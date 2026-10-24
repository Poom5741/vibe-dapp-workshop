// Fuji gas faucet — one page + one API, no framework.
// GET  /            → the faucet page (Turnstile captcha)
// GET  /api/status  → faucet address, balance, drip amount (public info)
// POST /api/drip    → { address, token } → captcha check → KV cooldown → send 0.1 AVAX
//
// Secrets (never in this file, never logged): FAUCET_PRIVATE_KEY, TURNSTILE_SECRET.
// They live in faucet/.dev.vars locally and Workers secrets in production.

import { ethers } from "ethers";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const isAddress = (a) => typeof a === "string" && /^0x[0-9a-fA-F]{40}$/.test(a);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/") return page(env);
      if (request.method === "GET" && url.pathname === "/api/status") return status(env);
      if (request.method === "POST" && url.pathname === "/api/drip") return drip(request, env);
      return json({ error: "Not found" }, 404);
    } catch (err) {
      console.error("unhandled", err && err.message);
      return json({ error: "Faucet error — try again in a moment." }, 500);
    }
  },
};

// ---------------------------------------------------------------- status ----

async function provider(env) {
  // Static network: skips a network-detection round trip on every call.
  return new ethers.JsonRpcProvider(env.RPC_URL, Number(env.CHAIN_ID));
}

async function status(env) {
  const rpc = await provider(env);
  const balance = await rpc.getBalance(env.FAUCET_ADDRESS);
  return json({
    address: env.FAUCET_ADDRESS,
    balanceAvax: ethers.formatEther(balance),
    dripAmount: env.DRIP_AMOUNT,
    cooldownHours: Number(env.COOLDOWN_HOURS),
    chainId: Number(env.CHAIN_ID),
    testMode: String(env.TURNSTILE_SITE_KEY).startsWith("1x"),
  });
}

// ------------------------------------------------------------------ drip ----

async function drip(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send JSON: { address, token }" }, 400);
  }
  const { address, token } = body || {};
  if (!isAddress(address)) return json({ error: "That doesn't look like a wallet address (0x + 40 hex chars)." }, 400);
  if (!token) return json({ error: "Please complete the captcha first." }, 400);
  if (!env.FAUCET_PRIVATE_KEY) return json({ error: "Faucet wallet not configured (FAUCET_PRIVATE_KEY secret missing)." }, 500);
  if (!env.RATE_LIMIT) return json({ error: "KV namespace RATE_LIMIT not configured." }, 500);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  // 1) Captcha — server-side verification against Turnstile siteverify.
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const verify = await verifyRes.json().catch(() => ({ success: false }));
  if (!verify.success) return json({ error: "Captcha failed — please retry the box and send again." }, 403);

  // 2) Cooldowns — one drip per address per COOLDOWN_HOURS, plus an IP daily cap.
  const now = Math.floor(Date.now() / 1000);
  const cooldownSeconds = Number(env.COOLDOWN_HOURS) * 3600;
  const addrKey = `addr:${address.toLowerCase()}`;
  const lastDrip = await env.RATE_LIMIT.get(addrKey);
  if (lastDrip) {
    const hoursLeft = Math.ceil((Number(lastDrip) + cooldownSeconds - now) / 3600);
    return json({ error: `This wallet already received gas. Try again in ~${hoursLeft}h.` }, 429);
  }
  const day = new Date().toISOString().slice(0, 10);
  const ipKey = `ip:${ip}:${day}`;
  const ipUsed = Number((await env.RATE_LIMIT.get(ipKey)) || 0);
  if (ipUsed >= Number(env.IP_DAILY_CAP)) {
    return json({ error: `Too many requests from this network today (cap: ${env.IP_DAILY_CAP}/day).` }, 429);
  }

  // 3) Send — 0.1 AVAX from the faucet burner to the requester.
  const rpc = await provider(env);
  const wallet = new ethers.Wallet(env.FAUCET_PRIVATE_KEY, rpc);
  const value = ethers.parseEther(String(env.DRIP_AMOUNT));
  const balance = await rpc.getBalance(wallet.address);
  if (balance < value) {
    return json({ error: `Faucet is empty (balance ${ethers.formatEther(balance)} AVAX) — the instructor needs to top it up.` }, 503);
  }

  let tx;
  try {
    tx = await wallet.sendTransaction({ to: address, value });
  } catch (err) {
    const msg = String(err && err.message);
    if (/insufficient funds/i.test(msg)) {
      return json({ error: "Faucet ran out of gas mid-flight — ask the instructor to top it up." }, 503);
    }
    console.error("send failed:", msg);
    return json({ error: "The Avalanche RPC rejected the transaction — try again shortly." }, 502);
  }

  // 4) Record usage only after a successful broadcast.
  await env.RATE_LIMIT.put(addrKey, String(now), { expirationTtl: cooldownSeconds });
  await env.RATE_LIMIT.put(ipKey, String(ipUsed + 1), { expirationTtl: 90000 });

  return json({
    txHash: tx.hash,
    explorer: `${env.EXPLORER_TX}${tx.hash}`,
    amount: env.DRIP_AMOUNT,
    note: "Broadcast — allow ~2–5 seconds to land on Fuji.",
  });
}

// ------------------------------------------------------------------- page ----

function page(env) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fuji Faucet — Vibe dApp Workshop</title>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>
  :root { --red:#e84142; --bg:#16121a; --card:#211b28; --line:#372c42; --text:#f4f1f7; --dim:#a99db8; }
  * { box-sizing:border-box; margin:0; }
  body { font:16px/1.5 system-ui,sans-serif; background:var(--bg); color:var(--text);
         min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:16px;
          max-width:430px; width:100%; padding:32px 28px; }
  h1 { font-size:22px; margin-bottom:4px; }
  h1 span { color:var(--red); }
  .sub { color:var(--dim); font-size:14px; margin-bottom:20px; }
  .chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
  .chip { font-size:12.5px; background:#2b2236; border:1px solid var(--line);
          border-radius:999px; padding:5px 12px; color:var(--dim); }
  .chip b { color:var(--text); font-weight:600; }
  label { font-size:13px; color:var(--dim); display:block; margin-bottom:6px; }
  input { width:100%; background:#171221; border:1px solid var(--line); color:var(--text);
          border-radius:10px; padding:12px 14px; font-size:15px; font-family:ui-monospace,monospace; }
  input:focus { outline:none; border-color:var(--red); }
  .captcha { margin:16px 0; }
  button { width:100%; background:var(--red); color:#fff; border:none; border-radius:10px;
           padding:13px; font-size:15.5px; font-weight:600; cursor:pointer; margin-top:16px; }
  button:hover { filter:brightness(1.1); }
  button:disabled { opacity:.55; cursor:wait; }
  #msg { margin-top:14px; font-size:14px; min-height:20px; word-break:break-word; }
  #msg.err { color:#ff8a8d; } #msg.ok { color:#7ee2a8; } #msg.busy { color:var(--dim); }
  #msg a { color:#ffb3b4; }
  footer { margin-top:18px; font-size:12px; color:var(--dim); text-align:center; }
</style>
</head>
<body>
<main class="card">
  <h1>🍉 Fuji <span>Gas Faucet</span></h1>
  <p class="sub">Free testnet AVAX for the <b>Vibe Code Your First dApp</b> workshop.</p>
  <div class="chips">
    <span class="chip">Drip <b id="amount">…</b></span>
    <span class="chip">Every <b id="cooldown">…</b>/wallet</span>
    <span class="chip">Faucet balance <b id="balance">…</b></span>
  </div>
  <label for="addr">Your Fuji wallet address</label>
  <input id="addr" placeholder="0x…" autocomplete="off" spellcheck="false">
  <div class="captcha"><div class="cf-turnstile" data-sitekey="${env.TURNSTILE_SITE_KEY}"></div></div>
  <button id="go">Send me test AVAX</button>
  <div id="msg"></div>
  <footer>Avalanche Fuji testnet · chainId 43113 · faucet <span id="faucetAddr">…</span></footer>
</main>
<script>
  const $ = (id) => document.getElementById(id);
  const msgBox = $("msg");
  const say = (text, cls) => { msgBox.className = cls || ""; msgBox.innerHTML = text; };

  fetch("/api/status").then(r => r.json()).then(s => {
    $("amount").textContent = s.dripAmount + " AVAX";
    $("cooldown").textContent = s.cooldownHours + "h";
    $("balance").textContent = Number(s.balanceAvax).toFixed(3) + " AVAX";
    $("faucetAddr").textContent = s.address;
    if (s.testMode) say("⚠️ Test captcha mode — anyone can pass it. Instructor swaps real Turnstile keys at deploy.", "");
  }).catch(() => say("Faucet status unavailable — is the worker running?", "err"));

  $("go").addEventListener("click", async () => {
    const address = $("addr").value.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return say("Enter a valid address (0x + 40 hex characters).", "err");
    const token = window.turnstile && turnstile.getResponse();
    if (!token) return say("Please complete the captcha box first.", "err");

    $("go").disabled = true;
    say("Requesting gas…", "busy");
    try {
      const res = await fetch("/api/drip", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        say(data.error || "Something went wrong.", "err");
      } else {
        say(\`✅ Sent \${data.amount} AVAX — <a href="\${data.explorer}" target="_blank" rel="noopener">view transaction</a> (\${data.note})\`, "ok");
      }
    } catch {
      say("Network error — check your connection and retry.", "err");
    } finally {
      $("go").disabled = false;
      if (window.turnstile) turnstile.reset();
    }
  });
</script>
</body>
</html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
