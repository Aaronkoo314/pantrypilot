# PantryPilot — Prompt Log

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.
Build session: evening of 6 September 2026 into the morning of 7 September 2026.
Tool: Claude Code (Opus 5) in the Claude desktop app.

This is the working log of how PantryPilot was actually built. It records the prompts
that produced the app, and — as the brief requires — the ones that went wrong. There
were more of the second kind than I expected, and several of the most useful moments in
the build were failures rather than successes.

Two tools were used, and section 1 is explicit about which did what. The master prompt was
drafted by ChatGPT over four rounds from a product idea of mine; the build itself was done in
Claude Code from that prompt. The final prompt wording is not mine and this log says so.

Entries are marked:

| Mark | Meaning |
| --- | --- |
| ✅ | Worked as intended |
| ⚠️ | Went wrong, and what it cost |
| 🔑 | A moment where my own judgment changed the outcome |

---

## 1. Where the master prompt came from

The prompt below is the single most consequential thing in this project — roughly 90% of the
finished app traces directly to it. **I did not write it in one go, and the final wording is not
mine.** It was drafted by ChatGPT across four rounds, from my product idea, after I uploaded the
assignment brief. Recording that accurately matters more to me than claiming authorship, so this
section is the log of those four rounds before section 2 picks up the build itself.

Each round moved one thing.

### Round 0 — the tool proposed six products and I rejected all of them

I uploaded `MGMT6110_Problem_Set_1.html` and asked only whether it could be read. ChatGPT read the
constraints and came back with six candidate products — a layered book-discovery app, an
investment watchlist, a gym-buddy matcher, a study-sprint planner, a restaurant picker and a
retail stock dashboard — and recommended the first:

> "如果是我替你选，我会直接做 BookPath。"

🔑 **I did not take the recommendation.** I replied with an entirely different idea of my own:
a cooking app where you say what is in your fridge and it tells you what you can make. Nothing in
the six suggestions led to it. Every screen in the submitted app descends from that override, not
from the tool's advice.

### Round 1 — scope

My raw idea contained two products at once, and I said so: *"选择我目前有哪些食物原材料，输出可以做
的菜，或者选择想要吃的菜，输出需要的原材料"* — pantry-to-dish **and** dish-to-shopping-list — plus
servings, calories, a fitness mode and a busy mode.

The variable that moved was scope. ChatGPT reframed it from a recipe app to a *meal decision
assistant*, made pantry-to-dish the core and dish-to-ingredients secondary, and named the two
inventions that became the product's spine: **ingredient match percentage** and **smart serving
scale** — the two interactions the reflection later spends the most time on.

### Round 2 — the user definition, where I was wrong

⚠️ I pushed back on the narrowed audience and argued for the widest possible one:

> **Me:** 目标用户是所有人群，所以覆盖面要广，从小白，到学生，到主妇到大厨都可以使用

The tool refused, and cited the assignment against me — a weak product definition starts with an
over-broad user, and "for people who want to be organised" is a category rather than a user. It
narrowed to *non-professional home cooks, including beginners, students, busy workers, parents,
and experienced everyday cooks*, and explicitly cut professional chefs on the grounds that their
real job is recipe development and cost control, not deciding what to cook tonight.

**I accepted, and that wording is verbatim in the GOAL section of the final prompt.** This is the
one round where the human in the loop was overruled and the output improved because of it.

### Round 3 — the guardrails, which grew out of the earlier rounds

I asked for the result in the course's R·G·O·G·C structure. The GUARDRAILS section that came back
was not written from scratch; it is an accumulation of constraints discovered while *rejecting*
the earlier ideas:

| Guardrail in the final prompt | Where it came from |
| --- | --- |
| "Do NOT use real restaurant, food-delivery, grocery, or company names, logos, or trademarks." | The rejected investment-dashboard idea in round 0, flagged as *"不能用真实公司名"* |
| "Do NOT call Gemini or any other AI model." | The rejected book-discovery idea in round 0, flagged as *"这次不能真的调用 AI，只能用 invented book data"* |
| "Do NOT present nutritional information as medical advice." and "The Fitness option should only prioritize meals that are relatively higher in protein, lower in calories, and nutritionally balanced within the invented dataset." | **My own fitness request in round 1**, answered with a warning that it would drag in *"BMI / TDEE / macro targets / weight-loss goals / dietary medical advice — scope 会爆炸"* |

The last row is the one worth noticing. **A guardrail exists in the shipped prompt because a
feature I asked for was identified as a scope failure before it was built.** The whole Fitness
section of `RANKING-RULES.md`, and the disclaimer rendered on two screens of the app, descend from
that exchange.

### The prompt that resulted

Pasted into Claude Code unchanged — I altered not one word of it.

> **ROLE:** You are a senior front-end developer building a clean, mobile-friendly React web app.
>
> **GOAL:** Build the front end of a cooking assistant called PantryPilot for non-professional
> home cooks, including beginners, students, busy workers, parents, and experienced everyday cooks.
>
> The main job of the product is to help users decide what to cook based on what ingredients
> they currently have, how many people they are cooking for, how much time they have, and what
> kind of meal they want.
>
> Build three connected screens:
>
> **1) Meal Setup** — select ingredients from an invented list; choose number of people; choose
> available cooking time (15 / 30 / 60+ minutes); choose a meal preference (Regular, Quick & Easy,
> Fitness, Family Meal); a clear "Find Meals" button.
>
> **2) Meal Recommendations** — at least 6 invented meal cards, each showing meal name, ingredient
> match percentage, cooking time, servings, calories per person, difficulty, meal category, and
> missing ingredients. Filter or sort by cooking time, calories, ingredient match, meal preference.
> An option to show only meals that require no additional ingredients. Clicking a meal opens its detail.
>
> **3) Meal Detail** — full ingredient list marking what the user has and still needs; preparation,
> cooking and total time; calories per serving and total; protein, carbohydrates and fat; a
> serving-size control that rescales ingredient quantities and total calories while leaving calories
> per person unchanged; step-by-step instructions; a button back to the recommendations.
>
> **OUTPUT:** A running React web app. All invented data in one separate data file. At least
> 20 invented ingredients and 8 invented meals. Each meal with structured data for ingredients,
> quantities, servings, cooking time, preparation time, calories per serving, protein, carbohydrates,
> fat, difficulty, meal category, and fitness suitability. One component per major screen or section.
> Movement between screens without reloading the page. Fully usable on a mobile phone.
> When finished, list all files created and briefly explain what each contains.
>
> **GUARDRAILS:** Front end only. Invented data only. Do NOT call Gemini or any other AI model.
> Do NOT call any external API, service, database, or URL. Do NOT add a backend. Do NOT add login,
> accounts, authentication, analytics, cloud storage, payments, grocery delivery, barcode scanning,
> camera recognition, or live nutrition services. Do NOT use real restaurant, food-delivery, grocery
> or company names, logos or trademarks. Do NOT add features that are not listed. Do NOT present
> nutritional information as medical advice. The Fitness option should only prioritize meals that
> are relatively higher in protein, lower in calories, and nutritionally balanced within the
> invented dataset.
>
> **CONTEXT:** Individual front-end prototype for MGMT 6110 at SMU. Built in Google AI Studio,
> stored in GitHub, deployed on Vercel. Primary users are non-professional home cooks. The visual
> style should feel modern, warm, practical and food-focused rather than technical or corporate.
>
> If you make any design or implementation choice that I did not explicitly specify, state that
> choice in one short line before implementing it.

✅ **Result.** Three screens, 30 ingredients, 11 meals, all required fields present. The last
instruction — declare unspecified choices — turned out to matter more than any other line, and is
discussed in section 4.

---

## 2. Chronological log

### 2.1 The machine had no Node.js

⚠️ **Went wrong before anything was built.** The first environment check returned:

```
$ node -v
bash: line 1: node: command not found
$ npm -v
bash: line 1: npm: command not found
```

There was no JavaScript toolchain on the laptop at all. Rather than stop, the tool wrote an
89-line Python script that concatenated the source files, stripped the ES module syntax, and
compiled the JSX in the browser through Babel, then served it over a local HTTP server. The
whole app was built and exercised this way before Node existed on the machine.

Node was installed later the same evening (section 2.6), and `npm install` ran at 19:53, four
minutes before the first commit at 19:57 — which is why `package-lock.json` appears in it. The
no-toolchain claim covers the construction of the app, not the whole session.

🔑 That script became a problem the next morning — see 2.11 — but it is the reason there was
anything to look at on day one.

### 2.2 Writing the data file failed on shell quoting

⚠️ The first attempt to write `pantryData.js` used a shell heredoc and died:

```
bash: -c: line 152: unexpected EOF while looking for matching `''
```

Cost: one wasted attempt on a 500-line file. Fix: stop trying to write large files through the
shell and use the file-writing tool directly. Not an interesting failure, but a real one, and it
is the kind of thing that silently eats time.

### 2.3 A bug found by testing, not by reading

⚠️ 🔑 Selecting fourteen ingredients programmatically left only **one** selected. The cause was a
stale closure: the toggle handler read `ingredientIds` from the render it was created in, so
fourteen rapid updates all computed from the same starting array.

```js
// before — every rapid click computes from the same stale array
const next = ingredientIds.includes(id) ? ... : [...ingredientIds, id];

// after — each update computes from the live state
onChange((current) => ({ ingredientIds: ... }));
```

This would not have shown up in ordinary clicking, and it would not have shown up by reading the
code. It surfaced only because the interface was driven automatically. **Verification found a
defect that inspection would have missed** — worth noting, because the opposite happened later.

### 2.4 Screenshots came back blank

⚠️ Several rounds of screenshots returned an empty cream rectangle while the page was demonstrably
rendering — the DOM query showed cards positioned correctly in the viewport. Cost: five or six
wasted cycles chasing a rendering bug that did not exist. Cause: the browser pane was hidden on my
side, and a hidden pane does not paint. Fix: verify through the accessibility tree and page text
rather than images when the pane is not visible.

### 2.5 Two real defects found by looking

⚠️ Two product defects, both shipped into the build, both caught visually, and neither of which
would have been caught by reading code:

- The four statistics on a meal card wrapped **3 + 1** at 375 px instead of sitting in a row.
  Fixed by switching from a wrapping flex row to a two-column grid.
- The brand emoji, a frying pan, read as a **magnifying glass** at 15 px. Changed to a tomato.

### 2.6 `npm install && npm run dev` — three separate failures

> **Me:** whats the problem now

⚠️ Three things were wrong at once, and only the first mattered:

1. **Node was not installed.** The whole earlier build had run through the Python preview harness.
2. **`&&` is a parser error in Windows PowerShell 5.1.** `标记"&&"不是此版本中的有效语句分隔符。`
3. **I was in `C:\Users\aaron`**, not the project folder.

Fix: install Node with `winget install OpenJS.NodeJS.LTS`, then run the two commands separately.

### 2.7 PATH did not update — twice

⚠️ After installing Node, `npm` was still "not recognized". After installing the GitHub CLI,
`gh` was still "not recognized".

> **Me:** node下载好了但是后面两个跑不了
>
> **Me:** 暂时还无法识别gh不知道为什么

The installs were fine. The registry showed both paths present in the machine PATH:

```
Machine PATH → C:\Program Files\nodejs\
Machine PATH → C:\Program Files\GitHub CLI\
```

Windows only hands the updated PATH to **newly launched** processes, and a new terminal *tab*
inherits from the already-running application. Restarting the tab does nothing; the application
has to be restarted, or the path prepended for the session:

```powershell
$env:Path = "C:\Program Files\GitHub CLI;C:\Program Files\nodejs;" + $env:Path
```

Cost: two separate rounds of confusion, roughly the same failure both times. I did not recognise
the second one as the same problem as the first.

### 2.8 A process I did not understand, and killed anyway

> **Me:** 这个running task是在干什么
>
> **Me:** 我关掉了，但是这个网页现在有什么问题吗

🔑 A background process was running that I had not asked about. I killed it first and asked
what it was second.

It was the Python preview server, and killing it broke nothing — but I did not know that when I
killed it. The honest reading is that I took a small risk and it happened not to cost anything. On
my own machine, with a process I had not authorised, acting first is defensible; it is not the same
thing as having judged it safe.

### 2.9 Approving the commit

> **Assistant:** 要我现在帮你 git init 并做第一次提交吗?
>
> **Me:** 准备提交吧

⚠️ Three words. Eighteen files, 4,360 lines, into a public repository. I did not ask to see the
diff and I did not ask for the file list. What was in them became a problem later (2.11).

I was also warned, in the same message where I chose a public repository, that my institutional
email address would become publicly visible in the commit metadata. I did not answer that
sentence. I moved on to the next task.

### 2.10 Challenging a default

> **Me:** 为什么用的是javascript 不是typescipt

🔑 The clearest case in the log of my judgment changing something. TypeScript versus JavaScript
had been declared in a single line at the start of the build, alongside five other choices, and
then quietly governed 2,400 lines. Asking the question did not change any code — I chose to defer
the conversion — but it converted an unexamined default into a stated decision with a reason.

The answer given was that the brief mentioned Google AI Studio, whose React scaffolds are plain
JSX, and that the course grades the cooking decision rather than type safety. Both are defensible.
Neither had been examined until I asked.

### 2.11 The file I never opened

⚠️ The Python preview harness from 2.1 loaded React, ReactDOM and Babel from a public CDN:

```
tools/build_preview.py:74   https://cdnjs.cloudflare.com/ajax/libs/react/...
tools/build_preview.py:75   https://cdnjs.cloudflare.com/ajax/libs/react-dom/...
tools/build_preview.py:76   https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/...
```

My own brief said, in capitals: **"Do NOT call any external API, service, database, or URL."**
Those three lines are external URL calls, and `cdnjs.cloudflare.com` carries a real company's
name. Both were disclosed to me when they were written, and both are defensible as a
development-only harness — but I never opened the file, and it went into a public repository
under my name in the commit I approved in 2.9.

I noticed on 7 September, while writing the reflection, when the repository file list was pulled
up and a search for `https` returned three lines I had never seen.

The file has since been removed — it had no remaining purpose once Node was installed, and it
collided with two items on the submission checklist.

**What would have caught it:** reading the eighteen filenames before typing `准备提交吧`.
`tools/build_preview.py` is visibly the wrong shape in a list of `.jsx` files. Ten seconds.

### 2.12 Vite served raw JSX and the page went blank

⚠️ After Node was installed the dev server started, but the page rendered nothing and the console
showed `Uncaught SyntaxError: Unexpected token '<'`. Fetching the entry module returned this:

```js
import { StrictMode } from 'react';   // bare specifier, not rewritten
...
  <StrictMode>                         // JSX, not compiled
```

Vite was serving the source **untransformed**, as a static asset. Cause: the project is reachable
at both `C:\Users\aaron\Documents\GitHub\pantrypilot` and `D:\GitHub\pantrypilot` (the same
directory through a drive mapping), and starting the server from one path while Vite resolved the
other put every source file outside what it considered the project root. The same cause later made
`npm run build` fail with:

```
[vite:build-html] The "fileName" or "name" properties of emitted chunks and assets must be
strings that are neither absolute nor relative paths, received "D:/GitHub/pantrypilot/index.html".
```

Fix: run both from the same path. Cost: a blank page that looked like a code error and was not.

### 2.13 A stopped process that did not stop

⚠️ Stopping the dev server killed the `npm` wrapper but left the `vite` child running and holding
port 5173, so the next server silently started on 5174 while I was still testing against 5173 —
and 5173 was the *broken* one from 2.12. Two minutes of testing a server I thought I had replaced.

### 2.14 The counter that never counted

⚠️ 🔑 The single worst defect in the build, and the one that says the most.

The Meal Setup screen ends in a button reading **"Find Meals · 8 meals fit right now"**. The
count filtered on the time budget alone:

```js
const setupResultCount = useMemo(() => {
  const limit = timeLimitMinutes(setup.timeId);
  return MEALS.filter((meal) => meal.totalMinutes <= limit).length;
}, [setup.timeId]);              // setup.ingredientIds never referenced
```

Tick nothing: 8. Tick fourteen ingredients: 8. The one input the entire product exists to consume
had no effect on the only feedback shown before committing.

It survived being written, being browser-tested, **three screenshots taken at ingredient counts of
0, 10 and 14 — all of which show the button reading "8"** — my review, the commit, and the push.
It was found only when eight adversarial review agents were pointed at the code *after* the
reflection had been written.

> **Me:** 改了

Fixed on 7 September. The button now reports two figures that move, and the fix was verified by
the check that should have been run on day one:

```
chips = 0    →  "8 meals fit your time"
chips = 6    →  "8 meals · 0 need no shopping"
chips = 7    →  "8 meals · 1 needs no shopping"    ← the 7th completes a recipe
chips = 14   →  "8 meals · 3 need no shopping"
```

**The test is four seconds long: tick an ingredient, watch whether the number moves.** It was never
run, because the screen looked finished and the number looked like a number.

### 2.15 Ambiguous instructions of my own

⚠️ Two of my prompts were ambiguous enough to need checking rather than guessing:

- **"然后可以删掉提交部分的内容"** — "delete the submission part" or "delete the commit content"?
  The second reading would have gutted the reflection, since the commit is its central evidence.
  The interpretation was stated back to me before acting.
- **"改了"** — "I changed it" or "go change it"? Resolved by checking the file: it was unmodified,
  so it meant the latter.

Worth logging because short prompts in a second language carry ambiguity that long ones do not,
and the cost of a wrong reading rises with how destructive the action is.

### 2.16 An edit that silently did not apply

⚠️ While removing the deleted script from the README, one of two edits failed: the first edit
deleted the line containing `build_preview.py`, which broke the multi-line string the second edit
was matching against. No error was raised. The README was left with a section heading followed by
a sentence fragment pointing at a file that no longer existed.

Caught by grepping the README afterwards rather than by trusting the edit reported success.

### 2.17 The second defect adversarial review found

⚠️ Running the same review process again before submission — three agents, this time against the
submission checklist rather than the code — turned up a numerical inconsistency that had been on
screen the whole time.

Calories per serving were rounded to the nearest 5. The whole-dish total multiplied that *rounded*
figure, while the whole-dish macros multiplied the *exact* grams. The two columns sat side by side
on the detail screen and disagreed:

```
Power Protein Yogurt Bowl, 2 servings
  displayed total      700 kcal
  52 g × 4 + 68 g × 4 + 24 g × 9 = 696 kcal      ← 4 kcal apart
```

Nine of the eleven meals were affected. The worst gap was 24 kcal, on the pasta at twelve servings.

The irony is exact. Section 2.11 records that the build made calories a *computed* value
specifically so the screens could not contradict each other, and called that the thing the tool got
right where my specification was wrong. It got the principle right and the rounding wrong, and I
verified the principle without ever checking two adjacent columns against each other.

Fixed by not rounding. The exact value is now used, so the total and the macros agree at every
serving size, and calories per person still do not move when only the serving size does.

---

## 3. Index of what went wrong

| § | Failure | Cost |
| --- | --- | --- |
| 1, round 2 | I argued for "everyone" as the target user and was overruled | Would have failed the assignment's own test for a weak product definition |
| 2.1 | No Node.js on the machine | Whole build routed through a Python harness |
| 2.2 | Shell heredoc quoting | One wasted attempt on a 500-line file |
| 2.3 | Stale closure dropped 13 of 14 selections | Real bug; found by automated testing |
| 2.4 | Blank screenshots from a hidden pane | 5–6 wasted cycles |
| 2.5 | Stats wrapped 3+1 at 375 px; brand emoji read as a magnifying glass | Two UI defects, both caught by looking |
| 2.6 | `&&` unsupported in PowerShell 5.1 | Blocked the documented run command |
| 2.7 | PATH stale after install, twice | Two rounds of the same confusion |
| 2.9 | Approved 18 files and 4,360 lines on three words | Let 2.11 into a public repository |
| 2.11 | Three CDN URLs in a repo whose brief forbade them | Went public; found at reflection time |
| 2.12 | Vite served untransformed JSX (drive mapping) | Blank page that looked like a code error |
| 2.13 | Orphaned server process held the port | Two minutes testing the wrong server |
| **2.14** | **Setup counter ignored ingredients** | **Survived every check; found by adversarial review** |
| 2.15 | My own prompts were ambiguous enough to need checking | Two near-misses, one of them destructive |
| 2.16 | An edit reported success but did not apply | Left a broken README section |
| 2.17 | Whole-dish calories disagreed with whole-dish macros | 9 of 11 meals; on screen the entire time |

Sixteen failures across fifteen sections. The split matters more than the count:

| Kind | Sections | Count |
| --- | --- | --- |
| Environment and tooling friction | 2.1, 2.2, 2.4, 2.6, 2.7, 2.12, 2.13 | 7 |
| Defects in the product itself | 2.3, 2.5 (×2), 2.14, 2.17 | 5 |
| Failures of my own judgement or process | §1 round 2, 2.9, 2.11, 2.15, 2.16 | 5 |

The tooling friction cost time and nothing else. The four in the last row are the ones worth
reading: none of them were caused by the tool, and all four would have been caught by a person
reading something before agreeing to it.

The two rows in the middle failed in opposite directions, which is the single most useful thing in
this log. **2.3 was caught by testing and would never have been caught by reading** — a stale
closure is invisible in a diff. **2.14 was caught by reading and had already survived testing** —
three screenshots show the bug and nobody looked at the number. Neither method is the safety net;
each one is blind exactly where the other sees.

---

## 4. Unspecified choices, and who really made them

The brief ended with: *"If you make any design or implementation choice that I did not explicitly
specify, state that choice in one short line before implementing it."* That instruction was
followed. The first reply opened with:

> Vite + React (JavaScript, no TypeScript), plain CSS (no UI library), screen switching via React
> state instead of a router, warm terracotta/cream palette, an ingredient search box in the picker,
> a "Recommended" default sort alongside the four required sorts, and cards showing servings scaled
> to your people count.

Every one of those is now in the product. I read that line and moved on.

Other decisions were never surfaced at all, because neither of us recognised them as decisions:
default party size 2; default time budget 30 minutes; the "Recommended" sort weighting match at
0.6 and preference at 0.4; the serving range 1–12; the rounding rule that renders 1.5 onions as
"1.5" but 230 g of rice to the nearest ten; what the list does when no ingredients are selected;
scroll-to-top on navigation.

And the four constants at the centre of the Fitness feature, which I did not read until I wrote
the reflection:

```js
const proteinPoints = Math.min(proteinPer100kcal / 12, 1) * 50;
const caloriePoints = Math.min(Math.max((750 - calories) / 400, 0), 1) * 30;
const balancePoints = (1 - Math.min(Math.abs(fatShare - 0.3) / 0.3, 1)) * 20;
```

**Declaring a choice is not the same as making one.** The instruction worked exactly as written and
still did not do what I wanted it to do, because a list of six declarations in the first reply of a
long session is read the way a terms-of-service dialog is read. The fuller version of this argument
is in `REFLECTION.md`.
