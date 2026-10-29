# Art direction: first-run Studio home (draft complete, unpublished)
Author: taplo-art-director. Inputs: ux-spec.md, research-board.md, studio.css, globals.css tokens. Files: `alternatives/{a,b,c}.html`, PNGs `a|b|c-390.png`, `a|b|c-1440.png`, `contact.png` (all six). Static HTML, no production file touched.
Surface rule: Studio = clarity and control. Product UI monochrome; the only colour is the photograph and the customer page miniature (cream/brown belong to the business page, not Taplo).

## Shared system (all three)
- Tokens (real): bg #f8f8f8, card #fff, ink #111 (--primary), muted #5d5d5d (oklch .46, 6.5:1 on #f8f8f8), line #e8e8e8, ring 0 0 0 1px #0000001a. Dark surface #101010 / text #f5f3eb / sub #c4c1b9 (the existing `.studio-next` pair).
- Fonts: Inter Variable (UI), Space Grotesk Variable (display headline only, <=1 per screen), Geist for numerals (none shown at zero). Mockups fall back to Inter: Space Grotesk is not installed locally, so check headline width in the build.
- Spacing scale 4/8/12/16/24/32/48. Gutter 16 at 390, 40 at 1440. Radius: pill 999, cards 28, sheets 28/28/0/0, phone 46.
- Type: min 14px everywhere (status, note, tip 14/20); body 16/24; button 16/600; card headline 16-20; page headline 30 (390) / 44 (1440) in B only.
- Touch: every control >=44px (buttons 48, primary 56 in B); dock items 48; text-link tips get a 44px hit area through padding.
- Order (identical): header, status (hollow dot + `Draft` pill + "Only visible in this browser"), ONE next action ("Your page is ready to publish", filled `Publish`), no attention rows (all zero), preview + `Edit my page` below the frame (never overlaid), note, one tip. No counters, checklist, plan text, Share row. Dock = 4 items (Page, Services, Bookings and messages, Share). Verbatim note: "Your page opens in this browser only. A public address needs accounts and publishing, which are not connected yet."
- Imagery: photograph only inside the preview, `object-fit:cover` hero, 118px tall in the miniature, bottom 38% faded into the page card with a 62%-to-transparent mask (matches the real renderer). No frame tint, no filters on the photo. A uses barber-chair, B barber-counter, C barber-chair (any may swap).
- Sample content: "Sample" chip (14/600) beside Services; B's footer also says "services are sample content"; C's rail says "3 · sample content". Prices GBP 34 / 32 / 28.
- Motion (purposeful only): press feedback `transform:scale(.98)` 120ms on buttons; C's sheet may rise 240ms ease-out once on load so the action reads as the answer; nothing loops. `prefers-reduced-motion`: all transitions and animation removed; status and action are static in every case.

## A. Preview-led column + sticky action bar
- Hierarchy: the page is the hero (phone 340 wide x 450 at 390; 372 x 470 at 1440). Status line above it; the next action lives in a floating dark bar fixed 84px above the dock (bottom 24px on desktop), 28px radius, headline 16/650 + 14px sub "Publishing is local to this browser." + cream `Publish` 48px.
- Surface: flat #f8f8f8 page, no cards; one dark object (the bar) so the primary action is the only high-contrast element after the photo.
- Spacing: 12px between status, phone, Edit; bottom padding 240px so scrolled content clears bar + dock.
- Trade-offs: best "see my page first" feel and Publish always reachable; the full note and the tip sit under the bar until scrolled (bar carries the short honest line). Bar + dock stack = ~160px of fixed chrome at 390. Order caveat: action card is below the preview in reading order; the ux-spec wants it above the preview, so a screen reader needs the bar first in DOM (fix at build).

## B. Calm path (timeline, newest step first)
- Hierarchy: type does the work. Status, then 30/44px headline, one sentence (16/24), 56px full-width black `Publish` (auto width, min 200, at 1440), the note. Below, a 2px rail (x=11) with a filled check node, "Done · Your page, drafted", and the preview as a 28px-radius card: tinted well (#efeeec to #f6f5f3), 300 (390) / 380 (1440) phone cropped by the card edge, footer row with name and `Edit my page`. Tip after the card.
- Surface: one white card on the flat page; shadow 0 16px 32px -20px #0000002e + 1px ring. Big white space (24 between blocks, 32 at 1440).
- Trade-offs: the strongest answer to "what do I do next", closest to the UX order, easiest to extend (after publish a new node "Published in this browser" slots on top; nothing teased now). The preview is below the fold at 390 (phone starts ~y 480), and services are cropped, so it under-sells "see my page". Best for new owners; weakest for returning owners who want to edit.

## C. Workspace: preview stage + slim rail (mobile: bottom sheet)
- Desktop: stage 920 wide (#eeeeec, radius 28, full height minus header) holding a 400 x 640 phone with services fully visible, `Edit my page` 400 wide directly under it. Rail 336 wide, no cards, hairline-separated sections (24px padding): status, 24px headline, 14px sentence, full-width `Publish` 48px, note, then sample services count, then tip.
- Mobile: status strip, stage with 340 x 395 phone and `Edit my page`; bottom sheet (white, radius 28 top, grabber 40x4, shadow 0 -18px 40px -20px #0000004d, ~245px high) with headline 20px, `Publish` + short note on one line, tip, dock inside the sheet (replaces the floating dock).
- Trade-offs: most "app-like", preview dominant at 1440 and a rail that scales to attention rows and the Share row without reflow. Costs: sheet covers the lower preview on phone, and the stage is mostly empty canvas at 1440. Rail needs a 1180 breakpoint fallback (existing studio.css already stacks it).

## Recommendation
Build **C on desktop and A's reading logic on mobile**, i.e. C as specified, with the mobile sheet's first line identical to A's bar (one dark-or-white object, always visible). If only one can ship: **C**. Reasons: (1) it keeps the right column the spec already assumes, so the existing `.studio` grid (64px dock, 340px side) needs the least change; (2) the preview is dominant and complete at 1440 with services visible; (3) the sheet puts status, headline and `Publish` inside the first 844px viewport together with the preview (acceptance 1 and 2), where B pushes the preview below the fold; (4) the rail has room for attention rows, Share and "Compare plans" later. Use B's headline treatment (Space Grotesk 24px in the rail) only. Risks to check at build: sheet height at 390x600 (acceptance 2), dock hidden while a keyboard is open, DOM order (action before preview), Space Grotesk headline width.
