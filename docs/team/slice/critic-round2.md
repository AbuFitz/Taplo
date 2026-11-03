# Critic round 2: first-run Studio home (Taplo)
Reviewer: independent visual critic agent (read-only; report transcribed by the coordinator because the agent had no Write tool). Build: Studio at commit 46ae988, HEAD a28bac7, production build on :3200, fixture Marlowe & Finch. Stills only; an AI review, not user testing.

## Dispositions
- 390x844: revise. 1440x900: revise. 390x600: pass for the above-the-fold primary-action criterion only.

## Findings and coordinator responses
| # | Finding | Response |
| --- | --- | --- |
| F1 high | Share card shows and copies `mytaplo.com/{slug}` while the page is browser-only | Fixed: shows the working address and says it works in this browser only |
| F2 high | Desktop published capture lost the email icon | Not a bug: the capture script itself replaced the fixture's contacts with a phone only between captures. Re-capture with an unchanged fixture |
| F3 medium | View page and Copy duplicated on the published screen | Fixed: card copies, Share row shows address and QR, header keeps View page |
| F4 low-medium | Incomplete state button said "Do this now" | Fixed: names the destination (Add contact details, Choose your business type, ...) |
| F5 low-medium | Header shows "Business Plan" on desktop | Open: it lives in the shared dashboard shell, not the Studio slice |
| F6 low | Green Published pill against monochrome UI | Fixed: monochrome filled pill |
| F7 low | Headline wraps differently by state | Intentional text-balance; left as is |
| F8 low | Mobile preview below the fold | By spec: status and action first |
Not found in stills but found by the coordinator afterwards: the mobile dock rendered at the page bottom (y=1042 on an 844px screen) because the dashboard's arrival animation left `translate: 0 0` on the page container, which traps fixed descendants. Fixed in `portal-workspace.css` (animation now ends at `translate: none`, fill-mode `backwards`).

## Genuinely good (critic)
One filled button per state; status and action above the fold; baseline clutter gone; Edit no longer overlaps the preview; truthful short copy; 390x600 keeps the primary action visible.

## Not judgeable from stills
Mobile Edit button and dock, focus order and rings, Esc and focus return, the QR sheet, loading and error states, keyboard-open viewport, motion, real contrast.
