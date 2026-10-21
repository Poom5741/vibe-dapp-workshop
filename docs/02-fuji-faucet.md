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

A faucet gives free testnet tokens because testnet money has no value. **Try them in this
order — faucet friction is the #1 dropout risk, so never stall on one:**

| # | Faucet | URL |
|---|--------|-----|
| 1 | Official | https://faucet.avax.network (→ core.app/tools/testnet-faucet) |
| 2 | Chainlink | https://faucets.chain.link/fuji |
| 3 | Third-party | https://www.allthatnode.com/avalanche.dsrv |
| 4 | Down entirely? | Helper gas-holder wallet — a live P2P demo |

Paste your `0x…` address → receive test AVAX. Verify it landed:
`npm run balance -- 0xYourAddress`

### Appendix — graceful testnet switch (only if EVERY faucet fails)

If the room must switch networks (e.g. another chain's faucet is up), the swap is a
**one-file change** because all network constants live in `app/src/config.js`:

1. Edit `app/src/config.js`: `FUJI_CHAIN_ID_DEC`, `FUJI_RPC`, `SNOWTRACE`, explorer.
2. Edit `foundry/foundry.toml`: the `fuji` rpc endpoint URL (+ `[etherscan]` chain).
3. `grep -rn 43113 app/src scripts` to catch strays (MintApp error text, wallet switch button).

Tell your agent: *"Switch the whole project from Fuji to <chain> <chainId>. Network
constants live in app/src/config.js and foundry/foundry.toml — change only those."*

## First transaction (3 min)

Send **0.1 AVAX** to your neighbor (swap addresses via QR). Open the tx → **View on
explorer** → read From / To / Value / Gas fee / Tx hash together.
The **tx hash is the receipt ID** — permanent, public, clickable forever.

## Common misconceptions

- ❌ "I need to buy AVAX" → No. Fuji AVAX is free.
- ❌ "The wallet app holds my money" → It holds keys; the chain holds the money.
