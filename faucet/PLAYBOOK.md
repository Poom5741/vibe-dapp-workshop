# Faucet delivery playbook (super-speckit micro route)

Feature: R7 one-page Fuji gas faucet. Route: **micro** (small understood new feature,
established boundaries) → one playbook + verification matrix, compact completion.
Purpose confirmation: instructor's super-speckit invocation, retained verbatim in
`requirements/R7-faucet.md`. No native Spec Kit state machine — compact mode, never
claimed as native convergence.

## Investigation notes (before code)

- Existing Worker in repo (`app/wrangler.toml`) is assets-only static hosting for the
  Next export, name `mint`. A faucet needs a Worker *script* + KV + secrets → separate
  `faucet/` worker, name `fuji-faucet`, zero overlap with the dApp scaffold.
- Fuji RPC `https://api.avax-test.network/ext/bc/C/rpc`, chainId 43113 (AGENTS.md).
- Captcha: Cloudflare Turnstile chosen — first-party to Workers, free, siteverify is a
  plain fetch. Official test sitekey/secret used locally; real keys swap at deploy.
- `cast` not installed on this machine (no `~/.foundry`) → treasury wallet generated
  with `ethers.Wallet.createRandom()` (identical cryptography: random secp256k1 key).
  Key written directly to `faucet/.dev.vars`; never displayed or committed.
- ethers v6 on Workers: `JsonRpcProvider(url, chainId)` uses a static network (skips
  network detection round-trip) and signs with the secret from env bindings.

## Known limitations (documented, accepted for workshop scale)

- Workers KV is eventually consistent: two requests from the same address in different
  colos within seconds could both pass the cooldown check. Captcha + IP cap make
  exploitation costly; acceptable for a classroom faucet.
- No nonce manager: each drip fetches the next nonce. Two truly concurrent drips could
  collide and one would need a retry. Classroom volume is single-digit concurrent.
- Drain bound: drip amount × IP daily cap per captcha-solvable address per 24h.

## Verification matrix

| # | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| 1 | One page serves: input, captcha, button, feedback | **verified** | ADE browser observation + proof `e5a83606` (page renders, chips populated) |
| 2 | Status endpoint shows live faucet address/balance from Fuji RPC | **verified** | `GET /api/status` → `balanceAvax: "0.0"`, chainId 43113 (live RPC round-trip) |
| 3 | Server-side Turnstile validation before funds move | **verified** (test keys) | missing token → 400; token verified via siteverify in drip path; real-secret swap documented — **re-verify at deploy** |
| 4 | Bad address rejected with friendly message | **verified** | `POST /api/drip {address:"0x123"}` → 400 |
| 5 | Per-address 24h cooldown in KV | **verified (logic)** | code path exercised via local KV (rate-limit branch before send); 24h re-request assertion deferred until funded — **not-verified end-to-end** |
| 6 | Sends exactly 0.1 AVAX on chainId 43113 | **not-verified** | Requires funded treasury; blocked on instructor deposit. Everything before broadcast verified (balance pre-check returns 503 correctly) |
| 7 | Friendly "faucet empty" error | **verified** | UI journey: fill → click → "Faucet is empty (balance 0.0 AVAX)…" (proof `e5a83606`) |
| 8 | Private key never committed/logged/echoed | **verified** | key only in `faucet/.dev.vars` (gitignored); wallet address is public info |
| 9 | Deploys to Cloudflare Workers | **not-verified** | Gated on instructor approval + Cloudflare login; runbook in `faucet/README.md` |

Checker identity: independent ADE browser session + curl suite against the running
candidate (maker and checker share this machine — compact micro scale, disclosed).
After funding or deploy, rows 5 and 6 need a fresh pass before claiming done.
