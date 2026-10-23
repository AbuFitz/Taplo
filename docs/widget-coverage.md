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
