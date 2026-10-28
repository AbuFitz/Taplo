# Onboarding, arrangements and design engine: audit against the brief

Branch `claude/modest-cerf-4tont1`. Evidence is a file path or a screenshot in `docs/review/`.
Status words: **Done** (verified in a browser or test this session), **Partial**, **Missing**, **Not verified**.

## Working-tree and test state at the start of this pass
- Working tree clean at `51b0649`; no other Claude session's processes were touched.
- Full Playwright run on the dev build: 788 passed, 10 failed (`category-plan-journeys` 5, `curated-setup-blocks` 2, `saved-looks` 1, `profiles` 1, `appearance` 1). All ten are heavy multi-viewport loops or font-load screenshot waits; several fail identically at the earlier baseline `a1916d4`. They are not yet individually root-caused.
- `playwright.config.ts` serves `next start` on :3100, a **production build**: edits are invisible to tests until `next build`. Use `BASE_URL=http://localhost:3000` against the dev server.
- Nothing is deployed or merged. The private study site was not reachable; the uploaded standalone HTML of the study was used instead.

## Verification
- Full Playwright runs, Chromium only: (1) dev server, 2 workers: 795 passed / 7 failed; (2) **production build**, 3 workers: 799 passed / 3 failed; (3) production build after the final asset, undo-storage and licence changes, 3 workers: **785 passed / 17 failed / 7 skipped**.
- Of run 3's 17 failures, **16 pass when re-run** with 2 workers (`--last-failed`): they were timeouts and click races under three-worker load (category loop of 48 businesses, plan reloads, hover and navigation timing, card-alignment measurement). The 17th, `curated-setup-blocks` at 390, passes alone in 38 s but hit its 60 s budget under load, so its timeout is now 150 s.
- Run 4, production build with all final code, 2 workers: **801 passed, 1 failed, 7 skipped** (1.1 h). The one failure (`related-designs` at 1440, a click before client navigation was ready) was fixed in the spec and passes 4/4. `curated-setup-blocks` passes 5/5.
- **Firefox** (`playwright.firefox.config.ts`, production build): cross-browser, booking, setup-header, arrangement width/axe sheet, also-categories and undo-reload specs: **24 passed, 2 skipped, 0 failed**. WebKit was not installed or run; a full Firefox suite was not run.
- **Full Firefox suite** (`playwright.firefox.config.ts`, production build, 2 workers): **795 passed, 7 failed, 7 skipped**. Four failures call Chromium's CDP touch API (`newCDPSession`, touch-drag reorder specs) and cannot run in Firefox; one expects a WebGL canvas for the animated backdrop that headless Firefox does not create (the page falls back to the static backdrop); the remaining two (`saved-looks` independent copies, `profiles` showcase-barber folio broken-image check) pass when re-run alone. **WebKit** (system libraries installed with `playwright install-deps`, `playwright.webkit.config.ts`, production build): cross-browser, booking, setup-header, arrangement width/axe sheet, also-categories, undo-reload, curated-setup-blocks and design-preview specs: **31 passed, 2 skipped, 0 failed**. A full WebKit suite was not run.
- Example content: service and product records can carry `example: true`; while any active one exists the page cannot be published (`readiness` id `example`, `goals.test.ts`).
- Unit suite 347 passed; `tsc --noEmit` clean.
- Earlier correction stands: the `design-preview` failure was a spec tapping repeatedly during load, not a hydration bug in the app.
- A stale `next start` process serving an old build produced a false mass failure once; always stop the old server before rebuilding.

## Journey (brief section 1)
| Item | Status | Evidence |
|---|---|---|
| Locked shell, desktop form left / live page right | Done | `src/features/demo/Onboarding.tsx`, `docs/review/journey/sheet-1440.png` |
| Mobile preview behind movable bottom sheet with explicit control | **Done (code-reviewed, covered by `mobile-setup-priority.spec.ts` at 320/390/768)**: the grip is a real `<button>` with a state label ("Show more of your page" / "Return to editing"), `aria-expanded`, `aria-controls`, Arrow Up/Down and Escape, plus drag | `docs/review/journey/sheet-390.png` |
| Identity first ("Make it yours."), no logo/image/tagline required | Done | `docs/review/journey/1440-01-start.png` |
| Name-only draft looks designed | **Done**: a blank start page now uses the type-led Editorial cover (`src/features/demo/store.ts` `initialState`); it stays "fresh" so choosing a category still applies that category's default look. The pre-name skeleton is only the page loading | `docs/review/journey/1440-02-name.png` (re-captured) |
| First creative moment with a strong recommended look already applied | **Partial, by design of this flow**: choosing a category applies that category's recommended look at once, and five alternative looks appear on the same "What do you do?" screen (`SetupThemes compact`); the full six-design and arrangement picker is still its own later step, after contacts | `docs/review/journey/design-1440.png` |
| "What do you do?" with Other and multi-category | **Done**: Other with a write-in exists; "I also do" lets a business add up to two further kinds of work, which add service suggestions and never change the design (`identity.alsoKeys`, `tests/e2e/also-categories.spec.ts`). Category is still not used to pick arrangements | `1440-03-step-1.png` |
| Goals multi-select, intent separate from configured booking | **Done**: "What would you like customers to do?" (book, call, message, see work, buy) is stored as `setupDrafts.goals`, separate from the real "Main button" setting; each chosen goal adds a Studio next-step until it is genuinely set up (`src/features/demo/actions.ts` `readiness`, `goals.test.ts`) | `src/features/demo/SetupConnections.tsx` |
| Optional first content / contact | Done (Skip for now on contact and content steps) | `tests/e2e/curated-setup-blocks.spec.ts` |
| Example content labelled and never saved as real | **Missing**: no "Example" labelling concept found in setup or starter data | `src/features/page/starter.ts` |
| Existing website / booking link honesty | **Done**: the field is a link only, and the step says Taplo links to it and does not copy the site or sync bookings | `SetupConnections.tsx` |
| Plan comparison with only verified entitlements | Partial: plan step exists (`SetupPlans.tsx`); entitlements and prices are the unvalidated figures named in the brief | |
| Account near the end, only configured providers | Partial: sandbox app, no real accounts; copy must not imply otherwise | |
| Completion creates an unpublished draft; Studio shows the page first with a dismissible checklist | Partial: draft + publish are separate (`store.ts` `published`); checklist exists (`src/features/demo/dashboard/Studio.tsx`) |  |

## Profile arrangements (brief section 2)
| Direction | Engine id | Status |
|---|---|---|
| Framed blend | `framed` (new) | Done, 5 asset states x 2 businesses at 390 |
| Open blend | `melt` (refined: no placeholder art without a photo) | Done |
| Centred identity | `identity` (new) | Done |
| Editorial cover | `masthead` (new) | Done |
| Side-by-side | `duo` (new; stacks below 19rem container width) | Done at 390 and in the width test (320 included); not yet eyeballed at 320 |
| Floating profile | `lifted` (new) | Done |
| Earlier arrangements kept | `split`, `bento`, `type` and legacy layouts still render | Done |

Evidence: `docs/review/arrangements/sheet-{barber,dealer}-{full,logo-only,cover-only,neither,long-name}.png`, generated by `tests/e2e/arrangement-sheet.spec.ts` (`TAPLO_SHEET=1`). Saved pages keep their stored layout id; nothing migrates.

Observed and fixed: `split` quick-action icons were unreadable over the photo; `melt` without a photo drew a large grey monogram. Still open: long business names make `masthead` very tall (acceptable, not elegant); no category has bespoke arrangements; the six study directions are offered to every category.

What I could not see from the study: its fallback-state wording beyond the toggles, and anything on the private site. The brief and the HTML were enough to build the six structures; typography and finish remain Taplo's own.

## Engine (section 3)
| Item | Status |
|---|---|
| Content, arrangement, finish kept separate in data | Partial: `header.layout` (arrangement), `layout.finish`, design recipe and content are separate keys; widget presentation lives on each widget; asset treatment (crop/fit/focal, scrim) lives on `ImageRef` and `header.scrim` |
| Applying a design preserves business data | Done: `applyDesign` touches `appearance` only; "Use this design" says so (`src/features/inspiration/UseDesign.tsx`) |
| Undo / provenance | **Done within limits**: undo now survives a reload of the same tab (sessionStorage, last 20 steps, dropped when large; `tests/e2e/undo-reload.spec.ts`). "Use this design" records `page.meta.appliedFrom` and the editor shows "Look started from …" (`MyPage.tsx`). Large pages (uploaded pictures) keep no saved undo |
| Versioned schemas | Partial: `PAGE_SCHEMA_VERSION` for pages; arrangement choice is not separately versioned |
| No destructive background removal | Done: none exists |
| Image-library licensing | Checked from repository records: see `docs/asset-licences.md`. Three CC BY-SA car photos and the unlabelled `taplo-demo` / `looks` images are open items |

## Gallery (section 4)
Gallery renders through the real engine (`src/features/inspiration/DesignGallery.tsx`). It now has a Profile filter for the six study directions, and 18 showcase pages were reassigned to the new arrangements by hand in `showcase-set.ts`. Contact sheets for a barber, mobile detailer, two trades, two retail, two tutors, two creatives and two hybrid/other pages: `docs/review/businesses/sheet-businesses.png`.

## Responsive, accessibility, data integrity (section 5)
- Every arrangement (all nine) is asserted free of horizontal overflow at 320, 375, 430, 768, 1024 and 1440 (`tests/e2e/arrangement-sheet.spec.ts`, "widths and accessibility"; passes on the dev build). Visual review done at 320, 768 and 1440 for the six study directions: `docs/review/arrangements/sheet-widths-{320,768,1440}.png`. Findings: side-by-side stacks cleanly at 320, nothing clips or overlaps; open blend becomes very tall at 768 (the photo is capped at 520px but still dominates the first screen).
- No horizontal overflow at 390 in any of 90 renders (asserted in the spec).
- axe (default rule set, header region only) reports no violations for all nine arrangements at those six widths with the barber sample. Not run: full page, dark finishes, other businesses.
- Preview/draft divergence found and fixed: see below.

## Preview not reflecting changes (user report)
Root cause found: when the browser refuses a write (localStorage full, typically after uploading images, or blocked), `read()` returned the previous stored copy, so the edit vanished from the editor; and the preview iframe, a separate document, never received the change because the `storage` event never fired. A fresh private window has empty storage, which is why it "works in private".
Fixed in `src/features/demo/store.ts`: the newest in-memory state wins while storage is failing, is broadcast to other documents over a `BroadcastChannel`, and tabs refresh on `pageshow` / visibility. The setup flow now shows the same "not saved" warning the editor already had. Regression test: `src/features/demo/store.test.ts`.
Not reproduced in a real browser with a full quota, and not ruled out: the stale production build on :3100 can also look like "changes not showing" when testing.
