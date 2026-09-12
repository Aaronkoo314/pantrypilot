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

**One exception, added for Problem Set 2, and it is not a ranking rule.** The meal detail screen
now shows one ingredient's published nutrient record fetched live from USDA FoodData Central. It
is cited on screen, it does not enter any filter, any sort, any count or any band, and nothing in
this document depends on it. Everything ranked or filtered below is still computed from the
invented data. Section 10 says why it was deliberately kept out of the ranking.

---

## 1. What the app is built on

| | |
| --- | --- |
| Ingredients | 93, in 5 categories; 2 of those have a second level |
| Meals | 47 — Chinese 17, Western 16, Thai 14 |
| Calories per serving | 265 to 915 |
| Price per serving | S$1.39 to S$15.33, median S$5.50 |
| Vegetarian meals | 14 of 47 |

Five values on every meal are **derived from the invented recipe data and never authored**:
calories, total time, the weight band, the vegetarian flag and the price. Derived from our own
data, not fetched — the one live figure in the product is displayed beside these and never feeds
them. That is the most important property in the data
model, because it means a label on a card cannot drift away from the figure printed beside it. v1
derived calories from the macros but rounded them to the nearest 5, and its whole-dish figures
disagreed with its whole-dish macros on 9 of its 11 meals as a result.

---

## 2. Ingredient match — the only number the user can audit

> **A meal's match is the share of its ingredients the user has ticked, as a whole percentage.**

`src/utils/mealMatching.js` · `matchMeal()`

```
matchPercent = round(100 × ingredients you have ÷ ingredients the recipe needs)
```

No weighting, no substitutions, no fuzzy matching. A clove of garlic counts exactly as much as
750 g of pork belly. This is the one figure the user can check without trusting us: the card
prints "you have 7 of 11" and names the four it is *not* counting, under "Still need"; the detail
screen lists the seven it is, under "You have (7)".

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

Because price is computed from quantities, the line prices, the whole-dish total and the cost of
just the missing items all move with the serving control, while **price per person stays fixed —
the same invariant as calories per person**. That is what lets the detail screen answer "what will
this cost me tonight" as well as "what does this cost each".

**The prices are invented.** No shop is named, implied, or surveyed, and the app says so on both
screens that show a figure. The live USDA lookup returns nutrition only; it publishes no prices
and none of these came from it.

---

## 7. The filters — all five exclude

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

Three counts reach the screen, and all three follow one rule: **a count applies every filter
except the one whose own label it sits on, and never a filter the user cannot see from where they
are standing.**

| Count | Where it shows | What it applies |
| --- | --- | --- |
| `setupTotal` | the Find Meals button | the setup filters, and neither results-screen toggle |
| `readyForSetup` | "N need no shopping", on setup | the setup filters plus readyOnly |
| `ready` | the readyOnly toggle, on results | everything except readyOnly |
| `vegetarian` | the vegetarian toggle, on results | everything except vegetarianOnly |

The second row exists because of the first half of that rule and the fourth because of the second.
`ready` carries the results-screen vegetarian toggle, which is right on the results screen and
wrong on setup: a user who turns Vegetarian on, goes back, and reads "3 need no shopping" would
have no control in front of them that explains the 3. So setup gets its own count. This was found
by checking this document against the code, not by using the app.

This is the general form of the worst defect in v1: a counter on the primary button that read the
same whether nothing or fourteen ingredients were selected, because it never referenced the
ingredient list at all. It survived every check and three screenshots. `prompts.md` section 2.14
records what that cost.

---

## 10. The live figure, and why it ranks nothing

`api/nutrition.js` · `src/components/SourcedNutrition.jsx`

> **One ingredient's published nutrient record is fetched from USDA FoodData Central and shown on
> the meal detail screen. It is displayed and cited. It does not enter any filter, sort, count or
> band.**

This was a decision rather than an omission, so it belongs in this file.

The tempting version is to recompute each meal's calories from real per-ingredient data and let
the weight band, the calorie sort and the light/medium/heavy filter follow. That would make the
band mean something. It would also mean **a rule that decides what the user sees depends on a
third party being up**, and this document's whole premise is that every such rule is stated here
with its numbers and a named owner. A band that silently changes when a provider has an outage is
not a rule anybody owns.

So the live figure sits beside the invented one and says which is which. The reader gets the
comparison; the ranking stays computable from data in this repository, and stays explainable with
the provider switched off.

**What that costs, stated plainly.** The product now shows one real nutrition figure and 46 meals'
worth of invented macros, and the honest description of that is a provenance feature rather than a
nutrition feature. `assessment.md` marks it as such.

**Two things the lookup will not do.** It never guesses: a search that matches nothing returns an
honest empty rather than the nearest food, and it asks only for analysed reference records, not
for packaged products whose label figures round to zero. Both were failures first — see
`prompts.md` §5.3 and `assessment.md` B4.

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
| 10 · The live USDA figure | **Fetched, not derived** | No — it ranks nothing |

Three things are authored by a person and therefore need a person to check them: **the macros and
times on all 47 meals**, **the ingredient quantities and base servings on those meals**, and
**the 93 unit prices**. A fourth now needs watching rather than checking: **the live USDA lookup**,
which nobody here controls and which can be empty, refused or unreachable on any given evening. Everything else in this table is arithmetic on those three — which means a
wrong quantity reaches the screen as a wrong price with no arithmetic error anywhere. That is the shortest honest statement of where the human review has to go, and it is
the same conclusion `REFLECTION.md` reached about v1 — the cheap work is the code, and the
expensive work is the judgement nobody can delegate.
