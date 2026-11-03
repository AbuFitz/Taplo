# Pricing refinement

Owner direction: replace weak pricing design and abstract shape icons, increase purposeful type, make phone comparison usable, reduce repeated selectors and backend-status paragraphs, and market the actual package differences without invented trials, popularity claims or commission promises.

## Direction and implementation

- Dark page connected to the marketing site; warm raised Free/Core cards, lavender Pro and graphite Business. One primary action per plan, matching the shared brand action. Mobile has a swipeable full-card rail and a compact underline selection; desktop reads all tiers together.
- Original compact illustrations show a free business profile, work gallery, booking calendar and team. Existing original photographs and the existing icon system are used; no screenshot of the actual product, arbitrary shape icon or additional dependency.
- Removed the extra purpose/recommendation selector. One selected plan is shared by the phone cards and detailed comparison. Programmatic smooth scrolling retains the intended target through intermediate cards; pointer/wheel input restores manual control, and resizing aligns the selected plan.
- Prices still come from PLANS. The full comparison still comes from resolveEntitlements. Free has three services, Pro has three staff calendars and Business has unlimited staff calendars. No annual discounts, free trials, transaction-fee promises or activated subscriptions are invented.
- Detailed comparison is grouped into Your page, Bookings and your team, and Growing your business, with one visible value column on phones and all four on larger screens. Feature labels are left aligned. Inclusion checks describe features; selected plans use colour and an underline, without selection ticks.
- Removed duplicate payment/delivery-status paragraphs and the repeated preview disclaimer from the marketing cards. The shared Studio badge remains the contextual explanation of local browser drafts and planned backend services. Provider requirements remain concise notes in the feature table.

## Verification and remaining scope

Verify four viewport widths, image loading, contrast/accessibility, page overflow, every plan link, actual entitlement values, quick repeated plan changes, phone comparison and resize synchronisation, setup intent, horizontal manual input, reduced motion and native Safari/Firefox. Production build/source lint/types are release gates. Final counts and screenshots belong in the handoff proof folder.

This pricing change does not complete the broader engine, dashboard, onboarding, all-theme rebuild, inspiration redesign, all ten feature pages or legal work. Those remain in FULL-CHECKLIST.md. Actual accounts, billing, publishing, message delivery, wallet services and missing operator/provider facts remain external dependencies.

Final local validation: 14 pricing/marketing Chromium checks pass (15.3s), three existing plan/setup comparison journeys pass (5.1s), and all 14 native Firefox/WebKit checks pass (26.3s). Build, source lint, TypeScript and whitespace pass. The full matrix now also includes testimonials, customer management, staff scheduling, permissions and advanced analytics, each read from the entitlement resolver and tested for every tier. Visual review included 320/390/768/1440 and direct mobile-browser Pro selection. Contrast was corrected after the first rendered review. Deployment/public verification is recorded separately in the release proof.
