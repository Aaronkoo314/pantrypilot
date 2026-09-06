# PantryPilot

A front-end prototype that helps non-professional home cooks answer one question:
**what should I cook with what I already have?**

Built for MGMT 6110 Human-AI Collaboration, Singapore Management University.

## The user journey

1. **Meal Setup** - tick the ingredients in your kitchen, say how many people are eating,
   how much time you have (15 / 30 / 60+ minutes), and what kind of meal you want
   (Regular, Quick & Easy, Fitness, Family Meal). Press **Find Meals**.
2. **Meal Recommendations** - a ranked list of meal cards showing ingredient match,
   time, servings, calories per person, difficulty, category and anything you are missing.
   Filter by time and preference, sort by match / time / calories / preference fit, or
   show only meals that need no extra shopping.
3. **Meal Detail** - the full recipe: what you have, what you still need, prep / cook /
   total time, calories per person and in total, protein / carbs / fat, a serving-size
   control that rescales every quantity, and step-by-step instructions.

All three screens live in one page, so moving between them never reloads the browser.

## Running it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To produce a production build for Vercel:

```bash
npm run build
```

Vercel picks this up automatically as a Vite project (build command `npm run build`,
output directory `dist`).

### No-build preview (optional, dev only)

If Node.js is not available on a machine, `tools/build_preview.py` concatenates the same
source files into a single page that compiles JSX in the browser:

```bash
python tools/build_preview.py
python -m http.server 8000
```

Then open `http://localhost:8000/preview/index.html`. This is a convenience for
demoing only - the real build is Vite. The generated `preview/` folder is gitignored.

## Scope and guardrails

- Front end only. No backend, no database, no accounts, no analytics.
- No network calls of any kind: every ingredient, meal and number is invented and lives
  in `src/data/pantryData.js`.
- No real brands, restaurants, shops or delivery services are referenced.
- Nutrition figures are illustrative sample data for a prototype. They are **not**
  health, dietary or medical advice, and the app says so on screen.
- The Fitness preference ranks meals only by the dataset's own nutrition signal:
  higher protein per calorie, lower calories per serving, and reasonably balanced macros.

## Files

| File | What it contains |
| --- | --- |
| `index.html` | Vite entry page with the `#root` mount point. |
| `package.json` | React 18 + Vite dependencies and the `dev` / `build` / `preview` scripts. |
| `vite.config.js` | Standard Vite + React plugin config. |
| `src/main.jsx` | Mounts `<App />` into `#root` and loads the stylesheet. |
| `src/App.jsx` | Root component. Holds setup, filter and screen state, computes the recommendation list, and switches between the three screens without reloading. |
| `src/data/pantryData.js` | **All invented data:** 30 ingredients, 11 meals with quantities, servings, times, macros, difficulty, category and derived fitness suitability, plus the time and preference option lists. |
| `src/utils/mealMatching.js` | Pure logic: ingredient matching, preference scoring, filtering, sorting, serving scaling and formatting. |
| `src/components/MealSetup.jsx` | Screen 1. People, time and preference controls plus the Find Meals button. |
| `src/components/IngredientPicker.jsx` | The searchable, category-grouped ingredient chips used by Screen 1. |
| `src/components/MealRecommendations.jsx` | Screen 2. Setup summary, filter bar, result count, meal list and empty state. |
| `src/components/FilterBar.jsx` | Time / preference filters, sort dropdown and the "only meals I can cook now" toggle. |
| `src/components/MealCard.jsx` | One meal summary card: name, match bar, time, servings, calories, difficulty, tags and missing ingredients. |
| `src/components/MealDetail.jsx` | Screen 3. Serving control, have / need ingredient lists, times, nutrition, steps and the back button. |
| `src/styles.css` | All styling. Mobile-first, warm palette, 48px minimum touch targets. |
| `tools/build_preview.py` | Dev-only helper that bundles `src/` into a no-build HTML preview. Not part of the app. |
