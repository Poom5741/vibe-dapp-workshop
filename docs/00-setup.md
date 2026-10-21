# Per-OS prerequisites — the repo must work identically on Windows and macOS

## macOS

```bash
# Node.js ≥ 18 (skip if installed)
brew install node
# Foundry
curl -L https://foundry.paradigm.xyz | bash && foundryup
```

## Windows

Two supported paths — **native is now fine**, WSL2 is the fallback:

**Native (recommended for the workshop room):** PowerShell as administrator:
```powershell
# Node.js ≥ 18: winget install OpenJS.NodeJS.LTS
# Foundry (official Windows support):
irm https://foundry.paradigm.xyz | iex
foundryup
```
If `foundryup` isn't found after install, open a NEW PowerShell window (PATH refresh).

**WSL2 fallback:** `wsl --install` → Ubuntu → follow the macOS commands inside WSL.
Everything in this repo is plain Node + npm, so it runs identically there.

## Both (then, from the repo root)

```bash
npm install        # app dependencies
npm run setup      # foundry libs + app deps (one command)
npm run verify     # setup check — must be all green
npm test           # forge tests (7 passing)
npm run dev        # Next.js → http://localhost:3000
```

## Notes

- All repo tooling is Node ≥18 + npm scripts: no bash/printf/sed anywhere in the learner
  path, so PowerShell, cmd, and zsh all work the same.
- `npm run balance -- 0xYourAddress` checks a faucet drip landed.
- Deployment (`npm run deploy`) needs `foundry/.env` with the BURNER key (docs/05 §0).
