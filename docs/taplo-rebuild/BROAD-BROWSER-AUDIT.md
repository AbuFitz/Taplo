# Broad frontend browser audit and corrections

The full existing Chromium suite was run against the compiled cd93a2d frontend: 418 cases, 412 passed and six failed, in 8.5 minutes. This expands the earlier targeted evidence across all sixteen looks, responsive public render combinations, owner editing, booking/contact, stock, saving, and the existing real-component workbench. It is not a claim that every one of the thirty widget types has complete explicit workbench states, nor that Chromium proves physical devices or other engines.

## What the audit found

The add-content chooser set a short aria-label on buttons containing a longer visible title, description and reuse status. Native text now provides the accessible name, matching the actual visible choice. The original useful real-content previews are unchanged.

Team avatar buttons overrode their visible name with a different full-name label. The decorative portrait/initials are now hidden as a redundant graphic; visible first name and an accessible surname/action provide a natural full-name button. Both light and dark avatar stories additionally verify the full name, open the actual profile and close it before their accessibility scan. No people or designs were removed.

A dialog entrance animation could win over the reduced-motion utility because the open-state selector was more specific. The shared dialog/alert backdrop and content now give the reduced-motion override explicit precedence. Accessibility checks use reduced motion and assert the add-content dialog has animation-name:none. This fixes an actual preference issue as well as making settled-state contrast measurement reliable; simply ignoring contrast findings was not the solution.

Three stale checks needed to match the current product: Arch became Soft square, No picture became Name only, and a lazy saved-look preview must be scrolled back into view after choosing another look. The logo upload check now opens Logo and cover before interacting with its field, following the visible owner flow. Content-choice selectors accommodate the complete natural label, instead of requiring a label that excludes its description.

## Verification scope

The final production build, TypeScript and targeted lint pass. Full unit suite:201 passed,39 database-dependent skipped. The final84 affected accessibility/editor/customer/booking checks all pass; both strengthened light/dark avatar interaction and axe cases pass2/2. All six initial failures therefore have corrected passing checks, with their affected flows rerun. The original broad result remains412/418; this is not represented as a second single clean418-case run. Exact delivery details are recorded in VALIDATION.md. The initial 418-case result is preserved above; do not rewrite it as an all-pass run. Related booking and editor checks are rerun after the shared overlay change. No existing tests were deleted or weakened to ignore a serious accessibility category. Original fictional example routes and owner records are preserved.

CURRENT-ACCEPTANCE.csv now maps all 38 original requirements to current evidence and explicit remaining actions. The original ACCEPTANCE.csv is retained as the historical baseline.

## Remaining priorities

- Finish the missing explicit widget workbench states and the remaining engine/migration/parity ledger.
- Simplify service detail facts and refresh affected images/films/recordings together.
- Review wide-logo picture controls for meaningful choices; the renderer intentionally keeps wide lettering whole.
- Bring older remaining primary examples up to the current UK design standard.
- Add full design-editing and stock-enquiry tutorials.
- Measure a representative cold mobile performance baseline, and run selected Firefox/WebKit flows; manual zoom/screen-reader and physical-device coverage must remain explicitly bounded.

The full frontend goal remains active. Backend integration is a later project. No Claude run or separate branch was used.
