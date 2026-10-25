# Engine and workspace pass, 25 October 2026

This is a verified foundation pass, not completion of the owner's full engine/dashboard/marketing request and not owner visual approval. Inspiration compositions have deliberately not been reproduced yet.

## Delivered

- Shared My Page material language across dashboard routes: compact toolbar, contextual navigation, category-aware service/vehicle labels, paper background and raised functional surfaces.
- Team: create/edit using the same record form as the page engine; portraits, speciality, service assignment, bookable state, search, removal confirmation, undo and individual-hours handoff. Actual account invitations/permissions remain unconnected.
- Availability: focused validated drafts, multiple daily periods, a one-hour break, chosen-day copying, per-person hours, timezone, special dates with edit/remove/undo, booking rules and per-service buffer/capacity overrides. Only Save writes a draft to the schedule; unsaved changes are guarded.
- Calendar: phone defaults to Agenda, desktop to Week; responsive Day view; keyboard arrow navigation and Enter to block a time. Explicitly chosen views persist during resize in the current session.
- Appearance: one shared visual finish picker in setup and Design. Four dark and two light finishes; atomic readable palettes, solid lifted surfaces and matching action colours; existing typography/profile/content preserved. Gradient/shader pace Still/Slow/Flow/Lively persists. Still overrides old page-motion drift. Reduced motion and offscreen shader pausing remain. Photo selection no longer inserts a fixture image before choosing a real photo. Custom colours clear preset selection.
- Services/products use the shared accessible detail overlay with dirty dismissal guards. A car dealer starts a new stock record as a vehicle with vehicle fact fields.

## Evidence

- Optimized production build and TypeScript passed.
- ESLint over all src plus the three added browser suites passed. Whole-repository lint also encounters existing unrelated scratch scripts in untracked work/; these were preserved rather than removed.
- 250 unit tests passed; 39 database integration tests skipped because no test database is configured.
- 32 Chromium browser cases passed: engine/workspace 8; existing booking/customer flows 9; curated setup/gallery/motion 5; all-category/plan journeys 5; 320/768/1440 route/edit checks 3; undo/photo/service-rule preservation 2.
- 16 native Firefox/WebKit cases passed, both desktop and phone: team edit/remove/restore/scheduling handoff, split/copy/invalid hours, date overrides/rules, real gradient movement/persistence/Still/reduced motion, calendar defaults and keyboard input.
- Manual in-app review: shared menu, Team empty/profile/editor, individual schedule and working-hours popup at desktop and 390px. Rendered proof remains in work/engine-hours-{390,1440}.png and work/engine-finish-{390,1440}.png. Screenshot timing waits for actual iframe content rather than accepting the loading skeleton.
- Logs in work/engine-workspace-{build,types,source-lint,units,regression,native,navigation,draft-safety}.log.

## Explicit remaining work, in owner priority order

1. Deep individual block-family editing and rendering: service presentation, gallery authoring, review combinations, profile compositions, links/media/team/product families. Audit the real end-to-end customer paths and authoring controls together. Finish palette choices are not six new inspiration themes.
2. Remaining dashboard tools beyond this shared shell: overview and publication readiness, Reviews, Offers editing, Analytics honest empty/instrumented states, Settings, deeper calendar/team interactions, saved filters and service-specific convenience.
3. Continue every registration step and category-specific follow-up, photo crop/mobile keyboard, palette/profile/tier decisions and contextual conversion illustrations; retain skip/back/draft behavior.
4. Reproduce curated dark/gradient/personal/business inspiration compositions only once their required engine controls are complete; actual renderer, varied profile/type/material/content, consistent device frames, category-led library.
5. Feature/product/pricing/marketing page reconstruction and real animated block storytelling, selective backgrounds, hero composition, plaque/wallet/print presentation, media refresh. Existing motion clips/snapshots are not claimed refreshed by this pass.
6. Physical iPhone/Safari keyboard, safe-area and performance review. Browser emulation/native WebKit are not physical-device verification.
7. Connected auth, billing, notifications, calendar sync, team invitations/permissions, wallet passes, print sales and analytics. No claims of activation or outbound messaging. Domain/mailbox connection and operating legal facts remain needed; the prior reminder has already been delivered.

Never resume the obsolete broad scheduled prompt or recreate the delivered reminder. Follow the owner's direct feedback; do not interpret passing tests as design approval.
