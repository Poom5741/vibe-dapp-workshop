# 🏔️ Vibe Code Your First dApp on Avalanche — Workshop Repo

A 2-hour, hands-on workshop for absolute beginners. You will: create a wallet, get free
testnet AVAX, generate your collection's identity, **spec-driven-build a dApp with the
speckit method**, deploy an ERC-721 contract to the Fuji testnet with **Foundry**, and
mint your first NFT.

**Stack:** Foundry (contract + tests + deploy) · Next.js (frontend, ethers v6) · Avalanche Fuji (43113)
**Works with any AI coding agent** — ZCode, Claude Code, Cursor, Codex, Windsurf, Gemini
CLI. The agent reads `AGENTS.md` and follows the stations.

---

## The 2-Hour Map

```
IDENTITY → FUEL → SPECKIT → ART → BUILD → DEPLOY → PROOF
 10 min   15 min   10 min   15 min  30 min  25 min   15 min
```

| ⏱ | Station | What you do | Where |
|---|---------|-------------|-------|
| 0:00 | **Web3 in 10** | Wallet, gas, contract, testnet — the four words | [docs/01-web3-in-10.md](docs/01-web3-in-10.md) |
| 0:10 | **Fuel** | Create wallet → Fuji network → faucet → first transfer | [docs/02-fuji-faucet.md](docs/02-fuji-faucet.md) |
| 0:25 | **Speckit** | Learn the spec → plan → tasks → build loop | [docs/03-speckit-method.md](docs/03-speckit-method.md) |
| 0:35 | **Art** | Generate 3 NFT artworks + banner into `app/public/art/` | [docs/04-cheat-sheet.md](docs/04-cheat-sheet.md) A1–A4 |
| 0:50 | **Build** | Run the scaffolded app, iterate with precise feedback | [docs/04-cheat-sheet.md](docs/04-cheat-sheet.md) B1–B6 |
| 1:20 | **Deploy** | `forge test` → `forge script` → Fuji | [docs/05-deploy-foundry.md](docs/05-deploy-foundry.md) |
| 1:45 | **Proof** | Mint, wire the address, read Snowtrace | [docs/06-proof.md](docs/06-proof.md) |
| after | **Go Live** | Real URL (Cloudflare) + art in wallets | [docs/07-go-live.md](docs/07-go-live.md) |
| after | **Token Station** | Deploy + trade an ERC-20 with the room | [docs/08-token-station.md](docs/08-token-station.md) |
| scale-up | **Assets on R2** | Move art + metadata to a bucket | [docs/09-r2-assets.md](docs/09-r2-assets.md) |

## ⚡ Quick Start (Windows and macOS — details in [docs/00-setup.md](docs/00-setup.md))

```bash
# 1. One-time tools (per-OS commands in docs/00-setup.md)
#    macOS:  brew install node;  curl -L https://foundry.paradigm.xyz | bash && foundryup
#    Windows (PowerShell):  winget install OpenJS.NodeJS.LTS;  irm https://foundry.paradigm.xyz | iex;  foundryup

# 2. Clone and set up — one command from the repo root
git clone <this-repo-url> && cd vibe-dapp-workshop
npm install && npm run setup

# 3. Open your AI coding agent in this folder and say:
#    "Read AGENTS.md and run the setup verification."
npm run verify

# 4. Two commands, two terminals
npm test        # contract: compile + 7 Forge tests
npm run dev     # frontend: http://localhost:3000
```

All learner-facing tooling is npm scripts + Node — no bash required, so PowerShell, cmd
and zsh behave identically.

## 🔑 The Golden Rules (all day, every day)

1. **Main wallet seed phrase on paper.** Never screenshot, never type it anywhere, never
   give it to an AI.
2. **Keys never leave the wallet — with one taught exception:** automated deploys use a
   **fresh, testnet-only burner wallet** whose key lives in `foundry/.env` (gitignored).
   This is the pro pattern: a key in a file must never be able to hurt you.
3. **Fuji testnet only** (chainId `43113`) — testnet money is free pretend-money.
4. **The agent proposes, you dispose** — read every approval popup.

## 📁 Repo Map

```
AGENTS.md            ← the contract your AI agent reads (start here)
FACILITATOR.md       ← run-of-show, checkpoints, fallbacks for the room
requirements/        ← per-station requirement briefs (the "client" — start each station here)
speckit/             ← the method: constitution, spec template, and YOUR specs in speckit/specs/
.github/prompts/     ← speckit.* prompt files any agent can pick up
app/                 ← Next.js dApp (App Router, ethers v6; static-export ready for Cloudflare)
foundry/             ← MyNFT.sol (ERC-721 Enumerable) + WorkToken.sol (ERC-20 faucet),
                       13 Forge tests, Fuji deploy scripts for both
scripts/             ← verify-setup.mjs · check-balance.mjs
docs/                ← setup (00) · stations (01–06) · go-live (07) · ERC-20 (08) · R2 (09)
HANDOFF.md           ← pilot-run record: what broke, what we fixed, lessons
```

## 🚰 Faucets (Fuji testnet AVAX)

1. Official: **https://faucet.avax.network** (paste your `0x…` address)
2. Backup: **https://faucets.chain.link/fuji**
3. Faucet down? Ask a helper — the distribution wallet send is itself a live P2P demo.
4. Verify it landed: `node scripts/check-balance.mjs 0xYourAddress`

## ✅ You're done when

- [ ] Non-zero Fuji balance + one completed transfer in your wallet history
- [ ] Your localhost:3000 page shows **your art**, a Connect Wallet button that works,
      a "Minted X / 100" counter, and a **My NFTs** section once you own tokens
- [ ] `npm test` green → a deployed contract address on Fuji (your day's most important string)
- [ ] An NFT minted from **your** contract, visible on **https://testnet.snowtrace.io**
- [ ] (Go Live) the site at your workers.dev URL with your art showing in wallets
