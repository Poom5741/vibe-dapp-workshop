# 🏔️ Vibe Code Your First dApp on Avalanche — Workshop Repo

A 2-hour, hands-on workshop for absolute beginners. You will: create a wallet, get free
testnet AVAX, generate your collection's identity, **spec-driven-build a dApp with the
speckit method**, deploy an ERC-721 contract to the Fuji testnet, and mint your first NFT.

Everything in this repo works with **any AI coding agent** — ZCode, Claude Code, Cursor,
Codex, Windsurf, Gemini CLI. The agent reads `AGENTS.md` and follows the stations.

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
| 0:40 | **Art** | Generate 3 NFT artworks + banner into `app/public/art/` | [docs/04-cheat-sheet.md](docs/04-cheat-sheet.md) A1–A4 |
| 0:55 | **Build** | Run the scaffolded app, iterate with precise feedback | [docs/04-cheat-sheet.md](docs/04-cheat-sheet.md) B1–B6 |
| 1:25 | **Deploy** | Paste the contract into Remix, deploy on Fuji | [docs/05-deploy-remix.md](docs/05-deploy-remix.md) |
| 1:50 | **Proof** | Mint, read Snowtrace, wire your contract address in | [docs/06-proof.md](docs/06-proof.md) |

## ⚡ Quick Start (do this before the workshop)

```bash
# 1. Clone and enter the repo
git clone <this-repo-url> && cd vibe-dapp-workshop

# 2. Open your AI coding agent in this folder and say:
#    "Read AGENTS.md and run the setup verification."
node scripts/verify-setup.mjs

# 3. Install the app
cd app && npm install && npm run dev
# → open http://localhost:5173
```

## 🔑 The Golden Rules (all day, every day)

1. **Seed phrase on paper. Never screenshot, never type it anywhere, never give it to an AI.**
2. **Keys never leave the wallet** — the wallet signs; no key ever goes into a file.
3. **Fuji testnet only** (chainId `43113`) — testnet money is free pretend-money.
4. **The agent proposes, you dispose** — read every approval popup.

## 📁 Repo Map

```
AGENTS.md            ← the contract your AI agent reads (start here)
FACILITATOR.md       ← run-of-show, checkpoints, fallbacks for the room
speckit/             ← the speckit method: constitution, spec template, worked examples
.github/prompts/     ← speckit.* prompt files any agent can pick up
app/                 ← the starter dApp (Vite + React + ethers v6)
contract/MyNFT.sol   ← the ERC-721 you deploy via Remix
scripts/             ← verify-setup.mjs, check-balance.mjs
docs/                ← one short doc per station + cheat sheet
```

## 🚰 Faucets (Fuji testnet AVAX)

1. Official: **https://faucet.avax.network** (paste your `0x…` address)
2. Backup: **https://faucets.chain.link/fuji**
3. Faucet down? Ask a helper — the distribution wallet send is itself a live P2P demo.

## ✅ You're done when

- [ ] Non-zero Fuji balance + one completed transfer in your wallet history
- [ ] Your localhost page shows **your art** and a Connect Wallet button that works
- [ ] A deployed contract address on Fuji (your day's most important string)
- [ ] An NFT minted from **your** contract, visible on **https://testnet.snowtrace.io**
