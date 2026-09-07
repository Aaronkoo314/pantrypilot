# PantryPilot — Prompt Log

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.
Build session: evening of 6 September 2026 into the morning of 7 September 2026.
Tool: Claude Code (Opus 5) in the Claude desktop app.

This is the working log of how PantryPilot was actually built. It records the prompts
that produced the app, and — as the brief requires — the ones that went wrong. There
were more of the second kind than I expected, and several of the most useful moments in
the build were failures rather than successes.

Entries are marked:

| Mark | Meaning |
| --- | --- |
| ✅ | Worked as intended |
| ⚠️ | Went wrong, and what it cost |
| 🔑 | A moment where my own judgment changed the outcome |

---

## 1. The opening brief

One long prompt, written before any code existed. It is the single most consequential
thing I typed, and roughly 90% of the finished app traces directly to it.

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

🔑 That script became a problem three days later — see 2.11 — but it is the reason there was
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

✅ Both of these were caught visually, and neither would have been caught by reading code:

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

🔑 A background process was running that I had not asked about. I killed it first and asked what
it was second. For a process on my own machine that is the right order, and it is one of the few
points in the log where I exercised control rather than accepting an explanation.

It was the Python preview server. Killing it broke nothing.

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




---

## 3. Index of what went wrong

| § | Failure | Cost |
| --- | --- | --- |
| 2.1 | No Node.js on the machine | Whole build routed through a Python harness |
| 2.2 | Shell heredoc quoting | One wasted attempt on a 500-line file |
| 2.3 | Stale closure dropped 13 of 14 selections | Real bug; found by automated testing |
| 2.4 | Blank screenshots from a hidden pane | 5–6 wasted cycles |
| 2.6 | `&&` unsupported in PowerShell 5.1 | Blocked the documented run command |
| 2.7 | PATH stale after install, twice | Two rounds of the same confusion |
| 2.11 | Three CDN URLs in a repo whose brief forbade them | Went public; found at reflection time |
| 2.12 | Vite served untransformed JSX (drive mapping) | Blank page that looked like a code error |
| 2.13 | Orphaned server process held the port | Two minutes testing the wrong server |


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
