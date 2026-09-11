# PantryPilot — Build Reflection

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.

| | |
| --- | --- |
| Artefact | PantryPilot · React + Vite, front end only |
| Repository | `Aaronkoo314/pantrypilot` |
| First commit | `f12466e` — 18 files, 4,360 lines |
| Human decisions during the build | 4 |

Every number, quoted prompt and file path below comes from the build session itself and has been
re-checked against the repository. The working log is in [`prompts.md`](prompts.md).

> **This document describes the version tagged `v1-submitted`, not the app currently on `main`.**
> It is the graded artefact and is deliberately left as it was submitted. v2 replaced the dataset
> and deleted the four meal preferences, so the Fitness formula this reflection spends most of Q2
> on no longer exists in the running app — which is rather the point of Q5's third pointer.
> [`CHANGELOG.md`](CHANGELOG.md) lists what changed; `git checkout v1-submitted` runs what was
> graded.

---

## Q1 — Who the users are, and what changes for them

**External, not internal.** Non-professional home cooks who cook three to five dinners a week from
a kitchen that is stocked but unplanned. Four situations rather than four personas:

- the student in shared housing with half a shelf and a shared fridge;
- the office worker home at 19:15 with no decision left in them;
- the parent cooking for four on a Tuesday who needs it to be liked, not impressive;
- the confident cook who is not stuck for skill, only bored.

**Where.** Standing in the kitchen, phone in one hand, fridge door open. That situation is the
reason the interface is mobile-first with 48-pixel touch targets and 17-pixel body text — it is
operated one-handed while something else is happening.

**How many.** Zero. This is a prototype with no users. The honest number is one marker and whoever
I show it to. The design target is a household of one to four, which is why the serving control
caps at twelve rather than fifty.

### What they do today, without it

| # | Step today | What the screen does |
| --- | --- | --- |
| 1 | Open the fridge and look | — |
| 2 | Hold six to ten ingredients in working memory while closing it | — |
| 3 | Search a recipe site for one ingredient you remember having | — |
| 4 | Open a recipe written for four when you are cooking for two | — |
| 5 | Scroll past the author's childhood to reach the ingredient list | — |
| 6 | **Diff the ingredient list against the fridge, from memory** | **Replaced** by a match percentage and an explicit "still need" list |
| 7 | **Discover two things are missing; substitute, shop, or start over** | **Reordered** — filter before committing, not after |
| 8 | **Start over. Return to step 3. Repeat four or five times** | **Removed** by "only meals I can cook now" |
| 9 | **Halve every quantity in your head at the stove** | **Removed** by the serving control |

The expensive step is not the cooking and it is not the searching. It is step 6 repeated inside the
step 7–8 loop: reading a full ingredient list against an imperfect memory of a fridge, four or five
times, getting it slightly wrong each time. PantryPilot replaces that loop with one filtered list
where the diff is already computed and shown as `100% match · you have 7 of 7` next to the seven
items it is claiming.

Step 9 goes too. Changing servings from 2 to 3 rewrites 300 g of chicken to 450 g and 4 cloves of
garlic to 6, while calories per person deliberately stay at 510 — because what changes when more
people eat is the shopping, not the portion.

### The honest limit

It only works if the user first tells it what is in the fridge. Selecting fourteen ingredients took
about twenty seconds in testing. I did not remove the inventory step. I moved it from the user's
memory to the user's thumbs, and I moved it to the front, where it is most visible and most likely
to be abandoned.

---

## Q2 — Augmented capacity and constrained capacity

### What the pairing let me do

I had a verified, three-screen React application — thirty ingredients, eleven recipes, a working
serving-scaling model — running and clicked through on a machine **with no Node.js installed at
all**. The entire app was written and exercised before any JavaScript toolchain existed on the
laptop.

Being exact about this, because the repository can be used to check it: Node was installed later
the same evening, and `npm install` ran at 19:53 — four minutes before the first commit at 19:57,
which is why `package-lock.json` is in it. The claim is about how the app was *built*, not about
the state of the machine for the whole session.

```
$ node -v
bash: line 1: node: command not found
$ npm -v
bash: line 1: npm: command not found
```

Rather than stop, the pairing routed around the missing toolchain: an 89-line Python script
concatenated the same source files, stripped the ES module syntax, and served them through Babel in
the browser. The app was fully exercised — all three screens, serving rescaling, every filter —
before Node existed on the machine. I would not have thought of that approach, and I could not have
written it in an afternoon.

My own time went almost entirely into deciding what the screens were for. Across the whole build I
made four decisions: where the folder lives, public or private, TypeScript or not, and whether to
commit. Everything else was specification up front and review after.

### What the pairing narrowed

Two constraints, both of which I can point to in the log rather than borrow from an article.

#### 1. I approved 4,360 lines I had not read

```
Assistant:  要我现在帮你 git init 并做第一次提交吗?
Me:         准备提交吧
Result:     18 files changed, 4,360 insertions(+)
            → pushed public to github.com/Aaronkoo314/pantrypilot
```

I did not ask to see the diff. I did not ask for the file list. Three words moved 4,360 lines into
a public repository under my name. What was in them is the subject of Q4.

#### 2. Checking the output looked like checking the logic

The Fitness preference is the feature the brief was most specific about: it must favour "relatively
higher in protein, lower in calories, and nutritionally balanced". I verified that selecting Fitness
reordered the list, and that salmon rose to the top and pasta sank. I never looked at the rule that
did it.

```js
// src/data/pantryData.js — lines 468–476, never reviewed
const proteinPer100kcal = (meal.proteinGrams / calories) * 100;
const proteinPoints     = Math.min(proteinPer100kcal / 12, 1) * 50;
const caloriePoints     = Math.min(Math.max((750 - calories) / 400, 0), 1) * 30;
const balancePoints     = (1 - Math.min(Math.abs(fatShare - 0.3) / 0.3, 1)) * 20;
```

Why is 12 g of protein per 100 kcal the ceiling? Why 750 calories and not 700? Why is fat's ideal
share 0.30? Why is protein worth 50 points and calorie load only 30? Those four constants *are* the
feature. I approved the behaviour they produce without ever reading the numbers that produce it, and
an hour later I could not have recited one of them.

The same gap, larger: I read none of the 492 lines of `pantryData.js` and none of the 885 lines of
`styles.css`. Every gram of protein, carbohydrate and fat in the app is unverified by any human. If
the salmon should be 25 g and says 40 g, nothing in my process would have caught it — and the app
shows that number to a user under the heading "Nutrition".

### Where the delegation figures showed up

The report cited in the brief puts AI in about 60% of developers' work with only 0–20% of tasks
fully delegated — figures drawn from Anthropic's own engineers rather than from students, which cuts
both ways here. For me the ratio depended entirely on where the task boundary was drawn.

| Task boundary | Delegated |
| --- | --- |
| "Decide what the product is" | 0% — the idea was mine, and I rejected the six the tool proposed |
| "Turn that into a specification" | The wording is entirely ChatGPT's; most of the feature list inside it is mine |
| "Write and test the application" | ~100% — I wrote no code and ran no test |
| **"Verify that it works"** | **~100%** |

The last row is the one nobody measures and the one that mattered. The app was checked by the
system that wrote it, and I read a summary of that self-check and called it verified. Section 2.14
of `prompts.md` records what that cost.

### Whose defaults became the product's

Writing this honestly took two passes, because my first draft of this section gave the tool credit
for things I had asked for by name.

**Mine.** The product, and most of what it does. One paragraph of mine
(`prompts.md` section 1, round 1, quoted in full there) asked for: choosing the ingredients you
have and being shown what you can cook; choosing a dish and being shown what to buy; cooking time;
suggested servings; a people count that recomposes the meal; calories per dish; **calories per
person**; a fitness option; and a simpler option for when you are busy. Nine features. Eight of
them shipped. Only automatic multi-dish pairing was cut.

**Not mine.** *Ingredient match percentage* — the number the cards are built around and the thing
that turns this from a recipe list into a pantry tool — was named by ChatGPT while narrowing that
paragraph. So were difficulty and meal category as card fields, the "no missing ingredients"
filter, the three fixed time budgets, and Family Meal as a fourth preference. It also supplied the
*invariant* on a figure I had asked for: total calories move with the serving size, calories per
person do not. I asked for the number; it decided what the number must never do.

**Not anyone's — chosen because nobody specified:** default party size 2; default time budget 30
minutes; a default sort called "Recommended" weighting match at 0.6 and preference at 0.4; the
serving range 1–12; the rounding rule that renders 1.5 onions as "1.5" but 230 g of rice to the
nearest ten; the empty-state wording; scroll-to-top on navigation.

And the look. The app is warm cream with a terracotta accent and rounded cards — which is, almost
item for item, the house style a model produces when no visual direction is given. It was disclosed
to me in the first reply as a choice being made. **Disclosed is not chosen.** I have a warm cream app
because I never said anything about colour.

I got this section wrong in both directions before it settled. First I claimed the tool's ideas as
mine, because they arrived inside a specification I had approved. Then, correcting that, I handed
it features I had asked for by name, because by then I trusted its account of the build over my own
memory of what I had typed.

That is the more uncomfortable finding. Working this way did not just move decisions — it made me
a poor witness to which ones had been mine, in both directions, within two days.

---

## Q3 — In, on, and out of the loop

### Where my judgment changed the outcome

The clearest case came after everything had shipped. I asked one question:

```
Me:  为什么用的是javascript 不是typescipt
```

It did not change a line of code — I chose to defer the conversion. It changed something more
useful: a default that had been mentioned once in a bullet list and then silently governed 2,400
lines became a decision with a stated reason and an owner. That is the difference between a choice
being *disclosed* and a choice being *made*.

It was not, however, the first time. Two earlier moments are logged in `prompts.md` section 1,
before any code existed. In round 0 the tool read the assignment, proposed six products and
recommended a book-discovery app; **I rejected all six and supplied the cooking idea myself**, and
every screen in the submitted app descends from that override rather than from its advice. Then in
round 2 the direction reversed.

Two smaller ones. I killed a background process before I understood it (`我关掉了`, then
`这个running task是在干什么`) — control first, explanation second, which for a process on my own
machine is the right order. And I chose the repository location and visibility rather than accepting
a suggestion.

### Where I was overruled, and was wrong

A category I did not expect to need. Asked to define the user, I argued for the widest possible
audience:

```
Me:  目标用户是所有人群，所以覆盖面要广，从小白，到学生，到主妇到大厨都可以使用
```

The tool refused, and cited the assignment back at me: a weak product definition starts with an
over-broad user. It narrowed the audience to non-professional home cooks and cut professional
chefs explicitly. That narrowed wording is verbatim in the GOAL section of the prompt that built
this app, and Q1 above is written from it.

I was in the loop, I had an opinion, I was overruled, and the product is better for it. Any honest
account of where human judgment is needed has to include the case where it was supplied and was
wrong — otherwise "keep a human in the loop" is an article of faith rather than a claim about
outcomes.

### Where I was in the loop and added nothing

This is the more useful half, and there are three.

> **Admission 1 — approval without inspection.** `准备提交吧` — eighteen files, unread, to a public
> repository. I was in the loop by construction: I was asked, and nothing happened until I answered.
> I was out of the loop in substance, because my answer carried no information about the contents.

> **Admission 2 — a warning I did not answer.** When I chose Public, I was told in the same message:
> "代码任何人都能看到。你的提交里作者邮箱是 aaron.koo.2026@mbai.smu.edu.sg，这个信息会公开可见。
> 介意的话现在还来得及改成私有". I did not respond to that sentence. Not "I considered it and accepted
> the exposure" — I moved to the next task. Being warned and proceeding is indistinguishable, from
> the outside, from having weighed it. From the inside it is not the same thing at all.

> **Admission 3 — accepting a self-assessment.** `npm audit` reported two vulnerabilities, including
> a known esbuild advisory. I was told these were development-only and did not affect the deployed
> site. That is probably true. I did not check it. I accepted a security assessment of the
> dependencies from the same process that installed them.

### Where each step belongs, going forward

Judged on reversibility, stakes, checkability, volume, and who bears the error.

| Step | Reversible | Checkable by the user | Volume | Who bears an error | Position |
| --- | --- | --- | --- | --- | --- |
| Compute ingredient match % | Yes — untap a chip | Yes, immediately — the list is shown beside the claim | ~10 per screen | The user | **Out** |
| Order the meal list | Yes — change the sort | Partly — the ranking reason is not shown | ~5 per day | The user | **Out** |
| Score Fitness suitability | Yes | No — the score is never displayed | Every Fitness session | The user | **On** |
| Rescale ingredient quantities | Yes, until you have cooked it | Yes, but at the stove — too late to matter | 1–2 per meal | The user | **On** |
| Author the nutrition figures | No, once published | No — 40 g and 25 g look identical | Once, for 11 meals | Someone who never agreed to any of this | **In** |

#### One step that should be out of the loop

**The ingredient match percentage.** It is fully reversible, the worst outcome is seeing a meal you
did not want, and — the decisive property — it is *self-auditing*. The screen states the claim and
prints the evidence beside it: "you have 7 of 7", followed by the seven items. The user validates
the computation by reading the same row. At roughly ten evaluations per screen, asking for approval
would be theatre.

What would have to be true, and measured, before I signed that off:

1. The have/need lists render **every** ingredient, never a truncated set, so the claim is always
   auditable. Measured by asserting rendered row count equals recipe ingredient count, for all
   eleven meals.
2. Match is a pure function of two lists: no fuzzy matching, no "close enough" substitutions, no
   hidden weighting. Measured by asserting `matchPercent === round(100 × have / total)` across all
   meals and a sample of pantry states.
3. The zero state is defined and visible: no ingredients selected yields 0%, not a crash and not a
   silent default. *This one I did check* — it returns "0 meals found".

#### One step where a human must stay

**Authoring the nutrition figures and the Fitness weights** — not displaying them, authoring them.
It is the only step in the product where the error is borne by someone who never agreed to anything,
where the user has no way of detecting it, and where the failure is silent rather than visible. It is
also the point at which a wrong number stops being a UI bug and becomes a health claim, which is
precisely why the app carries a disclaimer — and a disclaimer is an admission that nobody checked,
not a substitute for checking.

The cost argument makes it worse rather than better. This is eleven meals, authored once. A human
review would take perhaps forty minutes and never need repeating. **The step where I insist a human
is irreplaceable is the cheapest step in the entire build, and it is the one I skipped.**

---

## Q4 — What it built that I never sketched

The brief predicts a specific shape of surprise: you ask for a front end and AI Studio hands you an
app with a small server behind it, ready to be given a Gemini key you never see. I was not on AI
Studio, so I did not get that. I got the same category of surprise arriving from a different
direction.

My machine had no Node.js. To show me a running app, the tool wrote a Python bundler, started a local
HTTP server on port 8412, and served my React application using React, ReactDOM and Babel **fetched
from a public CDN**. I asked for a screen. I received a screen, a bundler, a web server, and three
external dependencies.

```
tools/build_preview.py:74   https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/...
tools/build_preview.py:75   https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/...
tools/build_preview.py:76   https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/...
```

My own brief said, in the guardrails section, in capitals: **"Do NOT call any external API, service,
database, or URL."** Those three lines are external URL calls, and `cdnjs.cloudflare.com` carries a
real company's name. They are development-only, they were disclosed to me the moment they were
written, and they are defensible. They also went into a public repository under my name, in the file
list of a project whose stated constraint they contradict, and I never opened the file.

Under the same approval went `package-lock.json`: 1,740 lines describing 63 packages, none of which
I selected, evaluated, or read, two of which carry published advisories. A screen, and a kitchen.

### When I noticed

Not during the build. I did notice the *server* — I asked `这个running task是在干什么` — which means I
saw a process I had not asked for and enquired about it. But I asked about the process, not the file,
and the answer satisfied me. Not at the commit. Not at the push. **I noticed while writing this
answer**, when the repository file list was pulled up and a search for "https" returned three lines I
had never seen.

It has since been removed, in commit `615ae79` — it had no remaining purpose once Node was installed,
and it collided with two items on the submission checklist. That is the shape of the whole episode:
it entered the repository without being read, and it left the repository for a reason that had
nothing to do with why it should never have been there.

### What I would have had to do differently

One thing, and it is humiliatingly small: **read the file list before saying yes.** Not review the
architecture. Not audit 63 dependencies. Just look at eighteen filenames, where
`tools/build_preview.py` sits among sixteen `.jsx` and `.js` files and is visibly the wrong shape.
Ten seconds, and then one `grep https` if the name surprised me. The gate existed. I was standing at
it. I said `准备提交吧`.

### It decided things I did not know were decisions

What the list does when nothing is selected — it shows every meal at 0% match, ordered by preference
rather than by match, which is a real product opinion I never held. That the party size starts at 2.
That garlic scales to "6 cloves" but rice rounds to "230 g", because quantities under twenty round to
the nearest whole and over one hundred to the nearest ten. That navigation scrolls to the top. Each
of these is now the product's behaviour, and I learned all of them by being shown a test result.

### It was right where I was wrong

My specification listed the fields each meal must carry, including both calories and the three
macronutrients — as independent fields. The build made calories a *computed* value: protein × 4 +
carbohydrate × 4 + fat × 9. I had not asked for that and would not have thought of it. Without it,
changing the serving size could have produced a total that contradicted its own macros on the same
screen, and the one guarantee I cared most about — calories per person stay fixed — would have been
quietly false.

That is the part worth sitting with. The brief was long, structured, and specific: role, goal,
output, guardrails, context, counts, field lists. It was also **drafted for me by ChatGPT over four
rounds** (`prompts.md` section 1) and pasted into the builder without my changing a word — which
makes the point sharper rather than softer, because two systems and one person all read that
specification and none of us noticed what it left out. It was detailed exactly where detail was easy — how many
ingredients, how many meals, which fields — and silent exactly where it mattered: what must stay
consistent with what. **I thought the specification was complete because it was long.**

---

## Q5 — Learning pointers for the organisational context

Work outward from Q4. In one afternoon, on a 2,400-line application, built by one person who had
written an explicit guardrail against external calls, a Python file and three CDN dependencies
entered a public repository — and it took until the reflection to see them. Every safeguard was
present: the additions were disclosed as they happened, an approval gate stood before the commit, and
the person at that gate had written the rule being crossed.

So the organisational assumption cannot be "someone will read it." A sample of one says they will
not. The controls have to sit where the artefact crosses a boundary — into a repository, into a
deployment, into a budget — because those are the moments that can be instrumented, and reading
generated code is not.

### 1. Show the file list, not the diff, before any AI-assisted commit reaches a shared repository — and require an explicit acknowledgement of new file extensions.

*Traces to:* a Python file and three `cdnjs.cloudflare.com` script tags entering a public repo in a
commit approved with three words. The filename alone would have caught it in ten seconds; the
4,360-line diff would not have been read at all.

### 2. Default every generated repository to private at the organisation level, and make publishing a separate step taken on a different day than the build.

*Traces to:* being asked "public or private?" in the middle of a build, being warned in the same
breath that my institutional email would become publicly visible, and proceeding without answering
the warning. The question arrives at the moment the person is least equipped to weigh it, and asking
harder does not fix that — moving the question does.

### 3. Every generated rule that ranks, scores or filters what users see gets a named human owner and one plain-English sentence stating its weights, committed beside the code.

*Traces to:* the Fitness score — `protein/12 × 50 + (750−kcal)/400 × 30 + fat-balance × 20` — which
is the core of the app's only health-adjacent feature, was authored by the tool, reviewed by nobody,
and which I could not have recited an hour after shipping. When the person who prompted it moves
team, that formula is the part nobody can explain and nobody dares change.

The same three questions in the organisational frame answer themselves once the boundaries are named.
*What data may enter a prompt* is settled at the repository gate, not in training. *Who pays* becomes
visible the moment a deployed app spends its owner's quota rather than its user's — my build spent
nothing, but only because the guardrails forbade the model call that AI Studio would have wired in by
default. *Who owns a thing nobody wrote* is answered by pointer 3, or it is not answered at all.

---

## Further action

Four directions were proposed for the next version — cuisine selection, a prep-and-shopping list,
deeper personalisation, and interface refinement. Rather than write them up from intuition, each was
designed in isolation and then handed to an adversarial reviewer instructed to find where it was
weak, with access to the actual repository.

The reviewers came back with something more useful than a roadmap. Before any of the four features
could be assessed, they found a defect in the code that had already shipped.

### Zero. The counter that never counted

The Meal Setup screen ended in a primary button reading `Find Meals · 8 meals fit right now`. The
phrase "right now" promised that the number responds to the kitchen you have just described. It did
not.

```js
// src/App.jsx — as shipped in f12466e
const setupResultCount = useMemo(() => {
  const limit = timeLimitMinutes(setup.timeId);
  return MEALS.filter((meal) => meal.totalMinutes <= limit).length;
}, [setup.timeId]);              // setup.ingredientIds never referenced
```

The count filtered on the time budget alone. Tick nothing and it read 8. Tick fourteen ingredients
and it still read 8. The single input the entire product exists to consume had no effect on the only
feedback the user gets before committing. Six lines above it, `readyCount` — written in the same
session, for a less prominent label — does take ingredients into account, so this was an omission
rather than a misunderstanding.

**How long it survived.** It was written, browser-tested, and photographed three times during the
build, at ingredient counts of 0, 10 and 14. All three screenshots show the button reading "8 meals
fit right now". Nobody read the number against the count beside it. It then passed my review, the
commit, and the push into the public repository. It was found by pointing eight adversarial agents at
the code *after* this reflection was written — which is to say the only thing that caught it was a
process nobody runs by default.

Fixed in commit `171992f`. Verified afterwards by ticking ingredients one at a time:

```
chips = 0    →   "8 meals fit your time"
chips = 6    →   "8 meals · 0 need no shopping"
chips = 7    →   "8 meals · 1 needs no shopping"     ← the 7th completes a recipe
chips = 10   →   "8 meals · 2 need no shopping"
chips = 14   →   "8 meals · 3 need no shopping"
```

The repair took one prop and four lines. The instructive part is not the fix, it is the check: *tick
an ingredient and watch whether the number moves.* That test takes four seconds, needs no tooling,
and would have caught this on the first afternoon. It was never run, because the screen looked
finished and the number looked like a number.

### A. Cook plan & shopping list — build first

Mark several recommended meals as "in my plan", set servings per meal, and get one merged list of
what is missing — deduplicated across meals, quantities summed, grouped by aisle. Three meals needing
4, 3 and 2 cloves of garlic produce one line reading 9 cloves, not three lines.

- **Why first.** It adds almost no new invented data — every number on the list is arithmetic on
  figures a human already authored — and it closes the loop the app currently leaves open: it tells
  you what you could cook, then abandons you.
- **Honest limit.** *The pantry is a boolean.* The app knows you "have garlic"; it does not know you
  have two cloves. Merge three meals that need nine and the list confidently omits garlic entirely.
  Merging cannot fix this — only quantities in the pantry model could, and that would triple the cost
  of the setup screen. The honest fix is a caveat on the list, not a better algorithm.
- **Forces a fix.** Serving size currently lives inside Meal Detail and is discarded on navigation. A
  plan needs it lifted to App state, which repairs a real existing defect.
- **Guardrail line.** Listing, merging, grouping, ticking off, printing: allowed. Prices, shops,
  links, delivery: forbidden. The line is between describing what you need and helping you get it.

### B. Interface refinement — build first

Two items, not a redesign. Fix the counter above (done), and fix the match bar, which is the graphic
carrying the app's central signal and currently carries almost none: its fill colours sit at roughly
1.1:1 contrast against the card, and they do not order correctly in greyscale, so the bar
communicates through the text printed on top of it rather than through the bar.

- Match is encoded in width and hue only. A segmented meter — one segment per ingredient, filled or
  hollow — would encode it in shape, work without colour, and show the actual count rather than a
  percentage of it.
- **On the palette.** Q2 concluded the warm-cream-and-terracotta look was a default rather than a
  decision. The fix is not a different palette; it is deriving one from something — the ingredient
  categories, the have/need distinction — so the next person can tell why it is what it is.
- **Leave alone.** The 48 px touch targets and the have/need colour split are working, and both were
  verified against real interaction rather than assumed.

### C. Personalisation — build later

The strongest candidate is the least exciting one: **remember the staples**. Q1 identified the
30-chip inventory step as the app's biggest imposed cost and its most likely abandonment point.
Remembering the user's usual pantry in browser storage removes it, adds no invented data, and creates
no ranking rule.

- **Its failure mode.** It fails in the confident direction. You finished the garlic last night; the
  app still believes you have it, reports 100% match, and sends you to the stove missing an
  ingredient. Tapping fourteen chips is tedious but self-correcting. Remembering them is convenient
  and decays silently.
- **Rejected: allergy filtering.** The ingredient array is a shopping-and-matching list, not an
  allergen manifest — nothing in the data records that a sauce contains nuts. A filter built on it
  would look authoritative and be wrong, and the error is borne by someone who never agreed to
  anything. Taste preferences are a different feature with a different error profile; those are fine.
- **Storage line.** Anything remembered stays in the browser, written only on a tap, never
  transmitted. It is lost on a new device and when site data is cleared, and the interface has to say
  so.

### D. Cuisine selection — build later

Filter by Western, Chinese, Indian and so on. The interface is half a day: one filter line, one
multi-select pill row reusing existing styles. The interface is not the problem.

- **Real cost.** Eleven meals across five cuisines is two meals per cuisine, so almost every
  combination of cuisine and time budget returns nothing. Making the filter honest means roughly
  tripling the dataset — about 22 new meals and 22 new ingredients — and every one of those carries
  nutrition figures that, by this document's own Q3 argument, a human has to check. **Start with
  three cuisines, not five.**
- **Hidden collision.** The Fitness score awards 20 of its 100 points for fat sitting near 30% of
  energy. A coconut-milk curry at 25 g protein / 40 g carbs / 28 g fat scores about 45; the existing
  chicken-and-rice dish at nearly identical calories scores about 65, and roughly nine of those
  twenty points are the fat-share term alone. Add cuisines without re-owning that constant and the
  app quietly rates whole cuisines as less healthy — a ranking nobody chose, sitting on a feature the
  guardrails specifically restricted.
- **Design call.** Cuisine should *exclude*, not score. Putting it into the ranking formula would add
  a second uninspectable set of weights to do work a filter already does.
- **Visible risk.** Unlike a wrong nutrition figure, a wrong-feeling Thai dish is detected instantly
  by everyone — and this prototype is read in Singapore by people who cook these cuisines weekly.

### Build order

| Order | Item | New invented data | Adds a ranking rule? | Effort |
| --- | --- | --- | --- | --- |
| 0 | Fix the setup counter — **done** | None | No | Four lines |
| 1 | Write down the four ranking rules that already ship unowned | None | No — it names the existing ones | An afternoon |
| 2 | Match bar and contrast pass | None | No | ~1 day |
| 3 | Cook plan & shopping list | ~30 unit fields | No — ordering only, no weights | ~1 day |
| 4 | Remembered staples | None | No | An evening |
| 5 | Cuisine, three to start | ~12 meals, ~15 ingredients | No, if it excludes rather than scores | Days, almost all authoring |

Item 1 builds nothing. It is the Q5 pointer applied to this repository: the four rules that already
decide what users see — `recommendedScore` at 60/40, `fitnessSuitability` at 50/30/20, and the Quick
and Family fits — each get a named owner and one plain sentence, committed beside the code. It costs
an afternoon, depends on nothing shipping, and every feature below it makes the omission worse.

The ordering principle across the whole table is the one this document arrived at the hard way: **the
cheap work is the code, and the expensive work is the judgement nobody can delegate.** Cuisine
selection sits last not because the filter is difficult — it is an afternoon — but because it demands
twenty-two recipes' worth of nutrition figures that a human has to sit down and check, and this
reflection exists partly because that check was skipped the first time.
