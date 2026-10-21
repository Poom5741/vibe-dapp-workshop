# speckit — the method we teach

**The one idea:** before you ask an AI agent to build anything, write a short **spec** —
a plain-language agreement of what you want. The spec, not the prompt, is the source of
truth. The agent turns spec → plan → tasks → working code, and *you* verify each step.

> People used to learn software to use computers. Now you direct software that uses the
> computer. The skill is direction, not syntax. The spec is how you direct.

## The 4-phase loop

```
specify ──► plan ──► tasks ──► implement ──► LOOK at the real result ─┐
    ▲                                                                 │
    └────────────────── iterate: precise feedback, change only that ◄─┘
```

| Phase | File it produces | One rule |
|-------|------------------|----------|
| **specify** | `station-specs/<name>-spec.md` | Use the 4-part recipe (below) |
| **plan** | same file, `## Plan` section | Name the files + libraries + order |
| **tasks** | same file, `## Tasks` section | Small numbered steps, each checkable |
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

## Worked examples (read these, then write yours)

- `station-specs/build-spec.md` — the dApp page spec (mostly prefilled for you)
- `station-specs/wiring-spec.md` — the post-deploy spec: put your real contract address in

## The constitution

`constitution.md` holds the non-negotiables (Fuji only, keys never in code, smallest
change wins). The spec may change freely; the constitution may not.
