# Requirements Brief R2 — The Mint dApp
> From: your facilitator (acting as the client) · For: the Build station
> YOUR job: turn this into a spec your agent can build from (speckit.specify)

## The client wants

A single-page NFT mint site for MY collection (see my art spec), running on
http://localhost:3000 from the Next.js app in `app/`.

**Must be true when we're done (acceptance criteria):**
- [ ] My images show on the page (banner + 3 artworks), not the starter art
- [ ] "Connect Wallet" opens my wallet and shows my address when connected
- [ ] The app refuses any network except Fuji (43113) and offers a switch button
- [ ] I can pick quantity 1–5 and see the total price before minting
- [ ] Mint calls MY contract via ethers v6; after minting I see the tx hash linked to Snowtrace
- [ ] Friendly error messages for: rejected in wallet, insufficient funds, wrong network
- [ ] Usable at phone width

## Non-negotiables (the repo constitution — speckit/constitution.md)

- `CONTRACT_ADDRESS` stays the placeholder in `app/src/config.js` until Deploy station.
- No backend, no logins, no publishing. Fuji only.

## Open questions — the client will NOT decide these for you

- Layout: where do banner, cards, and mint controls sit? What's above the fold?
- Copy: headline, subtext, button labels — in YOUR words.
- The look beyond "dark + my palette": spacing, borders, motion?

→ Your answers become `speckit/specs/build-spec.md`. The starter code in `app/` is raw
material, not the verdict — your spec may change anything EXCEPT the acceptance criteria.
