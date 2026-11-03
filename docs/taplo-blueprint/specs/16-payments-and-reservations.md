# Payment, stock and time must agree

Status: proposed transaction integrity contract. Working payment responsibility is now selected in [PAYMENTS-AND-REFUNDS.md](../PAYMENTS-AND-REFUNDS.md): merchant direct Stripe Connect charges, separate Taplo software billing. Actual provider/loss configuration and legal verification remain open. This supersedes this chapter’s original undecided status.

Use a reputable processor with connected merchant onboarding. Before implementation, decide seller/merchant-of-record responsibilities, charge arrangement, refund authority, negative balance liability, fees and payout communication. Processor configuration does not settle every commercial or legal responsibility.

For constrained purchases, create a finite stock/time reservation with expiry, quote and idempotency key. Start payment against that intent. Confirm through authoritative server verification, not a browser success animation. A successful customer redirect is useful feedback; asynchronous processor events and reconciliation determine durable financial state.

Model order, booking, payment and fulfilment states separately. A mixed transaction may need compensating actions rather than a magical distributed transaction: if money succeeds after a reservation expires, verify availability and confirm only if still valid; otherwise initiate the defined refund/recovery path and inform the customer. Never collect twice to conceal a timeout.

Deposit, remaining balance, card-on-file mandate and cancellation charge are separate mechanisms. Confirm what is authorised, when it can be collected and what happens on failure. Do not market an arbitrary “hold” as a long-term card authorisation.

Acceptance: duplicate event delivery changes balances once. Events arriving out of order do not regress a successful payment to pending. A processor outage creates an explainable pending/recovery state. Refunds cannot exceed remaining refundable value after prior refunds. Every monetary adjustment has an origin, reason, actor and matching processor reference where relevant.
