# Station 9 — NFT Assets on R2 (optional scale-up, after docs/07-go-live.md)

docs/07 deliberately uses **Workers static assets** for art + metadata because it's free
and zero-setup. Use R2 when you want the assets on their own bucket (custom domain,
separate lifecycle from the site, bigger files). Requires R2 activated in the Cloudflare
dashboard (needs a payment method on file — this is why it's NOT the workshop default).

## 1. Create the bucket and turn on public access

```bash
cd app
npx wrangler r2 bucket create vibe-assets
# Public access: enable it in the dashboard → R2 → vibe-assets → Settings →
# "Allow public access" (gives you the https://pub-<id>.r2.dev/... URL)
```

## 2. Upload art + metadata (the folder IS the contract's public root)

```bash
npx wrangler r2 object put vibe-assets/art/art1.png --file public/art/art1.png
npx wrangler r2 object put vibe-assets/art/hero.svg --file public/art/hero.svg
npx wrangler r2 object put vibe-assets/metadata/1 --file public/metadata/1
# …repeat for each file (or loop). Metadata image fields must become ABSOLUTE URLs:
#   "image": "https://pub-<id>.r2.dev/art/art1.png"
```

## 3. Point the contract at the bucket — one transaction, no redeploy

```bash
cast send <CONTRACT> "setBaseTokenURI(string)" "https://pub-<id>.r2.dev/metadata/" \
  --private-key "$PK" --rpc-url https://api.avax-test.network/ext/bc/C/rpc

# verify:
cast call <CONTRACT> --rpc-url https://api.avax-test.network/ext/bc/C/rpc "tokenURI(uint256)(string)" 1
# → https://pub-<id>.r2.dev/metadata/1   (fetch it: should return your JSON)
```

## 4. When to choose what

| | Workers static assets (docs/07) | R2 (this doc) |
|---|---|---|
| Setup | zero — ships with the site | bucket + public access + payment method |
| Cost | free tier | free tier (10 GB) after activation |
| Custom domain | workers.dev only | easy custom domain per bucket |
| Best for | the workshop + demo day | "real" collection infra |
| Immutability | none (mutable files) | none either — for true immutability use IPFS/Arweave |

Honesty note for the room: NEITHER option makes metadata immutable. Minted tokens point
at URLs; whoever controls the URL controls what wallets show. Immutability = content
addressing (IPFS/Arweave) — that's the take-home rabbit hole.
