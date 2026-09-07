# Ranking rules

**Owner: Aaron Koo** · Last reviewed 7 September 2026

> ⚠️ **This file describes v1 and is out of date as of the v2 data release.**
> Rules 3 to 6 — Fitness suitability, Quick & Easy fit, Family Meal fit and Regular fit —
> describe the four meal preferences, which v2 deleted. Rule 2's Recommended sort is also gone.
> What v2 actually does: cuisine, weight band, vegetarian and time all EXCLUDE rather than score,
> and the four sorts are plain orderings over ingredient match, time, calories and price with no
> weights anywhere. Nothing in the app is scored any more. This file is rewritten next; until
> then, read it as the record of what v1 did. See [CHANGELOG.md](CHANGELOG.md).

Six rules in this app decide what a user sees and in what order. They were generated during
the build and shipped without anyone stating what they do. This file states each one in a
plain sentence, names its weights, and records what it actually produces on the real eleven
meals — so that the next person to touch one can tell whether it is behaving as intended.

This exists because of a conclusion in [`REFLECTION.md`](REFLECTION.md): *every generated rule
that ranks, scores or filters what users see gets a named human owner and one plain-English
sentence stating its weights, committed beside the code.* Four of these rules failed that test
until this file was written.

Nothing here is nutrition, dietary or medical advice. Every number is a ranking signal over an
invented dataset.

---

## 1. Ingredient match

> **A meal's match is the share of its ingredients the user has ticked, as a whole percentage.**

`src/utils/mealMatching.js` · `matchMeal()`

```
matchPercent = round(100 × ingredients you have ÷ ingredients the recipe needs)
```

No weighting, no substitutions, no fuzzy matching. A clove of garlic counts exactly as much as
500 g of beef. The user can audit every result, because the card prints "you have 7 of 7" beside
the seven items it is counting.

**Known limit.** The pantry is a boolean: the app knows *whether* you have garlic, never *how
much*. A meal can read 100% match and still leave you short at the stove.

---

## 2. Recommended order (the default sort)

> **Recommended order is 60% of a meal's ingredient match plus 40% of its preference fit.**

`src/utils/mealMatching.js` · `buildRecommendations()`

```js
recommendedScore = matchPercent * 0.6 + preferenceScore * 0.4
```

**Why 60/40.** "Can I actually cook this tonight" should beat "does this suit my mood", but not
erase it. Match ranges over the full 0–100; the preference scores below do not, which means the
blend is more match-dominated in practice than 60/40 suggests.

**What it actually does.** Match contributes 0–60 points. Preference contributes:

| Preference | Score range on the 11 meals | Contribution at 0.4 | Effective swing |
| --- | --- | --- | --- |
| Regular | 57–100 | 22.8–40.0 | 17.2 |
| Quick & Easy | 10–100 | 4.0–40.0 | 36.0 |
| Fitness | 49–82 | 19.6–32.8 | **13.2** |
| Family Meal | 38–100 | 15.2–40.0 | 24.8 |

Fitness moves the recommended order by at most 13 points against match's 60. **Choosing Fitness
barely changes the default list.** It changes the list properly only under the "Preference fit"
sort. That is a real weakness, recorded rather than hidden.

---

## 3. Fitness suitability

> **A meal's fitness score is 50 points for protein per calorie, 30 for being lighter, and 20 for
> keeping fat near 30% of its energy.**

`src/data/pantryData.js` · `fitnessSuitabilityFor()`

```js
proteinPoints = min(protein per 100 kcal ÷ 12, 1) × 50     // 12 g/100 kcal earns full marks
caloriePoints = clamp((750 − calories) ÷ 400, 0, 1) × 30   // ≤350 kcal full, ≥750 kcal none
balancePoints = (1 − min(|fatShare − 0.30| ÷ 0.30, 1)) × 20
```

**Where the four constants came from.** They were generated, not derived from any source. The
brief required only that Fitness favour meals "relatively higher in protein, lower in calories,
and nutritionally balanced within the invented dataset", and these weights are one reading of
that sentence. 12 g per 100 kcal is roughly what a lean grilled fish reaches; 350–750 kcal spans
a light lunch to a heavy dinner; 30% fat is a midpoint, not a target anyone prescribed.

**What it actually ranks**, on the current data:

| # | Meal | Score | Protein / kcal per serving |
| --- | --- | --- | --- |
| 1 | Lemon Herb Salmon & Greens | 82 | 40 g / 394 |
| 2 | Power Protein Yogurt Bowl | 80 | 26 g / 348 |
| 3 | Smoky Chicken Wraps | 75 | 33 g / 427 |
| … | | | |
| 11 | Ten-Minute Tomato Garlic Pasta | 49 | 16 g / 502 |

That ordering is defensible. Two things about it are not obvious and should be:

- **The spread is only 33 points** (49–82). Nothing scores badly, so the rule separates meals
  weakly. See rule 2.
- **The balance term penalises fat-forward cooking as such.** A coconut-milk or ghee-based dish
  loses most of the 20 balance points regardless of how good it is. On the current Western-leaning
  eleven meals this rarely bites; if cuisines are ever added, this constant must be re-owned
  before it silently rates a whole cuisine as less healthy.

---

## 4. Quick & Easy fit

> **Quick & Easy scores a meal out of 80 for being fast — full marks at 5 minutes, zero at 75 —
> plus 20 for being labelled Easy or 10 for Medium.**

`src/utils/mealMatching.js` · `preferenceScore()`, case `quick`

```js
timeScore = clamp((75 − totalMinutes) ÷ 70, 0, 1) × 80
easeScore = Easy ? 20 : Medium ? 10 : 0
```

Produces a clean spread of 10–100 and orders the eleven meals exactly by total time, with
difficulty breaking ties. Behaves as intended.

---

## 5. Family Meal fit

> **Family Meal scores a meal out of 55 for how close its base recipe is to four servings, 35 for
> being flagged crowd-pleasing, and 10 for being Easy.**

`src/utils/mealMatching.js` · `preferenceScore()`, case `family`

```js
batchScore = min(baseServings ÷ 4, 1) × 55
crowdScore = familyFriendly ? 35 : 5
easeScore  = Easy ? 10 : 5
```

**In practice this is nearly binary.** The eleven meals land in two clusters: the four-serving
recipes score 95–100, the two-serving recipes score 38–73. Nothing sits in between, because
`baseServings` only ever takes the values 2 or 4 in the dataset.

**`familyFriendly` is a hand-set boolean**, not a derived value. It is set true on seven meals and
false on four (`Lemon Herb Salmon & Greens`, `Crispy Tofu Rainbow Bowl`, `Mushroom Spinach Toast
Stack`, `Power Protein Yogurt Bowl`) on the judgement that those four are less likely to please a
mixed table. That judgement is mine and is not defended by any data.

---

## 6. Regular fit

> **Regular scores a meal out of 40 for being under 90 minutes, plus 20 for Easy or 10 otherwise,
> plus a flat 40 given to every meal.**

`src/utils/mealMatching.js` · `preferenceScore()`, default case

```js
clamp((90 − totalMinutes) ÷ 85, 0, 1) × 40 + (Easy ? 20 : 10) + 40
```

**This rule does not do what its label promises, and that is worth stating plainly.**

Regular is presented to the user as "a bit of everything" — a neutral option. It is not neutral.
It is a mild speed ranking with a floor of 50, and it orders the eleven meals **almost identically
to Quick & Easy**:

| Position | Regular | Quick & Easy |
| --- | --- | --- |
| 1–7 | *identical* | *identical* |
| 8 | Chickpea Comfort Curry (84) | Crispy Tofu Rainbow Bowl (61) |
| 9 | Crispy Tofu Rainbow Bowl (78) | Chickpea Comfort Curry (60) |
| 10–11 | *identical* | *identical* |

One swap in eleven positions. A user switching between the two sees essentially the same list,
which makes one of the four preference buttons close to decorative.

**Two honest options, neither taken yet:**

1. Make Regular genuinely neutral — return a constant, so the Recommended order collapses to pure
   ingredient match. Honest, and makes the other three preferences visibly do something.
2. Give Regular its own meaning — variety, or everyday-ness — and say what that is.

Leaving it as an undeclared duplicate of Quick & Easy is the one option that should not survive.

---

## 7. The explicit sorts

`src/utils/mealMatching.js` · `buildRecommendations()` · `sorters`

These are not scores; they are orderings the user chooses directly. Each has a documented
tie-break:

| Sort | Orders by | Tie-break |
| --- | --- | --- |
| Recommended | `recommendedScore`, descending | none |
| Ingredient match | `matchPercent`, descending | preference fit |
| Cooking time | total minutes, ascending | ingredient match |
| Calories | calories per serving, ascending | ingredient match |
| Preference fit | preference score, descending | ingredient match |

Two filters run before every sort and are not scores either: the time budget removes meals whose
total time exceeds it, and "only meals I can cook now" removes meals with any missing ingredient.

---

## Summary for whoever inherits this

| Rule | Behaving as intended? |
| --- | --- |
| 1 · Ingredient match | Yes — and it is the only rule the user can audit on screen |
| 2 · Recommended 60/40 | Yes, with the caveat that preference contributes less than 40% in practice |
| 3 · Fitness suitability | Order is sensible; spread is narrow; the fat term needs re-owning before cuisines are added |
| 4 · Quick & Easy | Yes |
| 5 · Family Meal | Yes, but effectively binary, and rests on a hand-set boolean |
| 6 · **Regular** | **No — it duplicates Quick & Easy while being labelled neutral** |
| 7 · The five sorts | Yes |
