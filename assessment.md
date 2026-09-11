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

*To follow, in its own commit, once the audit currently running against the live URL has returned.
Deliberately not written yet — see the note at the top of this file.*

---

# 3. The collaboration

*To follow.*
