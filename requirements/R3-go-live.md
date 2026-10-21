# Requirements Brief R3 — Go Live (Deploy + Wire)
> From: your facilitator (acting as the client) · For: Deploy + Proof stations
> YOUR job: spec the wiring (speckit.specify), then run the deploy ritual yourself

## The client wants

My contract live on Fuji and my page minting from it.

**Deployment ritual (follow-the-leader, docs/05-deploy-foundry.md):**
1. Burner wallet first: fresh account, testnet-only, its key (and only its key) into
   `foundry/.env` — funded with a little test AVAX from the faucet.
2. `forge test -vv` — 7/7 green BEFORE deploying. Tests are the read-before-deploy ritual.
3. `forge script script/DeployMyNFT.s.sol --rpc-url fuji --broadcast --slow`
4. Copy the printed address — the day's most important string.

**Then wiring (acceptance criteria):**
- [ ] `app/src/config.js` has MY deployed address; name/symbol match what I deployed
- [ ] Mint from localhost:3000 succeeds; tx hash links to Snowtrace, Status: Success
- [ ] My token is visible in my wallet's NFT tab
- [ ] I can explain what happened when I paid gas: code became permanent on the chain

## Open questions

- Your collection name/symbol (what did you decide in R1? they must match the constructor).
- If a mint fails: which error is it (wrong network / rejected / out of gas) and what do
  you do? Decide BEFORE it happens — see the cheat card decoder.

→ Your answers become `speckit/specs/wiring-spec.md`. The deploy itself is NOT delegated:
you read the test list and you run the command. The agent explains; you execute.
