# QA round 3: setup (/onboarding) and Studio shell

Build: production build at http://localhost:3200 (branch claude/modest-cerf-4tont1, HEAD 043f91c). Not rebuilt or restarted; no application code edited; port 3100 untouched. The contract was read; no critic output was read.
Tool: Playwright Chromium 1194 with `--no-sandbox`, scripts in `/tmp/claude-0/qa/` (walk.js, nav2.js, kbd.js, kbd2.js, studio.js, bottom.js, pub*.js, home2.js, misc.js), screenshots in `/tmp/claude-0/qa/s/`.
Fixture: an isolated fictional business ("Marlowe & Finch", Barber), created by the real setup flow in a fresh browser context. Nothing external was created. Publishing is local to the browser.
Viewports: 390x844, 390x600, 1440x900, plus open-keyboard cases: (a) iOS-style, `visualViewport.height` stubbed to 504 with innerHeight kept at 844; (b) Android-style, real 390x500 viewport.

## What passed
- All 7 steps at 390x844, 390x600, keyboard (a), keyboard (b) and 1440x900: the field and Continue are inside the visible viewport in every state, with no horizontal scroll (scrollWidth equals the viewport width in all runs). The one exception is the Finish step at short heights (see 3). Console errors: 0.
- Validation on activation: an empty step 1 and an empty step 2 show an alert, stay on the step and keep the entries. "Call you" with no number shows the error. Rapid tile clicks end with one tile pressed. A double-clicked Continue advances once. A 95-char name causes no overflow.
- In-app Back keeps the entered values. Refresh resumes on the same step with the name and services. Skip works on Look, First action and Services, and the draft keeps its sample content. No "Save and exit" exists on any step or on Finish.
- The logo link points to `/`. After tapping it on the Services step, the entry is still in localStorage (`step: services`). Reopening `/onboarding` resumes on Services with the typed value.
- Finish gives "Saved as a draft. Not published." Open Studio goes to /dashboard with `onboarded: true` and `published: null`. The Studio pill reads "Draft".
- Studio: the dock (phone) or rail (desktop) is present on Home, Page (editor), Services (Treatments), Bookings, Reviews, Team, Products, Analytics and Settings. The dock is at y764-832 (y520-588 at 600) and the rail is 232px wide. Content never sits under the dock when scrolled to the bottom (checked on all 8 non-editor routes at both phone heights). Zero horizontal scroll on every route.
- Dialogs and focus: the More sheet traps focus, and Esc returns focus to "More". The QR sheet moves focus to Close, and Esc returns focus to "Show QR" (390 and 1440). The onboarding "Show full preview" moves focus to "Return to editing", and Esc returns focus to "Show full preview".
- Publish: Home Publish gives "Published · v1", moves focus to the heading, and announces "Published in this browser." The Share row shows one address, and the editor Publish gives the toast "Your page is published." Before publishing there is no Share row.
- axe (wcag2a, wcag2aa, wcag21a, wcag21aa): 0 violations on all 7 onboarding steps at 390, on look and plan at 1440, and on Home, Page and Settings at 390, and Home, Page and Services at 1440. This supplements the manual checks and is not WCAG certification.
- Reduced motion (emulated): setup is usable and nothing breaks.

## Failures, most severe first

### 1. Home primary action "Add contact details" lands nowhere useful, and Publish is disabled without a reason at phone width (Medium-high)
- Route /dashboard to /dashboard/page, 390x844, draft with no contact details.
- Steps: open /dashboard, tap "Add contact details". The editor opens showing only the preview, with no panel open and no highlighted field. To enter a phone number you must tap Content, tap "Finish this in Business details" and expand "Contact details".
- The Publish button is disabled. At 390 it has no visible reason, no `title` and no `aria-describedby`. At 1440 the sentence "To publish: at least one way to contact you." is shown. A phone user sees a grey button with no explanation. Screenshots: s/pub-1.png (390), F.png (1440).

### 2. The first action chosen in setup is shown as something else after the first contact is added (Medium)
- Steps: setup, step 4, choose "Get in touch". The preview shows "Get in touch". In Studio, add a phone number under Business details. The page's main button now reads "Book an appointment", with a phone icon beside it. State `booking.mode` is "contact" throughout, and the widget label is "Book an appointment". The owner never chose a booking button. Screenshots: s/pub-1.png against s/pub-after.png.

### 3. Finish step hides its main button at short heights (Medium)
- Route /onboarding?step=finish.
- 390x600: "Open Studio" sits at y493-545 and the footer begins at y530. The lower part of the button is faded and clipped, and the body scrolls inside a 168px area (s/fin-390x600.png).
- 390x500 (an Android keyboard-sized viewport): the button is at y445-497, under the footer (y430-500). `elementFromPoint` at its centre returns `sf-foot`. The body is only 116px tall (scrollHeight 323), so the user must scroll inside a small box to find the primary action.
- Works at 844, 667 and 640.

### 4. Browser Back after using in-app Back/Continue loops, and Back to the first entry shows the wrong step (Medium-low)
- In-app "Back" and "Continue" both push history entries. Sequence: reach Services, tap Back, tap Continue (history length 8). Browser Back then gives: Action, Services, Action, Look, Name, and then URL `/onboarding` while still displaying "What's it called?" (should be step 1). The in-app Back button should not push; the first entry (no `?step`) is ignored by `onPop`.

### 5. Validation focus and message layout (Low-medium)
- Step 4, "Call you", empty number, Continue (390 and 1440): focus goes to the selected radio, not the empty phone field, because the selector picks the first `input` or `[role=radio][aria-checked=true]` in DOM order. At 390x844 the notice ("Add the detail for the choice you made...") overlays the phone input (s/844-4err.png).
- Step 2 with an empty name gives three alerts at once: "Add your business name to continue.", "Use at least 3 characters." and "Add your business name and a valid web address."

### 6. Rail order differs from dock, More and editor-menu order (Low)
- At 1440 the rail reads Home, Page, Treatments, Products, Team, Bookings, Reviews, Analytics, Settings. The dock and More read Home, Page, Treatments, Bookings, then More: Reviews, Team, Products, Analytics, Settings. The code comment says one list orders them the same.

### 7. Clipped labels (Low)
- 1440 /dashboard/page, Content panel: buttons "Finish this in Business details" (shown as "Finish this in Busine...") and "Add a team member" overflow their cards (s/F.png).
- 390: the dock label "Treatments" is truncated to "Treatm...".

### 8. Keyboard order (Low)
- On phone widths the dock is first in the tab order on every Studio page (5 stops before the content: Home, Page, Treatments, Bookings, More). Home at 390 then has three further tab stops inside the preview iframe, and onboarding step 3 has four (one off-screen at 390). Esc does not matter here, but a keyboard user has to tab through the live preview contents. There is no way to skip them.
- Step 2 at 390: the "Add a logo or photo" control gives two tab stops, and one is off-screen.

### 9. Publish has no confirmation and no next step in the editor (Low, design note)
- Editor Publish is one tap, with only a toast (it covers the top of the page) and the button turning to "Live". There is no share step in the editor. The Home Share row appears only on Home. Contract-wise this is acceptable (publish is separate from draft creation).

### 10. Carry-over from round 2 (Low)
- The QR sheet footer still reads "Preview link. This page opens in this browser only." after publishing.

## Not covered and limits
- No real device, no real software keyboard, no Safari/WebKit: the keyboard cases use emulation. Chromium only.
- Not exercised: the real plan-account path (accounts are not configured in this environment, so Finish offers the labelled testing route "Open Studio"). Payments and external messages were not touched.
- Not retested: look/colour preservation after style changes, photo/logo uploads, Services pricing modes, and the Products and Team add flows.
- Failed-operation paths: storage-full and denied-clipboard were not rerun this round (covered in round 2).
