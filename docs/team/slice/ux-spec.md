# UX spec: first-run Studio home (`/dashboard`)
Author: taplo-ux-designer. Inputs: contract.md (settled items untouched), research-board.md (inference only, no observed first-run screens), Studio.tsx, `readiness()`, captures base-studio-m-full.png (390) and base-studio-d-full.png (1440).
No participants, metrics or quotes are claimed. Labels: [O] observed in capture/code, [I] inference.

## 0. Primary task and what is wrong now
Task: "I just made my page. Is it live, what do I do next, does anything need me?" Answer in one glance, then edit/preview/share.
- [O] Mobile 390 shows preview, then 5 cards before any ranked action competes: status, black "ready to share" card, three 0 counters, "7 of 7 done", "Get more". Zero counters + done checklist + three tips use more height than the single action.
- [O] Contradiction: pill says Draft and note says nothing is public, while the black card says "Your page is ready to share" and "Open sharing". It is not shareable beyond this browser.
- [O] "Edit my page" floats over the preview and covers the first service row. The dock has 5 items, 2 pointing to the same route (`/dashboard/page`), 2 to `/dashboard/bookings`.

## 1. The four questions, in this order
1. Status: one status line, always first under the preview: `Draft` or `Published` plus the truthful scope phrase (section 4).
2. Next: exactly one ranked next action (section 3), a single card with one primary button.
3. Attention: rendered only if something is waiting (pending bookings, new enquiries). If present it outranks every "next" row except "Publish changes" is never above it. Nothing renders when empty.
4. Edit / preview / share: preview is the page itself; Edit is one persistent control; Share is one row that appears after publish. View page is the header control only.

## 2. Information order
### 390px (single column, top to bottom)
1. Header (existing): menu, business name, "View page". Keep. No second View control elsewhere.
2. Status strip (one line, not a card): pill + scope phrase + (only if draft not complete) "N things to finish before you can publish".
3. Next-action card: headline, one sentence, primary button, optional text-link secondary.
4. Attention row(s): only when count > 0 (section 5). Replaces the "Waiting for you" card.
5. Live preview (existing device frame) with `Edit my page` as a full-width button directly below the frame, never overlaid.
6. Share row (published only): link, Copy, "QR" opens a sheet.
7. Optional one-line "Add photos" prompt (section 6), only when it is the single best tip.
8. Bottom dock (existing, reduced, section 11).
Rationale: status and next action sit above the fold on 390x844 without scrolling past the 640px-tall phone frame. [I] Frame scaled to max ~46% of viewport height on mobile so card 2-3 are visible at 844 and at 600.
### Desktop (>=1024)
Left rail dock (existing). Centre: preview + Edit button below it. Right column (max 360px): status strip, next-action card, attention rows, share row, tip line. Same order as mobile; nothing is desktop-only. The right column is not taller than the preview when zero attention exists.

## 3. Ranked next-action logic (first matching row wins; one primary only)
Required to publish = `readiness().required` items: industry, name+address, contact, plus "Replace or remove example items" when examples remain. `nextItem` today skips `published`; this table replaces that choice.
| # | State | Headline | Primary | Secondary |
|---|---|---|---|---|
| 1 | Draft, required items missing (`!canPublish`) | "Finish {first required label}" e.g. "Add a way to contact you" | Go to that item (its `href`) | Text link "Preview your page" (scrolls to/ focuses preview). Publish is not shown, so there is no disabled button. |
| 2 | Draft, complete (`canPublish`), never published | "Your page is ready to publish" | `Publish` (calls existing `publish`) | "Edit my page" is below the preview already; no second link. Scope phrase stays in status strip. |
| 3 | Published, with unpublished changes | "You have changes that are not published" | `Publish changes` | `Unpublish` as text link inside a "More" disclosure, not a button on the card. |
| 4 | Published, no changes, pending bookings or new enquiries | "{n} need a reply" (n = awaiting + new enquiries) | "Open bookings" (to `/dashboard/bookings`) | "Copy link" |
| 5 | Published, no changes, nothing pending | "Your page is published in this browser" | "Copy link" | "View page" opens `/demo/p/{slug}`. |
| 6 | No photos (gallery empty and logo missing, or `goal-work` unmet) | Never a headline. Handled as the single tip line (section 6) under any of rows 2-5, except row 1 where it is hidden. | | |
Rules: row 3 outranks row 4 for the card's primary button; pending items still show as separate attention rows (section 5), so neither is hidden. Optional steps (logo, bio, review, service) never become headline while a required step is open, and never become the headline after publish; they appear only as the tip line.
After a successful Publish the card changes to row 5 and focus moves to its headline; an `aria-live="polite"` message reads "Published in this browser."
Greeting ("Good evening") removed: it adds a line and a time dependency (`useClientNow`) for no decision value.

## 4. Draft vs publish vs share, truthfully
Fact [O]: `publish()` stores a frozen copy in browser state; `WHEN_UNAVAILABLE.publicPublishing` says a public address needs accounts and publishing, not connected yet. Nothing is public. Copy never says "live", "public", "online for customers" or "ready to share with customers".
| State | Pill | Scope phrase (status strip) | Detail disclosure ("What does this mean?") |
|---|---|---|---|
| Draft | `Draft` | "Only visible in this browser" | Existing `publicPublishing` sentence verbatim |
| Published | `Published · v{n}` | "Published in this browser only" | Same sentence; "Customers cannot reach it yet." only if that matches `WHEN_UNAVAILABLE` meaning. |
| Published + changes | `Published · v{n}` + "Unpublished changes" | as above | |
- The scope phrase is visible text, not tooltip. The long sentence moves to a disclosure; the status strip stays one line (wraps to two at 390 only for long phrase).
- Remove the black "Your page is ready to share / Open sharing" card. It is replaced by the Share row, which exists only when `s.published`.
- Share row: label "Share", the address in `business address` style, `Copy link` (existing clipboard logic with failure text, see error state), and "Show QR" opening a sheet at full size. The sheet repeats the scope phrase above the QR. Before publishing the row is absent (not disabled, not teased).
- `Publish` copy does not promise a public result: confirmation text "Published in this browser" only.

## 5. What hides until data exists
- Counters Upcoming / Need a reply / Enquiries: delete the three-tile grid. Render per-count rows only when count > 0: "{n} booking(s) need a reply", "{n} new enquiry/enquiries", "{n} upcoming" (upcoming only when upcoming > 0 AND awaiting = 0, to avoid duplicating).
- "Waiting for you" card header and the sentence "Your next appointments will appear here..." disappear when all three are 0. `UpcomingBookings` mounts only when upcoming > 0.
- Preview-only booking disclaimer ("Preview bookings stay in this browser...") moves into the row detail when a preview booking exists; otherwise absent.
- Dock enquiry badge: unchanged (already hides at 0).
- Examples card (existing, shown while no service): kept, but collapsed into one line inside the Next-action row 1 when `example` item is required; otherwise unchanged. Do not delete the toggle (settled: labelled samples).

## 6. Replacing the 7-of-7 checklist
- Checklist card removed from the home when all non-`published` checks are done (today: 7 of 7).
- While items remain: no card. The status strip shows "{n} to finish" only for required items, and the next-action card shows the first. The full list is one link, "See all steps", opening the existing checklist on `/dashboard/page` or a sheet (frontend to choose; same data from `readiness()`). Optional items appear there as "optional".
- `checklistHidden` and "Hide checklist" button become unnecessary; keep the field for existing saved state, remove the control.

## 7. The three "Get more" tips collapse to one
Delete the card and its three `ExplainerLoop` animations. Show one text line with an inline link, chosen by first match: (a) no gallery/logo: "Add photos so people can choose you." -> `/dashboard/page`; (b) booking goal chosen and no service with duration: "Add a service with a time so customers can book." -> `/dashboard/services`; (c) none: nothing renders. "Share it" tip is deleted (the Share row is the share action). Never shown with row 1.

## 8. Plan-locked prompts
- Remove the "You could also" card (`DISCOVER`) from the first-run and draft states entirely.
- After publish, at most one quiet text link at the very bottom of the column, "Compare plans" -> `/pricing`, only when `discover.length > 0`. No lock icon in the main column, no feature pitch, no price. Plans and prices remain provisional per contract.
- Locked features never replace the next action and never appear between status and preview.

## 9. States
- First use (just created, draft): row 1 or 2 depending on `canPublish`; no attention rows; no Share row; no tip if row 1.
- Returning: same logic; no greeting. If `!s.onboarded` the existing "Continue setup" link becomes row 1's secondary (it outranks tips).
- Loading: `useDraft()` returns null today and Studio renders nothing (blank). Spec: show the header, a skeleton for the status strip (one line) and next-action card (reserved height), and the preview frame placeholder. No spinner text. Max layout shift: 0 px when content arrives.
- Empty: zero counters hidden (section 5); no photos -> tip (a); no services -> examples card behaviour unchanged.
- Populated: Attention rows (max 2 visible, "and {n} more" link to bookings), Share row, one tip.
- Error: Copy link failure (clipboard denied, existing `catch {}` is silent) shows "Could not copy. Select the link and copy it." with the address as selectable text. Preview failure: `PagePreview` fallback text "Preview unavailable. Try again" with a Retry button; status strip and actions still work. Publish failure (canPublish false after content parse): inline "Fix {field} first" linking to it; no raw error.
- Long content: business name wraps to 2 lines then truncates with ellipsis in the header (full name in `title`); description is not shown on the home. Address wraps with `overflow-wrap:anywhere`. Headline from a long required label wraps, never truncates. Attention row text wraps; count stays visible.
- Keyboard focus order: skip link / header menu -> View page -> status strip disclosure -> primary button -> secondary link -> attention rows -> preview "Full preview" control -> Edit my page -> Share row (Copy, Show QR) -> tip link -> dock. Preview iframe is not a tab trap (existing accessible full-preview/return controls kept). Sheets trap focus, Esc closes, focus returns to the opener. Visible focus ring on every control.
- Narrow height 600px (390x600 or landscape): preview frame scales to max 40% of height; status + next-action card + primary button visible without scrolling; dock does not overlap the primary button (scroll padding = dock height + safe-area inset).
- Mobile keyboard interruption: Studio has no text input; when a sheet (Share/Copy fallback, help) has one and the visual viewport shrinks, the focused field and its sheet's primary action remain visible, the dock hides while the keyboard is open, and the header top edge shows no white flash. Dismissing the keyboard restores scroll position.

## 10. Acceptance criteria (each checkable in a browser)
1. At 390x844, the pill, scope phrase and the primary action button are all inside the first viewport without scrolling the page (preview frame included).
2. At 390x600, the primary action button is fully visible without scrolling and is not covered by the dock.
3. A new draft with a missing contact shows exactly one primary button on the next-action card and no `Publish` button; text reads "Add a way to contact you" (or the first required label).
4. A complete unpublished draft shows `Publish` as the only filled button on the page; the status strip reads "Draft" and "Only visible in this browser".
5. No element on any state contains the strings "ready to share", "Open sharing", "7 of 7", "We accept" or "Get more from your page".
6. With zero bookings and zero enquiries, the DOM contains no "Upcoming", "Need a reply" or "Enquiries" text on the page body (dock aria-label excluded) and no element whose text is exactly "0".
7. With one pending booking, an attention row reads "1 booking needs a reply" and links to `/dashboard/bookings`; the row is above the preview in DOM and visual order.
8. After clicking Publish, the pill reads `Published · v1`, focus moves to the new headline, the live region announces "Published in this browser", and the Share row appears; before, the Share row is absent.
9. Copy link writes the same address shown in the Share row; when clipboard permission is denied, the fallback message and selectable address appear.
10. The QR sheet shows the QR at least 200px wide and repeats the scope phrase; it is unreachable before publish.
11. `Edit my page` does not overlap the preview frame at 390 and 1440 (bounding boxes do not intersect) and is >= 44px tall.
12. Tab order matches section 9 and every stop shows a visible focus indicator; Esc closes any sheet and returns focus to its opener.
13. Tips: at most one tip line is present on any state; none while row 1 is active; none when photos and logo exist and no goal is unmet.
14. No plan or lock text appears while the page is unpublished; after publish at most one "Compare plans" link exists.
15. A 90-character business name and a 200-character address cause no horizontal scroll at 390 and keep the primary button visible.
16. With the mobile keyboard open (visual viewport 390x340) and a sheet input focused, the input and sheet's primary button are visible and the dock is hidden.
17. While data loads, status and action card placeholders occupy their final heights (no layout shift when content mounts).
18. Preview iframe failure still leaves status, primary action and Edit usable and shows the retry message.
19. Every state is reachable and unchanged in meaning for reduced-motion users (no motion required to see status or next action).

## 11. Unnecessary decisions and repeated controls to delete
- Choosing between 6 cards: replaced by one ordered column; delete card chrome equality (status strip, no card).
- Greeting by time of day (`greeting`, `useClientNow` use in Studio) and its kicker line.
- Black "ready to share" card and tiny QR `Scene` art; `first-run` / `bookings` scene switch.
- Three-tile counters grid; "Your next appointments will appear here" sentence at zero.
- "Your checklist" card, its open/closed heuristic (`done < 3`), "Hide checklist" button, `.slice(0, 7)`.
- "Get more from your page" card and three `ExplainerLoop`s; the "Share it" tip duplicates Share row.
- "You could also" plan-locked card in draft state.
- Disabled `Publish` button plus "To publish:" sentence (merge into row 1 headline).
- `Unpublish` as a peer button next to `Publish`/`View`/`Copy` (move into More disclosure).
- Repeated View controls: header "View page" and the card "View" button (keep header only; Share row has Copy and QR).
- Repeated Edit/Share routes: dock has "Page and design" and "Share, QR and wallet" both to `/dashboard/page`, plus "Edit my page" and "Do this now" to the same route. Reduce dock to 4 destinations: Page, Services, Bookings and messages (merge the duplicate `/dashboard/bookings` items), Share (opens the Share sheet, not a route). Do not remove the Looks/Colours control inside the editor (settled).
- Long scope sentence shown inline in every state (move to disclosure; keep text verbatim).

## 12. Out of scope / not changed
Account timing, plan comparison placement, preview renderer, Looks/Colours control, titles, plan prices and limits, public deploy. Real public share, custom domains and analytics wait for accounts and publishing.
