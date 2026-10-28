# Onboarding follow-up: second review round

Branch `claude/modest-cerf-4tont1` (remote `AbuFitz/taplo`). Nothing is deployed or merged by this work.

## Which version was reviewed

I cannot see which deployment produced the owner's screenshots, and the repository has no preview-deployment configuration, so I cannot hand over a hosted preview or confirm the build. What I can say from the content: the described screens (Paper / Quartz / Monochrome / Glasshouse under *Looks* plus a separate *Colours* tab, tabs over the first row, stacked white plan boxes with grey pills, the short development-style ending) match this branch as it stood before this round, not an older deployment. This round replaces all of them. To review the final branch safely, check out the branch head and run it locally (`npm run dev`) or ask for a private Vercel preview of the branch; I have not created one.

## 1. One collection of eight starting looks

`starting-looks.ts` pairs each approved colour direction with an existing design, so typeface, arrangement and composition come from the engine as it is (Carbon / white with Monochrome, Cobalt / ice with Quartz, Black / ember with Noir, Plum / pearl with Maison, Blue / violet with Borealis, Silver / ink with Glasshouse, White / electric blue with Paper, Rose / warm white with Terra). *Looks* is now the only grid. The old Paper / Quartz / Monochrome / Glasshouse set is no longer shown in registration (legacy saved designs still resolve).

- Illustrations are new miniatures drawn from each look's own colours and typeface (card, mark and name, block, action), not page screenshots.
- *Adjust colours* is a separate panel with a different purpose: accent colour, an optional logo palette (**Use these colours**), and **Use this look's original colours**. Adjusted colours persist when the look changes; Undo restores the previous state; content is untouched.
- The first automatic recommendation is White / electric blue: solid and still.

## 2. Movement

Every gradient look moves as soon as it is chosen (no toggle); solid looks stay still. Each uses its own treatment of the existing shader engine: Cobalt (warp), Ember (smoke), Plum (orbs), Violet (aurora), Silver (silk), Rose (swirl), all slow. Reduced motion shows the still version of the same colours. WebGL is only mounted when movement is on, so the still look is the approved one.

## 3. Visual continuity: causes found

Separate layers, separate causes:

- **Profile surface:** the full-width photo header (`poster`/`banner`) faded to a flat copy of the page colour, and with no cover it painted an accent-tinted 72px band. Over a moving background both read as seams. They now fade with a mask (the page shows through) and the empty band is transparent.
- **Preview container:** the handset area faded to transparent at the bottom, showing the backdrop as a lighter band. Removed.
- **Page vs document:** `theme-color`, `html` and `body` already took the page's base colour (earlier work).
- **Operating system chrome:** it can only show one flat colour and cannot show an animated image. While a background moves, a safe-area scrim carries the moving field into the flat colour at the top and bottom edges (zero height where there is no safe area).
- The white strip on non-profile pages was `theme-color` fixed at white; a `ChromeColour` component follows the page colour (earlier round).

Verified in Chromium with a simulated 47px notch (CDP safe-area override) for all six moving looks over three frames: the top row equals the flat page colour and equals the `theme-color` value. **Not verified:** real iOS Safari or Android Chrome, toolbar expand/collapse, overscroll, or the iOS 26 top-bar tinting.

## 4. Mobile composition

Tabs are gone (no control covers the first row). The grid adapts (`auto-fill`, rem-based, so larger text gives one column and narrow phones keep two). A spec checks, at 320/375/430, that titles end before their content, the last item of each step ends above the action row, the selected tile and label sit clear of the footer, and with a simulated keyboard the field, actions and error stay visible. Category and goals keep the page partly visible above an adaptive sheet.

## 5. Room to grow

Free first and easy to choose; a selected plan opens to show what it includes with check marks; a restrained notice states prices and limits are provisional (not approved terms). A plan is marked "Matches your goals" only when the owner chose online booking and the plan's own list includes online bookings. No decoration, no theme-limit claims.

## 6. Ending

Plan, then a short reveal (form clears, the draft is shown whole and non-interactive; reduced motion skips it), then **Review your page** with an account form (email and password, validation). With no provider, submitting says plainly that account creation is not available here and nothing was saved. A clearly labelled **Development route** opens Studio without an account; it exists only where the demo environment is enabled and no production bypass was added. Success copy appears only after a real successful connection; that path is unimplemented because no provider is connected (`account.ts` is the single boundary).

## Evidence and tests

Screens: `docs/review/followup/` (eight looks at 390 and 1440, picker top and scrolled, Adjust colours, journeys at 320/375/430, plans, reveal, account with errors and unavailable feedback, keyboard open and error, desktop journey, Studio). Generated with `TAPLO_SHOTS=1`.

| Area | Result |
| --- | --- |
| Unit tests | passing (colourways, arrangement suggestion) |
| Registration looks, ending, continuity, composition, large text, reflow | passing in Chromium |
| WebKit (desktop profile) | 16 of 16 passing: looks, ending, large text, reflow, category wording |
| Large text 150% and 200%, reflow at 320 x 256 | passing in Chromium and WebKit |
| Full Chromium suite | see the final report |

## Verified, simulated, not built

- **Verified (automated, Chromium and partly WebKit):** looks apply with their colours, motion rules, kept colours and undo, readability of text on all eight, ending flow and honesty, composition checks, large text and reflow.
- **Simulated:** soft keyboard (viewport shrink), notch (CDP safe-area override), reduced motion (media emulation).
- **Not verified:** any real iPhone or Android device; native browser chrome behaviour; Firefox for this round; touch on WebKit mobile profile.
- **Not built:** account creation, persistence after sign-up and its success confirmation; plan pricing and limits are placeholders.

## Reported separately: licensing

The marketing films still embed CC BY-SA car photos (`docs/asset-licences.md`). Not resolved, not swapped.
