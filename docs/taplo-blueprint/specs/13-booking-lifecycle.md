# Booking from selection to completion

Status: proposed complete journey using existing scheduling foundations.

An appointment offer defines location/delivery, duration, staff eligibility, resources, price/deposit rules, capacity where appropriate, lead time and change policy. A request flow and instant-confirmation flow are distinct promises. “Request sent” must not look like a confirmed appointment.

Customer flow: choose service → relevant staff/location → eligible time → required details and applicable terms → payment if needed → confirmation or request acknowledgement. Hold inventory/time only for a defined period. Staff-independent “any available” assignment must commit a real eligible allocation before confirmation.

Lifecycle: pending request, payment pending where relevant, confirmed, completed, no-show, cancelled, declined and expired. Financial status remains separate. A confirmed booking can be unpaid, partially paid or refunded; no-show does not mean a fee was successfully collected.

Manage booking through secure Activity or scoped verified access. Cancellation/rescheduling respects the policy version accepted at booking and any applicable rights. A change shows the new time, price difference and fee before commitment. Owner overrides require permission, reason and recorded customer communication.

Acceptance: simultaneous attempts for the last staff/time allocation produce one valid booking. An expired hold releases availability. A cancellation does not cancel another customer's recurring occurrence. A payment result arriving after expiry is reconciled through compensation/refund rather than silently double-booking. Marking no-show records the event and explains any separately authorised fee process.
