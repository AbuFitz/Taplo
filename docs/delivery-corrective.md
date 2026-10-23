# Corrective build: delivery report

This answers the corrective brief section by section. Everything below was checked by looking at the rendered result, not only by tests. Where a limit remains, it is named.

Taplo is still a sandbox: there are no accounts, no public publishing, no email or text sending, no payments and no live database. That is stated once in the product (the "Sandbox" badge and the one line where publishing happens), driven by `src/lib/capabilities.ts`, and nowhere else.

## What changed, by section

| # | Brief | What was done | Where to look |
| --- | --- | --- | --- |
| 1 | Platform foundation and logo | Cool neutral tokens (hue 264, one blue signal) replace the warm-era palette. The supplied logo forms (symbol, wordmark, horizontal and stacked lockups, app icons) were put on a contact sheet at navigation, header and footer sizes; the wordmark is the primary mark, the lockup is used large. | `docs/brand/logo-decision.md`, `docs/brand/logo-contact-sheet.png`, `src/app/globals.css` |
| 2 | Component workbench | An in-app workbench at `/workbench` renders every widget and overlay as a real story. Storybook was not added: the stories use the real renderer and add no dependency (decision recorded below). Each story is walked by Playwright with axe. | `src/features/workbench/*`, `tests/e2e/workbench.spec.ts`, `docs/screens/workbench/` |
| 3 | Widget family | Single-level cards (no card inside a card), flat service rows, collections with a visible cue, calm team cards, compact lists that stay readable. Found and fixed through this work: the compact product and vehicle list hid names and prices. | `src/features/page/renderer/page.css`, `docs/widget-coverage.md` |
| 4 | Header | Four arrangements (Compact, Cover, Image hero with a controlled fade, Text-led), logo or portrait, focal point, three scrim strengths, long names, and image colour suggestions with before/after, accept, and one undo. | `src/features/page/renderer/Header.tsx`, `src/features/page/editor/ColourSuggestion.tsx` |
| 5 | Editor shell | One panel with four tabs (Content, Header, Design, Settings) and the preview beside it; a phone gets the same four as bottom sheets. Nothing is clipped. Reordering has handles, move buttons and a "move to" menu. | `src/features/page/editor/EditorPanel.tsx`, `MobileEditor.tsx`, `docs/screens/after/editor-*.png` |
| 6 | Control audit | 39 design controls, each proven to change the rendered page, undo, redo and survive a reload. Rare colour roles are folded under "More colours". Saved drafts load unchanged. | `docs/control-matrix.md`, `tests/e2e/controls.spec.ts` |
| 7 | Starting looks | Nine looks (Clean, Night, Colour, Photo, Showroom, Mono, Terracotta, Forge, Orchard), each shown by a large thumbnail of the real renderer. A test fails if a look changes and its thumbnail was not regenerated. | `public/looks/`, `src/features/page/look-thumbs.test.ts` |
| 8 | Setup journey | Five steps: name, what you do and what people do first, a starting point, how to reach you, preview and publish. No technical narration. What is skipped is a "Finish later" list that stays in the editor. | `src/features/demo/Onboarding.tsx`, `docs/screens/after/setup-*` |
| 9 | Overlays | One responsive overlay (`Overlay`) on Radix Dialog: a dialog is a centred card from 640 px and a bottom sheet below it; a detail view is a large card, and full screen on a phone; an owner panel is a side panel, and a bottom sheet on a phone. Page and admin tones; visible title and close control; the footer follows the on-screen keyboard. | `src/components/taplo/overlay.tsx` |
| 10 | Launch-ready frontend | One capability config and adapters; one restrained sandbox disclosure; what is unavailable says what it needs. | `src/lib/capabilities.ts`, `src/components/taplo/sandbox-badge.tsx` |
| 11 | Marketing | The homepage and product pages are visual stories built from captures of the real renderer, with no booking-status emphasis on the homepage. The homepage section on booking wording was replaced by sharing. | `src/app/page.tsx`, `src/features/marketing/*` |
| 12 | Production process | The film was produced keyframe first: stills were inspected before any render, then the MP4 was rendered once the stills read well. | `marketing/film/` |
| 13 | Sharing and export | See the audit below. | `src/features/page/widgets/ShareClient.tsx` |
| 14 | Puck | Not needed; see the decision below. | `docs/editor-engine-decision.md` |
| 15 | Verification | See the results and the limits below. | this file |

## Sharing and export audit

Checked in the real panel and on the downloaded files:

- **Source of the artwork.** The share image and QR code are drawn on a canvas from the page's own colours, fonts and logo. Nothing is uploaded.
- **Draft leakage.** The link is built from the published slug in preview mode (`/demo/p/<slug>`). The share card shows the name and line only.
- **Fonts.** The share image uses the page's own heading and body fonts; they are loaded before drawing, with a system fallback.
- **Logo.** The business logo is drawn at its own proportions. A wide wordmark is not cropped.
- **Resolution.** The image is 1080 by 1350; the QR download is 1024 by 1024 (PNG) or vector (SVG for print). A test decodes both files and checks the dimensions.
- **Long names.** A name is shrunk until its longest word fits, then clamped to three lines with an ellipsis; the tagline is clamped to the room above the QR code; the link line shrinks to fit.
- **QR scan.** The test decodes the QR in the on-screen card, in the downloaded share image and in the downloaded QR PNG; all three return exactly the link shown.
- **File names.** `<business>-share.png`, `<business>-qr.png`, `<business>-qr.svg`, and the native share uses the same share-image name.
- **Native share.** Offered only when the browser supports it. Cancelling the share sheet is not an error. If it fails, the panel says so and points to Copy link.
- **Honest links.** In preview mode the panel says the link and QR only work in this browser. If a non-preview page is served from `localhost` or a private address, it says the link only works on this device. Nothing promises how Instagram, WhatsApp or Facebook will show the link.

## Decisions

- **Workbench instead of Storybook.** The brief allowed "Storybook or equivalent". The in-app workbench renders the real `PageRenderer` and the real overlays, so a story cannot drift from the product, and no dependency is added. Local screenshots and axe run against it.
- **No Puck spike.** See `docs/editor-engine-decision.md`: nothing in the brief is blocked by the current engine.
- **Choosing a look replaces earlier style changes** and says so; undo brings them back.
- **Removed:** the old add-widget dialog and the starter "rearrange to the suggested order" dialog were no longer reachable after the editor rebuild and have been deleted. The add-content chooser still suggests what suits the business; the one-step "rearrange my whole page" action is gone.

## Defects found by making the old tests honest

Repairing the older end-to-end specs against the new UI found real defects, now fixed:

- The compact product and vehicle list hid every name and price.
- Team cards failed the "label in name" rule, so a screen reader and a voice-control user could not use the same words.
- A card for a widget that needs its own setting (a video address, some text, a link) said "Finish this in Business details".
- The pricing comparison table pushed the page wider than a phone screen.
- Expired offers were counted as showing in the content list.
- Hint text in the design controls was below the contrast threshold on its tinted background.
- The main booking action in the header could not be tapped to select the booking widget while editing.
- The appearance lab was 8 to 60 pixels too wide at phone widths.

## Results

All of the following were run against a production build (`next build`, then `next start`) on 23 October 2026, in Chromium:

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `eslint src tests scripts` | clean |
| Unit and integration tests (`vitest`, with the real Postgres integration tests) | 122 of 122 passed (9 files) |
| End-to-end (`playwright`, 293 tests in 12 files) | 293 of 293 passed |
| of which: control matrix | 39 of 39 |
| of which: workbench stories with axe (serious and critical violations fail) | 109 of 109, across 14 families (Booking 5, Forms 4, Gallery 7, Header 25, Hours and place 6, Links 5, Products 11, Questions 4, Reviews 6, Services 12, Sharing 4, Team 13, Text 2, Vehicles 5) |
| Width sweep, `scripts/review/sweep.mjs`: 15 surfaces at 320, 360, 390, 430, 640, 768, 1024, 1280 and 1536 px | 135 checks, no sideways scrolling |

Keyboard use, visible focus, dialog focus trapping and focus return, reduced motion (animated wallpapers freeze) and the touch-size of controls on a phone are each covered by a named end-to-end test (`profiles`, `a11y`, `engine`, `journeys`, `controls`).

The end-to-end run was not green on the first pass: 45 tests failed against the new interface when the whole suite was first run, and 3 more on the second pass. Each was either a specification written for the old layout (repaired) or a real defect (listed above and fixed). Two tests (the wallpaper undo and redo) were unstable under load until they were run with reduced motion, which freezes the animated wallpaper; the product behaviour was checked separately and is correct.

## Before and after

Screens from the start of the corrective work are in `docs/screens/before/`; the same surfaces now are in `docs/screens/after/` (home, inspiration, pricing, setup at 1280 and 390, the editor at 1440, 1280 and 390, and the barber, physio and dealer pages). Every story has a screenshot in `docs/screens/workbench/`.

## Marketing assets

All captures in `public/marketing/` were retaken from the production build after the widget redesign: hero and example pages (desktop and phone), service, team, booking, enquiry, gallery, review and share states, and a new share image. The 15-second film in `marketing/film/` was re-produced in the new palette: prices, pick a time, share it three ways, nine looks, and the end card. It is silent, has the story written out beside it, and never autoplays.

## What is not connected, and what was not tested

- Accounts, public publishing and custom domains, email and text sending, payments, and a live database are not connected. Pages made here live in the browser that made them.
- **Browsers.** Only Chromium was available. Firefox and WebKit (Safari) were not run, so Safari-specific behaviour, including the iOS share sheet, is unverified.
- **Devices.** Phones and tablets are emulated (viewport, touch, mobile mode). No physical device was used, so on-screen keyboard behaviour, safe areas and real touch latency are unverified.
- **Zoom and text size.** Browser zoom is emulated by viewport width (640 px is 200 percent on a 1280 px screen; 320 px is 400 percent). A text-size-only setting in the OS or browser could not be set from here and is not claimed.
- **Screen readers.** axe checks and keyboard walk-throughs ran; no screen reader was used.
