# Round three: delivery

Specification: `docs/design-spec.md`. Directions compared: `docs/directions/`. Film: `docs/film-storyboard.md`. Launch dependencies: `docs/launch-dependencies.md`. Screens: `docs/screens/r3-before/` (the site as found), `docs/screens/r3-final/` (production build, Chromium).

## What changed structurally

| Area | Before | Now |
| --- | --- | --- |
| Editor shell | Two stacked bars; fixed 26 rem panel; content rows wrapping to three lines with a status on every row | One bar (name and save state, undo, redo, Preview, Publish, one sandbox indicator); a 26 to 30 rem panel; one-line rows with a status only for exceptions; no cards inside cards; Back returns to the same scroll position in the list (panel and phone sheet) |
| Editing a widget | Heading and "All of them" only; records edited on other pages | Layout chosen from drawn outcomes; the records behind the widget are listed, edited, added and removed in place (services, team, reviews, questions, products, vehicles, offers, photos). Services, products and offers are archived, never erased; taking a widget off the page keeps its records |
| Setup | Heading, an empty phone, a checkbox inventory, booking rules asked first | Five short steps: your business; what you do, what people do first and one way to reach you; a design; your first service (or vehicle, or photos) with the page filling in beside; review. Booking confirmation rules are no longer asked; a booking action only exists when it can work |
| Defect found | Booking vanished from a page whose header used button mode when online booking was not set up | Fixed in the view-model: a ready booking widget is always a booking action |
| Team widget | Walls of grey silhouettes when no portraits exist | People are listed compactly until portraits are supplied; portrait cards when they are |
| Sharing | One panel, one output | Two outputs. QR code: Taplo mark by default, or your logo, or nothing; black or your colour (darkened if it would not scan); classic, soft or dots; white or transparent. Share card: post (1080×1350) and story (1080×1920). Preview and export come from the same function; the card preview is the exported image |
| Marketing | Device frames, a footer of repeated links, uppercase labels, implementation copy | Hero led by one large phone with a second behind it; copy rewritten around customer benefit; footer regrouped (Product, Explore, Legal) with no uppercase labels; legal pages say one line, with the missing approved information tracked in `docs/launch-dependencies.md`; product page headings reduced |
| Film | 15 s, outdated setup screens | 18 s story: prices, time, setup, designs, share, action, rendered from fresh captures; poster is the settled frame of the setup scene |

## Direction decision

Three directions were composed and rendered (`docs/directions/`): a dark studio, a light product page, a calm cool-grey stage. The chosen direction takes the dark studio's scale and single-phone confidence, the grey stage's rising crop, and keeps the light workspace so customers' colours are judged on neutral ground. Principles applied: one obvious next action and choosing before configuring (Linktree); large tight type, compact navigation, one product image per idea (Framer); one hero object, generous space, an image that explains (Apple). The reference sites were not browsed in this work, so no observations of them are claimed.

## Verification (production build, Chromium; 23 October 2026)

| Check | Result |
| --- | --- |
| `next build`, `tsc --noEmit`, `eslint src tests scripts` | clean |
| `vitest` with the Postgres integration tests | 209 of 209, 11 files (84 for the QR renderer, including transparency) |
| `playwright` end to end | 298 of 298, including axe on the editor and onboarding, the control matrix, the component workbench stories, and the share panel |
| Width sweep, 15 surfaces, 320 to 1536 px | 135 checks, 0 overflowing |
| QR and share exports | Downloaded files are decoded independently (jsQR) back to the exact link: PNG 1024 and 3000, SVG, share card. A transparent PNG has alpha 0 in the corners and quiet zone and decodes on white, light grey and cream. A business logo travels inside the SVG as a data URI; the colour is at least 7:1 on white; repeated downloads decode; a changed style is never exported stale; preview and export share one drawing |
| Setup journey | Test walks name, reserved address, what you do, invalid then valid phone, design, a first service appearing in the preview, review, publish, and the published page |
| Earlier saved drafts | The migration test for an older draft still passes. Setup step names are unchanged in storage, so a draft saved mid-setup resumes |

The suite was red twice before it was green: the first run after the redesign had 18 failures (tests written for the old rows, labels and setup, and a real defect that overflowed the homepage at 360 to 1280 px because the hero used fixed widths). Each was repaired in the product or the specification.

## What was not done, and why

- **WebKit and Firefox**: not installed here. Everything above is Chromium. No physical device was used: no real-camera QR scan, no iOS keyboard or safe-area check, no touch-latency check.
- **Three.js / React Three Fiber scene, Penpot, Puck**: not added. No section needed depth the existing composition could not give, no Penpot instance was reachable, and no limitation of the current renderer and dnd-kit reordering was found that would justify a second editor or drag system.
- **Social film formats and "See how" clips**: only the 16:9 film was authored and rendered. A vertical and a square cut need their own compositions; they are not produced.
- **Dedicated illustrated pages** for every capability: the existing product pages keep their layouts with rewritten headlines and copy; the new share and setup captures are on the homepage and film, not yet on every product page.
- **Examples**: the seven starting designs were rebuilt last round and recaptured now; a further pass on distinct header compositions was not made. Team portraits are plain silhouettes by instruction.
- **Mobile-led gallery and a customer-page desktop that mirrors mobile**: the gallery still defaults to desktop crops; the customer page's desktop layouts are unchanged.

## External dependencies

Accounts, public hosting, a shared database, an email provider, an SMS provider, a payment provider, and the approved company and legal text. Listed with where the interface mentions each in `docs/launch-dependencies.md`.
