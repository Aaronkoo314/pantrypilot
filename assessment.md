# PantryPilot — Assessment

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.
Problem Set 2, September 2026.

This file continues where [`REFLECTION.md`](REFLECTION.md) stopped. That document assessed the
front end built for Problem Set 1; this one sets criteria for both halves of the product, marks
PantryPilot against them, and then assesses the collaboration that produced it.

> **On the order these sections were written.** The brief says to write the criteria down before
> judging anything, so section 2 was committed to this repository on its own, before any marking
> existed and before the audit that produced several of the marks in section 3 had returned. The
> commit history is the evidence: the criteria land in commit `328c0db` and the marking in
> `a62d218`, later the same day. I am pointing at that because a list of criteria you pass on every
> count is a list written after the answer was known, and the only defence against writing one is
> to fix the list first.
>
> Section 1 is the step that came before both, and it is the reason the back end looks the way it
> does rather than being an API bolted to whichever screen was easiest.

---

## Who this product is for

Carried forward from `REFLECTION.md` unchanged, because the criteria below are worthless if they
are not about somebody specific.

**Non-professional home cooks who cook three to five dinners a week from a kitchen that is stocked
but unplanned.** Four situations rather than four personas: the student in shared housing with half
a shelf; the office worker home at 19:15 with no decision left in them; the parent cooking for four
on a Tuesday who needs it to be liked rather than impressive; the confident cook who is not stuck
for skill, only bored.

**Where they are standing:** in the kitchen, phone in one hand, fridge door open, something else
already happening. Every front-end criterion below is downstream of that sentence.

---

# 1. Three claims this product could not support

Before deciding what to build, the brief asks you to open your own submission and look at it as a
stranger would, then finish this sentence three times:

> My screen tells the user **[this claim]**, which right now is **[typed in by me / made up by the
> agent]**, and to be true it would have to come from **[this source]**.

Doing it honestly took ten minutes and changed what I built. I had assumed the assignment was "add
an API". It is not. It is *stop your screen from asserting things it cannot support*, and an API is
only one of three repairs.

The exercise is easier for this product than for most, and not to its credit: PantryPilot's
guardrails for Problem Set 1 required that every figure be invented, so the whole screen is the
answer. What took the ten minutes was not finding an unsupported claim. It was working out which
four of the thirty-odd numbers on screen are *roots* — authored by a person — and which are
arithmetic performed correctly on top of those. There are exactly four roots: the 93 ingredient
unit prices, the three macros on each of the 47 meals, the prep and cook minutes, and the difficulty
label. Everything else is derived. Repairing one root repairs a string of visible claims; repairing
a derived figure repairs nothing, because it was never the thing that was wrong.

## A · The claim that needs live data — **repaired**

> My screen tells the user **this meal has 14 g of protein, 26 g of carbohydrate and 34 g of fat
> per serving, and 520 kcal**, which right now is **made up by the agent**, and to be true it would
> have to come from **a published nutrient database, looked up per ingredient and summed against
> the recipe's quantities**.

This is the root the back end exists for. It carries seven visible claims: the per-serving macros,
the whole-dish macros, calories per person, calories in total, the Light/Medium/Heavy band, the
calorie sort and the weight filter.

**What was actually repaired, stated precisely, because the gap matters.** One ingredient's
published record is now fetched live from USDA FoodData Central, cited by id on the meal detail
screen, and shown directly beneath the invented macros so the two can be compared. The meal's own
macros are still invented. Summing real per-ingredient nutrients across 93 ingredients and 47
recipes is a different and much larger piece of work, and claiming I had done it would be the exact
failure this exercise is about.

So the honest description of the feature is **provenance, not nutrition**: it tells the reader
which figure on the screen can be checked, and says in the same panel that every other one cannot.
That is a smaller claim than "PantryPilot now has real nutrition data", and it is one the product
can actually support.

## B · The claim that needs a calculation — **left in place, and labelled**

> My screen tells the user **this recipe is "Easy"**, which right now is **typed in by me**, and to
> be true it would have to come from **a model of how hard a recipe is for a particular cook, which
> nobody publishes**.

Difficulty is two values across 47 meals — 27 Easy, 20 Medium — with no third value, no definition
anywhere on screen, and no filter or sort that uses it. No source in the world publishes it, because
it is not a fact about the dish. It is a judgement about the reader, and the reader is exactly who
the product knows nothing about.

The brief's repair for this category is a model call, which it places explicitly out of scope for
Problem Set 2. So the two honest options were to delete it or to say on screen that it is not
sourced. I kept it, because unlike the progress bar below it does carry some information — a
first-time cook scanning a list does get something from it — and the cost of keeping it is a
sentence rather than a false impression.

**This is the one of the three I am least comfortable with.** "Left in place and labelled" is the
weakest of the three repairs, and if I were marking this I would push on it.

## C · The claim that should not have been there at all — **deleted**

> My screen tells the user **that the application is starting, on a progress bar counting from 0 to
> 100 over three seconds**, which right now is **a timer measuring itself**, and to be true it would
> have to come from **something actually loading, of which there was none**.

The cover screen carried a bar with `role="progressbar"` and `aria-label="Starting"`. There was no
`fetch`, no `await` and no `async` anywhere in `src/` when it was written. It reported the progress
of a three-second timer against that same timer and announced it to assistive technology as the
application loading.

It is the clearest instance in this product of the brief's third category — a number that exists
because the shape of the screen suggested there should be one. Worse than decorative: a sighted
user reads it as a stylish wait, while a screen reader is told the application is starting, which
is a statement about the system's state and was false.

It became untenable rather than merely wrong the moment the product gained a back end. There is now
a real loading state on the meal detail screen and a real one in the status row, and a product
cannot have three progress indicators of which one is fictional.

**Deleted, and what the screen does instead:** the cover holds for three seconds showing the
wordmark and the line "Cook what you already have", and says "Tap to skip" from the first frame
rather than revealing it once a bar has moved. It asserts nothing. Tap, click or any key dismisses
it, and anyone whose system asks for reduced motion never sees it.

## The fourth claim, which I did not repair and will not pretend I did

The brief asks for three. There is a fourth, it is the most consumer-facing number in the product,
and leaving it out of this section would be the kind of tidy omission the exercise exists to catch.

> My screen tells the user **this meal costs S$5.50 a head, and the two items you are missing come
> to S$4.35**, which right now is **made up by the agent**, and to be true it would have to come
> from **real Singapore retail food prices**.

That root carries eight visible claims — every ingredient row's price, the shopping cost, price per
person, the whole-dish total and the Cheapest-first sort.

**A source for it exists and I checked it by hand.** SingStat publishes "Average Retail Prices Of
Selected Consumer Items, Monthly" (table M213761), updated monthly, no credential required, under
terms that permit a public derived product.

**I did not use it, for a reason that is about this assignment rather than about the product.**
SingStat is keyless. A keyless source makes `keyConfigured` a decoration, makes "search my history
for your credential" vacuous, and makes the checklist item *change the variable to something wrong
on purpose and see what your user would see* impossible to perform. Roughly half of this week's
graded lines are about protecting a credential, and a source with no credential passes them
vacuously rather than actually.

That is an honest reason and it is still a reason about the grade rather than about the cook. A
second reason is about the product, and I only found it by being argued out of my first placement:
telling somebody who has already ticked "rice" what rice costs changes no decision they are about
to make. The placement that would earn its keep is the *missing*-ingredient shopping cost, which
answers "is this meal worth a trip to the shop" — and that is the version I would build next.

**So the product still prints a money figure that came from nowhere**, on every card and four times
on every detail screen. It is labelled as invented in both places. It is the largest unsupported
claim left standing, and this document should say so before somebody else does.

---

# 2. The criteria

Each has a name, a reason it matters to *this* user rather than to users in general, and a test
somebody who has never spoken to me could run against the live URL and get the same answer I did.

## Front end

### F1 · One-handed at the fridge
The user is holding a phone in one hand with the fridge open. A control they cannot reach with a
thumb is a control they cannot use, whatever it looks like on a laptop.

**How to tell:** open the live URL on a phone, or at a 375-pixel viewport. Get from the first
screen to a meal's method without pinch-zooming and without the page scrolling sideways. Every
control you must press to do that should be reachable with one thumb.

### F2 · A stranger can name the job in four seconds
This user has no patience budget at 19:15 and no reason to read an explanation. If the first screen
does not say what the product is for before they decide whether to bother, nothing else matters.

**How to tell:** show somebody the first screen for four seconds, take it away, and ask what they
think it does. If the answer is not "tells you what to cook from what you have", it failed. I
cannot run this test on myself, which is the point of it.

### F3 · Every figure is either checkable or visibly an estimate
The product prints calories, prices, times and macros. This user has no way of knowing which of
those came from anywhere. A number that looks sourced and is not is worse than no number, because
it spends trust the product has not earned.

**How to tell:** open any meal's detail screen, pick any number on it, and try to find — without
leaving that screen — either a named source for it or a statement that it is our own estimate.
Every number must land in one of those two categories. None may land in neither.

### F4 · The mistake this user will actually make has a way back
The likeliest wrong turn is not a mis-tap. It is narrowing the filters until nothing matches, then
having no idea which of five settings caused it.

**How to tell:** set filters that return an empty list. The screen must name the filter that is
actually binding and offer to undo that one, rather than saying "no results" and sending you to
another screen to guess.

### F5 · Nothing reorders the list behind the user's choice
This user picks a sort because they have decided what matters tonight — speed, or cost. A hidden
score that also nudges the order means the control is a suggestion rather than an instruction, and
they cannot tell.

**How to tell:** choose each sort in turn and read the figure it names down the list. The order
must follow that one visible number, including where it ties. If two cards are in an order the
printed figures do not explain, something invisible is ranking them.

### F6 · No claim of dietary or medical authority
One of the four situations is cooking for other people. A vegetarian badge that means less than the
reader thinks it means is the one invented fact in this product that could actually harm somebody.

**How to tell:** find the vegetarian filter and read what it claims, on screen, without clicking
anything. It must state the boundary of the claim in words. The same goes for every nutrition
figure: find the sentence saying it is not medical advice.

## Back end

### B1 · Somebody who is not me can tell whether the service is up
When this product misbehaves, the user cannot see whether the fault is the credential, the
provider, or my code. Neither can a classmate reviewing it, and neither can I from a phone.

**How to tell:** open `/api/health` on the live URL in a private window. It must answer, name the
upstream it depends on, say whether the credential is configured, and report what the upstream
said — with nothing further about the credential itself.

### B2 · The credential is unreachable from the page and absent from the repository
This is the only failure in the whole assignment with a consequence outside the classroom. A key in
a public repository is read by scanners within minutes.

**How to tell:** open the deployed page with the network tab open and confirm the only host it
talks to is its own. Download the built JavaScript bundle and search it for the key, for `api_key`,
and for the upstream hostname. Then search the repository's whole history, not only its current
files. All four must come back empty.

### B3 · Each failure says a different, actable sentence
A spinner tells this user nothing about which situation they are in, and three of the situations
are ones they can act on: come back later, pick a different ingredient, tell me it is broken.

**How to tell:** force each state and read the screen. Loading, the source having no record, the
provider refusing, the provider being unreachable, and the credential being unset must produce
different sentences. None may be a spinner, and none may blame a party that was not involved.

### B4 · A near miss is never dressed as an answer
The product asks the source for things like galangal and palm sugar, which it may not hold. The
temptation a search API creates is to show the closest thing it found, under a citation, as though
it were the thing asked for.

**How to tell:** query the live endpoint for an ingredient the source does not publish. It must say
so. Then query deliberate nonsense. It must also say so, rather than returning a confident record
for some unrelated food.

### B5 · The source is asked no more often than it actually changes
The reference data behind this product was published in 2019 and 2020 and does not move. Asking a
public service for it repeatedly is rude, and on a metered key it is also self-harming.

**How to tell:** read the `Cache-Control` header on `/api/nutrition`. Its freshness window should
match a source that changes twice a year, not one that changes hourly. Request the same ingredient
twice and confirm the second is served from the edge rather than from the provider.

### B6 · A stranger cannot spend my quota
The credential allows a thousand requests an hour. Anybody on the internet can call
`/api/nutrition` with any parameter they like, and the peer-review step of this assignment
explicitly invites classmates to try to break the product.

**How to tell:** call `/api/nutrition` with an ingredient the product itself would never ask for —
a random string. If it reaches the provider, then varying that parameter defeats the cache, and a
stranger with a loop can exhaust an hour's quota in well under a minute. The legitimate query set
here is closed and known: it is the 93 ingredients in `src/data/pantryData.js`.

---

# 3. Marking

Twelve criteria, marked against the live URL on 11 September 2026. The evidence column is the
command I ran or the file and line I read, so that somebody else can get the same answer. Where a
criterion is not met I have said so rather than softening it, and two of the entries below record
faults that were mine rather than the product's.

**Summary: seven met, four partly met, one not tested.**

| | Criterion | Verdict |
| --- | --- | --- |
| F1 | One-handed at the fridge | Met |
| F2 | A stranger can name the job in four seconds | **Not tested** |
| F3 | Every figure is either checkable or visibly an estimate | **Partly met** |
| F4 | The mistake this user will actually make has a way back | Met |
| F5 | Nothing reorders the list behind the user's choice | Met |
| F6 | No claim of dietary or medical authority | Met |
| B1 | Somebody who is not me can tell whether the service is up | Met |
| B2 | The credential is unreachable from the page and absent from the repository | Met |
| B3 | Each failure says a different, actable sentence | **Partly met** |
| B4 | A near miss is never dressed as an answer | Met |
| B5 | The source is asked no more often than it actually changes | Met |
| B6 | A stranger cannot spend my quota | **Partly met** |

---

## F1 · One-handed at the fridge — **Met**

At a 375-pixel viewport, all three screens report `document.body.scrollWidth` of exactly 375 and
zero elements whose right edge exceeds the viewport. Nothing scrolls sideways. The smallest control
on the path from arrival to a meal's method is 48 pixels tall; the serving steppers are 56 and the
ingredient group headers 71.

I am claiming less here than the criterion asks. I measured that nothing overflows and that the
targets are large enough. I did not measure whether they are within a **thumb's** reach on a real
phone held in one hand, which is what the criterion actually says, and which needs a hand and a
phone rather than a viewport emulator.

## F2 · A stranger can name the job in four seconds — **Not tested**

I cannot run this one. The test requires somebody who has not seen the product, and I have been
looking at it for two days; I can no longer see the first screen fresh, which is the entire reason
the criterion exists.

Leaving it unmarked is more honest than marking it. The peer-review thread in Week 3 is exactly
where this gets answered, and I would rather hand in an unmarked criterion with a stated reason
than a mark I made up.

## F3 · Every figure is either checkable or visibly an estimate — **Partly met**

On the meal detail screen it holds: three separate statements that the figures are our own
estimate, two disclaimers naming the invented prices and nutrition
(`MealDetail.jsx:175`, `MealDetail.jsx:230`), and a full source citation whenever the sourced panel
has a record.

It does not hold on the **results** screen. The disclaimer there sits below the entire meal list
(`MealRecommendations.jsx:95-98`), so every card has already asserted a price and a calorie figure
before the reader reaches the sentence explaining that both are invented. A user who taps a card
from the top of the list never sees it at all.

That is a real failure of my own criterion and the fix is not difficult. I have left it unfixed and
recorded it rather than quietly repairing it and reporting "met", because the criterion is more
useful to me as a found fault than as a passed line.

## F4 · The mistake this user will actually make has a way back — **Met**

With filters that return nothing, the empty state builds its relaxation offers from whichever
filters are actually binding (`MealRecommendations.jsx:25-46`) — "Allow any cuisine", "Allow 60+
minutes" — rather than printing a generic "no results". The setup screen also remains one tap away
throughout.

## F5 · Nothing reorders the list behind the user's choice — **Met**

There is no scoring anywhere in the product. All five filters exclude; the four sorts are plain
orderings over one printed value each, and every one breaks ties the same way, on ingredient match
(`mealMatching.js:148-164`). This was deliberate work in v2: the two scoring sorts v1 had were
deleted rather than reimplemented, and `RANKING-RULES.md` records why.

## F6 · No claim of dietary or medical authority — **Met**

The vegetarian filter states its own boundary on screen — "no meat, fish or fish-based sauces"
(`FilterBar.jsx:122`) — rather than leaving the reader to infer what it covers. The nutrition block
carries "Not health or medical advice" (`MealDetail.jsx:230`) and the price block carries "Not real
shop prices, and no shop is implied" (`MealDetail.jsx:175`).

The flag is also derived from the ingredients rather than hand-set per meal, so it cannot contradict
the recipe: 26 of the 93 ingredients are non-vegetarian and five of those are not meat at all —
oyster sauce, fish sauce, both curry pastes, dried shrimp. A filter that looked for meat would call
a Thai green curry vegetarian.

## B1 · Somebody who is not me can tell whether the service is up — **Met**

```
$ curl -s .../api/health
{"service":"pantrypilot","keyConfigured":true,"upstreamStatus":200,
 "upstream":"USDA FoodData Central","checkedAt":"2026-09-11T15:01:16.087Z"}
```

It names the upstream it depends on, says whether the credential is configured, reports what the
upstream answered, and carries `Cache-Control: no-store` so the answer is about now rather than
about an hour ago. It says nothing else about the credential — not its length, not a prefix, not a
hash.

Since the criteria were written, the product also reads this endpoint itself and states the answer
on every screen, with a link to the raw JSON. That was added because the endpoint answered from the
first deploy and the only way to read it was to type an address one letter away from a 404: asking
for `/app/health` instead of `/api/health` returns Vercel's own NOT_FOUND page, which looks exactly
like a back end that was never built.

## B2 · The credential is unreachable from the page and absent from the repository — **Met**

Four checks, all empty:

- The built bundle contains zero occurrences of `api_key`.
- `git log -p --all` over the whole history returns zero hits for `VITE_`, `AIza`, `AQ.`, `sk-` and
  `Bearer`. Nine apparent matches were all false positives: CSS palette tokens, a quoted
  `Unexpected token '<'` from an old build log, and the npm package `js-tokens`.
- No variable in the project begins `VITE_`, which matters because Vite inlines those into the
  bundle every visitor downloads.
- The page's only outbound request is to its own origin. The one external reference is an anchor
  `href` to the cited USDA record, which the reader chooses to click.

The key is read as `process.env.USDA_API_KEY` inside `api/` and nowhere else. `.gitignore` gained
`.env*` in a commit made **before** the key existed, which is the ordering that matters: a
credential that reaches git history stays readable after the file is deleted.

## B3 · Each failure says a different, actable sentence — **Partly met**

Six distinct states are implemented, one more than the brief asks for, and none is a spinner. Three
have been seen on the live URL:

- **ok** — `Garlic, raw`, Foundation, 2020-10-30, with the figures and the citation.
- **empty** — "USDA FoodData Central publishes no record matching 'Palm Sugar'".
- **not-configured** — seen before the environment variable was added, naming the variable.

**refused** and **unreachable** have not been produced on the live URL *by breaking the server*,
which is what the criterion asks for. What I have done instead is make the browser see each reply,
by replacing `fetch` in the console so the live page received a 403 from the upstream, then an
unreachable upstream, then a 500 from our own service. The status row moved through every one and
said a different, correct sentence each time.

That verifies the client half and not the server half, and the distinction matters: it proves the
screen renders the right words when it is handed each reply, and proves nothing about whether the
function actually produces those replies when a key is wrong or a hostname does not resolve. The
guards are written and reviewed; they have not been fired in anger.

One thing that half-test did catch, which is why it was worth doing: at 21 seconds the row still
showed the previous state and I briefly had two of them rendering identically. That was the poll
interval, not a mapping fault — the same stale-measurement mistake as B5, twice in one afternoon.

So: partly met. The honest form of the remaining work is a wrong key and a bad hostname on the real
deployment, each followed by undoing it.

Until I do that, this is partly met. I am recording it as such rather than marking it met on the
strength of having written the branches, because "I wrote the code for it" is exactly the kind of
claim this criterion exists to refuse.

## B4 · A near miss is never dressed as an answer — **Met, and it was not met this morning**

This is the criterion the product failed worst, and it failed silently.

FoodData Central's search defaults to `requireAllWords=false`. Queried with deliberate nonsense
(`zzqqxwv-not-a-real-food-99`) it returns **HTTP 200, 111,423 hits, and confident macros for oats**.
The obvious way to wire an empty state — `if (totalHits === 0)` — is therefore dead code that can
never fire, and ingredients like galangal and shrimp paste would have printed some unrelated food's
figures under a USDA citation.

Then, with `requireAllWords=true` in place and the credential live, the first real call still
returned the wrong thing:

```
"description":"GARLIC", "dataType":"Branded", protein 0 g, 167 kcal
```

Raw garlic is 6.6 g of protein and 143 kcal. That record was a packaged supermarket product whose
label rounded protein to zero on a small serving, which FoodData Central then scaled to 100 g.
Status 200, a genuine USDA record, a genuine record id, a citation on screen — and a wrong number.
It is the same defect I had rejected a different provider for, one layer further in.

Both are fixed: `requireAllWords=true` makes a miss return an honest empty result, and
`dataType=Foundation,SR Legacy` restricts the search to analysed reference records. Verified by
hand before the code changed — "garlic" goes from thousands of hits to eight, and the first is
`Garlic, raw`, Foundation, with 6.62 g protein and 143 kcal.

Neither fix came from testing the code. Both came from reading the response and knowing that oats
are not laksa paste.

## B5 · The source is asked no more often than it actually changes — **Met**

`Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` — a day fresh, a week
stale-usable, against a source whose records were published in 2019 and 2020 and are revised about
twice a year.

```
GET 1 → X-Vercel-Cache: MISS
GET 2 → X-Vercel-Cache: HIT
GET 3 → X-Vercel-Cache: HIT
```

I nearly recorded this as a failure. A first check with `curl -I` showed `Cache-Control: public`
with the directives apparently stripped and `MISS` on every request, and I had the beginning of a
theory about Vercel rewriting the header. The directives are stripped from what reaches the browser
because they are CDN instructions the CDN has already consumed, and `HEAD` requests are not served
from that cache. Re-running with `GET` showed it working. The lesson is the one the brief spends a
whole panel on: the symptom was real and my explanation of it was wrong, and re-measuring was
cheaper than fixing.

## B6 · A stranger cannot spend my quota — **Partly met**

When I wrote this criterion I did not know the answer. It was **not met**.

`/api/nutrition` took an arbitrary `ingredient` string and passed it upstream. Vercel's edge cache
keys on the full URL, so a stranger varying that parameter misses the cache on every request, and
each miss spends one of a thousand hourly calls that belong to me. The peer-review step of this
assignment explicitly invites classmates to try to break each other's products.

Fixed: the endpoint now takes `?id=` and validates it against the 93 known ingredients **before the
credential is read**. The text sent upstream comes from our own data rather than from the request,
so nothing a caller types reaches the upstream query string at all and there is nothing left to
inject with. Upstream calls are bounded at 93 distinct queries, all cacheable.

```
?id=garlic                     → ok, Garlic, raw, Foundation
?id=definitely-not-an-ingredient → 400 bad-request
?ingredient=chicken%20breast   → 400 bad-request
```

**Still partly met, because of something I did to my own site.** An audit I ran against the live URL
sent enough probe traffic — long parameters, null bytes, array-shaped parameters, repeated bundle
downloads — to trip Vercel's attack mitigation. For several minutes the site answered every visitor
with `HTTP 403` and a page titled "Vercel Security Checkpoint". It cleared on its own.

The graded requirement is that the URL opens for a stranger without being asked to sign in, and a
challenge page fails that harder than a login would. The quota is now protected; **availability is
not**. A classmate hammering the endpoint with perfectly valid ids would still take the product
down for everybody, and no code I own can prevent it.

That was my fault rather than the product's, and the mistake was not in any of the code. I pointed
a fan-out of concurrent probes at a production site that is about to be marked, because I was
thinking about how thorough the audit should be and not about what the traffic would look like from
the other side. It looked like an attack because, from the firewall's point of view, it was one.

---

# 4. The collaboration

Two parties built this. I contributed command: what the product is for, which claim to repair,
which provider to trust with it, what the screen says when that provider is not answering, how long
an answer stays fresh, and whether each thing that came back was good enough to keep. The agent
contributed production: the function files, the request, the parsing, the caching line, the wiring
to a screen that already existed.

What follows is where that boundary actually sat, rather than where I would like to say it sat.

## Q1 · Where did the agent make me faster, and by how much?

**The specific task: calling six candidate data sources by hand before choosing one.**

The brief says this twice — call the service once by hand, read the whole answer, read its terms,
and paste the real response into the prompt rather than letting an agent guess at field names. Done
properly for six candidates, that is reading six sets of documentation, six licence pages, and
making enough real calls to see each response shape. A working day, honestly, and the kind of day
where I would have cut it to three sources by lunchtime and told myself that was thorough.

It ran as fifteen agents in about nine minutes: six scouts calling their source by hand, six
sceptics re-testing what each scout claimed, and three auditors reading the repository, the live
URL and every claim the interface makes.

**What kind of task that was, because the pattern matters more than the instance.** It was work I
could have done but slowly — no individual step was beyond me. What changed was not capability but
**breadth**. The value was not in doing the SingStat call faster; it was in doing the Open Food
Facts call at all, which I would have skipped, and which is where the most useful rejection came
from. Fan-out bought coverage, not speed.

**What I did with the time.** Spent it on the thing the fan-out could not do: deciding. Choosing
USDA over SingStat took longer than the research did, because it hinged on something no agent
raised until I asked the question — that SingStat is keyless, and a keyless source makes half this
week's graded lines vacuous rather than passed.

**Where it was faster by hand, and it was not close.** Setting the Vercel environment variable and
redeploying. Two minutes in the dashboard. Everything I could have done about it in conversation
would have been describing where to click.

## Q2 · Where did it cost me time, and whose fault was that?

The worst instance was not the agent being wrong. It was **an instruction I sent before I had
decided what I wanted**, which the brief predicts is the most common answer here, and it was.

I asked for an adversarial audit of what the deployed product exposes, and I wrote the prompt in
terms of thoroughness: probe every disclosure surface, try to make the function throw, send long
parameters and null bytes and array-shaped parameters, download the bundle and search it. Four
agents did exactly that, concurrently, against the live URL.

Vercel's attack mitigation read that as what it was, and for several minutes
**pantrypilot answered every visitor with a 403 and a page titled "Vercel Security Checkpoint"**.
The graded requirement is that a stranger can open the URL without being asked to sign in. I had
taken my own submission off the internet by auditing it.

**Distinguishing the two failures, because they have different remedies.** The agent did not
misunderstand me; it did precisely what I asked. My instruction was unfinished: it said what to
test and never said what the traffic should look like from the other side, or that the target was a
production site about to be marked rather than a test environment. Nothing about the audit's
findings was wrong. The one thing missing from the prompt was a sentence I had not thought to
write, because I was thinking about coverage and not about consequence.

It cost perhaps fifteen minutes of downtime and an hour of my attention. The remedy is not a better
tool. It is a habit: name the target's status in the prompt, and decide the acceptable rate before
asking for thoroughness.

Two smaller losses, both mine, both the same shape:

- I checked the cache with `curl -I` and read `Cache-Control: public` with the directives gone and
  `MISS` on every request. I had a theory about Vercel rewriting headers and was a minute from
  changing the function. `HEAD` requests are not served from that cache and the directives are
  stripped because the CDN has already consumed them. A `GET` shows `MISS, HIT, HIT`. Re-measuring
  cost thirty seconds; the fix I nearly made would have cost an hour and broken a working cache.
- A responsiveness check reported horizontal overflow on all three screens. `clientWidth` was
  returning 0, so every element was "wider than the viewport". The real answer is zero overflow at
  375 pixels.

Both were symptom, theory, action — with the re-measurement missing. Panel 14 spends a page on
exactly this and I did it twice in an afternoon.

## Q3 · Did it ever hand me something that looked right and was not?

Twice, and the second one is the one worth writing down.

**The first was caught by having two agents instead of one.** A scout reported that FoodData
Central's empty state is "a 200 with `totalHits: 0` and an empty foods array". It read completely
plausible. It had never been tested. The sceptic assigned to refute it queried
`zzqqxwv-not-a-real-food-99` and got **HTTP 200, 111,423 hits, and confident macros for oats**,
because `requireAllWords` defaults to false and the search always finds something. Wiring the empty
branch to `totalHits === 0`, as the scout's report invited, would have shipped dead code that could
never fire, and ingredients like galangal and shrimp paste would have printed an unrelated food's
figures under a USDA citation.

I did not catch that. A second agent did, because its only instruction was to refute the first.

**The second one got past everybody, including me.** With `requireAllWords=true` in place, the key
installed, and the panel working, the first real call to the live endpoint returned:

```
"description":"GARLIC", "dataType":"Branded", protein 0 g, 167 kcal
```

Raw garlic is 6.6 g of protein and 143 kcal. The record was a packaged supermarket product whose
manufacturer label rounded protein to zero on a small serving, which FoodData Central then scaled
to 100 g. Status 200. A genuine USDA record. A genuine record id. A citation on screen. And a
number that is simply wrong.

**How long it took to notice: about four seconds, and it should have been never.** I read the
response because it was the first one after the credential went in, and I looked at the protein
figure because that is the field the panel exists to show. Had I checked with an ingredient whose
correct value I do not carry in my head — palm sugar, galangal, light soy sauce — I would have seen
a plausible number, ticked the criterion, and shipped it.

This is the failure the lecture described. It is not that the model was confidently wrong; the
model was not involved. It is that **a real source, a real record and a correct citation are not
the same as a correct answer**, and every visible signal said it was fine. It is also, exactly, the
defect I had rejected a different provider for two hours earlier — Open Food Facts describing bread
as 14.58 kcal per 100 g — and I walked into the same thing one layer further in, in a source I had
already decided to trust.

## Q4 · What did I have to know in order to supervise it?

**To catch the garlic figure: that garlic contains protein.** That is the whole of it. No
JavaScript, no knowledge of FoodData Central's schema, no test. Domain knowledge of the most
ordinary kind, applied to a number on a screen.

To catch the oats: that oats are not the thing anybody asked for — again, nothing technical.

Turning the question around, which is the harder half.

**What would I have had to know to catch what I did not catch?** I would have had to know that
`SR Legacy` is not a uniform set — that it contains manufacturer-contributed entries alongside
analysed ones, distinguishable only by a `derivationDescription` field. I learned that by accident,
when tofu came back as "HOUSE FOODS Premium Firm Tofu" and I assumed my dataType filter had failed.
It had not. The filter was working and the set is simply mixed.

Which means **I still do not know how many of this product's 93 ingredients resolve to a
manufacturer-supplied record rather than an analysed one.** I have checked four. The panel shows
the derivation honestly in every case, so nothing on screen is a lie — but "the figures are
labelled correctly" and "the figures are good" are different claims, and I can only support the
first. That is an open hole in a criterion I marked met, and I would rather write it here than
leave it for somebody to find.

## Q5 · Which decisions did I keep, and should I have kept more or fewer?

Kept, in the order they happened:

1. That the claim to repair is the nutrition macros, not the price — because the price source is
   keyless and half the graded lines this week are about protecting a credential.
2. That the panel claims **provenance, not nutrition**. One ingredient sourced and cited, 46 meals'
   macros still invented and labelled as such. The dishonest version of this feature was available
   and would have looked better.
3. The six sentences the user reads, and that there are six rather than four.
4. A day of cache freshness against a source revised twice a year.
5. That the live figure **ranks nothing** — no filter, no sort, no band depends on it, so the
   product stays explainable with the provider switched off.
6. That the endpoint takes an id from a closed list rather than free text.
7. That the results screen's misplaced disclaimer stays unfixed and marked as a failure, because
   it is worth more to me found than repaired.

**Should I have handed any of those over? No — and that is not a boast.** Every one of them is a
sentence, not an implementation. None would have been faster to delegate, because explaining the
constraint takes longer than making the decision.

**The one that never reached the list, which is the question actually being asked.**

The first version of the sourced panel reported **any** non-2xx reply as "USDA FoodData Central
refused the request". Locally there is no `/api/` at all, so the fetch 404s, and the screen blamed
USDA for a request that had never been sent.

Nobody decided that. It arrived as a branch on a status code — production work, apparently, of the
kind I had no reason to inspect. But **who gets blamed when the product fails is a decision about
the product**, not about the code. It matters because the two situations have different owners: a
refusal is the provider's problem and a 404 on my own address is a deployment fault of mine, and
the screen was pointing at somebody else while I looked for it. It cost nothing at the time and it
would have cost an evening on the night it mattered.

That is the boundary moving without anybody noticing it move, and it is worth more to me than the
six decisions above, all of which I knew I was making while I made them.

**A second one, still unresolved as I write this.** The panel reports that USDA publishes no record
for "Aubergine". That is true. It is true because USDA calls it *eggplant*, and `Eggplant, raw`
exists. The empty state is honest and the product is worse for it. Whether to keep a table of
British-to-American food names is a judgement about what the product owes its user, and I have not
made it — I have simply let the technically-correct behaviour stand, which is its own kind of
decision and not a good one.

## Q6 · What does this mean for a team of thirty?

I ran this alone, on something small, with a grade at stake. Scale it to thirty people building
something an organisation depends on, each holding a boundary like mine and none able to see
anybody else's, and the thing that does not scale is the part that saved me twice this weekend: a
person who knows what the number should be, looking at the number.

I would put the review step **at the point where a value first reaches a screen**, not at merge.
Every defect worth catching here was invisible in the diff and obvious in the response: the garlic
record is correct code reading a correct field from a real provider. A reviewer reading the pull
request would have approved it, and did, in the sense that I read it myself and approved it. So the
artefact under review has to be the rendered output beside the real source, not the patch.

I would refuse to let an agent settle two things. **What the user is told when the system fails**,
because that decision arrives disguised as error handling and is the whole of the product on the
morning the provider is down. And **which source is authoritative for a given claim**, because
that is a question about accountability rather than availability, and the failure mode is a screen
that is confidently wrong under a correct citation.

How anybody would know if one had been settled anyway: they would not, from the code. The only
place the boundary is visible is the log, which is why the log is a deliverable and not busywork.
At thirty people I would want the equivalent of this document's Q3 to be a standing question with a
name against it — not "did the tests pass" but *which number on this screen would you notice was
wrong, and which would you not?*

The thing nobody in my organisation currently checks, and would have to: **the provenance of each
figure a product asserts**, separately from whether the code that fetched it works. Those are
different questions, they fail independently, and only one of them has a test.
