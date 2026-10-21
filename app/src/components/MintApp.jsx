"use client";

import { useState } from "react";
import {
  connectWallet,
  getChainId,
  switchToFuji,
  mint,
  shortAddress,
  FUJI_CHAIN_ID_DEC,
} from "../wallet.js";
import { CONTRACT_ADDRESS, COLLECTION_NAME, MINT_PRICE_AVAX, SNOWTRACE } from "../config.js";

export default function MintApp() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null); // { kind: 'ok'|'err', text, tx? }
  const [busy, setBusy] = useState(false);

  async function onConnect() {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      setChainId(await getChainId());
    } catch (e) {
      setStatus(errStatus(e));
    }
  }

  async function onSwitch() {
    try {
      await switchToFuji();
      setChainId(await getChainId());
    } catch (e) {
      setStatus(errStatus(e));
    }
  }

  async function onMint() {
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setStatus({
        kind: "err",
        text: "No contract yet — finish the Deploy Station (forge script), then put your address in src/config.js.",
      });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const txHash = await mint(address, qty);
      setStatus({
        kind: "ok",
        text: "Minted! 🎉 Your NFT is on Fuji. This is your on-chain receipt:",
        tx: txHash,
      });
    } catch (e) {
      setStatus(errStatus(e));
    } finally {
      setBusy(false);
    }
  }

  function errStatus(e) {
    const msg = String(e?.message || e);
    if (e?.message === "NO_WALLET" || /no ethereum/i.test(msg))
      return { kind: "err", text: "No wallet found. Install Core or MetaMask, then retry." };
    if (/reject|denied/i.test(msg))
      return { kind: "err", text: "You rejected the request in your wallet. Nothing happened — you can retry freely." };
    if (/funds|balance/i.test(msg))
      return { kind: "err", text: "Not enough gas. Grab free test AVAX from the faucet and retry." };
    if (/chain|network/i.test(msg))
      return { kind: "err", text: "Wrong network. Switch your wallet to Fuji (43113)." };
    return { kind: "err", text: `Something went wrong: ${msg.slice(0, 140)}` };
  }

  const wrongNetwork = address && chainId !== FUJI_CHAIN_ID_DEC;
  const total = (Number(MINT_PRICE_AVAX) * qty).toFixed(2);

  return (
    <main className="wrap">
      <header className="hero">
        <img className="banner" src="/art/hero.svg" alt={`${COLLECTION_NAME} banner`} />
        <div className="hero-bar">
          <h1>{COLLECTION_NAME}</h1>
          <button className="btn connect" onClick={address ? undefined : onConnect}>
            {address ? shortAddress(address) : "Connect Wallet"}
          </button>
        </div>
      </header>

      {wrongNetwork && (
        <div className="notice err">
          Your wallet is on the wrong network. This app only talks to Fuji (43113).
          <button className="btn small" onClick={onSwitch}>Switch to Fuji</button>
        </div>
      )}

      <section className="gallery">
        {["art1", "art2", "art3"].map((n) => (
          <figure className="card" key={n}>
            <img src={`/art/${n}.svg`} alt={`${COLLECTION_NAME} #${n.slice(-1)}`} />
            <figcaption>{n.replace("art", "No. 0")}</figcaption>
          </figure>
        ))}
      </section>

      <section className="mint">
        <label>
          Quantity
          <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <p className="total">Total: {total} test-AVAX</p>
        <button className="btn mint-btn" disabled={busy || !address || wrongNetwork} onClick={onMint}>
          {busy ? "Minting…" : address ? "Mint" : "Connect wallet first"}
        </button>
        {status && (
          <p className={status.kind === "ok" ? "notice ok" : "notice err"}>
            {status.text}
            {status.tx && (
              <>
                {" "}
                <a href={`${SNOWTRACE}/tx/${status.tx}`} target="_blank" rel="noreferrer">
                  View on Snowtrace ↗
                </a>
              </>
            )}
          </p>
        )}
      </section>

      <footer>
        Built in a 2-hour workshop · Fuji testnet (43113) · <a href={SNOWTRACE} target="_blank" rel="noreferrer">Snowtrace</a>
      </footer>
    </main>
  );
}
