# Station 8 — Token Station: Deploy & Trade an ERC-20 (extension, ~25 min)

ERC-721 = every token **unique** (your NFTs). ERC-20 = every token **identical** (money).
Same chain, same wallet, same gas — just a different standard. This is the shortest path
from "I deployed a contract" to "I can demonstrate trading."

## 1. Read the contract first (the ritual, 2 min)

`foundry/src/WorkToken.sol` — read together on the projector:
- `is ERC20` → the fungible standard every wallet/exchange understands
- `faucet()` → anyone claims 100 WT, once per address (classroom gas station)
- `CAP = 1,000,000` → the rule you chose; ask the class WHY a cap matters
- `mint()` owner-only → the "central bank" lever; discuss why real tokens remove it

## 2. Test → Deploy (5 min)

```bash
npm test          # now runs BOTH suites: 7 NFT tests + 6 token tests
npm run deploy:token
```

Copy the printed token address — students add it to Core/MetaMask:
**Import token → paste 0x… → WT appears with a balance of 0.**

## 3. The classroom trade (10 min — the demo that lands)

1. Every student: call `faucet()` (via Remix Write, or the helper does it) → 100 WT each.
2. Pair up. Student A sends **10 WT** to Student B's address (wallet "Send" tab, pick WT).
3. Both open Snowtrace → the transfer is there: From / To / 10 WT / gas.
4. Land the idea: **no company processed that trade.** Two strangers' wallets settled
   directly on shared public rules. That's the whole ERC-20 pitch in one transfer.

Optional stretch: send WT *from the burner* with `cast send <token> "transfer(address,uint256)" <to> 10000000000000000000 --private-key "$PK" --rpc-url <fuji rpc>`.

## 4. What to discuss while it settles

- Fungible vs non-fungible: WT #5 is identical to WT #6; your NFT #1 is not #2.
- `approve` + `transferFrom`: how swaps/DEXes move your tokens (named only — DeFi
  mechanics are deliberately out of scope).
- Stablecoins & x402: real agents paying each other are ERC-20 transfers at machine speed.

## Commands (proven)

```bash
npm run deploy:token
cast call <TOKEN> --rpc-url https://api.avax-test.network/ext/bc/C/rpc "balanceOf(address)(uint256)" 0xYourAddress
cast send <TOKEN> "faucet()" --private-key "$PK" --rpc-url https://api.avax-test.network/ext/bc/C/rpc
```
