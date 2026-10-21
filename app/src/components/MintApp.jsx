"use client";

import { useEffect, useState } from "react";
import {
  connectWallet,
  getChainId,
  switchToFuji,
  mint,
  getMintStats,
  getMyNfts,
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
  const [stats, setStats] = useState(null); // { minted, max }
  const [myNfts, setMyNfts] = useState([]);

  const hasContract = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  async function refreshStats() {
    if (!hasContract) return;
    try {
      setStats(await getMintStats());
    } catch {
      /* contract not wired yet */
    }
  }

  async function refreshMyNfts(addr) {
    if (!hasContract || !addr) return;
    try {
      setMyNfts(await getMyNfts(addr));
    } catch {
      /* read-only failures are non-fatal */
    }
  }

  useEffect(() => {
    refreshStats();
  }, []);

  async function onConnect() {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      setChainId(await getChainId());
      refreshMyNfts(addr);
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
    if (!hasContract) {
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
      refreshStats();
      refreshMyNfts(address);
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
          <div>
            <h1>{COLLECTION_NAME}</h1>
            {stats && (
              <p className="counter">
                Minted {stats.minted} / {stats.max}
              </p>
            )}
          </div>
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

      {myNfts.length > 0 && (
        <section className="gallery">
          <h2 className="section-title">My NFTs</h2>
          <div className="my-grid">
            {myNfts.map((nft) => (
              <figure className="card" key={nft.id}>
                {nft.image ? (
                  <img src={nft.image} alt={`Token #${nft.id}`} />
                ) : (
                  <div className="placeholder">#{nft.id} · metadata pending</div>
                )}
                <figcaption>
                  <a href={`${SNOWTRACE}/token/${CONTRACT_ADDRESS}?a=${nft.id}`} target="_blank" rel="noreferrer">
                    Token #{nft.id} ↗
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

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
