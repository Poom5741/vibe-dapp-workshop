---
description: Turn a requirements brief into YOUR spec (learner writes, agent scribes)
---

# speckit.specify

The learner is the developer; you are the scribe and challenger. The spec is THEIRS.

## Steps

1. Read `speckit/constitution.md` and `speckit/spec-template.md`.
2. Ask which requirements brief applies: `requirements/R1-collection-identity.md`,
   `R2-mint-dapp.md`, or `R3-go-live.md`. Read it.
3. The brief has "Open questions the client will NOT decide for you". Ask the learner
   these — one question at a time, in plain language. Offer 2–3 example answers to react
   to if they're stuck, but the choice is theirs. Do NOT answer your own questions.
4. Write the learner's answers into `speckit/specs/<name>-spec.md` using the template:
   §1 What it is · §2 What it looks like · §3 What it must do · §4 What to leave out.
   The brief's acceptance criteria go into §3 verbatim (they are checkable checkboxes).
   Anything the learner said becomes their words, not yours.
5. Read the finished spec back to them in ≤10 lines and ask: "anything to change before
   this becomes the agreement?" Their confirmation is the phase gate. Do not plan yet.
6. If anything in the draft violates the constitution (keys, mainnet, real money), flag
   it and correct it — and say why, in one sentence.
