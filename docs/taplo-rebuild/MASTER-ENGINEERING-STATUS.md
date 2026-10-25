# Master engineering execution, 25 October 2026

**Current owner priority: master engineering first, deeper theme engine afterwards.** This replaces the earlier engine-first sequencing. This is an implementation record, not a completion or visual-approval claim.

## Implemented in this pass

- Desktop: floating, restrained glass navigation; working categorized Product and Designs menus; studio destination and shared Start free CTA. Native keyboard, pointer dismissal, Escape and focus return use existing Radix primitives. No mobile menu shown on desktop.
- Mobile: compact brand bar, thumb-reachable floating dock, Designs/Pricing/Start free destinations and a focused scrollable feature sheet containing all ten feature routes. Sheet closes on route selection and desktop resize; footer padding clears the dock and safe area. Navigation is outside the filtered header so fixed positioning does not attach to its containing block.
- Global marketing cleanup: removed repeated availability/status walls from the ten product routes, the homepage development banner, long pricing development copy and development-led setup FAQs. Existing user-action explanations remain where bookings, payments and publication are tested. One concise Studio preview control opens a focused explanation in setup/dashboard/editor; a locally saved preview is no longer described as live in the editor status/toast.
- Removed two dead old-host QR destinations: homepage and Sharing examples now encode the current public preview design URL.
- Inspiration catalogue: commercial examples lead in the requested order; portfolio/personal/maker designs remain. Contextual recommendations from the preceding release remain, as do retained legacy routes.
- Coherent package changes: Pro includes a custom domain, up to three bookable staff calendars and their scheduling. Business has an uncapped staff-calendar entitlement. A shared plan-aware booking-context builder is used by all public booking/service/team actions. Extra saved profiles are not deleted; the Team screen explains the Pro limit. Pricing comparison and plan highlights follow the same rules. Backend domain activation, payments and billing are not claimed connected.
- Services feature hero: replaced the static repeated barber image with an original, frameless interactive pricing illustration. Fixed/From/Quote changes both price and explanation; its detail/enquiry popup has honest example context and returns focus. Essential text stays fully legible throughout transitions; reduced motion removes travel. The feature hero uses the desktop two-column composition from 768px.
- No new libraries or generated people/photos were added. Shared fonts/icons/Motion/Radix and existing renderer/drafts remain.

## Verification

Production build, source ESLint and TypeScript pass. The whole-unit run has 255 passes and 39 database integration skips; no test database was configured. Focused entitlement/context tests verify Pro caps the eligible staff list at three, Business retains all bookable staff, and source profiles remain intact. Final local verification: 44 Chromium cases pass together (36.8s), and all 18 native Firefox/WebKit cases pass (34.8s). Navigation and Services illustration axe checks are included. Logs: work/master-{navigation-build,source-lint,types,units,final-browser,native}.log. Duplicate numbered generated .next/types files caused a typecheck collision; those generated copies were removed and TypeScript passed. No source types were suppressed.

Browser cases cover 320/390/768/1440, all ten feature routes, keyboard and pointer menus, resize/route dismissal, focus return, footer clearance, axe navigation/service-demo scans, pricing modes and popups, authoring notice, actual Pro-vs-Business booking choices, customer booking outcomes and setup plan illustrations. Actual in-app manual review includes the mobile feature sheet and service illustration. Native Firefox/WebKit are included; physical iPhone keyboard/performance remain unverified.

Official primitive references checked: https://www.radix-ui.com/primitives/docs/components/navigation-menu and https://www.radix-ui.com/primitives/docs/components/dialog. No copied hook-in-loop prototype or second Motion package was introduced.

## Explicit next work, master first

1. Homepage composition: genuinely divergent hero interaction, intentional section sequence, mobile feature folder/desktop depth, purposeful block choreography and visual design discovery. Current LiveStage, LookSwitcher and Film have not been replaced by this pass.
2. Remaining nine feature heroes and all feature-detail sections: unique interactive blocks, relevant simplified content and minimal copy; remove remaining repeated static captures. Services still has static detail-section captures below its new hero.
3. Inspiration interaction and full marketing composition: actual scaled phone/browser demos, intentional desktop carousel and mobile snap behavior, selective monochrome motion and content curation. Catalogue ordering is not a theme rebuild.
4. Master onboarding architecture: mobile live-preview/sheet mechanics with actual draft/renderer, keyboard, accessibility, skip/back, uploads/crop and category-aware existing workflows preserved. The prototype three-field form is not a replacement.
5. Master media/plaque production: purpose-built transparent motion assets and larger useful spatial interactions, correct QR, true wallet/NFC/print flows once connected. Existing media are not claimed regenerated.
6. Remaining package presentation/pricing design, priority onboarding policy and connected subscription/account/domain services. No invented priority support service or active subscription.
7. Legal: supplied file ends at Part 6 despite referring to Part 7. Operating legal facts and complete legal drafting/review remain outstanding. Do not invent details, claim approval or recreate the delivered reminder.
8. Deeper theme-engine/block/dashboard work resumes after the master engineering scope, according to the owner's changed priority.

Preserve the paused obsolete automation; no automated continuation has been re-enabled. Keep browser-only testing honest, current public host mytaplo.vercel.app, and existing untracked media intact.
