# Spec: Wiring — connect the deployed contract

> Owner: <you> · Status: draft (fill after Deploy Station)

## 1. What it is
Replace the placeholder contract address in the app with MY deployed Fuji contract, so
the Mint button calls my contract for real.

## 2. What it looks like
No visual change (maybe my collection name shows in the header).

## 3. What it must do
- [ ] `app/src/config.js` contains my real deployed address `0x…`
- [ ] Collection name and symbol in `config.js` match my contract constructor values
- [ ] Minting from the page succeeds; tx hash links to Snowtrace
- [ ] After minting, my wallet's NFT tab shows token(s) from my contract

## 4. What to leave out
No NFT metadata hosting today (art shows as the fallback image in wallets — that's the
take-home mission). No contract changes: deployed contracts are immutable.

---

## Plan
File: `app/src/config.js` (one line). Then re-test the mint flow.

## Tasks
1. [ ] Paste deployed address into `config.js`
2. [ ] Refresh page, connect wallet, mint 1
3. [ ] Confirm tx on Snowtrace; token visible in wallet

## Verification
Tx hash on https://testnet.snowtrace.io with Status: Success, From: my address,
To: my contract.
