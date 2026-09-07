# Ranking rules

**Owner: Aaron Koo** · Rewritten for v2 on 7 September 2026

Everything in this app that decides what a user sees, or in what order, is stated here in a
plain sentence with its numbers. This file exists because of a conclusion in
[`REFLECTION.md`](REFLECTION.md): *every generated rule that ranks, scores or filters what users
see gets a named human owner and one plain-English sentence stating its weights, committed beside
the code.* In v1, four rules failed that test.

**The headline for v2 is that nothing is scored any more.** v1 had four meal preferences, each a
weighted formula over invented nutrition figures, blended 60/40 into a "Recommended" order. All of
that is deleted. What replaced it is filters that exclude and sorts that order — no weights, no
blends, nothing that can quietly reorder the list behind the choice the user made.

Nothing here is nutrition, dietary or medical advice, and no price here is a real price.

---

## 1. What the app is built on

| | |
| --- | --- |
| Ingredients | 93, in 5 categories; 2 of those have a second level |
| Meals | 47 — Chinese 17, Western 16, Thai 14 |
| Calories per serving | 265 to 915 |
| Price per serving | S$1.39 to S$15.33, median S$5.50 |
| Vegetarian meals | 14 of 47 |

Four values on every meal are **derived from the recipe and never authored**: calories, the weight
band, the vegetarian flag and the price. That is the single most important property in the data
model, because it means a label on a card cannot drift away from the figure printed beside it. v1
authored calories separately from the macros and they disagreed on 9 of its 11 meals.

---

## 2. Ingredient match — the only number the user can audit

> **A meal's match is the share of its ingredients the user has ticked, as a whole percentage.**

`src/utils/mealMatching.js` · `matchMeal()`

```
matchPercent = round(100 × ingredients you have ÷ ingredients the recipe needs)
```

No weighting, no substitutions, no fuzzy matching. A clove of garlic counts exactly as much as
750 g of pork belly. This is the one figure the user can check without trusting us, because the
card prints "you have 7 of 11" beside the seven items it is counting.

**Known limit, unchanged from v1.** The pantry is a boolean: the app knows *whether* you have
garlic, never *how much*. A meal can read 100% match and still leave you short at the stove.

---

## 3. Calories per serving

> **Calories are the macros: protein × 4 + carbohydrate × 4 + fat × 9, unrounded.**

`src/data/pantryData.js` · `caloriesFromMacros()`

Never authored, and deliberately not rounded. Rounding to the nearest 5 was a v1 defect: the
whole-dish total multiplied the rounded figure while the whole-dish macros multiplied the exact
grams, so the two columns on the detail screen disagreed by up to 24 kcal on 9 of 11 meals.
Keeping the exact value makes them agree at every serving size.

---

## 4. The weight band — what replaced the four preferences

> **A meal is Light under 400 kcal per serving, Medium from 400 to 600 inclusive, and Heavy over
> 600.**

`src/data/pantryData.js` · `weightBandFor()`

**Where the two thresholds came from.** They are round numbers chosen to split the actual dataset
into three usable groups, and the dataset was then authored to fill all three. On the current 47
meals they give **15 light / 17 medium / 15 heavy**. That is the whole justification: no nutrition
authority sets these lines, and this file says so rather than implying otherwise.

This band is derived, so it is a *description* of the calorie figure next to it, not a second
opinion about the meal. That is the difference from v1's Fitness score, which was four invented
constants nobody had reviewed producing a health-adjacent judgement.

**It excludes, it does not score.** Selecting Light removes everything else from the list; it does
not nudge light meals up an order.

---

## 5. Vegetarian

> **A meal is vegetarian when every one of its ingredients is. The flag lives on the ingredient,
> never on the meal.**

`src/data/pantryData.js` · `isVegetarian()`

26 of the 93 ingredients are non-vegetarian. Twenty-one are the obvious ones — the meat, poultry
and seafood. **The five that matter are not meat at all:**

```
oyster-sauce   fish-sauce   red-curry-paste   green-curry-paste   dried-shrimp
```

Those five are why this rule is derived from the ingredient list rather than hand-set per meal. A
filter that looked for meat would call a Thai green curry vegetarian, and a hand-set flag would be
one careless edit away from doing the same. Deriving it means the label cannot be wrong unless the
recipe itself is wrong.

**What it claims, and what it does not.** On screen this filter says "no meat, fish or fish-based
sauces", and that is the whole claim. It is derived from this prototype's own invented ingredient
data. It is not a certification, it says nothing about dairy, eggs or honey, and halal filtering
was considered and deliberately rejected — a halal claim depends on slaughter method,
certification and cross-contamination, none of which an ingredient list records.

---

## 6. Price

> **A meal's price is the sum of each ingredient's quantity multiplied by its unit price, and the
> per-serving price is that total divided by the base servings.**

`src/data/pantryData.js` · `priceFor()` · and `scaleMeal()` in `mealMatching.js`

Every ingredient carries an invented `unitPrice` in Singapore dollars, per **one** of the single
unit that ingredient is ever measured in. The unit is declared once, on the ingredient; a recipe
line carries a bare number. v1 repeated the unit on every recipe line, which is exactly how a
price model drifts out of agreement with itself.

Each price in the data file carries a comment giving the same figure in a form a person can check:

```js
{ id: 'pork-belly', ..., unitPrice: 0.026, unit: 'g' },   // S$2.60 / 100 g
{ id: 'salmon-fillet', ..., unitPrice: 4.2, unit: 'fillets' },  // S$4.20 per fillet
```

That comment is not decoration. Nobody can eyeball whether `0.026` is right, and these numbers
reach the screen.

Because price is computed from quantities, it scales with the serving control alongside the
quantities themselves, and the detail screen can total only the missing items to answer "what will
this cost me tonight". **The prices are invented.** No shop is named, implied, or surveyed, and
the app says so on both screens that show a figure.

---

## 7. The filters — all four exclude

`src/utils/mealMatching.js` · `buildRecommendations()`

| Filter | Removes | Empty means |
| --- | --- | --- |
| Cooking time | meals whose prep + cook exceeds the budget | — (always one of three) |
| Cuisine | meals not in a selected cuisine | no restriction |
| Weight band | meals not in a selected band | no restriction |
| Vegetarian only | meals with any non-vegetarian ingredient | off |
| Only meals I can cook now | meals with any missing ingredient | off |

Cuisine and weight band are multi-select, and an empty selection means *no restriction* rather
than *nothing*. The interface says that out loud on both screens rather than leaving it to be
inferred from an empty row.

None of these scores. That is a deliberate constraint: a filter that also nudged the order would
be a second, invisible ranking rule sitting behind the sort the user chose.

---

## 8. The sorts

`src/utils/mealMatching.js` · `SORT_OPTIONS` and `buildRecommendations()`

Four sorts. Each is a plain ordering over one value, each can be reversed, and every one breaks
ties the same way.

| Sort | Orders by | Starts | Reversed reads |
| --- | --- | --- | --- |
| Ingredient match *(default)* | `matchPercent` | Best first | Fewest first |
| Cooking time | prep + cook | Shortest first | Longest first |
| Calories | calories per serving | Lightest first | Heaviest first |
| Price per person | price per serving | Cheapest first | Priciest first |

**Ties always break toward what the user can actually cook** — descending ingredient match, in
every sort. It is the same rule in one place rather than four.

**Choosing a new sort starts it in its own natural direction** rather than inheriting the previous
sort's, because carrying "descending" from match over to price would silently mean "most
expensive first".

**v1's "Recommended" sort is deleted rather than reimplemented.** With the preferences gone it
would have been ingredient match under a second name — two controls producing one list, which is
precisely the defect this file recorded against v1's Regular preference. The fix was deletion.

---

## 9. The two counts that promise something

`src/App.jsx` · `counts`

The readyOnly and vegetarian toggles each carry a count. **Each count applies every filter except
the one whose own label it sits on**, so a toggle can never advertise a number it is itself about
to exclude.

This is the general form of the worst defect in v1: a counter on the primary button that read the
same whether nothing or fourteen ingredients were selected, because it never referenced the
ingredient list at all. It survived every check and three screenshots. `PROMPTS.md` section 2.14
records what that cost.

---

## Summary for whoever inherits this

| Rule | Derived or authored? | Scores anything? |
| --- | --- | --- |
| 2 · Ingredient match | Computed from two lists | No |
| 3 · Calories | Derived from the macros | No |
| 4 · Weight band | Derived from calories | No |
| 5 · Vegetarian | Derived from the ingredients | No |
| 6 · Price | Derived from quantities × unit prices | No |
| 7 · The five filters | — | No, all exclude |
| 8 · The four sorts | — | No, plain orderings |
| 9 · The two counts | Derived, each excluding its own filter | No |

Two things are authored by a person and therefore need a person to check them: **the macros and
times on all 47 meals**, and **the 93 unit prices**. Everything else in this table is arithmetic
on those. That is the shortest honest statement of where the human review has to go, and it is
the same conclusion `REFLECTION.md` reached about v1 — the cheap work is the code, and the
expensive work is the judgement nobody can delegate.
