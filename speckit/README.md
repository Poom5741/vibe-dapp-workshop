# speckit — the method we teach

**The one idea:** before you ask an AI agent to build anything, write a short **spec** —
a plain-language agreement of what you want. The spec, not the prompt, is the source of
truth. The agent turns spec → plan → tasks → working code, and *you* verify each step.

> People used to learn software to use computers. Now you direct software that uses the
> computer. The skill is direction, not syntax. The spec is how you direct.

## The 4-phase loop

```
requirements ──► YOUR spec ──► plan ──► tasks ──► implement ──► LOOK ─┐
 (from the      (you decide)                                            │
  facilitator)              ◄──────── iterate: precise feedback ───────┘
```

You start each station from a **requirements brief** in `/requirements` — written like a
client talking to you. The brief states what the client wants and the acceptance criteria,
but leaves the real decisions (theme, look, copy, layout) **open on purpose**. Turning
those open questions into a spec is the dev skill we teach.

| Phase | File it produces | One rule |
|-------|------------------|----------|
| **specify** | `specs/<name>-spec.md` — YOURS | Answer the brief's open questions yourself |
| **plan** | `## Plan` in the same file | Name the files + libraries + order |
| **tasks** | `## Tasks` section | Small numbered steps, each checkable |
| **implement** | actual code | After each task, look at the real result |

## The 4-part recipe (this is the whole skill)

1. **What it is** — "A single-page NFT mint site…"
2. **What it looks like** — "dark theme, neon purple and red, Avalanche vibes…"
3. **What it must do** — "Connect Wallet button, quantity selector, Mint button calling a
   contract on Fuji (chainId 43113), show the tx hash after minting…"
4. **What to leave out** — "leave the contract address as a placeholder in config.js;
   use my images from /public/art with those exact filenames."

**The iterate reflex:** "vague feedback gets vague fixes." Bad: "it looks bad."
Good: "the hero image is stretched and the mint button is below the fold — fix only those."

## How to run it with your AI agent

Any of these works, because the repo ships the prompt files in `.github/prompts/`:

```
Run the speckit.specify prompt for the Build Station — my collection is called <NAME>.
Run the speckit.plan prompt.
Run the speckit.tasks prompt.
Run the speckit.implement prompt, then show me the page.
```

Or just say to your agent: *"follow speckit/README.md for my next change"* — `AGENTS.md`
already teaches it the loop.

## Worked example of the flow (not of the answers)

1. Read `requirements/R2-mint-dapp.md` — the client's asks + open questions.
2. With your agent (`speckit.specify` prompt), answer the open questions → write
   `specs/build-spec.md` yourself.
3. plan → tasks → implement, one checkpoint at a time.

The ONLY prefilled content in this repo is the acceptance criteria in the briefs.
Everything between "the client wants" and "the code works" is yours to write.

## The constitution

`constitution.md` holds the non-negotiables (Fuji only, keys never in code, smallest
change wins). The spec may change freely; the constitution may not.
