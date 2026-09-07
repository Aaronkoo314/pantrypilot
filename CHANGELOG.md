# Changelog

Every version of PantryPilot, newest first.

The tag [`v1-submitted`](../../releases/tag/v1-submitted) marks the exact state handed in for
MGMT 6110 Problem Set 1. **[`REFLECTION.md`](REFLECTION.md), [`PROMPTS.md`](PROMPTS.md) and
[`RANKING-RULES.md`](RANKING-RULES.md) describe that version**, not whatever is currently on
`main`. To see and run precisely what was graded:

```bash
git checkout v1-submitted
npm install
npm run dev
```

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
