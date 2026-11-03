# Widget coverage matrix

Legend: ✅ implemented and verified as stated · 🟡 partial (what is missing is named) · ⬜ missing · 🚧 externally blocked (what blocks it).

"Plan" is the agreed catalogue: the 27 types registered in `src/features/page/widgets/registry.ts` (the plan of record from the original spec and Direction 2) plus the families named in the latest brief. A family the brief names that had no registered type is listed as **new**.

## Baseline (start of this phase, from reading the code, not from earlier reports)

| Family | Registered type(s) | In add-content UI | In examples/marketing | Data source | Primary action | Detail / expanded view | Compact variant | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Identity / header | (page header, engine) | n/a | ✅ | identity | main action | n/a | five header layouts | ✅ |
| Contact actions | call, whatsapp, email, directions | ✅ | ✅ | contacts | tel / WhatsApp / mailto / map | none | button/card/compact | 🟡 no enquiry form |
| Links and social | link, social, document | ✅ | ✅ | contacts.social, widget settings | opens URL | none | button/card/compact; icons/list | ✅ |
| Text, announcements, promotion | text, announcement, offers, image, video | ✅ | 🟡 | settings, offers records | optional link | none | card | 🟡 offers have no detail |
| Services and prices | priceMenu, serviceList, featuredService | ✅ | ✅ | services records | booking dialog | ⬜ no service detail | list/cards/compact | 🟡 |
| Booking | booking | ✅ | ✅ | services, contacts | opens a dialog of the business's own channels | n/a | button/card | ⬜ **no appointment or request flow, no availability** |
| Products / affiliate | products | ✅ | ✅ | products records | enquiry or external link | ✅ (added this session) | grid/list | 🟡 no horizontal collection |
| Vehicle stock | products (kind vehicle) | ✅ | ✅ | products records | enquiry | ✅ | list | 🟡 |
| Gallery and media | gallery, image, video | ✅ | 🟡 | gallery records | none | ⬜ no lightbox | grid | 🟡 |
| Team | team | ✅ | ⬜ | staff records | none | ⬜ no profile | list/avatars | 🟡 |
| Reviews | reviews, leaveReview | ✅ | ✅ | testimonials, rating, links | review link | none | cards/quote | ✅ provenance shown |
| Opening hours | hours | ✅ | ✅ | hours | none | none | list/compact | 🟡 no today / open-now |
| Location / service area | location, serviceArea | ✅ | ✅ | location | directions link | none | card | 🟡 |
| FAQs | faq | ✅ | ✅ | faqs records | disclosure | inline | list | ✅ |
| Contact / enquiry form | **new** | ⬜ | ⬜ | none | none | none | none | ⬜ |
| Sharing and QR | **new** | ⬜ | ⬜ | published slug | none | none | none | ⬜ |
| Payment | payment | ✅ (labelled simulated) | ⬜ | none | opens a labelled mock-up | none | button/card | 🚧 Stripe not configured |

Backend reality at baseline: Supabase Postgres foundation only (businesses, locations, drafts, versions, subscriptions, audit). No staff, services, availability, holds or bookings tables. Postgres 16 is installed locally, so SQL can be tested for real.

## Final status (end of this phase)

Verified by the Playwright specs named in the last column (Chromium, production build) and unit/integration tests. "Preview" = works against the browser demo adapter; 🚧 rows name exactly what is not connected.

| Family | Type(s) | Add-content UI | Examples / marketing | Primary action | Expanded view | Compact variants | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Identity / header | page header | n/a | all 7 examples | main action | n/a | five header layouts | widgets, appearance | ✅ |
| Contact actions | call, whatsapp, email, directions | ✅ | ✅ | tel / WhatsApp / mailto / map | n/a | button / card / compact | widgets | ✅ |
| Links and social | link, social, document | ✅ | ✅ | opens URL | n/a | button / card; icons / list | widgets | ✅ |
| Text, announcements, promotion | text, announcement, offers, image, video | ✅ | 🟡 offers not shown in an example | optional link | n/a | card | page.test | 🟡 offers have no detail view (named, not hidden) |
| Services and prices | priceMenu, serviceList, featuredService | ✅ | ✅ | book / request / enquire per mode | ✅ service detail | menu, list, cards | widgets | ✅ |
| Booking | booking | ✅ | ✅ | full journey | n/a | button / card | booking, tests/integration | ✅ in preview · 🚧 live database, email/text, payment |
| Products / affiliate | products | ✅ | ✅ | enquire / own shop (disclosed affiliate) | ✅ | grid, list, swipe | widgets | ✅ |
| Vehicle stock | products (kind vehicle) | ✅ | ✅ | enquire / viewing | ✅ | list, swipe | widgets | ✅ · 🚧 live stock feeds |
| Gallery and media | gallery, image, video | ✅ | ✅ (barber) | opens lightbox | ✅ lightbox | grid, swipe, before/after | widgets | ✅ |
| Team | team | ✅ | ✅ (4 examples) | book with that person | ✅ profile | list, swipe, grid, avatars | widgets, booking | ✅ · choosing a person needs the Business plan |
| Reviews | reviews, leaveReview | ✅ | ✅ | review link | n/a | cards, quote, compact, swipe | widgets | ✅ provenance always shown |
| Opening hours | hours | ✅ | ✅ | none | n/a | list, compact (today, open now, in the business's zone) | widgets | ✅ |
| Location / service area | location, serviceArea | ✅ | ✅ | directions | n/a | card | widgets | ✅ |
| FAQs | faq | ✅ | ✅ | disclosure | inline | list | page.test | ✅ |
| Contact / enquiry form | enquiry | ✅ | ✅ | send message (no time reserved) | confirmation | button, inline | widgets | ✅ in preview · 🚧 email delivery |
| Sharing and QR | share | ✅ | ✅ | share sheet | ✅ | button, card | widgets (QR decoded) | ✅ preview link · 🚧 public link needs publishing |
| Payment | payment | ✅ (hidden on public pages) | not advertised | none | none | button / card | widgets (never public while unconnected) | 🚧 no payment provider |

Overlays: service, product, vehicle, team profile, booking, enquiry, lightbox, share, add-content chooser, record editors and destructive confirmation all use `src/components/taplo/overlay.tsx` (dialog, detail and mobile sheet kinds). Owner content management: chooser, create-in-place, Organise mode (touch drag, auto-scroll, keyboard, move menu, cancel, undo) in `src/features/page/editor/`, tested by `tests/e2e/content.spec.ts`.
