# Art direction: Taplo setup form (390 first). Values, not adjectives.
Inputs: contract.md, taplo-contract.json, form/ux-spec.md, studio/art-system.md, slice/art-direction.md, onboarding-mobile.css, audit stills m-0..m-8, setup-flow-v4.png. Fonts unchanged: Inter Variable (UI), Space Grotesk Variable (step title only). Product chrome monochrome; colour exists only in the business preview and the photograph.
Status: alternatives A/B/C written as HTML in `form/alt/`; PNGs and contact sheet NOT yet produced (no shell in this run). Run `node /home/user/taplo/docs/team/form/alt/capture.js` then open `alt/contact.png` and read `alt/audit.json`.

## 0. Thesis
First read: the owner's own page, already populated, on a quiet light stage. Then one white sheet with a 28px question. Then one black pill. Characteristic detail: tapping a tile visibly rewrites the page above it (name, services, button) while the chrome stays still. Current result fails because a black aurora, blurred glass sheet, 13px captions, per-step sheet heights and a blank grey phone make the form louder than the page. Studio's dialect (#f7f7f7 / #fff / #111, black pill) is reused; nothing is rebranded.

## 1. Stage and sheet (all 7 steps, same values)
- Stage `#f4f4f2`; html/body/theme-color/`<meta name=theme-color>` all `#f4f4f2`. Delete `.setup-backdrop`, aurora, top shade, invert logo filter.
- Phone: 296 wide (screen 282), bezel 7px `#111`, radius 44, ring `0 0 0 1px #00000026`, no drop shadow, left 47, top 64, height 560. The phone never moves or resizes between steps or snaps; only the sheet covers it. Page inside renders fitted to 282, scroll 0 (step 4 and 5 scroll the screen itself).
- Sheet: `#fff`, radius 28 28 0 0, shadow `0 -18px 40px -20px #0000004d`, no blur, no tint, no border. Heights 16/52/88 dvh (min 112 at Peek); transition height 240ms cubic-bezier(.22,.75,.2,1).
- Grip: 40x4 `#d4d4d4`, 8px from top. Drag zone = grip + title row (>= 44px tall). Escape/Arrow keys per ux-spec s3.
- Behind the sheet at 844: Peek top y=709, whole phone visible (64-624); Default top y=405, phone visible 64-405 (hero, name, buttons, 2-3 service rows); Full top y=101, only progress row and 37px of bezel. At 600: Peek y=488, Default y=288, Full y=72.
- Body = sheet minus 24 grip zone minus 84 footer: 331px at Default/844, scrolls inside, no fade unless scrollable (then 16px `#fff0 -> #fff`).
- Page gutter 16. Spacing 4/8/12/16/24. Body type 16/24. Help, errors, meta 14/20 `#454545`. Nothing under 14px in product UI (the scaled page miniature is exempt, aria-hidden).

## 2. Progress
- Stage row 56 high, no wordmark: left "Step n of 7" 14/20 600 `#111` (aria-live polite), right "Save and exit" 14/600, 44 high hit, right margin -4.
- Bar: 4px, radius 999, inset 16, y=50; track `#d9d9d6`, fill `#111`, width n/7 (14.3%, 28.6% ...). Fill transition 180ms. Role progressbar, valuenow n, max 7.

## 3. Titles
- Title: Space Grotesk 600, 28/32, -0.03em, `#111`, max 2 lines (clamp 24-28 under 340 wide), takes focus on step change. Keyboard open: 22/26, one line.
- Subtitle only on Plan and Finish: 14/20 400 `#454545`, 4px under title. Steps 1-5 have none (question is the title). Titles verbatim: "What do you do?", "What's it called?", "Choose a look.", "What should customers do first?", "Add your services", "Pick a plan.", "Your page is ready".

## 4. Type step (3x3)
- Grid 3 cols, gap 8, tile 114x76 (390-32-16)/3, radius 20, bg `#f7f7f7`, ring `0 0 0 1px #0000000d`, padding 0 8. Icon above label, gap 6: line icon 24x24, stroke 1.75, round caps, `currentColor`. Label 14/17 600, centred, max 2 lines, `overflow-wrap:anywhere`, no ellipsis. Grid block 244 high.
- Visible labels (full name in aria-label): Barber / beauty, Detailer / valet, Trades, Tutor / coach, Personal trainer, Cafe / restaurant, Car dealer, Cleaner, Something else. 2 lines at 90px content width; check at 320 wide (tile 90, content 74: "restaurant" 600 needs ~68).
- Selected (aria-pressed): bg `#111`, label/icon `#fff`, plus 20px white disc with 14px black check, top 6 right 6. Signals: fill inversion AND check shape AND state in a11y tree (not colour only). Press: scale .98 120ms.
- Title row carries "Search" (20px icon + 14/600, 44 high) at right. Trades selected: Plumber | Electrician chips (44 high, 14/600, selected = `#111` fill + check) in a row 12 under the grid; body scrolls. Something else: 56px field under the grid.
- Preview at first paint: "Your business name" at 55% opacity, services labelled "Example". Preview changes on tap.

## 5. Name step
- Field label 14/20 600 above (6 gap). Field 56 high, radius 14, bg `#f7f7f7`, inset ring 1px `#00000026`, 16/500, scrolls horizontally, never grows. Focus: border `#111` 1px + outline 3px `#111` offset 3. Counter "80 of 100" 14/20 only from 80 chars.
- Address line 8 under: 14/20 `#454545`, "mytaplo.com/" + slug 600 `#111`; "Change" 14/600 underline, 44 hit (padding 0 8, margin -12 -8). Slug truncates at 40 chars on a word boundary. Under it, 2px gap, 14/20 `#454545`: "Your address is reserved when you create your account." Never "available".
- Two optional rows (12 below): one group `#f7f7f7`, radius 20, ring 1px `#0000000d`, divider `#e8e8e8`; each row min 56, 16/600 title, "Optional" 14/400 `#454545`, 8px chevron (2px `#111`). Logo set: 40px avatar radius 14 `#eee` replaces nothing, shown left. Body total at Default 320 of 331: fits with 11 spare.

## 6. Look step
- Segmented Looks | Colours: 44 high, track `#eee`, active `#fff` + ring 1px `#0000000d`, 15/600, radius 999.
- Carousel: cards 148x112, radius 16, gap 12, padding-left 16, `scroll-snap-type:x mandatory`, snap start, no scrollbar; at 390 shows 2 cards + 54px of the third (signals scroll). Right-aligned "12 looks" 14/20 `#454545` above. Card = the real mini-render. Name under, 14/20, 500 `#454545`; selected 600 `#111`. Suggested look carries "Suggested" 14/600 under the name until chosen.
- Selected: 2px `#111` outline offset 3 + 22px black disc, white check, top 8 right 8 + name 600. Focus: 3px `#111` offset 3 (outline offset 3 would overlap the selected ring: use offset 6).
- Undo and Reset to suggested: text links 14/600 underline, 44 high, shown only after a change. "Profile arrangement . Optional" collapsed row 56. Stack height 44+12+140+12+44+12+56 = 320, fits.
- Colours tab: one group, 8 rows min 48: two 24px discs overlapping -6, name 16/600, check right when selected, `#454545` hex never shown. Scrolls inside body.

## 7. Action step
- One group (radius 20, `#f7f7f7`), 4 rows min 64, divider `#e8e8e8`. Row: icon 24, label 16/600, consequence 14/20 `#454545` (one line, wraps ok), radio right: 22px circle ring 2px `#111`; selected = 12px `#111` dot + row bg `#fff` with ring 2px `#111` inset. Not colour only.
- Selected row expands in place (instant, no height animation) to its single field: label 14/600, field 56 (spec of s5). inputmode tel/email, autocomplete tel/email. Booking = no field. Body scrolls (4x64 + 82 = 338).

## 8. Services and Plan
- Services: group of up to 4 rows, min 64: name 16/600, meta 14 `#454545` "Ask for price . Example"; trailing remove button 44x44 (aria "Remove Haircut"). Tap row to edit in place (name field 56, price field 56, duration chips 44). "Add another" text 16/600 48 high; "Use these" outlined pill 48 (`#fff`, 1px `#00000026`). Empty list valid, one 16/24 sentence.
- Plan: radio group; Free first, selected, expanded with limits as 14/20 list. Core/Pro/Business rows min 64: name 16/600, one-line 14, price 16/600 right with "provisional" 14 `#454545` beneath. Footnote 14/20. Continue label "Continue with Free". Phone stays at Peek.

## 9. Finish
- Title "Your page is ready" (28/32), subtitle 14/20. Status row: 24px black disc + white check, "Saved as a draft. Not published." 16/600, only after the read-back. Primary pill 56 "Open Studio (testing route)"; under it "Testing environment only, not part of the customer experience." 14/20. Preview goes to Peek then full-screen with outlined 48 "Edit in Studio". Dashed devroute box, green done banner (`#effaf2`) are deleted.

## 10. Footer (84 high, fixed in sheet, bg `#fff`, padding 12 16 max(20, safe-area))
- Back: text button 72x52 min, 16/600 `#111`, no underline, step 2+. Continue: flex 1, min 160, 52 high, radius 999, `#111`, 16/600 `#fff`, hover `#2a2a2a`, press scale .98. Flat: no gradient, no inset highlight, no lift shadow.
- Skip (steps 3-6): 16/600 underlined text link, 44+ high, sits in the row between Back and Continue so the footer stays 84. Deviation from ux-spec "above Continue": above would add 44px and shrink the body; revisit if the Skip row reads cramped at 320.

## 11. Errors, notices, focus
- Field error: under field, 14/20 600 `#111` with 16px outline alert icon, field ring 2px `#111`, `role=alert` once per press, focus to field. No red, no tint.
- Failed-save notice: above footer, `#fff`, ring 1px `#111`, radius 14, padding 12 16, 14/20 text, "Retry" outlined pill 44 high on the right.
- Focus (every interactive): `outline:3px solid #111; outline-offset:3px`; on `#111` fills add `box-shadow:0 0 0 3px #fff`. Never `outline:0` without replacement. All targets >= 44x44.

## 12. Motion (nothing else moves)
- Step change: body translateX(24px->0) + opacity 0->1, 180ms ease-out; title and footer static. Preview change: masthead and service list cross-fade 160ms; phone frame static. Progress fill 180ms. Sheet snap 240ms. Press 120ms scale .98. No aurora, no hover lift, no blur, no looping.
- Interruption: transitions are CSS and retarget; a second tap restarts the 160ms fade from the current opacity. Reduced motion: every duration 0, no slide, no fade, snap instant, preview swaps in one frame.

## 13. Desktop 1440x900
Left panel 520 (same bodies, tile grid 3x3 at 520 => 164px tiles, same 76 high), right the uncropped phone 700 tall on `#f4f4f2`, whole page background `#f4f4f2`, left panel `#fff` radius 28, no scaling hack.

## 14. Alternatives (same content, 390x844, Type + Name; Default 439px sheet)
- A "Boxed": bezel phone 296, progress on stage, grey tiles, black selected fill + check, boxed field. Tests: Studio dialect carried straight into the form.
- B "Outlined + headline field": phone 340 wide, 7-segment progress, white outlined left-aligned tiles (selected = 2px ink border + check + bold), name typed as 28px display text on a 2px rule. Tests: whether the field can be the headline and the page larger.
- C "Open": no bezel (page card 358), progress inside the sheet, boxless 40px icon discs, underline field, 48px divider rows. Tests: removing boxes entirely.
- Math (not rendered): all six states fit 331px (A 300/320, B 324/328, C 324/324); worst case B Name with 3px spare.

## 15. Recommendation: A
Reasons: reuses the passed Studio dialect without a new one; tiles are the largest tap targets (114x76) with the strongest non-colour selected state (inversion + check + a11y state); real phone bezel keeps "preview behind the phone" literal and gives 341px of visible page at Default; spare height (31px Type, 11px Name) survives longer names and the Trades chip row. B's headline field is rejected: 28px display input conflicts with the title above it and consumes the Name budget. C is rejected: `#f1f1ef` discs on `#fff` are 1.1:1, selected state relies on a black disc only, and progress inside the sheet vanishes at Peek. Borrow from none. Open risk: all of this is unrendered; the capture audit must show 0 text under 14px, 0 buttons under 44px, bodyOverflowPx <= 0 before the engineer builds.
