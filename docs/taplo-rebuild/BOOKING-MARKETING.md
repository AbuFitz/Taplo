# Booking marketing direction

24 October 2026. First individual feature-page redesign. System archetype with editorial pacing.

Promise: appointments that fit the way a local business works. Audience needs to see both the customer journey and control of working hours, without confusing a request with a confirmed appointment.

Conversion: try the actual booking flow, then adopt the matching business example. Secondary journey opens its full customer page. Fictional clinic and coaching fixtures supply all service names, prices, durations and modes. No invented customers, performance claims, payments or messages.

Creative thesis: a quiet white typographic opening paired with the common cropped handset, followed by a dark, moving tonal field for the working demo. The difference between instant booking and requests is the interaction, not a slideshow. Existing type, Lucide icons, real renderer and scheduling engine only.

Mobile: vertical thumb flow, readable phone crop, two simple business choices, genuine full-screen booking sheet. Desktop: asymmetrical type and larger handset, generous whitespace, no background card behind the phone. A focused demo block uses the same booking engine as the customer page. Reduced motion removes entry motion and tonal drift. No fake loading or automatic scrolling.

Verified: fixture content, per-service booking modes, local scheduling engine, hours/buffers/notice configuration, existing owner calendar. Provisional: overall art direction awaits owner review. Missing: cloud booking persistence, provider emails/texts and payments. These remain plainly disclosed at the relevant demo and capability section.

Acceptance: real request and instant journeys complete with correct outcomes; selection updates preview, action and adoption link together; mobile/desktop no horizontal overflow; keyboard focus, dismissal and reduced motion work. Inspect actual rendered images at 390 and 1440 widths, run affected route and native-browser checks. No new dependency. Other feature pages and the rejected film remain separate open work.

## Implemented and checked

Individual booking route now has a white editorial hero showing an actual clinic time picker, the common cropped thin handset, a dark pointer-responsive tonal field, real clinic/coaching booking trials, matching adoption/full demo destinations, concise owner controls and visible connection disclosures. All other feature routes retain their existing content pending individual redesign. No library added.

Visual review found and fixed the local page-themed modal stacking under adjacent art/navigation and overbroad heading styles. Review also exposed a 16px strip beneath the shared mobile booking action bar. Its sticky inset and bottom padding now cover the scroll surface through to the sheet edge; a geometric regression checks both real demo outcomes.

Production build/typecheck, affected lint and diff checks pass. 18 affected Chromium cases and14 Firefox/WebKit cases pass, including real pending/confirmed outcomes, browser persistence, 320/390/768/1440 widths, native radio keyboard selection, focus return, live customer flow and reduced motion. Scoped WCAG2A/AA and2.1AA automated scan reports no violations. Physical-device checks remain outstanding. The clinic hero capture is reproducible with scripts/marketing/capture-states.mjs booking-clinic-time, and uses no invented product UI.

Remaining: owner review; all other feature marketing pages; replacement film; deeper theme/profile/media/section engine; broader guided adoption and compact owner portal; physical-device/performance checks; legal identity facts and backend services as already recorded. This first page is not overall frontend completion.
