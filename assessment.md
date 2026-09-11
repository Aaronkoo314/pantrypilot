# PantryPilot — Assessment

**Author: Aaron Koo**

MGMT 6110 Human-AI Collaboration, Singapore Management University.
Problem Set 2, September 2026.

This file continues where [`REFLECTION.md`](REFLECTION.md) stopped. That document assessed the
front end built for Problem Set 1; this one sets criteria for both halves of the product, marks
PantryPilot against them, and then assesses the collaboration that produced it.

> **On the order these sections were written.** The brief says to write the criteria down before
> judging anything, so section 1 was committed to this repository on its own, before any marking
> existed and before the audit that produced several of the marks in section 2 had returned. The
> commit history is the evidence: section 1 lands in its own commit, section 2 in a later one. I
> am pointing at that because a list of criteria you pass on every count is a list written after
> the answer was known, and the only defence against writing one is to fix the list first.

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

# 1. The criteria

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

# 2. Marking

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

**refused** and **unreachable** have not been produced on the live URL. They exist in the code and
I can reason about them, but the criterion says force each state and read the screen, and I have
not done that for two of the six. Producing them means deliberately breaking the deployment —
a wrong key, then a hostname that does not resolve — and undoing both afterwards.

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

# 3. The collaboration

*To follow.*
