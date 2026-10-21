#!/usr/bin/env node
/**
 * Workshop setup verification. Run from the repo root:
 *   node scripts/verify-setup.mjs
 * Green checklist = the room starts from a known-good state.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
let failures = 0;

function check(label, ok, hint = "") {
  console.log(`${ok ? "✅" : "❌"} ${label}${ok || !hint ? "" : `\n   → ${hint}`}`);
  if (!ok) failures++;
}

function commandExists(cmd) {
  const res = spawnSync(cmd, ["--version"], { shell: process.platform === "win32" });
  return res.status === 0;
}

console.log("\n🏔️  vibe-dapp-workshop — setup check\n");

// Toolchain
const [major] = process.versions.node.split(".").map(Number);
check("Node.js ≥ 18", major >= 18,
  `You have ${process.versions.node}. Install Node 18+: macOS "brew install node", Windows "winget install OpenJS.NodeJS.LTS".`);
const hasForge = commandExists("forge");
check("Foundry (forge) on PATH", hasForge,
  process.platform === "win32"
    ? "PowerShell: irm https://foundry.paradigm.xyz | iex  then  foundryup (open a NEW window after). WSL2 also works — see docs/00-setup.md."
    : 'Run: curl -L https://foundry.paradigm.xyz | bash && foundryup  (then open a new terminal)');

check("Repo layout", existsSync(join(root, "AGENTS.md")) && existsSync(join(root, "speckit/README.md")),
  "Run this from the repo root (the folder containing AGENTS.md).");

// App
const app = join(root, "app");
check("Next.js app present", existsSync(join(app, "package.json")) && existsSync(join(app, "src/app/page.jsx")));
check("Dependencies installed", existsSync(join(app, "node_modules")),
  "Run: npm install   (installs app/ dependencies)");
if (existsSync(join(app, "node_modules"))) {
  try {
    const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
    check("package.json scripts (dev/build)", pkg.scripts?.dev && pkg.scripts?.build);
  } catch { check("package.json parses", false, "app/package.json is not valid JSON."); }
}

// Art (fallback pack must exist; learners replace these)
const art = join(app, "public/art");
const artOk = existsSync(art) &&
  ["hero.svg", "art1.svg", "art2.svg", "art3.svg"].every((f) => existsSync(join(art, f)));
check("Starter art pack (4 files in app/public/art)", artOk,
  "Restore from git: git checkout app/public/art");

// Learner art (soft check — Gate 2 of the workshop)
const learnerArt = existsSync(art) ? readdirSync(art).filter((f) => /^art\d+\.(png|jpg|jpeg|svg)$|^hero\.(png|jpg|jpeg|svg)$/.test(f)) : [];
check("Learner art present", learnerArt.length > 0, "None found — that's fine before the Art station; after it, save your images into app/public/art/.");

// Config placeholder state
const cfgPath = join(app, "src/config.js");
if (existsSync(cfgPath)) {
  const cfg = readFileSync(cfgPath, "utf8");
  const placeholder = cfg.includes("0x0000000000000000000000000000000000000000");
  console.log(placeholder
    ? "⏳ CONTRACT_ADDRESS is still the placeholder — normal until the Deploy station."
    : "✅ CONTRACT_ADDRESS is set (post-Deploy).");
} else {
  check("app/src/config.js", false, "Missing — restore from git.");
}

// Foundry
const fd = join(root, "foundry");
check("Foundry project present", existsSync(join(fd, "foundry.toml")) && existsSync(join(fd, "src/MyNFT.sol")));
check("Foundry deps (lib/)", existsSync(join(fd, "lib/forge-std")) && existsSync(join(fd, "lib/openzeppelin-contracts")),
  "Run: npm run setup   (or: cd foundry && forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts --no-commit)");

// Secrets guard
const envPath = join(fd, ".env");
if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  const key = env.match(/DEPLOYER_KEY\s*=\s*(\S+)/)?.[1] ?? "";
  const looksReal = /^0x[0-9a-fA-F]{64}$/.test(key) && !/^0x0+$/.test(key);
  check("foundry/.env uses a BURNER key (never your main wallet)", !looksReal || !env.includes(process.env.MAIN_HINT ?? "\u0000"),
    "Only ever put a fresh testnet-only burner key here. Never your main wallet's seed/key.");
  console.log("ℹ️  foundry/.env exists — keep it out of git (already gitignored).");
}

console.log(failures === 0
  ? "\n🎉 All green. You're ready for the workshop.\n"
  : `\n⚠️  ${failures} item(s) to fix — follow the hints above, then re-run.\n`);
process.exit(failures === 0 ? 0 : 1);
