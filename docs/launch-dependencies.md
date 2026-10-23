# Launch dependencies

Information and services Taplo cannot supply for itself. None of these is invented in the product; where one is missing, the interface says so once, at the point of use.

## Approved information (owner: Taplo)

| Needed | Used by | Status |
| --- | --- | --- |
| Company name, registered address, registration number | Footer, privacy notice, terms | Missing |
| Privacy notice (controller, purposes, retention, rights contact) | `/legal/privacy` | Missing. The page says it will be published before launch |
| Terms of service (accounts, acceptable use, plans, billing) | `/legal/terms` | Missing. Same |
| Support and reporting contact | Footer, legal pages, error states | Missing |
| Cookie and consent wording that matches what the live service sets | Banner (not built until there is something to consent to) | Missing |
| Approved sender address for product email | Enquiry email, confirmations | Missing |
| Approved contact for the marketing site | Footer, contact page | Missing |

## Services (owner: Taplo; none provisioned in this work)

| Service | What it switches on | Where the interface mentions it |
| --- | --- | --- |
| Accounts and sign-in | Real log in, a public address per page | Sandbox badge, publish step |
| Public hosting of business pages | Public links and QR destinations | Share panel, review step |
| Shared database (Postgres, schema already written and tested) | Live bookings with no double-booking, enquiry inbox across devices | Booking product page |
| Email provider | Enquiry email, appointment confirmations | Product pages (Messages, Contact) |
| SMS provider | Appointment messages, reminders, promotions | Product pages (Messages) |
| Payment provider | Deposits, payments, product checkout | Add content (Pay or deposit), Products page |

All of the above is read from `src/lib/capabilities.ts` and `src/lib/feature-status.ts`.
