/*
 * Pure helper functions for matching, scoring, filtering and scaling meals.
 * No data lives here - everything comes from src/data/pantryData.js.
 */

import { INGREDIENT_BY_ID, TIME_OPTIONS } from '../data/pantryData.js';

/*
 * `directional` marks the sorts where reversing the order is a question a user
 * actually asks - shortest or longest, lightest or heaviest. Recommended and
 * Preference fit are scores, and "least recommended first" is not a request
 * anyone makes, so those two stay fixed and the direction control hides.
 *
 * `ascLabel` / `descLabel` name the direction in the user's terms rather than
 * as an arrow, because "Shortest first" is unambiguous and an up arrow is not.
 */
export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended', directional: false },
  { id: 'match', label: 'Ingredient match', directional: true, ascLabel: 'Fewest first', descLabel: 'Best first' },
  { id: 'time', label: 'Cooking time', directional: true, ascLabel: 'Shortest first', descLabel: 'Longest first' },
  { id: 'calories', label: 'Calories', directional: true, ascLabel: 'Lightest first', descLabel: 'Heaviest first' },
  { id: 'preference', label: 'Preference fit', directional: false },
];

export const SORT_BY_ID = SORT_OPTIONS.reduce((map, option) => {
  map[option.id] = option;
  return map;
}, {});

/** The direction a sort starts in the first time it is chosen. */
export function defaultSortDir(sortId) {
  return sortId === 'time' || sortId === 'calories' ? 'asc' : 'desc';
}

/* ---------------------------------------------------------------- *
 * Ingredient matching
 * ---------------------------------------------------------------- */

/**
 * Compare one meal against the ingredients the user says they have.
 * Returns the meal plus match information, without mutating the meal.
 */
export function matchMeal(meal, ownedIds) {
  const owned = ownedIds instanceof Set ? ownedIds : new Set(ownedIds);

  const haveIngredients = [];
  const missingIngredients = [];

  meal.ingredients.forEach((line) => {
    if (owned.has(line.id)) {
      haveIngredients.push(line);
    } else {
      missingIngredients.push(line);
    }
  });

  const total = meal.ingredients.length;
  const matchPercent = total === 0 ? 0 : Math.round((haveIngredients.length / total) * 100);

  return {
    ...meal,
    haveIngredients,
    missingIngredients,
    haveCount: haveIngredients.length,
    totalIngredientCount: total,
    matchPercent,
    isReadyToCook: missingIngredients.length === 0,
  };
}

/** Human-readable names for a list of ingredient lines. */
export function ingredientNames(lines) {
  return lines.map((line) => (INGREDIENT_BY_ID[line.id] || {}).name || line.id);
}

/* ---------------------------------------------------------------- *
 * Preference scoring
 * ---------------------------------------------------------------- */

/**
 * How well a meal fits the chosen meal preference, 0-100.
 *
 * Fitness deliberately uses only the dataset's own nutrition signal
 * (fitnessSuitability = higher protein, lower calories, balanced macros).
 *
 * These weights are stated in plain English, with the order they actually
 * produce on the eleven meals, in RANKING-RULES.md (rules 4, 5 and 6).
 * Change a number here and change it there.
 */
export function preferenceScore(meal, preferenceId) {
  switch (preferenceId) {
    case 'quick': {
      // Shorter total time is better; being labelled Easy helps a little.
      const timeScore = Math.min(Math.max((75 - meal.totalMinutes) / 70, 0), 1) * 80;
      const easeScore = meal.difficulty === 'Easy' ? 20 : meal.difficulty === 'Medium' ? 10 : 0;
      return Math.round(timeScore + easeScore);
    }
    case 'fitness':
      return meal.fitnessSuitability;
    case 'family': {
      // Bigger batches and crowd-pleasing meals score higher.
      const batchScore = Math.min(meal.baseServings / 4, 1) * 55;
      const crowdScore = meal.familyFriendly ? 35 : 5;
      const easeScore = meal.difficulty === 'Easy' ? 10 : 5;
      return Math.round(batchScore + crowdScore + easeScore);
    }
    case 'regular':
    default:
      // Neutral: a gentle nudge toward easier, faster, everyday meals.
      return Math.round(
        Math.min(Math.max((90 - meal.totalMinutes) / 85, 0), 1) * 40 +
          (meal.difficulty === 'Easy' ? 20 : 10) +
          40
      );
  }
}

/** A meal is called a "strong fit" when it clearly suits the chosen preference. */
export function isStrongPreferenceFit(meal, preferenceId) {
  if (preferenceId === 'regular') return false;
  return preferenceScore(meal, preferenceId) >= 70;
}

/* ---------------------------------------------------------------- *
 * Filtering and sorting
 * ---------------------------------------------------------------- */

export function timeLimitMinutes(timeId) {
  const option = TIME_OPTIONS.find((item) => item.id === timeId);
  return option ? option.maxMinutes : Infinity;
}

/**
 * Turn the raw meal list into the ranked list shown on the recommendations screen.
 *
 * settings: { ownedIds, timeId, preferenceId, sortId, sortDir, readyOnly }
 */
export function buildRecommendations(meals, settings) {
  const { ownedIds, timeId, preferenceId, sortId, sortDir, readyOnly } = settings;
  const owned = new Set(ownedIds);
  const maxMinutes = timeLimitMinutes(timeId);

  const scored = meals
    .map((meal) => {
      const matched = matchMeal(meal, owned);
      const prefScore = preferenceScore(meal, preferenceId);
      return {
        ...matched,
        preferenceScore: prefScore,
        // Default ranking: mostly "can I actually cook this", partly "does it suit me".
        // See RANKING-RULES.md rule 2 for what the 60/40 blend does in practice -
        // preference contributes less than 40% because its scores do not span 0-100.
        recommendedScore: matched.matchPercent * 0.6 + prefScore * 0.4,
      };
    })
    .filter((meal) => meal.totalMinutes <= maxMinutes)
    .filter((meal) => (readyOnly ? meal.isReadyToCook : true));

  // Each sort names the value it orders by. Direction is applied once, below,
  // so there is one rule for it instead of five.
  const keys = {
    recommended: (meal) => meal.recommendedScore,
    match: (meal) => meal.matchPercent,
    time: (meal) => meal.totalMinutes,
    calories: (meal) => meal.caloriesPerServing,
    preference: (meal) => meal.preferenceScore,
  };

  const keyOf = keys[sortId] || keys.recommended;
  const option = SORT_BY_ID[sortId] || SORT_BY_ID.recommended;
  // A non-directional sort ignores whatever direction is being carried.
  const dir = option.directional && sortDir === 'asc' ? 1 : -1;

  return scored.sort((a, b) => {
    const primary = (keyOf(a) - keyOf(b)) * dir;
    if (primary !== 0) return primary;
    // Ties always break toward what the user can actually cook, in every sort.
    return b.matchPercent - a.matchPercent;
  });
}

/* ---------------------------------------------------------------- *
 * Serving scaling
 * ---------------------------------------------------------------- */

/** Round a scaled quantity to something a person would actually measure. */
function roundQuantity(value, unit) {
  if (unit === 'g' || unit === 'ml') {
    if (value >= 100) return Math.round(value / 10) * 10;
    if (value >= 20) return Math.round(value / 5) * 5;
    return Math.round(value);
  }
  // Countable things: keep halves, drop pointless decimals.
  return Math.round(value * 2) / 2;
}

export function formatQuantity(quantity, unit) {
  const rounded = roundQuantity(quantity, unit);
  const shown = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return unit ? `${shown} ${unit}` : shown;
}

/**
 * Scale a meal's ingredient quantities from its base servings to the chosen servings.
 * Calories and macros PER SERVING never change here - only the totals do.
 */
export function scaleMeal(meal, servings) {
  const factor = servings / meal.baseServings;

  const ingredients = meal.ingredients.map((line) => ({
    ...line,
    scaledQuantity: line.quantity * factor,
    display: formatQuantity(line.quantity * factor, line.unit),
    ingredient: INGREDIENT_BY_ID[line.id],
  }));

  return {
    factor,
    servings,
    ingredients,
    caloriesPerServing: meal.caloriesPerServing,
    totalCalories: Math.round(meal.caloriesPerServing * servings),
    totalProtein: Math.round(meal.proteinGrams * servings),
    totalCarbs: Math.round(meal.carbGrams * servings),
    totalFat: Math.round(meal.fatGrams * servings),
  };
}

/** "1 h 15 min" style formatting for anything over an hour. */
export function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
