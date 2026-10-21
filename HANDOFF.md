# HANDOFF — Vibe DApp Workshop Pilot (AI-Agent-Assisted Run)
Date: 2026-10-21 · Mode: Single learner + AI coding agent (ZCode) doing the full workshop
Purpose: Detailed record of how this pilot run went — what worked, what broke, what we changed — to be used for improving the workshop, the scaffold, and future runs.

## 1. What this pilot was
A complete end-to-end run of the "Vibe Code Your First dApp on Avalanche" workshop (2-hour beginner format) where the AI agent did the setup, fixing, deploying and wiring, and the learner did the decisions that require a human: wallet creation, faucet trips, MetaMask approvals, minting, and art direction.

Final state (all live at time of writing):

| Artifact | Value |
|---|---|
| Collection | Peak Pioneers (PEAK) — ERC-721, OpenZeppelin v5, Solidity 0.8.24 |
| Contract (Fuji, 43113) | 0xa1cdaa64f5d66a1672bd768a7e1b73b1490415a2 |
| Deploy tx | 0x828febf46cca4ee7d2a9dbe2e8428907e65ea621d13e82367fa5d366a7cfa8ed |
| setBaseTokenURI tx | 0xa84389e78f344079cbb4400155b674d56b1b231c33045779afbf3066d170927d |
| Mint site (production) | https://mint.peak-pioneers.workers.dev (Cloudflare Workers, static) |
| Metadata base | https://mint.peak-pioneers.workers.dev/metadata/ (+ extensionless copies) |
| Token minted | #1 (art: black-hole PNG, imported into learner's MetaMask) |
| Learner main wallet | 0x6C20baC9e85Cb18FD24c8d8872702786B59305cE (address only — key stays with learner) |
| Burner deployer key | foundry/.env → DEPLOYER_KEY (gitignored, address 0x7f4e...9113) |

## 2. Timeline — what happened at each step

### Station 0 — Setup (~20 min)
Cloned the repo; installed Node (present, v24) and Foundry via foundryup.
`npm run setup` failed on Windows: `forge install --root foundry` errored with "Library directory is not relative to the repository root". Workaround: run `forge install ... --no-commit` from inside foundry/ — worked. (FIXED upstream: setup script now cds into foundry/.)
`npm run verify` → all green.
`npm run dev` → 500 error: scaffold app/src/app/page.jsx renders `<MintApp />` but never imports it. Fix: add the import → page 200. (FIXED upstream.)

### Station 1 — Fuel (learner, ~30 min across two networks)
Learner created MetaMask wallet (seed on paper; never shared with the agent).
Fuji faucet initially failed for the learner; they got OP Sepolia gas instead and asked to switch networks → we migrated the whole project to OP Sepolia (chainId 11155420) — it touched 7 files. Later the learner got Fuji AVAX → reverted everything to Fuji via git checkout of the network files. Lesson: keep network config isolated so testnet swaps are one-file changes. (FIXED upstream: single-file chain config + documented switch recipe in docs/02.)

### Station 2 — Speckit (~10 min, agent-executed)
Learner delegated creative decisions to the agent ("ลุย" = go for it), so the agent wrote the specs. This breaks the workshop's "the learner answers the open questions" rule. (FIXED upstream: hard gate — ≥3 learner-typed answers before the agent may write a spec; otherwise the spec is labelled DRAFT-PROPOSED-BY-AGENT.)

### Station 3 — Deploy (~40 min, several scaffold bugs)
Deploy to Fuji surfaced three scaffold bugs in a row:
1. DeployMyNFT.s.sol used console.log without importing forge-std's console → compile error. (FIXED upstream.)
2. Burner key handling: first burner's key never written to .env (temp-file parsing), later recovered from the transcript after the learner funded it.
3. Foundry did not auto-load a custom DEPLOYER_KEY var — forge script ran with Foundry's default sender and aborted. Fix used then: pass --private-key explicitly. (FIXED upstream properly: script now does vm.startBroadcast(vm.envUint("DEPLOYER_KEY")) so the .env key is used with no shell plumbing.)
Also: foundry.toml's fuji = "${FUJI_RPC_URL}" required the env var at deploy time. (FIXED upstream: ${FUJI_RPC_URL:default} fallback.)
Success: ONCHAIN EXECUTION COMPLETE; verified on-chain with cast call name() → "Peak Pioneers".

### Station 4 — Proof / Minting
Learner balance check via scripts/check-balance.mjs (worked; harmless Node-on-Windows libuv assertion at exit — (FIXED upstream: exitCode instead of process.exit)).
Learner minted from localhost:3000 → token #1; imported into MetaMask via Import NFT.

### Station 5 — Production + metadata (post-workshop extension, ~50 min)
Goal: real web deployment + NFT images.
- Next.js static export: output: "export" + images unoptimized. (Now in the scaffold.)
- Cloudflare Workers deploy (free, no R2 — R2 activation needs a card): npx wrangler login (OAuth can time out — click Allow fast); wrangler.toml name="mint", [assets] directory="./out"; workers.dev subdomain must be registered on first deploy (API field is subdomain; `wrangler subdomain` is gone in v4); worker renamed to "mint" for a clean URL; ~60s TLS/DNS propagation after first deploy.
- Metadata: contract has owner-only setBaseTokenURI → no redeploy needed. cast send setBaseTokenURI "<base>". Bug found afterwards: tokenURI(1) = …/metadata/1 — no .json suffix; original 1.json 404'd for marketplaces. Fix: ship extensionless copies. (Now in the scaffold: metadata/N.json AND extensionless metadata/N.)
- Custom art: learner supplied a PNG; per-file gallery entries in MintApp.jsx.
- Live supply counter: getMintStats() (JsonRpcProvider, no wallet needed). (Now in the scaffold, plus a My NFTs section via ERC721Enumerable.)

## 3. Bugs found in the workshop scaffold (ALL NOW FIXED UPSTREAM)

| # | File | Bug | Fix in repo |
|---|---|---|---|
| 1 | app/src/app/page.jsx | `<MintApp />` used without import → 500 | import added |
| 2 | foundry/script/DeployMyNFT.s.sol | console.log without import → compile fail | `import {console} from "forge-std/console.sol";` |
| 3 | Deploy flow | DEPLOYER_KEY in .env never read by forge script | `vm.startBroadcast(vm.envUint("DEPLOYER_KEY"))` |
| 4 | foundry/foundry.toml | fuji = "${FUJI_RPC_URL}" undocumented requirement | `${FUJI_RPC_URL:<public default>}` |
| 5 | npm run setup | forge install --root fails (Windows/Git Bash) | script cds into foundry/ |
| 6 | Metadata hosting | tokenURI has no .json suffix | extensionless copies shipped |
| 7 | scripts/check-balance.mjs | Windows exit assertion (cosmetic) | process.exitCode instead of process.exit |

## 4. Commands that actually work (proven)

```bash
# PATH for foundry in Git Bash
export PATH="$PATH:/c/Users/<you>/.foundry/bin"

# Deploy (from foundry/) — DEPLOYER_KEY is auto-loaded from .env now
cd foundry && forge script script/DeployMyNFT.s.sol --rpc-url fuji --broadcast --slow

# Wire contract address → app/src/config.js, then:
cd app && npx next build && npx wrangler deploy     # static site → Workers

# Set metadata base (owner only)
cast send <CONTRACT> "setBaseTokenURI(string)" "https://<site>/metadata/" \
  --private-key "$PK" --rpc-url https://api.avax-test.network/ext/bc/C/rpc

# Sanity checks
cast call <CONTRACT> --rpc-url https://api.avax-test.network/ext/bc/C/rpc "tokenURI(uint256)(string)" 1
node scripts/check-balance.mjs 0xYourAddress
```

## 5. Lessons learned / what to improve

Workshop design:
- The agent shouldn't write the spec → hard gate added upstream.
- Faucet friction is the #1 dropout risk → 4 faucets listed up front + graceful one-file testnet-switch recipe (docs/02 appendix).
- Keep network config in ONE file → app/src/config.js is the single source; scripts import from it.
- Commit scaffold fixes upstream → this commit.
- .env/key teaching moment worked well — burner-wallet pattern held; the agent only ever saw addresses.
- R2 friction: Workers static assets are the better default for beginners; R2 stays an optional scale-up.
- Cloudflare gotchas pre-documented in docs/07-go-live.md.

Technical debt / known limitations:
- Metadata is mutable (files on Workers can change under minted tokens). Fine for a workshop; real projects should use IPFS/Arweave.
- Art #2/#3 still starter SVGs until the learner replaces them.
- Contract not source-verified on Snowtrace (needs a free SNOWTRACE_API_KEY) — documented in docs/07 §4.

## 6. Suggested next steps (prioritized)
1. ✅ Commit the local fixes upstream (this commit).
2. Verify the contract source on Snowtrace (forge verify-contract, free API key).
3. Replace art #2/#3 and rebuild/deploy.
4. ✅ "My NFTs" section (now in scaffold via ERC721Enumerable + getMyNfts()).
5. Optional hardening: IPFS pin metadata; withdraw() the mint proceeds as a teaching moment; teach pause()/unpause().
6. If R2 is ever activated: upload art + metadata, update setBaseTokenURI — one cast send, no redeploy.

## 7. Where everything lives
See the repo tree at README.md. Pilot artifacts (Peak Pioneers contract, site, metadata) live on the learner's machine and on Fuji — the contract address is in §1 above.
