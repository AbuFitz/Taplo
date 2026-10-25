# Service authoring and popup editing

## Result and scope

Services now have a visual picker with name, actual price, duration, group, inclusion and per-block earlier/later order. Explicit references are ordered, deduplicated and filtered for missing/archived records before group/featured/limit rules. The business record order and other blocks are preserved. Automatic inclusion can follow future services; manual ordering creates a deliberate explicit selection. Included is selection state, not a claim that a plan/group/limit cannot hide a record.

Content controls open immediately on the records. Actual rendered layout previews live in Appearance with the existing material, corner and colour controls. This applies to all block layout choices, including social and vehicle variants; the renderer and saved layout model are shared.

Record-selector edits for services, people, products/vehicles, photos, questions, offers and permitted review records open one focused Overlay. Duplicate inner headings/back buttons/dividers were removed. Unsaved changes guard Escape/outside/close dismissal; explicit Cancel discards. Save/add/archive retain their existing validation and persistence. Focus returns to the original row or Add control when that row is gone. Review source restrictions remain. Other editing surfaces still require their own family audits; this does not claim every platform popup is finished.

A real mobile bug crossed the Base UI drawer and Radix dialog dismissal systems: Escape could dismiss the underlying sheet and destroy an unsaved task. The drawer now cancels its own Escape dismissal while a task Overlay is open. A draft baseline uses React state, not a ref read during rendering. The end-to-end test edits, requests dismissal, keeps editing, saves, reopens, requests dismissal again and discards without altering the saved record.

## Photos and customer actions

The optional service image already existed in the content schema but had no authoring-to-renderer path. It now uses the existing image uploader and crop task, preserves a whole photo by default, and travels through both booking/public service projections. Cards and the service detail show the image; rows and price menus stay compact. Photos stay inside the service card button's hit area and have bounded aspect ratios.

Detail wording now depends on actual booking eligibility. An instant-mode record on a plan without online booking offers an enquiry and says no time is reserved. The booking handoff restores focus to its original service card when dismissed. No service action charges cards or sends real bookings externally.

## Owner marketing correction

The authoring bar has one interactive preview badge with free browser testing, local storage and planned publishing/checkout context. Marketing does not gain duplicate preview-status blocks. Home and pricing no longer promise no commission. Existing affiliate disclosures and artists’ commissioned work are unrelated and preserved. Legal text remains dependent on verified operator and processing facts; the legal draft has been corrected to include the newly supplied Part 7 presentation requirement.

## Verification

Final verification: 37 Chromium release cases pass; four adjacent social/vehicle checks and the service-sharing journey also pass (42 distinct cases). Sixteen final Firefox/WebKit service/photo-authoring cases pass; the preceding broader native pass covered all 34 service/gallery cases. The unit suite has 272 passes and 39 database skips. Production build, source lint, separate TypeScript and whitespace checks pass. Logs: work/service-release-browser.log, service-release-native.log, service-adjacent.log (four passes plus an obsolete navigation selector, fixed and separately verified in service-record-sharing.log), service-engine-unit-suite.log, service-editor-build.log, service-engine-lint.log and service-editor-types.log. All user-facing confirmation and persisted states are tested through the actual UI and renderer, not implementation-only assertions. Tests use synthetic content and images only.

Remaining: service packages/inclusions, featured-offer family refinement, a complete profile-arrangement review, deeper record editors for other block families, dashboard consistency, all-theme rebuilding, and the renewed marketing/inspiration composition work. Nothing here marks the full checklist complete.
