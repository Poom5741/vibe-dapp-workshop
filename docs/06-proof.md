# Station 6 — Proof: Mint, Wire, Snowtrace (1:45–1:57)

**Gate (the workshop's KPI):** NFT minted from YOUR contract + visible on Snowtrace.

## 1. Mint from the app (the full-circle moment)

```bash
cd app && npm run dev     # → http://localhost:3000
```

Tell your agent (cheat card **B5**):
> My deployed contract is 0x… . Put it in app/src/config.js, match the name/symbol, then
> help me tick every acceptance box in speckit/specs/wiring-spec.md — the spec I wrote
> from requirements/R3-go-live.md.

Then in the page: **Connect Wallet → quantity → Mint → approve in wallet.**
Concept made visible: **frontend ↔ wallet ↔ contract** — the page asks, the wallet shows
YOU, you approve, the chain executes.

## 2. Read the chain

Paste your contract address into https://testnet.snowtrace.io:
- the **contract page** (creator, creation tx, token list)
- your **mint transaction** (hash, from/to, gas, Status: Success)

📸 Screenshot moment: "This is your first on-chain artifact. This page will still be here
in ten years."

## 3. Check the wallet

Open Core/MetaMask → NFTs tab → the token from your contract is there. (Your custom art
shows once metadata is set — that's the take-home mission; today the token on-chain is the win.)

## 4. Failed-transaction literacy (read one calmly, together)

| Message | Meaning |
|---------|---------|
| Wrong network | the app refused a non-Fuji chain → switch |
| User rejected | you cancelled; nothing happened; retry freely |
| Insufficient funds | out of gas → faucet / helper wallet |

## 5. Where next (2 min, matched to majors)

- **Design/media** → AI-assisted brand & UI work for dApps
- **Business/finance** → RWA tokenization on Avalanche L1s; x402 agentic payments
- **Engineers-in-hiding** → build.avax.network guides → this repo, now with Foundry tests
  → mainnet (after a cold week of thinking)
- **Everyone — take-home missions:**
  1. Set `BASE_TOKEN_URI` + metadata JSONs so YOUR art shows in wallets (`setBaseTokenURI`)
  2. Redeploy a v2 with a new feature (new contract — immutability!)
  3. Publish the page to a real URL
