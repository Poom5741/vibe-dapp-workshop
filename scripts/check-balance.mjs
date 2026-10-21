#!/usr/bin/env node
/**
 * Check a Fuji address balance via plain JSON-RPC — no deps.
 *   node scripts/check-balance.mjs 0xYourAddress     (or: npm run balance -- 0x…)
 * Reads the chain config from app/src/config.js — the repo's ONE network file.
 */
import { FUJI_RPC, SNOWTRACE } from "../app/src/config.js";

const addr = process.argv[2];
if (!addr || !/^0x[0-9a-fA-F]{40}$/.test(addr)) {
  console.error("Usage: node scripts/check-balance.mjs 0xYourAddress");
  process.exitCode = 1;
} else {
  await check();
}

async function check() {
  const rpc = process.env.FUJI_RPC_URL || FUJI_RPC;
  async function rpcCall(method, params) {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
  }

  try {
    const chainId = parseInt(await rpcCall("eth_chainId", []), 16);
    const wei = BigInt(await rpcCall("eth_getBalance", [addr, "latest"]));
    const avax = Number(wei / 10n ** 12n) / 1e6;
    const network = chainId === 43113 ? "Fuji (43113)" : `chainId ${chainId} — NOT Fuji!`;
    console.log(`Network : ${network}`);
    console.log(`Address : ${addr}`);
    console.log(`Balance : ${avax} AVAX ${avax > 0 ? "✅" : "(empty — hit the faucet)"}`);
    console.log(`Explorer: ${SNOWTRACE}/address/${addr}`);
    if (wei === 0n) process.exitCode = 2;
  } catch (e) {
    console.error("RPC error:", e.message);
    process.exitCode = 1;
  }
}
