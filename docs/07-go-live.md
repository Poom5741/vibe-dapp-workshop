# Station 7 — Go Live: Real URL + Art in Wallets (take-home / extension)

The 2-hour workshop ends at localhost + on-chain tokens. This station is the proven
post-workshop recipe (from the 2026-10-21 pilot): put the site on a real URL and make
your art show inside wallets — no R2, no payments, no backend.

## 1. Static export (already configured)

`app/next.config.mjs` ships with `output: "export"` + `images: { unoptimized: true }`
(the app is fully client-side). So:

```bash
cd app && npx next build     # → app/out/
```

## 2. Cloudflare Workers, free, no R2 (the pilot's path)

R2 needs dashboard activation + a payment method — skip it. Workers serves static assets
for free. `app/wrangler.toml` is already set up (`name = "mint"`, assets `./out`).

```bash
npx wrangler login     # browser OAuth — click Allow FAST, it can time out
npx wrangler deploy    # first run: register your workers.dev subdomain when prompted
```

Cloudflare gotchas (all hit in the pilot):
- First deploy: `wrangler deploy` asks you to register a **workers.dev subdomain** — do it
  in the interactive prompt (there is no `wrangler subdomain` command in v4).
- Worker name = URL prefix: worker `mint` + subdomain `peak-pioneers` →
  `https://mint.peak-pioneers.workers.dev`. Rename in `wrangler.toml` and redeploy if the
  doubled-name URL looks ugly.
- ~60s of TLS/DNS errors right after the first deploy is just propagation.

## 3. Metadata: make the art show in wallets

ERC-721 `tokenURI(id)` = `baseTokenURI` + id — **no `.json` suffix**. The repo therefore
ships BOTH: `app/public/metadata/1.json` (human-friendly) and extensionless `metadata/1`
(what marketplaces actually fetch). Keep them identical when you edit.

```bash
# from app/, after `next build && npx wrangler deploy`:
cast send <CONTRACT> "setBaseTokenURI(string)" "https://<your-site>/metadata/" \
  --private-key "$PK" --rpc-url https://api.avax-test.network/ext/bc/C/rpc
# verify:
cast call <CONTRACT> --rpc-url https://api.avax-test.network/ext/bc/C/rpc "tokenURI(uint256)(string)" 1
```

Then re-import the token in your wallet (or refresh) → your art appears.

⚠️ Honesty note: files on Workers can change under minted tokens. Fine for a workshop;
real projects pin metadata on IPFS/Arweave for immutability.

## 4. Source verification (polish)

`forge verify-contract <0xContract> src/MyNFT.sol:MyNFT --chain-id 43113` — needs a free
SNOWTRACE_API_KEY in foundry/.env. Makes your token page show verified source.

## 5. Command cheat sheet (proven on Windows Git Bash)

```bash
export PATH="$PATH:/c/Users/<you>/.foundry/bin"   # Git Bash PATH fix
cd foundry
PK=$(grep '^DEPLOYER_KEY=' .env | cut -d= -f2)
forge script script/DeployMyNFT.s.sol --rpc-url fuji --broadcast --slow   # DEPLOYER_KEY auto-loaded from .env

cd ../app && npx next build && npx wrangler deploy
```
