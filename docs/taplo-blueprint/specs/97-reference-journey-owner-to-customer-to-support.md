# 97 · Reference journey: one business, one connected relationship

Working edition 1.7 · 3 November 2026 · Adopted reference scenario. This deepens a connected service journey using existing contracts plus identified extensions; it is not a claim every schema, final screen or integration is complete.

## Reference business and purpose

Chapter is a fictional independent barber business used to make the experience concrete. An owner creates a recognisable mini-space, adds one service with their own price and duration, sets actual working time in context, and deliberately publishes an eligible offer. A customer enters through the owner's existing website or social link, books, pays only if required, returns to manage the appointment, and can resolve a cancellation without restarting the journey.

Illustrative amounts: £40 total, optional £10 deposit, £30 balance. These are synthetic service amounts, never Taplo subscription pricing or suggested merchant prices. The reference uses Europe/London and a specified resource/location; actual dates/slots are authoritative data, not hard-coded UI promises.

## Actors and source authority

Owner authorises offer, business scheduling and financial settings. Practitioner sees own/assigned work under granular grants; a TeamProfile or Resource is not a login. Customer or verified guest manages only their permitted booking. Merchant finance role handles permitted refunds/review; Console has separate diagnostic and action permissions. Each command resolves principal/business/field authority server-side and uses the existing response/error envelope.

Primary records: Business, Offer, Resource, AvailabilityRule/AvailabilityChange, Reservation, AgreementSnapshot, Booking, Payment, Refund, Conversation/Message, SupportCase, AuditEvent and ProviderOperation. Search/mini-page/customer return/calendar/email/Wallet are scoped views or projections over source truth. New working-time draft/readiness and payment-authority/allocation details need the explicit extensions in 86/93; existing generic fields are not assumed sufficient.

## Owner path and interface

| Stage | Exact outcome | Actions and safeguards |
| --- | --- | --- |
| Identity draft | Owner recognises name/look and primary customer action | No mandatory upload; no invented initials; choose coordinated look; account handover preserves draft |
| First service | Authored title, price mode/amount and duration | Save service draft; optional photo/description; no scraped/prefilled commercial facts |
| Missing working time | Scoped quick editor opens in the service task | Named resource/location/timezone; days/intervals; copy-to-selected days; preserve service draft |
| Hours saved | Shared working pattern updated; next dependency recomputed | Actual hours persist independently of unsaved service; exceptions preserved; full settings optional |
| Booking mode | Explicit instant/request choice appropriate to configured workflow | Request not labelled confirmed; resources/availability checked |
| Optional payment protection | Owner chooses none/deposit/full/guarantee where supported | £10 example manually authored; policy and provider readiness required for online advance |
| Review | Show real customer page/task and actionable readiness | Blocker explains exact fix; optional content not red errors; no silent publish |
| Publish | A versioned eligible public composition becomes active | Authorised owner action, fresh readiness check and conflict handling; preview remains separate |

Do not force all customers through payment onboarding when the owner chooses no upfront charge. Conversely, selecting deposits cannot silently degrade to pay later because provider setup is incomplete. Owner can retain draft or deliberately choose a different supported mode.

## Customer path

Direct visitor sees Chapter once, compact authored blocks and a horizontal offer rail where useful. Selecting the service opens its readable rounded task surface. The customer chooses eligible professional (or any available), time, then enters necessary contact/participant facts and reviews. Location, total, deposit/balance and cancellation summary remain legible; no app install or marketing consent is required to complete the ordinary booking.

The review uses a short-lived server quote/reservation with offer/policy versions. On change/expiry, show new facts and require review rather than silently charging another amount. Display Book appointment for the no-upfront route and Pay £10 deposit for the paid route. Where a provider challenge or external page is needed, preserve task context and verify financial state on return.

After authoritative success: appointment details, amount paid/balance where relevant, Manage appointment and useful location/contact information. Save business/Wallet/app promotion is secondary and optional. One agreement summary plus the defined receipt source avoids duplicate contradictory financial messages.

## Private return and daily work

Authenticated or appropriately verified customer returns to the same business mini-space. For you shows the next actionable booking above suitable public blocks, with View appointment. Anonymous visitor sees none of its private facts. A scoped guest link accesses only the authorised task, not all records matching an email.

Staff calendar/agenda shows assigned appointment and necessary payment status without bank/payout/private unrelated data. Merchant can record attendance, authorised payment collection and relevant notes under separate actions. Completing the service does not implicitly authorise a later charge or create marketing consent. Repeat booking retrieves eligible current offers/time/price; it does not recharge a historic agreement.

## Normal command sequence and boundaries

1. Owner configuration commands must be explicitly defined/bound for Offer/AvailabilityRule and publication; existing booking commands do not imply these editors already have exact APIs.
2. CreateReservation validates offer/resource/location/time, acquires finite capacity and server quote; reservation is not a booking or completed charge.
3. Accept/version AgreementSnapshot and verified participant/contact authority before commitment. The full consent/snapshot creation API remains an identified contract extension.
4. No upfront route: CommitBooking consumes valid reservation atomically under the chosen guards. Deposit route: create/track the correct merchant payment operation; only verified success plus valid/reconciled capacity permits commitment.
5. Outbox emits committed event; projections/calendar and notification intents process independently. Delivery failure does not erase an accepted booking.
6. Customer management reads current authorised state. RescheduleBooking reserves replacement before releasing original; CancelBooking requires reviewed current impact and records cancellation separately from refund execution.
7. Refund/review/provider dispute each have independent records/status and permitted actions. SupportCase links relevant state and evidence without granting an operator unrestricted financial control.

This sequence is an explicit handoff map, not a complete additional implementation or proof of all underlying command contracts. Builder may not invent missing configuration/acceptance/payment APIs without reconciling the specification first.

## Cancellation branch

Customer selects Cancel appointment. Review states date/time, amount paid, policy cutoff in clear timezone and calculated outcome. If a valid free cancellation applies, explain the eligible refund and initiate under authorised rules. Otherwise show reviewed proposed retention/refund and a way to request review. Cancellation can free capacity while financial review continues; the customer must not be shown as still attending simply because money is disputed.

Merchant review contains a concise timeline and itemised outcome, not a blank chat thread. Merchant can waive, refund authorised amount or explain a justified proposed charge. Customer can challenge facts; applicable rights and provider deadlines remain intact. If the customer seeks a bank dispute, do not issue a second uncoordinated refund. Taplo handles its technical faults and escalation; merchant supply quality remains the merchant's responsibility under the real arrangement.

## Screen and feedback state set

Owner editor: empty, authored draft, unsaved, saving, saved, invalid, conflict, permission revoked, disconnected. Hours editor: current pattern, closed day, split shift, copy review, impacts accepted work, failure/conflict and successful return. Publish: ready, blocker, changed revision and confirmed version.

Customer: offer unavailable, no eligible times, loading, reservation expiry, quote/policy changed, verification required, payment processing/challenge/failed/uncertain/succeeded, confirmed, rescheduled, cancelled, refund pending/failed/completed and review requested. Staff/Console: restricted field, stale projection, provider mismatch, permitted reconcile and case owner/deadline. Each needs visible copy, action, focus/back behaviour and expected record effect.

## Scenario acceptance set

| ID | Trigger | Expected invariant/outcome |
| --- | --- | --- |
| J01 | No logo, long name | Deliberate readable identity, no generated initials or duplicate name |
| J02 | Hours quick save while service unsaved | Hours saved, service draft retained; no false all-saved state |
| J03 | Existing exception edited only via full settings | Quick save preserves it and current accepted work |
| J04 | Owner chooses no deposit | No card/setup gate added without another valid requirement |
| J05 | Deposit chosen, provider restricted | Paid offer not enabled; explain exact next step |
| J06 | Two customers select final slot | At most valid capacity committed; loser gets useful alternative/recovery |
| J07 | Payment succeeds after expired reservation | Reconcile capacity or defined refund path; no fictional confirmation |
| J08 | Repeated submit/callback | No duplicate booking/payment/refund effect |
| J09 | App/browser closes after payment | Safe status retrieval; no instruction to pay again without reconciliation |
| J10 | Reminder queued then rescheduled | Old reminder suppressed; new actual time/version used |
| J11 | Anonymous/shared-device page visit | Private booking absent; proper verification/cleared cache |
| J12 | Staff accesses refund/bank details without grant | Denied; calendar access does not confer financial authority |
| J13 | Cancellation/refund pending | Booking and financial states separately truthful |
| J14 | Merchant rebooks cancelled slot | Relevant mitigation review, no blanket automatic charge formula |
| J15 | Merchant leaves with upcoming work | Tracked closure/refund/support route; records not erased indiscriminately |
| J16 | DST/timezone boundary | Correct local agreement/cutoff and stored instants; ambiguous times resolved |
| J17 | External calendar stale | Affected instant booking follows freshness gate, never assumed free |
| J18 | Theme/media/reduced-motion changes | Critical content readable and operable; transaction authority unchanged |

These are specified expected outcomes; implementation/provider/concurrency/user test evidence must be recorded separately. JOURNEY-REFERENCE.html supplies selected visual interactions, not every screen in this state set.
