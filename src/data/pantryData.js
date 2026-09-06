/*
 * PantryPilot - single source of invented data.
 *
 * Everything in this file is made up for a university prototype.
 * No real brands, restaurants, shops or nutrition services are referenced,
 * and nothing here is fetched from an API. Numbers are illustrative only
 * and are not medical or dietary advice.
 */

/* ---------------------------------------------------------------- *
 * 1. INGREDIENTS (30 invented pantry items)
 * ---------------------------------------------------------------- */

export const INGREDIENT_CATEGORIES = [
  'Proteins',
  'Vegetables & Fruit',
  'Grains & Carbs',
  'Dairy & Eggs',
  'Pantry & Flavour',
];

export const INGREDIENTS = [
  // Proteins
  { id: 'chicken-breast', name: 'Chicken Breast', emoji: '\u{1F357}', category: 'Proteins' },
  { id: 'ground-beef', name: 'Ground Beef', emoji: '\u{1F969}', category: 'Proteins' },
  { id: 'salmon-fillet', name: 'Salmon Fillet', emoji: '\u{1F41F}', category: 'Proteins' },
  { id: 'firm-tofu', name: 'Firm Tofu', emoji: '\u{1F9CA}', category: 'Proteins' },
  { id: 'chickpeas', name: 'Chickpeas', emoji: '\u{1FAD8}', category: 'Proteins' },

  // Vegetables & Fruit
  { id: 'onion', name: 'Onion', emoji: '\u{1F9C5}', category: 'Vegetables & Fruit' },
  { id: 'garlic', name: 'Garlic', emoji: '\u{1F9C4}', category: 'Vegetables & Fruit' },
  { id: 'tomatoes', name: 'Tomatoes', emoji: '\u{1F345}', category: 'Vegetables & Fruit' },
  { id: 'bell-pepper', name: 'Bell Pepper', emoji: '\u{1FAD1}', category: 'Vegetables & Fruit' },
  { id: 'broccoli', name: 'Broccoli', emoji: '\u{1F966}', category: 'Vegetables & Fruit' },
  { id: 'spinach', name: 'Spinach', emoji: '\u{1F96C}', category: 'Vegetables & Fruit' },
  { id: 'carrot', name: 'Carrot', emoji: '\u{1F955}', category: 'Vegetables & Fruit' },
  { id: 'mushrooms', name: 'Mushrooms', emoji: '\u{1F344}', category: 'Vegetables & Fruit' },
  { id: 'potatoes', name: 'Potatoes', emoji: '\u{1F954}', category: 'Vegetables & Fruit' },
  { id: 'lemon', name: 'Lemon', emoji: '\u{1F34B}', category: 'Vegetables & Fruit' },

  // Grains & Carbs
  { id: 'rice', name: 'White Rice', emoji: '\u{1F35A}', category: 'Grains & Carbs' },
  { id: 'pasta', name: 'Pasta', emoji: '\u{1F35D}', category: 'Grains & Carbs' },
  { id: 'bread', name: 'Bread', emoji: '\u{1F35E}', category: 'Grains & Carbs' },
  { id: 'tortillas', name: 'Tortillas', emoji: '\u{1FAD3}', category: 'Grains & Carbs' },
  { id: 'oats', name: 'Rolled Oats', emoji: '\u{1F33E}', category: 'Grains & Carbs' },

  // Dairy & Eggs
  { id: 'eggs', name: 'Eggs', emoji: '\u{1F95A}', category: 'Dairy & Eggs' },
  { id: 'milk', name: 'Milk', emoji: '\u{1F95B}', category: 'Dairy & Eggs' },
  { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '\u{1F376}', category: 'Dairy & Eggs' },
  { id: 'cheddar-cheese', name: 'Cheddar Cheese', emoji: '\u{1F9C0}', category: 'Dairy & Eggs' },
  { id: 'butter', name: 'Butter', emoji: '\u{1F9C8}', category: 'Dairy & Eggs' },

  // Pantry & Flavour
  { id: 'olive-oil', name: 'Olive Oil', emoji: '\u{1FAD2}', category: 'Pantry & Flavour' },
  { id: 'soy-sauce', name: 'Soy Sauce', emoji: '\u{1F962}', category: 'Pantry & Flavour' },
  { id: 'mixed-herbs', name: 'Mixed Herbs', emoji: '\u{1F33F}', category: 'Pantry & Flavour' },
  { id: 'chili-flakes', name: 'Chili Flakes', emoji: '\u{1F336}', category: 'Pantry & Flavour' },
  { id: 'peanut-butter', name: 'Peanut Butter', emoji: '\u{1F95C}', category: 'Pantry & Flavour' },
];

export const INGREDIENT_BY_ID = INGREDIENTS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {});

/* ---------------------------------------------------------------- *
 * 2. USER-FACING OPTION LISTS
 * ---------------------------------------------------------------- */

/** Cooking-time budgets the user can pick. maxMinutes is compared to total time. */
export const TIME_OPTIONS = [
  { id: '15', label: '15 min', helper: 'Barely any time', maxMinutes: 15 },
  { id: '30', label: '30 min', helper: 'A normal weeknight', maxMinutes: 30 },
  { id: '60plus', label: '60+ min', helper: 'I can take my time', maxMinutes: Infinity },
];

export const PREFERENCE_OPTIONS = [
  { id: 'regular', label: 'Regular', emoji: '\u{1F37D}', helper: 'A bit of everything' },
  { id: 'quick', label: 'Quick & Easy', emoji: '\u{26A1}', helper: 'Fewest steps, fastest food' },
  { id: 'fitness', label: 'Fitness', emoji: '\u{1F4AA}', helper: 'Higher protein, lighter calories' },
  { id: 'family', label: 'Family Meal', emoji: '\u{1F468}‍\u{1F469}‍\u{1F467}', helper: 'Big batch, crowd-pleasing' },
];

export const PREFERENCE_BY_ID = PREFERENCE_OPTIONS.reduce((map, option) => {
  map[option.id] = option;
  return map;
}, {});

/* ---------------------------------------------------------------- *
 * 3. MEALS (11 invented recipes)
 *
 * Quantities below are written for baseServings. The app scales them
 * when the user changes the serving size on the detail screen.
 * Calories are derived from the macros using 4 / 4 / 9 kcal per gram,
 * so the numbers on every screen stay consistent with each other.
 * ---------------------------------------------------------------- */

const RAW_MEALS = [
  {
    id: 'golden-garlic-chicken-rice',
    name: 'Golden Garlic Chicken Rice',
    emoji: '\u{1F35A}',
    tagline: 'One pan, buttery garlic rice, no washing-up marathon.',
    category: 'One-Pan',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 10,
    cookMinutes: 20,
    proteinGrams: 38,
    carbGrams: 58,
    fatGrams: 14,
    familyFriendly: true,
    ingredients: [
      { id: 'chicken-breast', quantity: 300, unit: 'g' },
      { id: 'rice', quantity: 150, unit: 'g' },
      { id: 'garlic', quantity: 4, unit: 'cloves' },
      { id: 'onion', quantity: 1, unit: '' },
      { id: 'butter', quantity: 20, unit: 'g' },
      { id: 'olive-oil', quantity: 1, unit: 'tbsp' },
      { id: 'mixed-herbs', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      'Cut the chicken into thick strips and season it with the herbs, salt and pepper.',
      'Heat the olive oil in a deep pan and brown the chicken for 4 minutes a side, then set it aside.',
      'Soften the chopped onion and garlic in the butter until they smell sweet, about 3 minutes.',
      'Stir in the rice, add double its volume in water, and bring it to a gentle simmer.',
      'Sit the chicken back on top, cover the pan, and cook on low for 12 minutes.',
      'Rest it off the heat for 3 minutes, fluff the rice, and serve straight from the pan.',
    ],
  },
  {
    id: 'ten-minute-tomato-garlic-pasta',
    name: 'Ten-Minute Tomato Garlic Pasta',
    emoji: '\u{1F35D}',
    tagline: 'The one you make when you get home starving.',
    category: 'Pasta',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    proteinGrams: 16,
    carbGrams: 78,
    fatGrams: 14,
    familyFriendly: true,
    ingredients: [
      { id: 'pasta', quantity: 200, unit: 'g' },
      { id: 'tomatoes', quantity: 4, unit: '' },
      { id: 'garlic', quantity: 3, unit: 'cloves' },
      { id: 'olive-oil', quantity: 2, unit: 'tbsp' },
      { id: 'chili-flakes', quantity: 1, unit: 'tsp' },
      { id: 'mixed-herbs', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      'Boil the pasta in well-salted water and set a timer for the packet time.',
      'While it cooks, warm the olive oil with the sliced garlic and chili flakes on low heat.',
      'Add the chopped tomatoes and squash them with a spoon for 5 minutes.',
      'Lift the pasta straight into the sauce with a splash of its cooking water.',
      'Toss it hard for 30 seconds until glossy, then finish with the herbs.',
    ],
  },
  {
    id: 'sunrise-veggie-scramble',
    name: 'Sunrise Veggie Scramble',
    emoji: '\u{1F373}',
    tagline: 'Soft eggs and greens, ready before the kettle boils.',
    category: 'Breakfast',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    proteinGrams: 24,
    carbGrams: 12,
    fatGrams: 20,
    familyFriendly: true,
    ingredients: [
      { id: 'eggs', quantity: 4, unit: '' },
      { id: 'spinach', quantity: 60, unit: 'g' },
      { id: 'tomatoes', quantity: 2, unit: '' },
      { id: 'bell-pepper', quantity: 1, unit: '' },
      { id: 'cheddar-cheese', quantity: 40, unit: 'g' },
      { id: 'butter', quantity: 10, unit: 'g' },
    ],
    steps: [
      'Beat the eggs with a pinch of salt until the colour is even.',
      'Melt the butter in a non-stick pan on medium-low heat.',
      'Cook the diced pepper for 2 minutes, then add the tomatoes and spinach until wilted.',
      'Pour in the eggs and stir slowly, pushing them into soft folds.',
      'Take the pan off the heat while the eggs are still slightly wet and scatter over the cheese.',
    ],
  },
  {
    id: 'lemon-herb-salmon-greens',
    name: 'Lemon Herb Salmon & Greens',
    emoji: '\u{1F41F}',
    tagline: 'Tray in, tray out. Bright, light and high in protein.',
    category: 'Sheet-Pan',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 10,
    cookMinutes: 18,
    proteinGrams: 40,
    carbGrams: 18,
    fatGrams: 18,
    familyFriendly: false,
    ingredients: [
      { id: 'salmon-fillet', quantity: 2, unit: 'fillets' },
      { id: 'broccoli', quantity: 250, unit: 'g' },
      { id: 'lemon', quantity: 1, unit: '' },
      { id: 'garlic', quantity: 2, unit: 'cloves' },
      { id: 'olive-oil', quantity: 1, unit: 'tbsp' },
      { id: 'mixed-herbs', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      'Heat the oven to a high roasting temperature and line a tray.',
      'Toss the broccoli florets with the oil, crushed garlic and herbs, then spread them out.',
      'Roast the vegetables on their own for 8 minutes so they get a head start.',
      'Nestle in the salmon, top each fillet with lemon slices, and roast for 10 minutes more.',
      'Squeeze over the rest of the lemon and serve straight from the tray.',
    ],
  },
  {
    id: 'crispy-tofu-rainbow-bowl',
    name: 'Crispy Tofu Rainbow Bowl',
    emoji: '\u{1F957}',
    tagline: 'Crunchy tofu, sticky sauce, a lot of colour in one bowl.',
    category: 'Bowl',
    difficulty: 'Medium',
    baseServings: 2,
    prepMinutes: 15,
    cookMinutes: 15,
    proteinGrams: 28,
    carbGrams: 52,
    fatGrams: 16,
    familyFriendly: false,
    ingredients: [
      { id: 'firm-tofu', quantity: 300, unit: 'g' },
      { id: 'rice', quantity: 120, unit: 'g' },
      { id: 'carrot', quantity: 2, unit: '' },
      { id: 'bell-pepper', quantity: 1, unit: '' },
      { id: 'broccoli', quantity: 150, unit: 'g' },
      { id: 'soy-sauce', quantity: 2, unit: 'tbsp' },
      { id: 'garlic', quantity: 2, unit: 'cloves' },
      { id: 'olive-oil', quantity: 1, unit: 'tbsp' },
    ],
    steps: [
      'Start the rice first so it steams while everything else happens.',
      'Press the tofu dry with a towel and cut it into thick cubes.',
      'Fry the tofu in the oil without moving it for 3 minutes a side until crisp.',
      'Add the garlic and soy sauce and shake the pan until the cubes are glazed.',
      'Stir-fry the carrot, pepper and broccoli for 4 minutes so they stay crunchy.',
      'Build the bowl: rice, vegetables, tofu, and any sauce left in the pan.',
    ],
  },
  {
    id: 'hearty-beef-potato-bake',
    name: 'Hearty Beef & Potato Bake',
    emoji: '\u{1F958}',
    tagline: 'The big tray that reheats beautifully the next day.',
    category: 'Oven Bake',
    difficulty: 'Medium',
    baseServings: 4,
    prepMinutes: 20,
    cookMinutes: 45,
    proteinGrams: 34,
    carbGrams: 46,
    fatGrams: 24,
    familyFriendly: true,
    ingredients: [
      { id: 'ground-beef', quantity: 500, unit: 'g' },
      { id: 'potatoes', quantity: 800, unit: 'g' },
      { id: 'onion', quantity: 2, unit: '' },
      { id: 'carrot', quantity: 2, unit: '' },
      { id: 'garlic', quantity: 3, unit: 'cloves' },
      { id: 'milk', quantity: 150, unit: 'ml' },
      { id: 'butter', quantity: 30, unit: 'g' },
      { id: 'cheddar-cheese', quantity: 80, unit: 'g' },
      { id: 'mixed-herbs', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      'Boil the peeled potatoes until a knife slides through easily, about 15 minutes.',
      'Meanwhile brown the beef hard in a wide pan, then add the onion, carrot and garlic.',
      'Season with the herbs, add a splash of water, and simmer for 10 minutes.',
      'Mash the drained potatoes with the butter and milk until smooth.',
      'Spread the beef into a baking dish, top it with the mash, and rake lines across it with a fork.',
      'Scatter over the cheese and bake for 20 minutes until the peaks are deep golden.',
    ],
  },
  {
    id: 'chickpea-comfort-curry',
    name: 'Chickpea Comfort Curry',
    emoji: '\u{1F35B}',
    tagline: 'Cheap, filling, and mostly made from the back of the cupboard.',
    category: 'Stew',
    difficulty: 'Easy',
    baseServings: 4,
    prepMinutes: 10,
    cookMinutes: 30,
    proteinGrams: 18,
    carbGrams: 62,
    fatGrams: 14,
    familyFriendly: true,
    ingredients: [
      { id: 'chickpeas', quantity: 480, unit: 'g' },
      { id: 'tomatoes', quantity: 4, unit: '' },
      { id: 'onion', quantity: 1, unit: '' },
      { id: 'garlic', quantity: 3, unit: 'cloves' },
      { id: 'spinach', quantity: 100, unit: 'g' },
      { id: 'rice', quantity: 200, unit: 'g' },
      { id: 'olive-oil', quantity: 2, unit: 'tbsp' },
      { id: 'chili-flakes', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      'Cook the onion slowly in the oil for 6 minutes until soft and sweet.',
      'Add the garlic and chili flakes and stir for one minute.',
      'Tip in the chopped tomatoes and cook them down to a thick base, about 8 minutes.',
      'Add the drained chickpeas and a cup of water, then simmer for 15 minutes.',
      'Start the rice halfway through so both finish at the same time.',
      'Stir the spinach through at the very end and season to taste.',
    ],
  },
  {
    id: 'smoky-chicken-wraps',
    name: 'Smoky Chicken Wraps',
    emoji: '\u{1F32F}',
    tagline: 'Everyone builds their own, so nobody complains.',
    category: 'Wraps',
    difficulty: 'Easy',
    baseServings: 4,
    prepMinutes: 15,
    cookMinutes: 15,
    proteinGrams: 33,
    carbGrams: 40,
    fatGrams: 15,
    familyFriendly: true,
    ingredients: [
      { id: 'chicken-breast', quantity: 500, unit: 'g' },
      { id: 'tortillas', quantity: 8, unit: '' },
      { id: 'bell-pepper', quantity: 2, unit: '' },
      { id: 'onion', quantity: 1, unit: '' },
      { id: 'greek-yogurt', quantity: 150, unit: 'g' },
      { id: 'lemon', quantity: 1, unit: '' },
      { id: 'chili-flakes', quantity: 1, unit: 'tsp' },
      { id: 'olive-oil', quantity: 1, unit: 'tbsp' },
    ],
    steps: [
      'Slice the chicken thinly and toss it with the oil, chili flakes and salt.',
      'Cook it in a very hot pan in one layer so it catches colour, about 6 minutes.',
      'Add the sliced pepper and onion and cook for 5 minutes more until just soft.',
      'Mix the yogurt with lemon juice and a pinch of salt to make a quick sauce.',
      'Warm the tortillas for 20 seconds each and put everything on the table.',
      'Let everyone fill and roll their own.',
    ],
  },
  {
    id: 'mushroom-spinach-toast-stack',
    name: 'Mushroom Spinach Toast Stack',
    emoji: '\u{1F344}',
    tagline: 'A proper meal that happens to sit on toast.',
    category: 'Toast',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    proteinGrams: 17,
    carbGrams: 34,
    fatGrams: 14,
    familyFriendly: false,
    ingredients: [
      { id: 'bread', quantity: 4, unit: 'slices' },
      { id: 'mushrooms', quantity: 250, unit: 'g' },
      { id: 'spinach', quantity: 80, unit: 'g' },
      { id: 'garlic', quantity: 2, unit: 'cloves' },
      { id: 'butter', quantity: 15, unit: 'g' },
      { id: 'cheddar-cheese', quantity: 30, unit: 'g' },
    ],
    steps: [
      'Tear the mushrooms into rough pieces so they brown better than neat slices do.',
      'Fry them in the butter on high heat without stirring for 3 minutes.',
      'Add the garlic, then the spinach, and cook until the leaves collapse.',
      'Toast the bread while the pan finishes.',
      'Pile the mushrooms onto the toast and grate the cheese over the top.',
    ],
  },
  {
    id: 'slow-simmer-beef-noodle-pot',
    name: 'Slow-Simmer Beef Noodle Pot',
    emoji: '\u{1F372}',
    tagline: 'A weekend pot that fills the kitchen with smell for an hour.',
    category: 'Soup',
    difficulty: 'Medium',
    baseServings: 4,
    prepMinutes: 20,
    cookMinutes: 55,
    proteinGrams: 32,
    carbGrams: 48,
    fatGrams: 18,
    familyFriendly: true,
    ingredients: [
      { id: 'ground-beef', quantity: 400, unit: 'g' },
      { id: 'pasta', quantity: 250, unit: 'g' },
      { id: 'carrot', quantity: 3, unit: '' },
      { id: 'onion', quantity: 1, unit: '' },
      { id: 'garlic', quantity: 4, unit: 'cloves' },
      { id: 'tomatoes', quantity: 3, unit: '' },
      { id: 'soy-sauce', quantity: 2, unit: 'tbsp' },
      { id: 'mixed-herbs', quantity: 2, unit: 'tsp' },
    ],
    steps: [
      'Brown the beef in a heavy pot until the bottom of the pot goes dark.',
      'Add the onion, carrot and garlic and cook for 8 minutes.',
      'Stir in the tomatoes, soy sauce and herbs, scraping the base of the pot clean.',
      'Cover with water, bring it to a bubble, then drop to the lowest simmer for 40 minutes.',
      'Add the pasta directly to the pot for the last 12 minutes.',
      'Taste, season, and let it sit for 5 minutes before serving.',
    ],
  },
  {
    id: 'power-protein-yogurt-bowl',
    name: 'Power Protein Yogurt Bowl',
    emoji: '\u{1F963}',
    tagline: 'No heat, no pan, five minutes, still counts as a meal.',
    category: 'No-Cook',
    difficulty: 'Easy',
    baseServings: 2,
    prepMinutes: 5,
    cookMinutes: 0,
    proteinGrams: 26,
    carbGrams: 34,
    fatGrams: 12,
    familyFriendly: false,
    ingredients: [
      { id: 'greek-yogurt', quantity: 300, unit: 'g' },
      { id: 'oats', quantity: 60, unit: 'g' },
      { id: 'peanut-butter', quantity: 30, unit: 'g' },
      { id: 'milk', quantity: 100, unit: 'ml' },
    ],
    steps: [
      'Stir the oats into the milk and leave them for 3 minutes to soften.',
      'Spoon the yogurt into two bowls and swirl the oats through it.',
      'Warm the peanut butter for a few seconds so it pours, then drizzle it over.',
      'Eat it straight away, or cover it and keep it in the fridge overnight.',
    ],
  },
];

/* ---------------------------------------------------------------- *
 * 4. DERIVED MEAL FIELDS
 * ---------------------------------------------------------------- */

/** Calories per serving, kept consistent with the macros (4 / 4 / 9 kcal per gram). */
function caloriesFromMacros(meal) {
  const raw = meal.proteinGrams * 4 + meal.carbGrams * 4 + meal.fatGrams * 9;
  return Math.round(raw / 5) * 5;
}

/**
 * Fitness suitability, 0-100, derived only from this invented dataset.
 * It rewards three things and nothing else:
 *   - protein density  (grams of protein per 100 kcal)  -> up to 50 points
 *   - lighter servings (lower calories per serving)     -> up to 30 points
 *   - macro balance    (fat near ~30% of energy)        -> up to 20 points
 * This is a prototype ranking signal, not nutrition or medical advice.
 */
function fitnessSuitabilityFor(meal, calories) {
  const proteinPer100kcal = (meal.proteinGrams / calories) * 100;
  const proteinPoints = Math.min(proteinPer100kcal / 12, 1) * 50;

  const caloriePoints = Math.min(Math.max((750 - calories) / 400, 0), 1) * 30;

  const fatShare = (meal.fatGrams * 9) / calories;
  const balancePoints = (1 - Math.min(Math.abs(fatShare - 0.3) / 0.3, 1)) * 20;

  return Math.round(proteinPoints + caloriePoints + balancePoints);
}

export const MEALS = RAW_MEALS.map((meal) => {
  const caloriesPerServing = caloriesFromMacros(meal);
  return {
    ...meal,
    caloriesPerServing,
    totalMinutes: meal.prepMinutes + meal.cookMinutes,
    fitnessSuitability: fitnessSuitabilityFor(meal, caloriesPerServing),
  };
});

export const MEAL_BY_ID = MEALS.reduce((map, meal) => {
  map[meal.id] = meal;
  return map;
}, {});
