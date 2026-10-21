# Station 1 — Fuel: Wallet, Fuji, Faucet (0:10–0:25)

**Gate to pass:** non-zero Fuji balance + one completed transfer in your history.

## Security briefing (3 min — before ANYONE creates a wallet)

Seed phrase = master key. Whoever knows it owns everything, permanently.

1. **Write it on paper.** Never screenshot, never cloud-note, never photo.
2. **Never type it into any website.** Legitimate apps never ask.
3. **Never give it to an AI agent or chatbot** — including today's tools. Agents get powers
   through approval popups, never through your keys.

We're on testnet: zero real money. Build the habits now; the same wallet works on mainnet later.

## Create the wallet (4 min, together)

Install **Core** (Ava Labs' Avalanche wallet, browser extension) → Create new wallet →
write the seed phrase on paper → verify the words → set a password. MetaMask works
identically; add Fuji manually: chainId `43113`, RPC `https://api.avax-test.network/ext/bc/C/rpc`.

Under the hood: seed phrase → private key → public address. Wallet apps hold *keys*;
your tokens live on the chain at your address.

## Switch to Fuji (2 min)

Core network picker → **Fuji Testnet**. Check the badge/color — "always check which network
you're on" is a lifelong habit.

## Faucet (3 min)

A faucet gives free testnet tokens because testnet money has no value.

| Faucet | URL |
|--------|-----|
| Official (first choice) | https://faucet.avax.network |
| Backup | https://faucets.chain.link/fuji |
| Down? | Helper distribution wallet — a live P2P demo |

Paste your `0x…` address → receive test AVAX. Verify it landed:
`node scripts/check-balance.mjs 0xYourAddress`

## First transaction (3 min)

Send **0.1 AVAX** to your neighbor (swap addresses via QR). Open the tx → **View on
explorer** → read From / To / Value / Gas fee / Tx hash together.
The **tx hash is the receipt ID** — permanent, public, clickable forever.

## Common misconceptions

- ❌ "I need to buy AVAX" → No. Fuji AVAX is free.
- ❌ "The wallet app holds my money" → It holds keys; the chain holds the money.
