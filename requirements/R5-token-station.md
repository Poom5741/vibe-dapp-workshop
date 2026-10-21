# Requirements Brief R5 — Token Station (extension)
> From: your facilitator · For: deploy + trade an ERC-20 (docs/08-token-station.md)
> YOUR job: spec it first (speckit.specify), then deploy

## The client wants

A classroom currency on Fuji that every student can claim, then trade with each other —
so the room can SEE a peer-to-peer transfer settle without any company in the middle.

**Acceptance criteria:**
- [ ] `npm test` shows the token suite green (6 tests) next to the NFT suite
- [ ] Token deployed on Fuji; address imported into my wallet; symbol shows (WT or mine)
- [ ] I claimed the faucet ONCE and got exactly the faucet amount
- [ ] A second claim REVERTS (per-address once is the rule — and it's on-chain)
- [ ] I sent 10 tokens to a classmate; both sides see it on Snowtrace
- [ ] I can explain ERC-20 vs ERC-721 in one sentence each

## Open questions — yours to answer

- Name + symbol (in `foundry/.env`: TOKEN_NAME / TOKEN_SYMBOL) — brand it
- Faucet size: is 100 right for your room? What would YOU choose and why?
- The cap: 1,000,000 default — keep, change, or remove owner-minting entirely?

→ Your answers become `speckit/specs/token-spec.md`. The contract already supports your
choice via `.env` (name/symbol); deeper rule changes are YOUR spec → agent edits → tests.
