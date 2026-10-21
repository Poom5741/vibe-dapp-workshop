---
description: Implement the tasks, verifying each against the real result
---

# speckit.implement

Read the active spec (plan + tasks must exist; if they don't, run the earlier phases).

## Steps

1. Work through tasks in order. After EACH task: tick the checkbox in the spec file and
   tell the student what to look at to verify it themselves (URL, button, screen region).
2. One task = one change set. Never bundle two unrelated changes.
3. Narrate each file you create or edit in ONE sentence a non-programmer understands.
4. If a task fails or looks wrong, do not silently retry: show the student the real
   error/result and propose the smallest fix. Iterate reflex: change only what's named.
5. Finish by re-running `node scripts/verify-setup.mjs` (from the repo root) if the change
   touched config/art/setup, and asking the student to tick the spec's Verification items.
6. Never commit or push anything today, and never touch anything outside the repo without
   explicit approval.
