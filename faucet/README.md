# Fuji Gas Faucet

One-page faucet that drips **0.1 testnet AVAX** per request (24h cooldown per wallet,
Cloudflare Turnstile captcha, per-IP daily cap). Runs as its own Cloudflare Worker,
separate from the dApp's static Worker in `app/wrangler.toml`.

- Wallet: `0xB5A90caf8f1Cf3Bd918e24bc42E7c37CDAd4C683` (fresh burner, testnet-only)
- Live (test-captcha mode): https://fuji-faucet.poom-a1d.workers.dev
- Tunables (drip amount, cooldown, caps, RPC): `wrangler.toml [vars]`
- Secrets: `FAUCET_PRIVATE_KEY`, `TURNSTILE_SECRET` — in `.dev.vars` locally (gitignored),
  in Workers secrets in production. **Never commit or paste these.**
- Spec + verification matrix: `requirements/R7-faucet.md`, `PLAYBOOK.md`

## Run locally

```bash
cd faucet
npm install
npm run dev        # http://localhost:8787  (KV simulated, secrets from .dev.vars)
```

Currently on Turnstile **test keys** (the widget says so). Fine for local testing.

## Fund the treasury (instructor)

Send 1–5 testnet AVAX to `0xB5A90caf8f1Cf3Bd918e24bc42E7c37CDAd4C683`:

- From your workshop wallet / Core wallet, or
- `cast send 0xB5A90caf8f1Cf3Bd918e24bc42E7c37CDAd4C683 --value 2ether --rpc-url fuji --private-key $TESTNET_KEY`
- Top-ups later: same address, any amount. Balance shows live on the page.

Faucets: https://faucet.avax.network or https://faucets.chain.link/fuji (fund your own
wallet first if needed).

## Deploy (needs instructor approval + Cloudflare login)

```bash
cd faucet
npx wrangler login                                   # opens browser
npx wrangler kv namespace create RATE_LIMIT          # copy the id into wrangler.toml
npx wrangler secret put FAUCET_PRIVATE_KEY           # paste the key from .dev.vars
npx wrangler secret put TURNSTILE_SECRET             # paste your REAL Turnstile secret
npx wrangler deploy                                  # prints the https://*.workers.dev URL
```

Real Turnstile keys (2 min, free): dash.cloudflare.com → Turnstile → Add site →
add the worker's hostname → put the **site key** in `wrangler.toml [vars]
TURNSTILE_SITE_KEY` and the **secret key** in the `TURNSTILE_SECRET` Worker secret.
Until then the deployed faucet runs in test-captcha mode — anyone can pass it.

After deploying: swap real keys, redeploy, then send a real drip to a student wallet and
check the tx on https://testnet.snowtrace.io — that closes the last two rows of
`PLAYBOOK.md`'s verification matrix.

## Monitor

```bash
npm run tail        # live Worker logs (errors land in the Events dashboard too)
```
