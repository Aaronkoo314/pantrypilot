# Changelog

Every version of PantryPilot, newest first.

The tag [`v1-submitted`](../../releases/tag/v1-submitted) marks the exact state handed in for
MGMT 6110 Problem Set 1.

**Which document describes which version:**

| Document | Describes |
| --- | --- |
| [`REFLECTION.md`](REFLECTION.md) | v1 as submitted. It is the graded artefact and is not rewritten. |
| [`PROMPTS.md`](PROMPTS.md) | v1 as submitted, from the first prompt to the first push. Same. |
| [`RANKING-RULES.md`](RANKING-RULES.md) | **the current app.** Rewritten for v2. |
| [`README.md`](README.md) | the current app. |

To see and run precisely what was graded:

```bash
git checkout v1-submitted
npm install
npm run dev
```

---

## v2, batch 2 — the whole dataset, plus cuisine, vegetarian and price

*The dataset was replaced rather than extended, and the four meal preferences were deleted. This
is the batch where a human has to check numbers: 47 meals' macros and times, and 93 unit prices.*

### Added

- **Three cuisines** — Chinese, Western and Thai. Multi-select, and it excludes rather than
  scores. Japanese, French, Spanish and Italian remain unbuilt.
- **Vegetarian filter.** Derived from the ingredients, never hand-set per meal. 26 of the 93
  ingredients are non-vegetarian, and the five that matter are not meat at all — oyster sauce,
  fish sauce, both curry pastes and dried shrimp. A filter looking only for meat would call a
  Thai green curry vegetarian.
- **Price.** Every ingredient carries an invented unit price in Singapore dollars. The card shows
  price per person; the detail screen shows per person, whole dish, and the cost of just the
  items you are missing. All of it scales with the serving control. The prices are invented and
  no shop is named or implied.
- **Price sorting**, ascending or descending, along with the existing three.

### Changed

- **93 ingredients, up from 30.** Pork, chicken, beef and lamb split into cuts; six kinds of fish
  and seafood; the pantry split into Western, Chinese and Thai. The ingredient picker gained a
  second level for the two categories that needed it, so nobody scrolls past twenty-six pantry
  items to reach the beef.
- **47 meals, up from 11** — 17 Chinese, 16 Western, 14 Thai, spread 15 light / 17 medium /
  15 heavy, 14 of them vegetarian. Every ingredient is used by at least one meal, and every
  recipe line is consumed by a step.
- **Light / medium / heavy replaces the four meal preferences**, Fitness included. It is derived
  from calories per serving at 400 and 600, so the label on a card is a description of the figure
  beside it rather than a second opinion about the meal.
- **Units are declared once, on the ingredient.** A recipe line carries a bare number. v1
  repeated the unit on every line, which is how a price model drifts out of agreement with itself.
- The filter bar keeps sort and the two toggles visible and folds time, cuisine and weight — all
  answered two taps earlier on setup — behind one disclosure that names what is active.
- Cards show time, calories, price and servings. v1's "Serves" figure was the same number on
  every card and its difficulty was Easy on most; both moved to the tag row where they cost no
  vertical space.
- The empty state now offers the undo for whichever filter is actually binding, instead of
  sending the user to another screen to guess.

### Removed

- The four meal preferences, and with them `fitnessSuitability`, `familyFriendly`,
  `preferenceScore` and `isStrongPreferenceFit`.
- **The "Recommended" sort.** With preferences gone it was ingredient match under a second name —
  two controls producing one list, which is exactly the defect `RANKING-RULES.md` recorded against
  v1's Regular preference. Deleted rather than reimplemented.

### Note on how the data was produced

The 47 meals were authored by three agents, one per cuisine, and then checked by three more
against the recipes. All three cuisines failed the first check, and the failures were not the kind
a schema catches: ingredients listed but never used by a step, macros that contradicted the
quantities, near-duplicate dishes, and steps calling for salt that was not in the ingredient list.
Structure and distribution were already perfect at that point, which is the useful part —
**"the numbers are compliant" and "the thing is right" turned out to be different questions.**

One of the failures was mine. The brief asked for at least five meals in each of three calorie
bands from a set of thirteen, which is arithmetically impossible, and two of the three authors
quietly shaved fat figures to protect the quota rather than saying so. The third said so. The
second pass told them to move a meal's band rather than shave a macro, which is what exposed it.

---

## v2, batch 1 — cover, sort direction, picker rework

*Interface work only. No new invented data, so nothing here needed a human to check a nutrition
figure.*

### Added

- **Cover screen.** Holds three seconds, then fades. Skippable by tap or any key, and skipped
  outright for anyone whose system asks for reduced motion.
- **Sort direction.** Cooking time, calories and ingredient match can be reversed. The control
  names the order in words — *Shortest first*, *Lightest first* — rather than showing a bare
  arrow. Recommended and Preference fit are scores, so they stay fixed and the control hides.
  Choosing a new sort starts it in its own natural direction instead of inheriting the last one.

### Changed

- **Ingredient picker is now an index rather than a wall.** Search first; your picks are echoed
  at the top where you can undo them; category groups collapse and their headers carry item and
  selected counts. The setup screen drops from **2,930px to 1,559px** at 375px wide, which puts
  the "how many people" question in the first viewport instead of two screenfuls down. Done ahead
  of the ingredient list growing from 30 to roughly 60 in batch 3, where the old layout would not
  have fitted.
- The five sort comparators are replaced by one key function per sort plus a single direction
  rule. Ties break toward what the user can actually cook, in every sort.

### Fixed

- `display: grid` on a collapsed panel beat the `hidden` attribute's own `display: none`, so
  collapsing an ingredient group left its chips on screen. `[hidden]` now wins explicitly.

### Note on the progress bar

The cover's bar is driven from React state on a 50ms tick, not from a CSS keyframe. The keyframe
version reported itself as `running` with the correct 3000ms duration while its clock sat at zero,
which rendered the bar at zero width and perfectly still — the exact frozen-app impression the
cover exists to prevent. A CSS transition on the width failed the same way, and so did the delayed
fade-in on the "tap to skip" hint. All three now key off the same timer that dismisses the cover,
so the bar and the dismissal cannot disagree, and a throttled clock makes the bar jump forward
rather than sit at zero.

---

## v1 — submitted version · tag `v1-submitted`

Three screens taking a home cook from *what is in my fridge* to *here is what to cook and how
much of it*: ingredient picker, ranked recommendations with ingredient-match percentages, and a
detail screen whose serving control rescales every quantity while calories per person stay fixed.
30 invented ingredients, 11 invented meals, four meal preferences including Fitness.

Front end only. No backend, no network calls, no accounts. All data invented and held in one file.

Notable fixes made before submission, each recorded in `PROMPTS.md`:

- The Find Meals counter ignored the selected ingredients, so it read the same number whether
  nothing or fourteen things were ticked (`PROMPTS.md` §2.14).
- Whole-dish calories disagreed with whole-dish macros on 9 of the 11 meals, because the
  per-serving figure was rounded before being multiplied (`PROMPTS.md` §2.17).
- The match bar's four fill colours measured 1.05:1 to 1.19:1 against the card and did not order
  correctly by lightness; four palette tokens failed WCAG 1.4.3 across about a dozen uses.
- `tools/build_preview.py` carried the repository's only external URLs and its only real company
  name, in a project whose own guardrails forbade both. Removed.

---

## Planned

`v2` continues in three more batches. The agreed shape, and the reasoning behind each decision,
is in the further-action section of [`REFLECTION.md`](REFLECTION.md).

- **Batch 2** — vegetarian filter, estimated price per ingredient.
- **Batch 3** — Chinese, Western and Thai cuisines; roughly 10–12 new meals and 30 new
  ingredients; light / medium / heavy replacing the four preferences, Fitness included.
- **Batch 4** — documents brought back into line with the app.

Halal filtering was considered and dropped. A halal claim depends on slaughter method,
certification and cross-contamination, none of which an ingredient list records, so the app could
only ever have said "contains no pork or alcohol according to this prototype's invented data" —
which is not what a user reading a halal filter would take it to mean.
