# Workshop Constitution (non-negotiable)

These rules outrank any spec, prompt, or agent suggestion. If a change conflicts with
these, the change is wrong.

1. **Keys never leave the wallet.** No seed phrase or private key may be written to any
   file, env var, chat message, or config. Deployment uses an injected wallet (Remix).
2. **Fuji testnet only.** chainId `43113`. Anything targeting mainnet (`43114`) is rejected.
3. **Nothing of real value.** No purchases, no real funds, no publishing to the internet
   today. `localhost` and testnet only.
4. **Smallest change wins.** Each iteration changes only what the feedback names.
5. **The human approves.** The agent proposes; the student disposes. Every external action
   (spend, publish, delete) needs an explicit human yes.
6. **v1 ships.** Perfection is not a gate at any station; the loop continues forever.
