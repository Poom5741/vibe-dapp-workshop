# Spec: Build Station — the NFT mint page

> Owner: <you> · Status: prefilled starter — make it YOURS by editing §2 and §3

## 1. What it is
A single-page NFT mint site for my collection, served at localhost:5173 by the Vite app
in `app/`.

## 2. What it looks like
<!-- EDIT THIS to your taste — this is the part that makes it yours -->
Dark theme, neon purple (#8A2BE2) and red (#E5484D) accents, Avalanche vibes.
Hero banner (16:9) at top, three artwork cards (1:1) in a row, quantity selector and
mint button below. Works on a phone-width screen.

## 3. What it must do
- [ ] Show my images from `public/art/`: `hero.png`, `art1.png`, `art2.png`, `art3.png`
  (fallback: the repo's starter art with the same names)
- [ ] "Connect Wallet" button → opens my wallet extension (injected provider)
- [ ] If wallet is on the wrong network → show "Switch to Fuji" button that switches (43113)
- [ ] Quantity selector 1–5; total price = qty × 0.01 AVAX shown before minting
- [ ] "Mint" button → calls `mint()` on the contract at `CONTRACT_ADDRESS` via ethers v6
- [ ] After minting → show the tx hash as a link to Snowtrace
- [ ] Friendly errors: "user rejected", "insufficient funds", "wrong network"

## 4. What to leave out
- `CONTRACT_ADDRESS` stays `0x0000000000000000000000000000000000000000` in
  `app/src/config.js` until Deploy Station.
- No backend, no database, no image uploads, no metadata hosting today.
- No login/signup of any kind.

---

## Plan
Files: `app/src/App.jsx`, `app/src/wallet.js`, `app/src/config.js`, `app/src/App.css`
Libraries: react, ethers v6 (already in package.json)
Order: config → wallet helpers → UI sections → mint flow → error messages

## Tasks
1. [ ] `npm install && npm run dev` — page loads at localhost:5173 with starter art
2. [ ] Connect Wallet works; address shows when connected
3. [ ] Wrong-network guard + switch button
4. [ ] Quantity + total price display
5. [ ] Mint flow with tx-hash link (works after Deploy Station fills the address)
6. [ ] My art replaces the starter art (same filenames, same folder)

## Verification
Open localhost:5173 in a browser with the wallet installed: art visible, button opens
wallet, switching networks works, mint shows a Snowtrace link after Deploy Station.
