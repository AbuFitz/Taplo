# Requirement checklist (round four)

Status: **done** (built and verified), **reference** (built once as the reference, to be propagated after review), **open** (not started), **blocked** (needs something outside this work). Updated 23 October 2026, at the review gate.

## Audit findings, separated

**Functional defects (reproduced)**
- A saved page with button-style header actions lost its booking button when online booking was not set up. Fixed in round three.
- With roomy card padding, a bare swipe collection overflowed a phone by 8 px (collection bleed used the card padding, not the page gutter). Reproduced with a script that lists elements past the viewport; fixed this round in `page.css`.
- Booking, enquiry and owner screens carried "Preview mode:" wording. Reworded to plain statements of what is stored where.

**Weak design decisions**
- Desktop modes `split` and `columns` turned a page into a different layout. The reference design uses one adaptive centred layout; the other two remain valid in saved pages and are scheduled for retirement in propagation.
- All-caps tracked labels inside widgets (group titles, badges). Removed from the widget family this round.
- Reordering lived in a separate Organise mode. Replaced with a handle and a menu on every row.
- One typeface and one blue for the platform that read as the default. Replaced by Geist 800 at large sizes and one saturated cobalt.
- Showcase designs share one structure. Open (propagation).
- Marketing sections repeat phone frames and cards. One section rebuilt (booking story); the others are open.

**Missing capabilities**
- Mobile-led gallery, per-capability feature pages and illustrations, portrait/social film cuts and "See how" clips, a Storybook catalogue, a 3D scene, the retirement of split/columns in the editor control. All open (propagation).

**External dependencies**
- Accounts, public hosting, database, email, SMS, payments, approved legal text and company details (`docs/launch-dependencies.md`).

## The brief, section by section

| § | Requirement | Status | Where / note |
| --- | --- | --- | --- |
| 1 | Understand the product; keep scope and pricing | done | No pricing or entitlement change; no backend work |
| 2 | Finish the work left open | reference | Starting-design rebuild: one design (Folio). Mobile-led gallery, desktop composition, feature illustrations, film formats: open |
| 3 | Audit the implementation; checklist | done | This file; `docs/tooling.md` |
| 4 | Apply the three skills | done | `docs/tooling.md`: frontend-design (process and tells), web-design-guidelines (rules fetched and applied to the new code), HyperFrames (film phase, after review) |
| 5 | Tooling, each with problem, output, compatibility, licence, side | done | `docs/tooling.md`. Adopted: Motion, Radix Colors, Base UI Drawer, dnd-kit 6/10, CSS scroll snap. Planned: Storybook 10.6.3 (dev), R3F 9.8.2 + Drei 10.7.9 (one scene). Not adopted: Embla, Puck, qr-code-styling, Penpot MCP (needs a signed-in plugin session), Chrome DevTools MCP |
| 6 | Three directions on actual content; define the system | done | `docs/directions/` (hero, editor and customer page per direction, rendered; the editor and customer page use the real app under each direction's tokens). Chosen: A. Tokens in `globals.css`; typography in `docs/platform-typography.md`; logo set in `docs/brand/logo-decision.md` |
| 7 | Reviewable reference | reference | See below |
| 8 | Component workbench | open | `/workbench` (109 real-renderer stories) stays; Storybook to be adopted after review |
| 9 | Navigation and footer | reference | Full-width compact bar, Product menu with a finished-page tile, active/hover/focus states, mobile sheet; footer with the wordmark at page width, grouped links and legal access |
| 10 | Customer-page composition; desktop is the same page | reference | Folio: cover, logo, serif name, action, sections. Desktop: wider column, full-bleed cover, people two across, short collections lie flat. Same order and identity |
| 11 | Widget family | reference | Heading scale for display faces; sentence-case group titles and badges; team list when no portraits. Per-widget redesign: open |
| 12 | Overlays and sheets; keyboard test; Base UI Drawer evaluation | open | Existing overlay vocabulary unchanged. The keyboard-open journey test is scheduled |
| 13 | Everyday editing | reference | Rows with handles and a menu; layout tiles; records edited in place; Back keeps list position. Reorder verified by mouse, keyboard, touch, menu, Escape-cancel and undo |
| 14 | Engine audit | open | Control matrix from round two stays green; further audit scheduled |
| 15 | Replace showcase designs | reference | Folio replaces the barber example (and is suggested first for barbers and photographers). The other six: open |
| 16 | Mobile-led gallery | open | |
| 17 | Registration | reference | Cover photo added; the five-step flow shown reaching Folio. Further steps open |
| 18 | Homepage and feature pages | reference | Hero and the booking story. The rest: open |
| 19 | Writing | reference | Hero, story and footer rewritten; "Preview mode" wording removed. Site-wide pass: open |
| 20 | Motion, artwork, 3D | reference | Scroll-linked booking story with reduced-motion fallback. 3D: open |
| 21 | Film | open | Existing film is the round-three cut; to be rewritten with the HyperFrames story/spec workflow |
| 22 | Sharing | done | Round-three work retained: standalone QR and share card, transparent and solid, business logo or Taplo mark. The brief now makes the business logo the preferred centre; the default is still Taplo's mark. Switching the default to the business logo when it is usable is scheduled |
| 23 | Launch behaviour | done | One sandbox indicator; capability flags unchanged |
| 24 | Verification | done for the reference | Production build, Chromium: tsc, eslint clean; vitest 209/209 (with Postgres); Playwright 302/302; width sweep 135 checks, 0 overflowing. No WebKit, no physical device |

## The reference, item by item

| # | Reference item | Status |
| --- | --- | --- |
| 1 | Navigation and hero | built |
| 2 | One art-directed feature section | built: the booking story |
| 3 | Footer | built |
| 4 | One rebuilt customer-page design | built: Folio on Marlowe & Finch |
| 5 | Its phone and desktop composition | built |
| 6 | Its editor with layout choices and ordering | built |
| 7 | Setup reaching that result | built (five steps, cover photo added) |
| 8 | Detail overlay and sharing | existing overlays and the share panel, shown on the new page |
