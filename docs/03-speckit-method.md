# Station 2 — Meet Your Agent + the speckit Method (0:25–0:35)

The conceptual heart of the workshop. The main skill we teach: **speckit** — spec-driven
direction of an AI coding agent.

## Chatbot → agent (2 min)

- Chatbot: answers. Conversation ends at text.
- Agent: **does** — tools (edit files, run commands, search the web), multi-step work,
  light supervision. Today's coding agent lives inside this repo and reads `AGENTS.md`.

"The skill is direction, not syntax."

## The speckit loop (5 min — read `speckit/README.md` with the room)

```
specify → plan → tasks → implement → LOOK at the real result → iterate
```

The **spec** (a short plain-language agreement of what you want) is the source of truth —
not the prompt, not the agent's first draft.

## The 4-part recipe (this is the whole skill)

1. **What it is** — "a single-page NFT mint site…"
2. **What it looks like** — "dark theme, neon purple and red…"
3. **What it must do** — "Connect Wallet, quantity selector, Mint on Fuji 43113…"
4. **What to leave out** — "contract address stays a placeholder; use my art from /public/art"

Plus the **iterate reflex**: read the result → name exactly what's wrong → change only that.
"Vague feedback gets vague fixes."

## The safety model (2 min)

- Agents ask before anything external: sending, publishing, spending, deleting. Read popups.
- Two layers: **keys stay in the wallet** (Station 1 rules); **approvals stay with the human**.
- The one exception today, taught as the *pro pattern*: a **fresh burner wallet** whose key
  goes into `foundry/.env` for automated deploys. Testnet only, empty otherwise. Your main
  wallet's seed phrase NEVER touches a file.

## Live demo (projector)

Say to your coding agent: *"Read AGENTS.md and run the speckit loop for the Build
Station spec"* → watch the spec appear, then the plan, then the tasks, then the code.
That's the student's whole afternoon — except the art and the name will be theirs.
