# Critic round 1: first-run Studio home, alternatives A / B / C
Reviewer: taplo-visual-critic. Opened all 6 stills, baseline (m, d) and the 3 refs before reading art-direction.md and ux-spec.md. Stills only; AI review, not user testing.

## What is genuinely good (all three)
- The baseline's mess is gone: no zero counters, no black "ready to share" card, no 7-of-7, no "Edit my page" laid over the services row. One Publish, one Draft pill, honest "Only visible in this browser".
- The customer-page miniature (cream, brown, serif, real photo) is the only colour; Taplo UI stays monochrome as the contract requires. It looks like a product, not a template.
- Sample chip beside Services and the honest "local to this browser" line are present and readable.

## A. Preview-led + floating dark bar
- 390 / default -> the dark bar sits over the note: "...which are" is visibly cut by the bar -> reads as a clipping bug, and the one honest sentence is half hidden -> give the note its own space above the bar, or drop it from the page body (bar already says it).
- 390 / default -> bar (~72px) + dock (~64px) + status stack ~160px of floating chrome over a 844px screen; phone bottom and Services ("Hair" cut mid-label) are cropped at the dock edge -> the preview looks accidentally cut, not framed -> only one floating layer is allowed.
- 390 / default -> positive: phone dominant, Publish reachable, headline 16px is modest but legible.
- 1440 / default -> phone is centred at x~694 but "Edit my page" and the note are centred at x~768, and the bar at 768: three different axes -> looks misaligned, not designed -> one axis. Publish sits at the bottom of the viewport (y~840), 700px from the Draft status it belongs with. Dock rail at x=64 is detached from everything. Large empty canvas.
- Disposition: 390 revise; 1440 revise.

## B. Calm path (timeline)
- 390 / default -> best answer to "what do I do": 30px headline, full-width 56px black Publish, all above the fold. Genuinely the clearest first five seconds of the three.
- 390 / default -> the floating dock lands on top of the phone's description and "Book your chair" (dock at y~770 over the preview start) -> the owner's first look at their page is covered by chrome -> reserve space or move dock; the preview is the product's proof.
- 390 / default -> timeline rail + "Done · Your page, drafted" check node: decoration with no decision attached; the grey well around the phone adds a second container -> remove the rail now (art-direction admits nothing follows yet).
- 1440 / default -> strong type, but the column hugs x=408 with ~310px dead on the right and the preview card is cropped at the fold with Edit in a footer strip; Services never visible above the fold. The page the owner just built is secondary on a desktop -> weakest "see my page".
- Disposition: 390 revise; 1440 revise.

## C. Stage + rail / bottom sheet
- 1440 / default -> the page is the hero (400x640, Services fully visible, three prices), Edit sits directly beneath on the same axis as the phone, rail on the right with status, headline, one black Publish. Clear focal point, one primary, honest note, generous space. Closest to the references' calm. Faults: the rail headline wraps with a stranded word ("publish") at 24px -> widen rail or set 22px; the sentence "Everything you need is filled in." is vague, use "Add photos" as the only tip and cut one line; rail ends at y~530 with empty stage canvas around, acceptable.
- 390 / default -> everything the task needs is in one viewport: Draft status, preview hero, Edit, headline, Publish, tip, dock. Passes acceptance 1 at 844. Faults: (a) Publish is a ~100px pill beside a note while "Edit my page" is a 340px outlined bar -> the secondary action outweighs the primary by width -> make Publish full width 52-56px with the note under it, Edit stays outlined and smaller; (b) the grey stage runs edge to edge with only top corners rounded under a 16px-gutter status row -> seam looks accidental -> 16px gutter and 28px radius all round, or full-bleed with no radius; (c) the phone shows only the hero; Services peeks nowhere, so the page looks like a one-card page -> let 24px of Services show under the hero or keep the crop deliberate with a taller frame when height allows; (d) grabber implies a draggable sheet; if it is static it is a false affordance.
- Disposition: 390 revise (minor, close); 1440 pass (fix the headline wrap).

## Choice: build C, with B's headline/Publish proportions on the sheet and rail
Reason: only C keeps the page the hero and the action beside it on both viewports, and its rail extends to attention rows and Share without reflow. B is the right copy hierarchy, wrong layout. A's floating bar costs a layer that collides with the note and dock.

## Five fixes before implementation (priority order)
1. C mobile: make Publish the dominant control (full width, 52-56px, note below), shrink Edit to secondary weight. Today Edit wins by area.
2. C mobile: verify at 390x600 and with a 340px visual viewport that Publish stays visible and unobstructed, the dock hides with the keyboard, and the sheet does not cover the whole preview. Cannot be judged from these stills; acceptance 2 and 16 are still open.
3. DOM and focus order: status, headline, Publish before the preview (the rail is last visually on desktop, so use order, not DOM, to place it right). A flagged this for itself; C needs the same.
4. C mobile stage polish: gutter and radius on the grey stage, remove or make functional the grabber, show a sliver of Services (or a deliberate crop) so the page reads as a page; keep the Sample chip visible.
5. C desktop rail: fix the widowed headline, trim the vague sentence, keep rail top aligned to phone top; confirm Space Grotesk headline width in the build (mockups used Inter).

## Cannot be judged from stills
Sheet drag/rise motion, press states, focus rings, reduced-motion, keyboard-open behaviour, the real Space Grotesk headline, real screen-reader order, contrast of the 14px muted text on the grey stage (measure in the browser; it looks adequate on white).
Ambition note: against Linktree/Notion these are quieter by contract (monochrome UI). That is a choice, not a defect, but no alternative offers a signature moment beyond the photo; do not add decoration to fix that.
