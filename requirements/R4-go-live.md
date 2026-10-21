# Requirements Brief R4 — Go Live (extension / take-home)
> From: your facilitator · For: after the 2 hours — real URL + art in wallets
> YOUR job: spec it first (speckit.specify from this brief), then build (docs/07-go-live.md)

## The client wants

My collection out of localhost and visible to the world:
- The mint site at a real HTTPS URL (my own workers.dev subdomain)
- MY art showing inside wallets and on Snowtrace — not a gray placeholder
- Token pages that look finished (verified source if possible)

**Acceptance criteria:**
- [ ] `next build` produces app/out; `wrangler deploy` serves it at my URL
- [ ] `tokenURI(1)` returns a URL that fetches my metadata (remember: no `.json` suffix)
- [ ] `setBaseTokenURI` points at my live `/metadata/` folder — one `cast send`, no redeploy
- [ ] My custom art is in metadata; importing the token into MetaMask shows MY image
- [ ] The page shows "Minted X / 100" and a **My NFTs** section with the connected wallet's tokens
- [ ] I can explain why workshop-grade metadata is mutable and what IPFS would change

## Open questions — yours to answer

- Your workers.dev subdomain name (it becomes your brand URL)
- Metadata descriptions: what story does each token tell?
- Art for #2 and #3 (only #1-style custom art is required to start)
- Stretch: verified source on Snowtrace (free SNOWTRACE_API_KEY)?

→ Your answers become `speckit/specs/golive-spec.md`. Then follow `docs/07-go-live.md`.
