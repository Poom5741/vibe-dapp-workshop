#!/usr/bin/env node
/**
 * Check a Fuji (or any EVM) address balance via plain JSON-RPC — no deps.
 *   node scripts/check-balance.mjs 0xYourAddress
 * Useful after the faucet: "did it land?"
 */
const addr = process.argv[2];
if (!addr || !/^0x[0-9a-fA-F]{40}$/.test(addr)) {
  console.error("Usage: node scripts/check-balance.mjs 0xYourAddress");
  process.exit(1);
}

const RPC = process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";

async function rpc(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

try {
  const chainId = parseInt(await rpc("eth_chainId", []), 16);
  const wei = BigInt(await rpc("eth_getBalance", [addr, "latest"]));
  const avax = Number(wei / 10n ** 12n) / 1e6;
  const network = chainId === 43113 ? "Fuji (43113)" : `chainId ${chainId} — NOT Fuji!`;
  console.log(`Network : ${network}`);
  console.log(`Address : ${addr}`);
  console.log(`Balance : ${avax} AVAX ${avax > 0 ? "✅" : "(empty — hit the faucet)"}`);
  console.log(`Explorer: https://testnet.snowtrace.io/address/${addr}`);
  process.exit(avax > 0n ? 0 : 2);
} catch (e) {
  console.error("RPC error:", e.message);
  process.exit(1);
}
