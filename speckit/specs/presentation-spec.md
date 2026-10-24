# Spec: presentation — Vibe Code Your First dApp

> Owner: workshop presenter · Date: 2026-10-24 · Status: built and verified; content and visual direction approved

## 1. What it is

An animated, multi-slide HTML deck for live teaching. The presenter supplied the three content parts and approved the expanded outline before requesting implementation, commit and push.

Presenter-provided decisions:
1. Audience: “nontech who may coding or not coding but interest to learn.”
2. Story: ETHGlobal 2024 with ChatGPT/Grok chat, Claude Code during the Arise internship, then a family-company project worth millions of THB with 100% AI-agent coding.
3. Curriculum: Web3 fundamentals, proof of stake, Avalanche, wallet logic and MetaMask; build this repository's dApp and explain ERC/20/721.
4. Format and delivery: animated HTML presentation, saved by committing and pushing to this repo.

## 2. What it looks like

Speaker-led, fixed 1920×1080 slides, scaled to the screen, with large type and progressive diagrams. The presenter selected “B — Playful color blocks”: BlockFrame with heavy borders, hard shadows, Inter and Space Grotesk, and pink/blue/green/yellow/cream surfaces. English follows the approved discussion. Suggested 20/25/65-minute sections plus 10 minutes of buffer.

## 3. What it must do

- [x] A multi-slide HTML presentation opens locally without an application build.
- [x] The three agreed parts are present in the agreed order.
- [x] Animation explains processes and supports live teaching.
- [x] Keyboard navigation, slide selection, presenter notes and reduced motion work.
- [x] The workshop instructions match this repository and target Fuji only (43113).
- [x] Personal anecdotes contain only facts supplied by the presenter.
- [ ] The deliverable is committed and pushed to this repository.

## 4. What to leave out / placeholders

No invented personal anecdotes, private company details or precise budget; no wallet connection, real transaction, app change or deployment. No automatic website publishing. No specific ADE product tutorial. No claim that green tests are a security audit. Use repository fallback art for the conceptual product slide.

## Plan

Files: `presentation/slides.json` (content and notes), presentation runtime/styles/build script, generated `presentation/index.html`, usage guide, fonts and licenses; link the deck from the root README. Libraries: no runtime dependencies; embed Inter and Space Grotesk and existing art. Keep installed skills and local ADE state out of the presentation commit.

Order: record requirements; select a visual direction; compile content and interactions into HTML; verify desktop/mobile layout and controls; commit only deliverable files and push the existing branch.

## Tasks

1. [x] Record the agreed content and inspect the repository.
2. [x] Prepare three real title-slide previews.
3. [x] Draft slides, notes and supporting sources.
4. [x] Apply the selected design and build the standalone deck.
5. [x] Verify browser behavior and correct layout issues.
6. [ ] Commit and push the presentation.

## Verification

### Approved revision: conversation-led build section

The presenter requested that learners work through requirements and speckit with their AI, rather than follow manual commands such as `npm test`. Revise slides 31–41 into phase prompts and acceptance checkpoints, with facilitator talking points for independent work time. Preserve the selected design, the first two sections, the 44-slide count and the test-before-deployment safety gate. The agent performs technical checks; the learner verifies the actual result against their spec. Rebuild, check the changed slide layouts, then commit and push under the existing delivery authorization.

Check all slide bounds at 1280×720 and a phone viewport; inspect representative screenshots; verify reveals, reverse navigation, slide selection, hash links, notes, fullscreen, editing/export and reduced motion. Check the generated HTML has no required network assets and no wallet integration. Confirm the remote branch contains the resulting commit.

Verified: 44 slides; no text overflow or major-block overlap detected in the browser audit; all slides visually inspected in contact sheets. Browser checks passed for reveal/reverse navigation, first/last boundaries, hash navigation, notes, edit toggle, single active slide, inactive-slide isolation, offline assets, keyboard handling after control focus, 16:9 fit at 1280×720 and 390×844, and portable HTML export. JavaScript syntax checks passed. Reduced-motion and print overrides are included; print output was not separately exported. The remote commit is confirmed in the delivery message rather than recorded before the push occurs.
