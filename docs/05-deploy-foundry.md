# Station 5 — Deploy: Foundry → Fuji (1:20–1:45)

**Gate to pass:** a deployed contract `0x…` address on Fuji.
Foundry compiles, tests, and deploys your contract. (No Foundry installed? Remix fallback
at the bottom — same contract file, injected wallet, zero tooling.)

## 0. The two-wallet rule (say it out loud)

- **Main wallet** (Station 1): seed phrase on paper, NEVER in a file. Holds your gas.
- **Burner wallet**: create a FRESH account in Core/MetaMask, fund it with a little test
  AVAX, export ITS private key into `foundry/.env`. Testnet only, disposable. This is the
  pro pattern for automation — a key in a file must never be able to hurt you.

## 1. Install & build (5 min, helpers circulate)

One-time tool install per OS is in **docs/00-setup.md** (macOS: curl+foundryup;
Windows PowerShell: `irm https://foundry.paradigm.xyz | iex` then `foundryup`).

```bash
npm run setup        # foundry libs + app deps (from repo root)
cp foundry/.env.example foundry/.env   # PowerShell: Copy-Item foundry/.env.example foundry/.env
npm test             # compile + run the 7 tests
```

Compilation = human-readable Solidity → machine bytecode. The ABI (the contract's "menu"
of callable functions) is generated too.

## 2. Test before you deploy (3 min) — the professional habit

```bash
forge test -vv
```

Seven tests run against a simulated chain: minting, wrong payment, quantity limits, sold
out, pause. **Tests are the read-before-deploy ritual made executable.** Read
`foundry/test/MyNFT.t.sol` for 60 seconds — every `test_RevertWhen_*` is a rule YOU chose.

## 3. Deploy (5 min, all together)

```bash
npm run deploy       # from the repo root — or, from foundry/:
forge script script/DeployMyNFT.s.sol --rpc-url fuji --broadcast --slow
```

What just happened: the deploy is itself a **transaction** — the bytecode went on-chain,
the constructor ran once (name/symbol), and the contract got its own `0x…` address. The
gas popup's meaning is real: thousands of computers executed and stored your will.

The script prints:
```
=== DEPLOYED ===
Contract address (put this in app/src/config.js):
0x…
```
**This is the day's most important string.** Copy it. Also visible on Snowtrace.

## 4. Verify (optional, 2 min)

```bash
forge verify-contract <0xYourContract> src/MyNFT.sol:MyNFT --chain-id 43113
# needs SNOWTRACE_API_KEY in .env (free at snowtrace.io)
```

## 5. Immutability, out loud

If I deploy it, can I edit it? **No — that's the entire point.** Fixing means deploying a
new version. (Today taught safely on testnet.)

## Remix fallback (no tooling / Foundry broken)

1. https://remix.ethereum.org → new file `MyNFT.sol` → paste `foundry/src/MyNFT.sol`
   (swap the two imports for `import "@openzeppelin/contracts/token/ERC721/ERC721.sol";`
   and `import "@openzeppelin/contracts/access/Ownable.sol";` — Remix fetches them)
2. Compile (0.8.x) → Deploy & Run → Environment: **Injected Provider** → confirm wallet
   is on **Fuji** → Deploy → confirm in wallet.
3. Same rule, same address ritual.

## Success check

`node scripts/check-balance.mjs` won't help here — check **https://testnet.snowtrace.io/address/0xYourContract**
instead: creation tx, code, and soon your tokens.
