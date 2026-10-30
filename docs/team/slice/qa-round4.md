# QA round 4: setup (/onboarding) and Studio shell

Build: production build at http://localhost:3200 (not rebuilt or restarted; port 3100 untouched; no app code edited). Contract read; critic output not read.
Tool: Playwright Chromium 1194 (`--no-sandbox`), scripts in `/tmp/claude-0/qa4/`, screenshots in `/tmp/claude-0/qa4/s/`, axe-core 4 (wcag2a/aa, 21a/aa).
Fixture: fictional "Marlowe & Finch" (Barber), first action "Get in touch", created by the real setup flow in fresh contexts. Nothing external touched; publish is browser-local.
Viewports: 390x844, 390x600, iOS-style keyboard (visualViewport stubbed to 504), Android-style real 390x500 (and 450), 1440x900.

## Round-3 findings re-tested

| # | Round-3 finding | Result | Evidence |
|---|---|---|---|
| 1 | Home "Add contact details" lands nowhere; Publish disabled with no reason at 390 | Mostly fixed | 390: opens `/dashboard/page?open=details`, Business details sheet, reason line "To publish: at least one way to contact you." visible under the header and linked by `aria-describedby`. Still: the Contact details accordion is collapsed (one more tap), no tab is highlighted while the sheet is open. 1440: lands on Content with "Page blocks", no Business details open (reason line shown). |
| 2 | Main button becomes "Book an appointment" after a phone number is added | Fixed for the main button, new side effect | After adding 07700900123 the main button is "Call" (`tel:`), `booking.mode` stays `contact`. But a calendar icon link and a full-width "Book an appointment" block (`/marlowe-and-finch/book`, `booking_click`) now appear in the preview, though the owner chose "Get in touch" and `onlineBookingReady` is false. See N1. |
| 3 | Finish hides "Open Studio" at short heights | Partly fixed | 844, 667, 600, 568: button hit-testable, whole. 600: fully visible at y477-529 but the body is a 168px scroller. 500 and 450: `elementFromPoint` at the button centre returns `sf-foot` (button 429-481 under footer 430-500; 405-457 under 380-450). Still broken at keyboard-sized heights. |
| 4 | Browser Back after in-app Back/Continue; first entry shows wrong step | Mostly fixed | In-app Back no longer pushes. Browser Back from Services after Back+Continue: Action, Action, Look, Name, Type. First entry `/onboarding` now shows "What do you do?" (fixed). Residual: a duplicate Action entry (one wasted Back press). |
| 5 | Validation focus and message layout | Not fixed | Step 4 "Call you" with empty number: focus goes to the radio button, not the phone input. At 390x844 the notice sits over the phone field (label barely visible, field hidden: `s/844-4err.png`); at 390x500 the field is fully hidden and Continue is pushed below the viewport (y459-511 of 500). Two alerts with near-duplicate text ("Enter the number people should call." plus "Add the detail for the choice you made..."). Step 2 empty: three visible alerts at once ("Add your business name to continue.", "Use at least 3 characters.", "Add your business name and a valid web address."). |
| 6 | Rail order differs from dock/More | Fixed | Rail: Home, Page, Treatments, Bookings, Reviews, Team, Products, Analytics, Settings. Dock plus More: Home, Page, Treatments, Bookings then Reviews, Team, Products, Analytics, Settings. |
| 7 | Clipped labels | Not fixed (partly better) | 1440 editor Content: "Finish this in Busine..." clipped and "Add a team member" spills past its card (`s/addc-1440.png`). Dock "Treatments" now looks whole at 390 (74px text in a 72px box, marginal) but is clipped at 360 (74 > 66). |
| 8 | Keyboard order: dock first, iframe tab stops | Not fixed | Phone Home: 5 dock stops first, then page controls, then 3 IFRAME stops. Editor: dock (5), Undo, Preview, tabs, 3 IFRAME stops. Onboarding Look: 4 IFRAME stops, one off-screen. No skip. |
| 9 | Editor Publish has only a toast (design note) | Unchanged | Toast "Your page is published." and the button turns to "Live". Acceptable under the contract. |
| 10 | QR sheet footer "Preview link. This page opens in this browser only." after publishing | Not fixed | Seen after publishing at 390. |

## New failures, most severe first

### N1. Adding a first phone number also adds a booking CTA the owner never chose (Medium)
390 and 1440 identical. After the phone is typed the preview shows "Call", then a calendar icon link and a "Book an appointment" block linking to `/marlowe-and-finch/book`, while Bookings says "Online booking is off". The "Book or enquire" content block reads "Book an appointment / Needs a first entry". A customer can tap a booking link that cannot book. Check what that link does on the live customer page.

### N2. Setup choice "Free" is shown as Business in Settings (Medium)
`setupDrafts.planIntent` is `free` (Continue with Free), but state `plan` is `business`, and Settings, Plan shows "Business · £39.99/month" with all features unlocked. The owner sees a plan they did not pick. If this is the intended testing default it needs a label.

### N3. Finish and validation layouts fail at keyboard-sized heights (Medium)
See round-3 items 3 and 5 above. At 390x500 the Finish primary action is covered by the footer and the Step 4 error pushes Continue out of view.

### N4. Deep links skip required steps (Low-medium)
In a fresh context `/onboarding?step=finish` shows "Your page is ready." and "Saved as a draft" for an empty draft; Open Studio then lands on Home with "Check your name and web address / 2 things to finish". `?step=plan`, `services` and `name` also open directly. `?step=bogus` falls back to step 1 (fine). The heading "Your page is ready." is followed by the sentence "Your page is ready. Publish it from Studio..." (duplicate wording).

### N5. Bookings, Hours tab: contrast (Low-medium, axe serious)
8 nodes `.schedule-closed` "Unavailable": #8b9398 on #fff, 3.12:1 (needs 4.5:1), 390 and 1440. Every other axe run below was clean. Bookings tab buttons carry `aria-selected` without `role="tab"` at 390 and 1440 (not flagged by axe, but not a valid tab pattern).

### N6. Editor sheets at keyboard height (Low-medium)
390x500 (Android-style), Business details sheet: the dock stays on screen (y420-488), leaving about 70px of sheet; the focused phone input sits just above the dock with no label visible (`s/kb4.png`). Usable, cramped. iOS-style emulation (vv 504): the sheet shrinks and the field is visible in the screenshot, but the field rect (y679) lies below the 504px visual viewport.

### N7. Offers: focus lost after "Add offer" (Low)
Treatments, Offers: pressing the toggle "Add offer" removes it and focus moves to `body` (screen reader and keyboard users lose their place). The submit button has the same name, and an empty submit shows the alert but leaves focus on the button rather than the title field. Works otherwise (adds the offer; one "Add offer" button visible at a time).

### N8. "More" has no current state (Low)
On Reviews/Team/Products/Analytics/Settings at 390, the More button is visually active but has no `aria-current`; the sheet marks the current item with `aria-current`. Fine in the sheet.

### N9. 390 editor: no tab selected after the sheet closes (Low, design note)
Content/Profile/Design/Settings show no active state when the sheet is closed (1440: Content is selected via `role=tab`, `aria-selected`). At 390 the tab opened from "Add contact details" (Business details) highlights no tab. Active state does show while Design/Profile/Settings sheets are open.

## Passed
- Onboarding 7 steps: field and Continue inside the visible viewport at 390x844, 390x600, iOS-style keyboard (vvh 504), Android 390x500 (except Finish, N3) and 1440x900. Console errors 0 on every run.
- Zero horizontal scroll on all onboarding steps, all 9 Studio routes, and the editor tabs at 390 and 1440.
- Deep link `?step=plan` works with and without a draft; refresh resumes on the same step; in-app Back keeps values; browser Back reaches Type.
- Studio dock (390) and rail (1440) present on Home, Page, Treatments, Bookings, Reviews, Team, Products, Analytics, Settings. More sheet traps focus (Tab cycles inside, Close included), Esc returns focus to More, navigation closes it, browser Back returns.
- Publish reason line "To publish: at least one way to contact you." visible at 390 and 1440 (also 390x600), disappears after adding a phone, Publish enables. Publish gives "Your page is published." and Home shows Copy link and Show QR; QR Esc returns focus to "Show QR".
- Reviews and Bookings have an H1 each; Bookings tabs Calendar/Enquiries/Hours switch correctly; Hours shows Online booking, Weekly hours, Dates that are different, Booking rules.
- axe (wcag2a, wcag2aa, wcag21a, wcag21aa): 0 violations on all 7 onboarding steps (390 and 1440), 9 Studio routes (390 and 1440), 4 editor tabs (390 and 1440), Bookings Enquiries. 1 violation: Bookings, Hours (N5). Not a WCAG certification.

## Limits
Chromium only. No real device or software keyboard; keyboard cases use stubbed visualViewport and resized windows. Customer-side `/book` link behaviour, photo uploads, Services pricing modes, and Products/Team add flows were not tested. No accounts, payments or messages. Reduced motion not rerun this round.
