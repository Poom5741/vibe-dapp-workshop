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
| 3 | Server-side Turnstile validation before funds move | **verified** (test keys) | missing token → 400; token verified via siteverify in drip path; **deployed with test keys — real-key swap still pending** |
| 4 | Bad address rejected with friendly message | **verified** | `POST /api/drip {address:"0x123"}` → 400 |
| 5 | Per-address 24h cooldown in KV | **verified** | prod: second drip to same address → 429 "Try again in ~24h" (KV binding live) |
| 6 | Sends exactly 0.1 AVAX on chainId 43113 | **verified** | prod drip: tx 0xcc7afd98e33206d0ce51eac92833da5dc94c3cc7a90eda752576449752602a40 mined block 59936120, value 0.1, recipient balance exactly 0.1 (RPC-verified) |
| 7 | Friendly "faucet empty" error | **verified** | UI journey: fill → click → "Faucet is empty (balance 0.0 AVAX)…" (proof `e5a83606`) |
| 8 | Private key never committed/logged/echoed | **verified** | key only in `faucet/.dev.vars` (gitignored); wallet address is public info |
| 9 | Deploys to Cloudflare Workers | **verified** | deployed via WSL wrangler (OAuth acct poom@charoenyost.com): https://fuji-faucet.poom-a1d.workers.dev — page 200, /api/status live, prod drip journey (captcha→KV→RPC→503 empty) passed; version e669a09f |

Post-funding checklist: ~~fund wallet → real drip → tx on Snowtrace (rows 5, 6)~~ **done 2026-10-24**. Remaining: swap real Turnstile keys (row 3) when pointing students at it.

Checker identity: independent ADE browser session + curl suite against the running
candidate (maker and checker share this machine — compact micro scale, disclosed).
After funding or deploy, rows 5 and 6 need a fresh pass before claiming done.
