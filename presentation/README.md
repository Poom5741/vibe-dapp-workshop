# Vibe Code Your First dApp — presentation

Open **[index.html](index.html)** in Chrome, Edge, Firefox or Safari. It contains 44 slides, embedded fonts and artwork, and works offline. No app setup or wallet is needed to present it.

For a local HTTP preview, run this from the repository root:

```sh
python -m http.server 3818 --bind 127.0.0.1 --directory presentation
```

Open `http://localhost:3818`. Stop the server with Ctrl+C after presenting. You can also simply open the HTML file directly.

## Presenting

| Control | Action |
| --- | --- |
| Right arrow, Space, Page Down | Reveal the next step, then advance |
| Left arrow, Page Up | Reverse a step or return to the preceding slide |
| Home / End | First / last slide |
| Slide dropdown | Jump to a specific slide |
| F / fullscreen button | Enter or exit fullscreen |
| N / Notes | Toggle speaker notes and source links |
| E / Edit | Edit the visible slide's text |
| Escape | Exit editing and close notes |
| Swipe / mouse wheel | Move forward or backward |

**Notes appear on the same screen as the slides.** Close them before projecting. This is not a separate private presenter window.

Edits are saved in the current browser's local storage when available. Click **Export HTML** in edit mode to download a portable copy with your changes. Local edits do not change Git files, and rebuilding does not clear the browser's saved edits. Use a fresh browser profile to review the committed original. To make lasting source changes, edit `slides.json`, then rebuild.

The deck honors the operating system's reduced-motion setting. It preserves its 16:9 composition on phones; landscape orientation is easier to read. Browser printing produces static slides with all steps visible; animation is retained only in HTML.

## Content and pacing

- Slides 1–9: welcome and the presenter's AI journey.
- Slides 10–23: Web3 foundations, Avalanche Fuji, wallet logic and MetaMask.
- Slides 24–41: the repository's dApp, token standards and guided build checkpoints.
- Slide 42: closing; slides 43–44: network details and sources.

Suggested pacing is 20 minutes / 25 minutes / 65 minutes, with a 10-minute buffer. Have students finish tool installation before the session. Use the repository's fallback art if time is short. This is a different run-of-show from the original README station timetable.

Personal-story facts come from the presenter. Notes indicate where to add spoken personal examples without inventing company details or outcomes. The product illustration uses the repository's fallback artwork and is labeled as a conceptual preview. Nothing in the deck connects to MetaMask or sends a transaction.

## Editing and rebuilding

```sh
node presentation/build.mjs
```

| File | Purpose |
| --- | --- |
| `index.html` | Ready-to-present standalone deck; this is the file to share. |
| `slides.json` | Slide text, layout types, speaker notes and source links. |
| `styles.css` | The selected playful BlockFrame visual design and print styles. |
| `runtime.js` | Navigation, reveals, notes, fullscreen and local text editing. |
| `viewport-base.css` | Frontend Slides' fixed 1920×1080 stage and print foundation. |
| `build.mjs` | Embeds all assets and source files into the standalone HTML. |
| `fonts/inter.ttf`, `fonts/spacegrotesk.ttf` | Open fonts embedded for offline use. |
| `fonts/*-OFL.txt` | Font license notices, also included in the generated HTML. |
| `THIRD_PARTY_NOTICES.md` | Attribution for the presentation skill and artwork. |

Font files are source assets; presenting only requires `index.html`. Keep the generated HTML in the same commit as source changes. Source links in notes point to the public repository or the original documentation and need internet only when clicked.
