# Booking architecture and exact connection status

## Layers

| Layer | Where | Role |
| --- | --- | --- |
| Rules (pure TypeScript) | `src/features/booking/{time,availability,engine,types,model}.ts` | Time zones and clock changes (`Intl`), working hours, breaks, leave, date exceptions, buffers, notice, window, capacity, eligibility, holds, idempotency, status changes, rescheduling. No I/O. |
| Server rules (SQL) | `supabase/migrations/20261023000001_booking.sql` | The same rules as `slot_problem`, `create_booking`, `hold_slot`, `set_booking_status`, `reschedule_booking`, `expire_pending`, `submit_enquiry`. An exclusion constraint (`bookings_no_overlap`) and advisory locks make double-booking impossible, whatever the application does. |
| Demo adapter | `src/features/booking/demo-adapter.ts` | Runs the pure engine against `localStorage` (`taplo.demo.bookings.v1:<slug>`, `taplo.demo.scheduling.v1:<slug>`). Every confirmation says "saved in this browser only". |
| Customer journey | `src/features/booking/ui/BookingFlow.tsx`, `EnquiryForm.tsx` | Service, person, location, day and time, details, review, result. Reuses react-day-picker 10 for the date strip. |
| Owner side | `src/features/booking/ui/owner/*` | Agenda, day/week/month, detail, status, blocked time, working hours. Built on the same engine; no calendar library. |

## Outcomes and wording

| Service mode | Result | Buttons | Result wording |
| --- | --- | --- | --- |
| instant | Confirmed appointment | Book this time / Confirm booking | "Confirmed appointment. Your time is reserved." |
| request | Pending request | Request this time / Send request | "Pending request. This is a request. It is not confirmed until the business accepts it." Expires if unanswered (`expirePending`). |
| contact | Enquiry | Send message | "No time was reserved." |

## Guarantees and how they are tested

- **Atomic, no double booking.** SQL: exclusion constraint plus `pg_advisory_xact_lock`. Tested on Postgres 16 in `tests/integration/booking.test.ts` with concurrent connections (one wins, the other gets `slot_taken`).
- **Idempotent retries.** A client key per attempt; replaying it returns the first booking. Tested in the engine (`booking.test.ts`), in SQL, and by a double-tap e2e test.
- **Holds.** A time chosen in the journey is held briefly so two customers do not collide mid-journey; holds expire on a test-clock-aware timestamp.
- **Time zones.** Business-zone rules and DST (a day with 23 or 25 hours, the 29 March 2026 five-hour case) are unit-tested; the customer's own time is shown when it differs.
- **Permissions.** SQL functions take the business id and the staff/service must belong to it; public RPCs expose only what a visitor needs. Row-level security is in the migration and tested: anonymous visitors cannot read or write any scheduling table directly, and another business's members cannot read this business's bookings. Account sign-in itself is not connected (below).

## Exact connection status

| Piece | Status |
| --- | --- |
| Rules engine | ✅ implemented, unit tested |
| SQL functions and constraints | ✅ written, applied and tested against a local Postgres 16 |
| Customer journey and owner calendar | ✅ working in the browser against the demo adapter |
| Live database | ❌ **not connected.** No Supabase project is configured for this environment. The journey does not call the SQL functions yet; swapping the adapter for an RPC client is the one remaining step, and it is deliberately not described as done. |
| Email and text confirmations | ❌ not sent. No provider is connected. The UI says so on every confirmation. |
| Deposits and payment | ❌ not connected. The payment widget stays off on public pages. |
| Rate limiting of public booking RPCs | ❌ not implemented (needs the hosting edge or a database extension). |
| Accounts, public publishing | ❌ not connected, so owners cannot yet log in to a real calendar. |

## What "connected" will need

1. A Supabase project and the migration applied; environment variables set.
2. A server adapter exposing `create_booking`, `hold_slot`, `submit_enquiry` and the owner functions to the app (the RLS and functions already exist).
3. An email/SMS provider for confirmations and reminders.
4. A payment provider for deposits.
5. Rate limiting on public endpoints.
