# Taplo setup form: UX specification (rebuild of /onboarding)

Status: specification only. Engineering check, not a user test; no research is claimed. Linktree is comparative (docs/team/linktree-flow.md, text only, 2022 captions possibly stale). Locked: account at the end, Free visible, preview behind the movable sheet with full-preview and return controls, one renderer and one draft state, optional business content, categories suggest only, Looks/Colours and "Choose a look." stay, manual choices survive, completion saves an unpublished draft, fonts untouched.

## 0. Source discrepancies to resolve first
- store.ts:24 order is business, widgets, industry, goal, reach, contacts, plan, publish. docs/onboarding-audit.md lists industry before widgets. The code is truth: the look comes 2nd, type 3rd.
- Account step lives inside PublishStep (Onboarding.tsx:470-524) and, with capabilities().accounts false (src/lib/capabilities.ts:25), shows a form that cannot create anything. Replace per section 4.
- SetupPanel.tsx sets sheet height to `auto` with min 36% / 52% and max 70% / 78% (lines 71-74). This is why the sheet height changes on nearly every step. Replace with the fixed model in section 3.
- Plan step uses `previewStep` false (Onboarding.tsx:142), so the phone is hidden on plan. Screenshot m-7 lists "Customer testimonials" under Free; src/features/subscriptions/plans.ts:24 lists "1 theme (matched to your industry)". The latter contradicts "categories never restrict design access". Plan copy must come from plans.ts, with that line reworded by the owner before launch.
- docs/team/setup-flow-results.md mockup v4 ends on "It's live", "available" slug and three looks. All three break locks (draft not published; no shared slug database in the sandbox; twelve looks and Looks/Colours). Take its order and tone, not those screens.
- docs/team/contract.md "Superseded" calls account-last a withdrawn Linktree claim; taplo-contract.json and the owner lock it. This spec follows the lock.
- SetupStyles.tsx was not read in full; Looks/Colours internals (SetupLook.tsx colourUndo, keptColours) are reused as they are.

## 1. Step map
Principle: the page looks like the owner's business after two answers (type, name). Everything else refines it. Order: Type, Name, Look, Action, Services, Plan, Finish. Progress is "n of 7" in words, not an 8-step bar.

| # | Step (title) | Captures | Why here | Auto-filled / inferred | Deferred | Skip |
|---|---|---|---|---|---|---|
| 1 | Type, "What do you do?" | Category (8 tiles + Something else) | Biggest content lever for one tap; scored 5 on capture | Section 2 engine: sample services, tagline, main button, location mode, goal, suggested look (a suggestion only) | Sub-types, "I also do", Show category, Where work is done | No. "Something else" is the exit and takes a free-text label |
| 2 | Name, "What's it called?" | Name (required); optional one-line description; optional logo | The page becomes theirs | Web address from name (editable, local validation); sample tagline replaced by theirs if typed | Cover photo, full description | Name no; logo and line yes |
| 3 | Look, "Choose a look." | Look (Looks tab) or colours (Colours tab); optional profile arrangement | Visible payoff while motivation is highest | Recommended look pre-selected, marked "Suggested", never locked to the category | Fine styling, fonts, arrangements | Yes; recommended look is kept |
| 4 | Action, "What should customers do first?" | ONE choice: Request a booking, Call, Message, Get in touch; then only that channel's detail | Replaces goal chips, the second "Main button" question and the contact step | Default from category (barber: booking; trades: call; cafe: get in touch). Stored into setupDrafts.goals and the existing primaryAction | Other channels, socials, website, WhatsApp number extras, products and "See the work" goals (starter sections already come from the type) | Yes; keeps the default, and a button with no detail shows "Add a number in Studio" only in Studio, never on the page |
| 5 | Services, "Add your services" | Review the 3 to 4 sample services: keep, rename, remove; add price/duration optionally | Real content is last because it asks the most | Samples shown as "Example" until the owner taps "Use these" or edits a row; no prices | Gallery, hours, team, vehicles, products (the FirstContent record forms leave onboarding) | Yes, "I'll add these later" |
| 6 | Plan, "Pick a plan." | Plan preference (Free preselected) | Near the end; informs Studio, charges nothing | Free | All billing | Yes (Continue with Free) |
| 7 | Finish | Account (when connected), draft save, handoff | Account last | n/a | Publishing | See section 4 |

Merges and moves, justified: goal + reach + main button become step 4 (one decision, one detail; the old contact step required channels and asked for many fields before value). contacts (first service forms) shrink into step 5 and the vehicle/photo/product record forms move to Studio. Industry moves from 3rd to 1st, because the engine needs it before name and look can look real (also the best captured score). The "Where is the work done?" and "Show category" questions move out (inferred, editable in Studio). Description moves to an optional line on step 2. Cover photo moves to Studio. This is 7 screens but only 2 are needed for a real page; step count was not the target.

## 2. Content engine
After step 1 the engine writes sample content through the existing `showExamples` mechanism (store.ts:37): shown in the live draft, labelled "Example", never saved or published unless the owner edits or accepts it. Presets already exist in src/features/themes/presets/industries/index.ts; reuse their service names. Prices are never invented: price mode is "Ask for price". Hours are never invented: placeholder "Add your hours". No generated human portraits anywhere. Photography slot: pages are complete with no image (typographic masthead). Sample photos exist only for three categories (public/photography/generated, credits.json) and are offered as "Try a sample photo" in Studio, never auto-applied.

| Tile (preset id) | Sample services | Sample tagline | Main button | Hours placeholder | Photography slot |
|---|---|---|---|---|---|
| Barber / beauty (barber) | Haircut, Skin fade, Beard trim, Hot towel shave | "Sharp cuts, no waiting around." | Book a cut (request) | Add your hours | Sample: barber-chair, barber-counter |
| Detailer / mobile valet (detailer) | Full valet, Interior deep clean, Paint correction, Ceramic coating | "We come to you and leave it spotless." | Request a quote | Add your hours | Sample: detail-door, detail-kit |
| Trades: plumber / electrician (plumber default; inline chips Plumber or Electrician, optional) | Call-out, Repair, Installation, Safety inspection (or the preset's list per chip) | "Fast, tidy, fully explained." | Call now | Add your hours | None; typographic |
| Tutor / coach (tutor) | GCSE Maths, A-level Maths, English, 11+ preparation | "Patient teaching that builds confidence." | Request a lesson | Add your hours | Sample: tutor-desk, tutor-room |
| Personal trainer (personal-trainer) | Assessment, 1:1 training, Small-group training | "Training built around your week." | Request a session | Add your hours | None |
| Cafe / restaurant (hospitality) | Espresso, Flat white, Breakfast, Cake (labelled Menu) | "Good coffee and something to eat." | Get in touch (Book a table is opt-in) | Add your hours | Sample: coffee |
| Car dealer (car-dealer) | Book a viewing, Part-exchange valuation, Finance conversation | "Honest cars, clearly priced." | Book a viewing | Add your hours | None; vehicle records in Studio |
| Cleaner (cleaner) | Regular home clean, Deep clean, End of tenancy clean, Office clean | "A cleaner home, on your schedule." | Request a clean | Add your hours | None |
| Something else (other) | None; the preview shows one empty "Your first service" example row | None | Get in touch | Add your hours | None |

Taglines are samples, shown only in the preview and as the placeholder of the optional line on step 2. Rules: changing type before editing replaces samples; after the owner edits any sample, that item is theirs and survives type changes (preserve-data lock). Changing type never changes look or colours the owner chose manually. The suggested look follows the existing starting-looks ranking and only sets the pre-selection when the owner has not touched step 3.

## 3. Composition at 390 and the one sheet height model
Layout: stage (progress, preview), sheet (grip, title, body, footer). Stage uses a light neutral (#f4f4f2) behind the phone, not the current black with a blank grey phone, and the browser theme-color matches it, so there is no white flash. Preview is the real renderer (SetupCanvas) showing a populated sample from the moment the screen opens; there is never a blank phone.

Sheet heights (one model, same on every step, in dvh of the visual viewport):
- Peek: 16dvh, minimum 112px. Grip, one-line step title, Continue. At 844: 135px. At 600: 112px.
- Default: 52dvh. At 844: 439px. At 600: 312px. Every step opens here.
- Full: 88dvh. At 844: 743px. At 600: 528px. Leaves the progress row visible.
- The heights never change with content. Content scrolls inside the body only; the grip, title and footer stay fixed. A 16px fade shows when more content is below. No `auto` height, no per-step overrides.
- Controls: drag the grip to snap; tap toggles Peek and Default; accessible buttons "Show full preview" (to Peek) and "Return to editing" (to Default); Arrow Up/Down and Escape on the grip as in SetupPanel.tsx; body `inert` only at Peek (except Continue). Full is reachable for long lists (plans, services).
- The preview is fitted to width, scroll position 0, never zoomed beyond fit. Visible band at 844 Default is about 345px (56px progress + 439px sheet); at 600 Default about 232px; at Peek the whole page is visible, scrolled by the preview itself.

Preview focus per step: 1 top of page with sample header and first services; 2 masthead (name) at top, name edits live; 3 top of page; 4 scrolls the preview to the main button; 5 scrolls to the services section; 6 top of page at Peek; 7 Peek, then a full-screen preview on Finish with "Edit in Studio".

Footer on every step: Back (text button, left, omitted on step 1), primary Continue (right, 52px, full width on narrow), Skip as a text link above Continue on steps 2 logo, 3, 4, 5, 6 only where listed. Footer is sticky with safe-area padding and never covers the last field (body has bottom padding = footer height). Continue is always enabled; validation happens on press.

Step bodies at 390:
1. Type: 3x3 grid of 9 tiles (line icon + label, 56px tall, 2-line labels wrap), tap selects (aria-pressed) and the preview changes at once. Trades tile reveals two small chips Plumber | Electrician, Plumber preselected. Something else opens one text field "What do you do?" plus a Search link above the grid: type-ahead over all 48 preset keywords (existing searchIndustries), top 5 results.
2. Name: field (autofocus on desktop only), live address line "mytaplo.com/fade-street" with "Change", optional row "Add a line about you" (collapsed; placeholder is the sample tagline), optional row "Add a logo" (56px, opens Overlay crop). Keyboard open: preview strip, title shrinks to one line, only field, address, Continue stay.
3. Look: heading "Choose a look."; segmented Looks | Colours; horizontal snap carousel of 12 look cards, each 148x112 showing a real mini-render, name and a selected check (non-colour signal); the selection row "Undo" and "Reset to suggested" appear after a change; "Profile arrangement . Optional" collapsed row. Colours tab: 8 approved colourway swatch rows 48px tall with names. Manual colours are kept across looks (keptColours).
4. Action: four 64px radio rows (icon, label, one-line consequence "Opens your phone's call screen"), the chosen row expands to its single field (phone, WhatsApp number or email, or nothing for booking requests), with inputmode and autocomplete.
5. Services: list of up to 4 rows (name, "Ask for price" or typed price, duration chip), each with Remove; "Add another" (max 3 on Free, matching plans.ts); "Use these" accepts samples as real; empty list is valid.
6. Plan: see section 4.

Functions and states:
- Validation timing: no errors while typing; on Continue or on blur of a non-empty invalid field. Error text under the field in text colour with an icon, `aria-describedby`, `role=alert` once per press; focus moves to the first invalid field. Name required (1 to 100 characters; counter appears at 80). Address: slugProblems() locally (format, reserved, length), live under the field. "Available" is never claimed: the sandbox has no shared address registry; the line reads "Your address is reserved when you create your account."
- Logo: PNG, JPG or WebP, rejected otherwise with "Choose a PNG, JPG or WebP"; resized to 640px; crop sheet with circle, square and logo framing (existing avatarShape), Replace, Remove, and "Undo" for 8 seconds. Storage full: keep the preview, show the failed-save notice (below).
- Look undo: one-level undo (colourUndo) plus Reset to suggested; every change announces "Look set to Warm sand. Undo available."
- Long names: preview wraps up to 4 lines; address line truncates the slug at 40 characters at a word boundary; step title never wraps beyond two lines (clamp 1.6 to 2.25rem); the field scrolls horizontally rather than growing.
- Resume: state.step persists in localStorage (taplo.demo.v2). On load, open the saved step at Default with focus on its title; no resume modal. Legacy saved steps must be mapped (business to name, industry to type, widgets to look, goal and reach to action, contacts to services, publish to finish) before stateSchema (z.enum(ONBOARDING_STEPS)) parses, or older drafts are discarded; also keep setupDrafts fields readable.
- Back button and refresh: each step is a history entry (/onboarding?step=name); the browser Back goes to the previous step with state intact; at step 1 it leaves. Refresh keeps the same step and snap height resets to Default.
- Save and exit: writes state, then shows "Saved on this device. Resume from the Taplo home page." and routes to `/`, where the home page shows "Continue your page" while a draft exists. It never says "published".
- Failed storage: sticky inline notice above the footer ("Couldn't save your last change on this device. Retry."), with a Retry button that re-writes; Continue still works inside the session but the Finish step refuses to claim a saved draft until a write succeeds.
- Keyboard open (visualViewport shrinks by more than 180px with an input focused): sheet becomes the visual viewport minus a 48px header; a 112px preview strip stays if the viewport is 480px or more, otherwise the preview is hidden and the focused field, its error and Continue stay visible. The grip hides. On blur the previous snap restores with no jump.
- Desktop (1440x900): two columns, left panel 520px with the same bodies, right the uncropped phone, sticky, vertically centred, 700px tall. No sheet; Peek, Default and Full do not exist; Look cards become a 4-column grid; Plan shows its list on the left and the phone remains on the right. Step headings and footers are identical to mobile.

## 4. Ending
Plan (step 6): "Pick a plan." Free first and preselected, expanded with its limits from plans.ts; Core, Pro and Business as one-line rows (name, price, one-line summary) each expandable; "Prices and limits are provisional. Choosing a plan saves a preference only; nothing is charged." Continue label "Continue with Free" (or the chosen plan name). The preview stays visible at Peek (mobile) or on the right (desktop). A ?plan= value from pricing is pre-selected.

Finish (step 7), two truthful variants driven by capabilities():
- Accounts unavailable (sandbox): title "Your page is ready". Body: the draft is stored in this browser only and is private (WHEN_UNAVAILABLE.accounts). Primary "Open Studio (testing route)". The button and a "Testing environment only, not part of the customer experience" note replace the non-working email and password form. No "account created", no "live".
- Accounts available: email, password (and no providers that do not exist), "Create account and open Studio"; an existing session skips this screen. Failure keeps the draft, shows the error, offers Retry and "Open Studio without an account" only if the environment allows it.
Both: the draft is written, read back and only then shown as "Saved as a draft. Not published." Preview goes to full height with "Edit in Studio". Publishing is a separate Studio action; nothing here publishes. Studio first-run shows the real draft and one next action (add hours or price your services), not metrics.

## 5. Acceptance criteria (browser-checkable)
1. /onboarding at 390x844 renders a populated sample page behind the sheet on first paint; no blank grey phone, no white strip at the top (theme-color equals stage colour).
2. The sheet is exactly 16dvh, 52dvh or 88dvh at snap on every step; its height does not change between step 1 and step 7 (measure the bounding box, 390x844 and 390x600; 600 gives 112, 312 and 528px).
3. The preview's rendered region does not move or resize when pressing Continue (only its content changes).
4. Steps in order: Type, Name, Look, Action, Services, Plan, Finish; the 3rd screen title is exactly "Choose a look." with a Looks and a Colours tab.
5. After tapping each of the 9 tiles the preview shows that category's sample services labelled "Example"; reloading before any edit keeps them unlabelled-as-real nowhere in saved content (inspect taplo.demo.v2: content.services is empty).
6. Typing a name updates the preview masthead within one frame; 1-, 2- and 4-line names stay inside the phone and above the sheet title.
7. With no name entered, Continue shows an inline error and moves focus to the field; with a name, no other field blocks Continue on steps 2 to 6.
8. No screen says an address is "available" or the page is "live".
9. Logo upload accepts PNG, JPG and WebP, rejects other types with a message, shows crop, Replace and Remove; a page with no logo and no cover looks complete at 390 and 1440.
10. Changing look then pressing Undo restores the previous look, colours and keptColours exactly; manual colour choices survive a later look change and a type change.
11. Choosing a category does not remove any look from the carousel (12 looks reachable for every category).
12. Step 4 offers exactly one choice group; the old "Main button" fieldset and goal chips are gone; choosing Call without a number shows a field and the button is not added to the page until the number exists.
13. Step 5 with no edits and Skip yields a draft with zero services saved; editing one sample row saves only that row.
14. Plan step: Free is selected on arrival, the preview is visible (mobile Peek or desktop right), prices are marked provisional, and Continue never claims a subscription.
15. Keyboard open at 390 with a viewport reduced to about 300px height: the focused input, its error and Continue are all visible; closing the keyboard restores the previous snap without a visible jump.
16. Grip: Enter toggles Peek and Default, ArrowUp and ArrowDown change snap, Escape returns to Default; labels "Show full preview" and "Return to editing" are announced; body is inert only at Peek.
17. Back button steps back one step with data intact; refresh on step 3 reopens step 3 with the same look; a legacy saved state with step "business" or "widgets" opens the mapped step with content intact.
18. Simulated full storage shows the failed-save notice with Retry; Finish does not print "Saved as a draft" until a write succeeds.
19. With accounts off the Finish screen has no email/password form, says the draft is stored in this browser, and labels the Studio route "testing"; with accounts on, an existing session skips account creation.
20. Every step title takes focus after navigation; progress text and snap changes are announced politely; focus rings visible; touch targets 44px or more; reduced motion removes slide transitions.
21. At 1440x900 the phone is uncropped, the left panel has no horizontal scroll, and no step needs vertical page scroll of the document.
22. After Studio opens, the draft is unpublished (published === null in state) and the Studio first-run state shows it.

## 6. What to delete
- ONBOARDING_STEPS values "business, widgets, industry, goal, reach, contacts, publish" and STEP_TITLE, STEP_LABEL, why entries for them (replace with the seven new ids and a migration map).
- The "part" two-screen mechanism for reach/business (Onboarding.tsx:134-137, PART_TITLE) and the separate goals and "Main button" UI in SetupConnections.tsx (goalChoices, lines 39-43, 225-242).
- The compact prop and fractional heights (36/52/70/78%, 92px) in SetupPanel.tsx and `data-mobile-layout=preview/focus` switching; the desktop `revealed` zoom logic (Onboarding.tsx:141).
- "Show category", "Where is the work done?", "I also do", "Just looking? Open a sample business" from onboarding (move to Studio or marketing); the cover-photo Overlay and description paragraph from step 2 (cover goes to Studio).
- FirstContent vehicle/photo/product record forms (Onboarding.tsx:372-448) from onboarding, kept in Studio.
- The non-functional account form shown when accounts are off; the "Customer testimonials" Free line in SetupPlans.tsx unless plans.ts lists it; the black stage and the SetupBackdrop dependence on step phase.
