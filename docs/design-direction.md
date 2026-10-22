# Design direction

> **Reference inspection status: NOT DONE.** The spec asks for concrete observations from Stripe, Linear, Vercel, Booksy, Linktree, Framer, Tesla and Fresha. No browsing of those sites was performed in this milestone, so no observations are recorded for them and none are claimed. The section below is the design *intent* implemented so far; add real reference notes (with what was seen and what was deliberately not copied) before Phase 2 is signed off.

## Three surfaces
1. **Business profiles** (`[data-taplo-theme]`) — themed per layout family; the product's showpiece.
2. **Dashboard** — neutral shadcn tokens, dense and calm. Not built yet.
3. **Taplo marketing** — placeholder home + pricing only.

## Family identities (as implemented)
| Family | Hero | Image priority | Services | Rhythm / width | Type | CTA |
|---|---|---|---|---|---|---|
| Trades | full-bleed dark, uppercase condensed, huge stacked actions | darkened backdrop, practical | compact ruled rows, price right | compact, wide | Barlow Condensed + Inter | Call first; accent band mid-page; sticky mobile bar |
| Beauty | split editorial, arched portrait | high; gallery directly after hero | treatment menu (image tiles + dotted-leader rows) | airy, wide | Fraunces + Manrope | pill booking button; sticky "book" on mobile |
| Education | left-aligned explanation + contained action card, credential chips | low | subject cards with duration/mode chips | regular, mid width | Lexend + Inter | action card in hero; contextual mobile bar |
| Professional | narrow serif, rule, text-link actions | low | numbered engagements, wide measure | airy, narrow | Source Serif 4 + Inter | restrained button + text links |
| General | centred, works with zero photography | optional | balanced cards | regular | Manrope | primary + secondary buttons |

## Rules applied
- Palette swap alone is a failure: hero structure, image priority, service treatment, section rhythm, typography, width and CTA position all differ (asserted in `themes.test.ts`, reviewed in screenshots).
- Tap targets ≥44px, visible focus from shadcn ring mapped to the accent, no colour-only status, native `<details>` FAQ, reduced-motion media query neutralises transitions.
- Empty blocks disappear without leaving a gap; absent contact channels produce no links.

## Visual QA performed (milestone 1)
Full-page desktop renders of Trades/Beauty/Education/Professional/General and 390px mobile renders of four families were inspected by eye. Findings fixed: Professional layout carried a Booking block the spec's default order excludes. Not yet done: manual 200%-zoom visual review (only an automated 640px overflow proxy), screen-reader pass, automated axe scan.
