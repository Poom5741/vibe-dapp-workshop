# R7 — Fuji Gas Faucet (instructor-run)

## Purpose (client's words, verbatim — super-speckit invocation, this session)

> i want one page faucet app that my student can go and request for fuji gas . use cast
> wallet to create new wallet and save it somewhere to hold the gas. this web should be
> deploy to cloudflare worker and should validate learner with capcha. at the end went i
> deploy i will deposit testnet gas to wallet you give me and we will test thefaucet

Provenance: instructor (workshop owner) via super-speckit skill arguments. This is the
confirmed product intent for this feature.

## Decisions (instructor-confirmed)

| Question | Answer |
| --- | --- |
| Drip amount per request | **0.1 testnet AVAX** |
| Cooldown per student wallet | **24 hours** |
| Captcha | Cloudflare **Turnstile** (native to Workers, free). Ships with Turnstile's official *test* keys (always-pass) for local testing; real keys swapped in at deploy. |
| Treasury wallet | Fresh burner generated on this machine (`cast` unavailable → equivalent `ethers.Wallet.createRandom()`). Private key stored **only** in `faucet/.dev.vars` (gitignored) and later as a Workers secret. Address shared with instructor for funding. |
| Hosting | Its own Cloudflare Worker (`faucet/`), separate from the dApp's static Worker (`app/wrangler.toml`, name `mint`) so the workshop scaffold stays untouched. |

## Acceptance criteria

1. One page served by the Worker: address input, captcha, request button, clear feedback.
2. POST /api/drip validates the Turnstile token server-side before touching funds.
3. Per-address 24h cooldown and a per-IP daily cap, persisted in Workers KV.
4. Sends exactly 0.1 testnet AVAX on Fuji (chainId 43113) from the faucet wallet.
5. Friendly errors: bad address, captcha failed, rate limited, faucet empty.
6. Private key never committed, never logged, never echoed to the chat.
7. Works locally via `wrangler dev` before any deploy; deploy steps documented and
   gated on instructor approval (external action).
