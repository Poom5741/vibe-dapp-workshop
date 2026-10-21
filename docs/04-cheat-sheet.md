# Station 3+4 — Art & Build Cheat Card (print one per student)

## A — Art station (0:35–0:50) · image agent

Deliverables: 3 artworks (1:1) + 1 banner (16:9), saved into `app/public/art/`.
The starter files there are `hero.svg`, `art1.svg`… — save yours with the SAME base names
(`art1.png`, `hero.png`, …) and tell your agent "point the page at my .png files."

**A1 — identity prompt**
> Give me 10 name ideas for an NFT collection about ___. Pick your favorite and say why,
> then write a one-line tagline for it.

**A2 — artwork prompt (reuse the SAME style sentence ×3 = consistency)**
> Generate a 1:1 artwork: [subject]. Style: cyberpunk retro-futurist. Palette: neon purple
> and red on near-black. Bold silhouette, centered composition.

**A3 — banner prompt**
> Generate a 16:9 hero banner for "[collection name]": same style and palette, wide scene,
> space for a title on the left.

**A4 — iterate reflex**
> Same image, change ONLY [x]: e.g. "make the background darker; keep everything else."

## B — Build station (0:50–1:20) · coding agent, `cd app && npm run dev` → localhost:3000

**B1 — start from the spec**
> Read AGENTS.md and speckit/station-specs/build-spec.md. Run speckit: update §2 (the look)
> and §3 (behaviors) to match MY collection: "<name> — <tagline>". Then plan → tasks →
> implement. After each task tell me what to check on the page.

**B2 — precise feedback (the pattern)**
> The hero image is stretched and the mint button is below the fold on my phone width.
> Change only those two things.

**B3 — explain like a tutor (reading is free)**
> Explain what app/src/components/MintApp.jsx does in one paragraph, like I'm not a programmer.

**B4 — what "Connect Wallet" means** (read with the agent)
> `connectWallet()` asks the injected wallet for your address; `FUJI_CHAIN_ID_DEC = 43113`
> is why the app refuses other networks; `CONTRACT_ADDRESS` in `src/config.js` is the
> contract's phone number — a placeholder until Deploy station.

**B5 — after deploy: wire it**
> My deployed contract is 0x… . Put it in app/src/config.js and set the collection
> name/symbol to match what I deployed. Then run speckit/station-specs/wiring-spec.md.

**B6 — recovery (falling back is normal)**
> Something's broken. Reset the app to the starter state: `git checkout app/` then
> `npm install && npm run dev`, and re-apply only my config/art changes.

## Error decoder (Proof station)

| Message | Meaning | Fix |
|---------|---------|-----|
| Wrong network | app refuses non-Fuji chains | click "Switch to Fuji" |
| User rejected | you cancelled in the wallet | nothing happened; retry freely |
| Insufficient funds | out of gas | faucet again (docs/02) |
