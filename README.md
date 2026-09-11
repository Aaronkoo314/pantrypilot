# PantryPilot

A front-end prototype that helps non-professional home cooks answer one question:
**what should I cook with what I already have?**

**Author: Aaron Koo**  

Built for MGMT 6110 Human-AI Collaboration, Singapore Management University.

## Coursework documents

- [prompts.md](prompts.md) - the working log of how this was built, including the prompts and steps that went wrong.
- [REFLECTION.md](REFLECTION.md) - the five-question reflection, plus the further-action roadmap.
- [RANKING-RULES.md](RANKING-RULES.md) - what every rule that filters or orders the meal list does, with its numbers and a named owner. Nothing in v2 is scored.
- [CHANGELOG.md](CHANGELOG.md) - every version, newest first, and which document describes which.

> **Which version the documents describe.** `prompts.md` and `REFLECTION.md` describe the state
> tagged `v1-submitted`, which is what was handed in for Problem Set 1; they are the graded
> artefacts and are not rewritten. `RANKING-RULES.md` and this file describe the current app.
> `git checkout v1-submitted` gives you exactly the graded version, and
> [CHANGELOG.md](CHANGELOG.md) lists everything that changed after it.

## The user journey

1. **Meal Setup** - tick the ingredients in your kitchen from 93, grouped and searchable, with
   meat and pantry items on a second level; say how many people are eating; pick a time budget
   (15 / 30 / 60+ minutes); and optionally narrow by cuisine (Chinese, Western, Thai) and by how
   heavy you want it (Light, Medium, Heavy). Press **Find Meals**.
2. **Meal Recommendations** - meal cards showing ingredient match, time, calories per person,
   price per person and servings. Sort by match, time, calories or price, in either direction;
   filter to vegetarian only, or to meals that need no extra shopping.
3. **Meal Detail** - the full recipe: what you have, what you still need and what the missing
   items cost, prep / cook / total time, price per person and for the whole dish, calories per
   person and in total, protein / carbs / fat both per serving and for the whole dish, and a
   serving-size control that rescales every quantity, every line price and the whole-dish totals
   while price per person and calories per person stay fixed. Then the numbered steps.

A cover screen sits above screen 1 for three seconds on arrival, with a progress bar so the wait
does not read as a freeze. Tap, click or any key skips it, and it is skipped outright for anyone
whose system asks for reduced motion.

Time, cuisine and weight stay editable on screen 2, behind the "Time, cuisine and weight"
disclosure, and edits there write back to screen 1. The Find Meals button carries a live count
that moves as you tick ingredients.

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

## Scope and guardrails

- Front end only. No backend, no database, no accounts, no analytics.
- No network calls of any kind: every ingredient, meal and number is invented and lives
  in `src/data/pantryData.js`.
- No real brands, restaurants, shops or delivery services are referenced.
- Nutrition figures are illustrative sample data for a prototype. They are **not**
  health, dietary or medical advice, and the app says so on screen.
- The name PantryPilot was chosen independently for this coursework prototype. No
  affiliation with any similarly named product or service is implied.
- Prices are invented sample figures in Singapore dollars. They are not real shop prices, and
  no shop is named or implied.
- Nothing in the app is scored. Cuisine, weight, vegetarian, time and "can cook now" all exclude;
  the four sorts are plain orderings with no weights. See [RANKING-RULES.md](RANKING-RULES.md).

## Files

| File | What it contains |
| --- | --- |
| `index.html` | Vite entry page with the `#root` mount point. |
| `package.json` | React 18 + Vite dependencies and the `dev` / `build` / `preview` scripts. |
| `vite.config.js` | Standard Vite + React plugin config. |
| `src/main.jsx` | Mounts `<App />` into `#root` and loads the stylesheet. |
| `src/components/SplashScreen.jsx` | The cover screen. Three-second hold with a state-driven progress bar, skippable, skipped under reduced-motion. |
| `src/App.jsx` | Root component. Holds setup, filter and screen state, computes the recommendation list, and switches between the three screens without reloading. |
| `src/data/pantryData.js` | **All invented data:** 93 ingredients with unit, price and vegetarian flag, and 47 meals across three cuisines with quantities, servings, times, macros, difficulty and category. Calories, weight band, vegetarian status and price are derived here, never authored. |
| `src/utils/mealMatching.js` | Pure logic: ingredient matching, filtering, sorting, serving scaling, pricing and formatting. |
| `src/components/MealSetup.jsx` | Screen 1. People, time, cuisine and weight controls plus the Find Meals button. |
| `src/components/IngredientPicker.jsx` | Screen 1's ingredient index: search, an echo of your picks, and collapsible categories with a second level for meat cuts and pantry cuisines, every header carrying item and selected counts. |
| `src/components/MealRecommendations.jsx` | Screen 2. Setup summary, filter bar, result count, meal list and empty state. |
| `src/components/FilterBar.jsx` | Sort dropdown with an ascending/descending control, the vegetarian and "only meals I can cook now" toggles, and a disclosure holding time, cuisine and weight. |
| `src/components/MealCard.jsx` | One meal summary card: name, match line and meter, time, calories, price, servings, tags and missing ingredients. |
| `src/components/MealDetail.jsx` | Screen 3. Tag row, serving control, have / need ingredient lists with per-line prices, times, cost, nutrition per serving and whole dish, steps and the back button. |
| `src/styles.css` | All styling. Mobile-first, warm palette, 48px touch targets on the primary controls; the compact "Clear all" (32px) and the second-level group headers (44px) are the two deliberate exceptions. |
