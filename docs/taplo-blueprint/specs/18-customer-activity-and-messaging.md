# Private activity and contextual communication

Status: recommended relationship layer. Depends on: identity and transaction access.

Each activity detail answers: what this is, which business supplies it, current status, date/location or fulfilment, amount paid/due, next action, relevant policy, messages and help. Orders and bookings retain appropriate specialist views within a shared grammar.

Attach a conversation to its business and relevant order/booking/quote. Messages retain scope; opening a thread cannot expose a different merchant's records. A business may manage permitted customer history, but not the customer's global spending or visits.

Transactional notifications cover acknowledgements, confirmations, changes, reminders, ready-for-collection, refunds and issue progress. Configure channels by availability, customer preference, delivery reliability and jurisdictional requirements. Marketing consent is separate. A failed reminder enters an actionable delivery state; it must not change the booking to cancelled.

Secure guest access should use verified, scoped access with expiry/revocation and anti-abuse controls. Claiming past activity into an account requires verification and deliberate matching rules, not merely entering an email address. Shared devices must not retain private details after sign-out.

Acceptance: an order update deep-links to the correct private record after verification. A customer can stop marketing without losing necessary transaction updates. A reschedule sends the new details once after commitment. Message retry avoids duplicates. A support handover includes the existing context so the customer does not retype it, while retaining permissions and an audit trail.
