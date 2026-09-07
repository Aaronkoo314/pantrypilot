/*
 * Pure helper functions for matching, filtering, sorting, scaling and pricing.
 * No data lives here - everything comes from src/data/pantryData.js.
 */

import { INGREDIENT_BY_ID, TIME_OPTIONS } from '../data/pantryData.js';

/*
 * The sorts.
 *
 * v1 had five, and two of them - "Recommended" and "Preference fit" - were
 * scores over the four meal preferences. Those preferences are gone, which
 * left "Recommended" as ingredient match under a different name. Shipping both
 * would have repeated the exact defect RANKING-RULES.md recorded against v1's
 * Regular preference: two controls that produce the same list. So there are
 * four sorts, ingredient match is the default, and nothing is scored.
 *
 * `directional` marks the sorts where reversing is a question a user actually
 * asks. `ascLabel` / `descLabel` name the direction in the user's terms,
 * because "Cheapest first" is unambiguous and an up arrow is not.
 */
export const SORT_OPTIONS = [
  {
    id: 'match',
    label: 'Ingredient match',
    directional: true,
    ascLabel: 'Fewest first',
    descLabel: 'Best first',
  },
  {
    id: 'time',
    label: 'Cooking time',
    directional: true,
    ascLabel: 'Shortest first',
    descLabel: 'Longest first',
  },
  {
    id: 'calories',
    label: 'Calories',
    directional: true,
    ascLabel: 'Lightest first',
    descLabel: 'Heaviest first',
  },
  {
    id: 'price',
    label: 'Price per person',
    directional: true,
    ascLabel: 'Cheapest first',
    descLabel: 'Priciest first',
  },
];

export const SORT_BY_ID = SORT_OPTIONS.reduce((map, option) => {
  map[option.id] = option;
  return map;
}, {});

/** The direction a sort starts in the first time it is chosen. */
export function defaultSortDir(sortId) {
  return sortId === 'match' ? 'desc' : 'asc';
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
 * Filtering and sorting
 * ---------------------------------------------------------------- */

export function timeLimitMinutes(timeId) {
  const option = TIME_OPTIONS.find((item) => item.id === timeId);
  return option ? option.maxMinutes : Infinity;
}

/**
 * Turn the raw meal list into the list shown on the recommendations screen.
 *
 * Every filter here EXCLUDES. None of them scores, so none of them can quietly
 * reorder the list behind the sort the user chose.
 *
 * settings: { ownedIds, timeId, cuisineIds, weightBands, vegetarianOnly,
 *             readyOnly, sortId, sortDir }
 * An empty cuisineIds or weightBands array means "no restriction".
 */
export function buildRecommendations(meals, settings) {
  const {
    ownedIds,
    timeId,
    cuisineIds = [],
    weightBands = [],
    vegetarianOnly = false,
    readyOnly = false,
    sortId,
    sortDir,
  } = settings;

  const owned = new Set(ownedIds);
  const maxMinutes = timeLimitMinutes(timeId);

  const scored = meals
    .map((meal) => matchMeal(meal, owned))
    .filter((meal) => meal.totalMinutes <= maxMinutes)
    .filter((meal) => cuisineIds.length === 0 || cuisineIds.includes(meal.cuisine))
    .filter((meal) => weightBands.length === 0 || weightBands.includes(meal.weightBand))
    .filter((meal) => (vegetarianOnly ? meal.vegetarian : true))
    .filter((meal) => (readyOnly ? meal.isReadyToCook : true));

  // One key function per sort, then a single direction rule, so there is one
  // place to change how direction works rather than four.
  const keys = {
    match: (meal) => meal.matchPercent,
    time: (meal) => meal.totalMinutes,
    calories: (meal) => meal.caloriesPerServing,
    price: (meal) => meal.pricePerServing,
  };

  const keyOf = keys[sortId] || keys.match;
  const option = SORT_BY_ID[sortId] || SORT_BY_ID.match;
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

/**
 * Format a quantity for display. The unit is looked up on the ingredient
 * rather than passed in, because the ingredient is the only place a unit is
 * declared - a recipe line carries a bare number.
 */
export function formatQuantity(quantity, ingredientId) {
  const unit = (INGREDIENT_BY_ID[ingredientId] || {}).unit || '';
  const rounded = roundQuantity(quantity, unit);
  const shown = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return unit ? `${shown} ${unit}` : shown;
}

/** Singapore dollars, to the cent. */
export function formatPrice(amount) {
  return `S$${amount.toFixed(2)}`;
}

/**
 * Scale a meal from its base servings to the chosen servings.
 * Calories and macros PER SERVING never change here - only the totals do.
 */
export function scaleMeal(meal, servings) {
  const factor = servings / meal.baseServings;

  const ingredients = meal.ingredients.map((line) => ({
    ...line,
    scaledQuantity: line.quantity * factor,
    display: formatQuantity(line.quantity * factor, line.id),
    ingredient: INGREDIENT_BY_ID[line.id],
    linePrice: line.quantity * factor * ((INGREDIENT_BY_ID[line.id] || {}).unitPrice || 0),
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
    pricePerServing: meal.pricePerServing,
    totalPrice: meal.pricePerServing * servings,
  };
}

/** "1 h 15 min" style formatting for anything over an hour. */
export function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
