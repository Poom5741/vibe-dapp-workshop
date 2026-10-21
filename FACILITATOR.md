# FACILITATOR.md — Run of Show (2-hour cut)

Audience: absolute beginners (20–30 uni students). Harness: any AI coding agent (repo is
agent-agnostic) + an image-generation agent/skill for the Art station.
Two hard rules from the proposal survive the cut to 2 hours: **hard gates between
stations**, and **nobody stays at zero** (fallbacks below are mandatory, not optional).

## Timeline

| Time | Segment | Mode | Gate to pass |
|------|---------|------|--------------|
| 0:00–0:10 | Web3 in 10 (`docs/01`) | Talk + live Snowtrace demo | four words on projector |
| 0:10–0:25 | Wallet + Fuji + faucet (`docs/02`) | Hands-on, all together | **GATE 1**: non-zero Fuji balance + 1 completed transfer each |
| 0:25–0:35 | Agents + speckit method (`docs/03`) | Talk + live demo | oral check: 4 parts of the recipe |
| 0:35–0:50 | Art station (`docs/04` A1–A4) | Hands-on (image agent) | **GATE 2**: ≥1 image saved in `app/public/art/` |
| 0:50–1:20 | Build station (`docs/04` B1–B6) | Hands-on (coding agent) | **GATE 3**: localhost page shows art + Connect Wallet opens wallet |
| 1:20–1:45 | Deploy station (`docs/05`) | Guided, all together | **GATE 4**: deployed `0x…` contract address on Fuji |
| 1:45–1:57 | Proof station (`docs/06`) | Hands-on | minted NFT + contract visible on Snowtrace |
| 1:57–2:00 | Show & tell + ladder home | Talk | 3 student demos, 30 sec each |

## Cut decisions (3h → 2h) — what was dropped

- Metadata hosting / "art shows in wallet" → take-home mission (say so explicitly).
- AI-as-tutor stretch (B6) → optional, only if the room is ahead.
- Per-student Remix pace → the Remix ritual is fully follow-the-leader, one step at a time.

## The 25% rule (say it out loud at every gate)

"If more than a quarter of the room is stuck, EVERYONE loads the fallback and we continue
from a known-good state. Falling back is normal, not failure."

| Gate | Fallback | How |
|------|----------|-----|
| Wallet/faucet | Helper sends from distribution wallet | live P2P demo — narrate it on Snowtrace |
| Art | Starter art pack | already at `app/public/art/` — students keep their AI art as take-home |
| Build | Starter template | `git checkout app/` inside the repo, `npm install && npm run dev` |
| Deploy | Pre-made contract | `contract/MyNFT.sol` IS the pre-made contract — everyone pastes the same file, no generation step exists |

## Unstick scripts (helpers)

- Dev server not opening → `cd app && npm install && npm run dev` (30 sec).
- Images not showing → exact folder `app/public/art/`, exact filenames, hard refresh.
- Wallet button silent → extension installed? logged in? unlocked? (back to Module 2 state)
- Faucet empty/down → helper distribution wallet; also https://faucets.chain.link/fuji.
- Remix "Injected provider" shows wrong chain → switch wallet to Fuji first, then refresh Remix.

## Pre-flight (facilitator, the day before)

- [ ] Run `node scripts/verify-setup.mjs` on a loaner laptop — expect all green.
- [ ] Fund the distribution wallet with test AVAX (~2 AVAX × student count ÷ 25 per transfer
      is plenty; 0.5 AVAX per student covers mints at 0.01 × 5).
- [ ] Confirm faucet.avax.network loads from the venue network; have Chainlink faucet open.
- [ ] Projector shows: four words slide, cheat card, and a live dev server of this repo.
- [ ] Print the cheat card from `docs/04-cheat-sheet.md` (one per student).

## Projection checklist for the four words

wallet · gas · smart contract · testnet — visible during segments 1–2, reused verbatim
by helpers all day.
