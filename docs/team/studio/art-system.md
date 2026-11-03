# Studio art system (all owner pages). Values, not adjectives.
Author: art director. Inputs: contract.md, ux-system.md (settled), slice/art-direction.md, critic-round3, studio.css, portal-workspace.css, workspace-tools.css, globals.css, audit stills (390 and 1440) and r2-ready-m / r2-published-m. AI review of stills only.
Thesis: the home slice already works (flat grey page, one black pill, white rounded surfaces, the owner's page as the only colour). The manage pages fail because they use a different dialect: 12-13px blue-grey text, green-tinted chips, button rows inside cards, illustration cards. This spec makes the manage pages speak the home dialect. Home is not restyled; its tokens are the source. One detail that belongs to Taplo: the black pill primary and the black ink dock, nothing else.

## 1. Tokens (replace the ad-hoc values; no new colours)
- Page `#f7f7f7` (home `.studio` and portal agree; use one: `--st-bg:#f7f7f7`). Surface `#fff`. Ink `#111`. Text-2 `#454545` (9.7:1 on #f7f7f7; replaces #687076, #677177, #5d5d5d). Line `#e8e8e8`. Pressed `#0000000a`. Skeleton `#e6e6e3` -> `#e8e8e8`.
- Remove all tinted greens/blue-greys: `.workspace-notice #ecefea/#435440`, `.workspace-toast #e9efec`, `.team-person-top` avatar `#e9efec/#354b41`, `#f0f2f1`, `#172c22`, `#dde1e4`. Replace with `#fff`, `#eee` (avatar bg), `#111`, `#d4d4d4`.
- Radius: row group 20, sheet 28 top, pill 999, input 14, chip 999. Shadow: one, `0 0 0 1px #0000000d` for surfaces on #f7f7f7 (drop `--portal-shadow` blur on manage pages). Sheets only: `0 -18px 40px -20px #0000004d`.
- Fonts: Inter Variable all UI. Space Grotesk Variable only on the page h1 (`--font-display`). Geist numerals not used on manage pages.

## 2. Spacing and type
- Scale 4/8/12/16/24/32/48. Gutter 16 at 390 (not 20), 32 at >=1024. Content column max 720 beside the 220 rail, left-aligned in its area. Header to h1 24. h1 to status 8. Status to primary 16. Primary to list 24. Row group to footnote 16.
- Type (px size/line, weight, tracking). Page title h1: 30/34 at 390, 38/42 at >=1024, 600, -0.03em, Space Grotesk, wraps 2 lines (replaces clamp 30-42 with -0.045em, which collides on long names). Status line: 15/22, 400, #454545, one line, ellipsis. Row title: 16/22, 600, #111, 2 lines then ellipsis. Row meta: 14/20, 400, #454545, wraps, state word (Archived, Hidden) 600 #111. Body 16/24. Field label 14/20 600. Field help and footnote 14/20 #454545 (kills 12 and 13px). Button label 16/600 (small 15/600 only for outlined in sheet footers). Chip/pill 14/600. Dock label 12 is NOT allowed: 13/16, 600 active, 500 inactive is the single exception for icon captions and must fit "Bookings" in 390/5 = 78px. If it cannot, use 14/16 and 11px side padding.
- Long names: `overflow-wrap:anywhere`, never `white-space:nowrap` except buttons and chips.

## 3. Shared row (`StRow`)
- Group: `#fff`, radius 20, ring 1px #0000000d, rows separated by 1px `#e8e8e8` inset 16 left (divider, not one card per row; replaces the card-per-item look in services/products/team). Group margin 0.
- Row: min-height 64, padding 12 16, grid `[leading? 40] 1fr [trail?] 20`. Title 16/600 over meta 14/400, gap 2. Trailing chevron: 8x8 border-right/bottom 2px #111 rotated -45deg (the `.studio-steps` chevron pattern), 20px box, always visible. Optional trailing text (e.g. "Hidden") sits left of the chevron, 14/600.
- Leading: avatar 40x40 radius 14 `#eee` initials 15/600 #111, or photo cover. No icon tiles elsewhere.
- Whole row is one `<button>` or `<a>`; hover/press `#0000000a`; press `scale(.99)` 120ms. Keyboard focus: section 9.
- Selected or active: 2px #111 left bar is not used; none needed on manage pages.
- Attention row (home `.studio-attention`): same group style, min-height 56, count badge 28px black circle white 14/600 left of the title, chevron right. Max 2 plus "and {n} more" text link.

## 4. Buttons (all text 16/600, radius 999)
- Primary: bg #111, text #fff, min-height 48 (56 only on home Publish card), padding 0 24, width 100% at 390, auto (min 160) at >=1024; hover `#2a2a2a`; one per page. Disabled: bg #d4d4d4 text #5d5d5d (still 4.5:1 text-on-fill not required for disabled; label kept).
- Secondary: outlined, bg #fff, 1px `#00000026` border, text #111, min-height 48, same radius and padding. Used for Save link / Edit my page / sheet Cancel when a primary exists.
- Text link: 16/600 underline, offset 4px, min-height 44, padding 0 8, #111; destructive text link in sheet footers is #111 underlined plus the verb ("Archive Skin fade"). Red `--destructive` is NOT used.
- Press: `scale(.98)` 120ms. Icon-only buttons 44x44, radius 14 (sheet close, menu).

## 5. Dock (mobile <1024) and rail (>=1024)
- Mobile dock: fixed, left 12 right 12 (max-width 420, centred), bottom `max(12px, env(safe-area-inset-bottom))`, height 64, radius 26, `#fff`, ring 1px #0000000d plus `0 18px 40px -26px #00000059` (existing). 5 equal cells of 62-76px. Cell: icon 22 above label 13/16, gap 2, 48 min touch, radius 18. Inactive icon outline #111 stroke 1.75, label 500 #454545. Active (`aria-current=page`): icon filled, label 600 #111, cell bg `#eeeeee`. More is active on any secondary page.
- Badge: Bookings only, `min-width 18 height 18` black, white 11px digit is replaced by 12px/600 digits (decorative count; the label text carries meaning) at top 6 right calc(50% - 22px); hidden at 0; text "9+" above 9; `aria-label` "Bookings, 3 need a reply".
- Scroll padding: page `padding-bottom: calc(64px + 12px + env(safe-area-inset-bottom) + 24px)`.
- Keyboard open (`studio-kb`, visual viewport height < 75% of window): dock `display:none`, no transition. Restores on blur.
- Landscape under 500px height: dock stays 64 high; labels hidden only below 340px width.
- Desktop rail: fixed left 0, width 220, full height, bg #f7f7f7, no border (page edge contrast only with the content surfaces), padding 24 12. Item: height 48, padding 0 12, radius 14, icon 20 + 12 gap + label 16/500. Active: bg #fff, ring 1px #0000000d, label 600. Hover `#0000000a`. Settings pinned bottom with 12 margin. Badge: 22px black pill 14/600 at right. Business name does not repeat in the rail.

## 6. Shell header
- Sticky, height 64 at 390 and 72 at 1440, bg `#f7f7f7` (opaque, no blur, no white flash), padding 0 16 (32). Left: business name 16/600, 2-line clamp, link to Home; Draft/Published pill beside it (non-home only) 14/600, 32 high, white with 1px #00000026, Published = black fill white text (existing `.studio-pill-live`). Right: `View page` secondary 44 high, padding 0 16, 15/600. Nothing else. Removed: hamburger, section label, plan link.

## 7. Page header, status, empty, error, skeleton
- Page header block: h1, status line, primary. No description paragraph under h1 (moves to empty state or footnote). Status on one line or the block is not rendered. More menu (3 dots, 44x44) sits in the h1 row right for Reorder, Block time, Add samples.
- Empty: group-less; centred is NOT used. Left-aligned 16/24 sentence (max 28em) + the one primary at 48. No icon, no card, no dashed border (replaces `.workspace-empty` 52px padded card with 26px heading and the dashed bookings box).
- Error banner: `role=alert`, bg #fff, ring 1px #111, radius 14, padding 12 16, text 15/22 "Could not load services. Your changes are kept.", right: `Try again` secondary 44 high. Never colour.
- Skeleton: rows at real height 64 (title bar 16 high 55% wide `#e8e8e8` radius 8, meta bar 14 high 35%, gap 6); h1 bar 34 high 45% wide; status bar 15 high 30%; 3 rows. Shimmer none; 1.2s opacity 1 -> .6 -> 1 loop only when motion allowed; static otherwise.

## 8. Sheets and dialogs
- Mobile sheet: radius 28 28 0 0, bg #fff, max-height 92dvh (visual viewport when keyboard), grabber 40x4 `#d4d4d4` 8 from top, header 56 (title 18/600 left, close 44x44 right), body padding 16 16 24 scroll, no scrollbar, footer sticky padding 12 16 + safe-area, top 1px `#e8e8e8`, contains Primary Save (flex 1) + text Cancel. Backdrop `#00000052`. Rise 240ms ease-out; close 180ms.
- Desktop panel: right, width 480, full height, radius 28 0 0 28 -> radius 0 on the edge, same header/body/footer, slide 220ms.
- Confirm dialog: width min(100% - 32, 360), radius 24, padding 24, title 18/600, text 16/24, two buttons stacked at 390 (primary-outline order: Cancel first and default focus, destructive named second as filled #111).
- Dirty close row replaces footer: "Discard changes?" 16/600, `Keep editing` secondary, `Discard` text link.

## 9. Focus, colour, motion
- Focus ring: `outline:3px solid #111; outline-offset:3px` on every interactive; on filled black add `box-shadow:0 0 0 3px #fff` (home value). On black or #111 surfaces ring is #fff. Search/inputs: same ring, border becomes #111 1px. Never `outline:none` without replacement.
- Monochrome: ink, greys, white only. The only colour on any manage page is the preview miniature and photographs. One functional status treatment: black pill/fill = active/published/needs attention, outlined = draft/inactive, plus a word. No green, amber, red, no status dots by colour, no tinted notices. Charts do not exist yet.
- Motion: press 120ms scale, sheet 240/180, row hover bg 120ms, page enter none (delete `portal-arrive`: it moves fixed children, defect A). Skeleton pulse only. Reduced motion: all transitions 0, no pulse, sheets appear without slide, dock identical.

## 10. Application per page (390 first, 1440 same order)
- Shell header: name left (2-line), pill (non-home), View page right. Plan link and subtitle deleted. Hamburger deleted. Replaces 76px toolbar with 64.
- Services (Treatments): h1, status "6 services, all visible", primary Add service 48 full-width, then one row group (title, meta "£34 · 45 min · Hair", chevron). Up/down/Edit/Archive buttons and the description deleted; each row falls from ~140px to 64px. Offers = last row in its own group.
- Bookings: h1, status "2 need a reply" or "Nothing waiting", attention rows, then one segmented control (3 segments, 44 high, #eee track, active white ring, 15/600; "Hours and rules" fits at 390 as "Hours"), Agenda default, one compact view menu, empty sentence plain text. Add sample, Block time, staff select move to More menu; the dashed box goes.
- Reviews: h1, status, hero card and pin icon deleted; one field 48 high labelled "Google Maps or review link" 14/600, help 14px, secondary/primary Save link 48 (primary, only action); truthful note as 14px footnote.
- Team: h1, status "3 people", Add team member primary; one group of rows (avatar 40, name, role, "Bookable" meta). Bio, pencil, bin, Working hours leave the row; no search at 3. Desktop is one column group (max 720), not three cards.
- Products: h1, status "2 items", Add item; rows meta "£18 · Customers enquire · Available". The NFC/checkout card and its illustration become one 14px footnote under the group.
- Analytics: h1, one 16/24 sentence per state, one text link (Compare plans or Share your page). Nothing else; no art, no zero tile.
- Settings: h1, status "Demo plan: Business"; group 1 rows: Plan (opens sheet with simulated plan select; 11-line list behind "What does each plan include?"), Not connected (row), Reset demo data (row, opens confirm). The second illustration card goes. Plan prices keep the word "provisional" 14px.
- Home and My page: unchanged except dock labels (5 items) and header per section 6.
