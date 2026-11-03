# Console and customer support operations

Status: proposed internal product. Depends on: role-based access and audit records.

Console should provide a case inbox, business lookup, scoped customer/transaction lookup, issue timeline, permitted resolutions and service-health context. Avoid unrestricted impersonation as the default support tool. Where assisted access is needed, make it time-limited, purpose-bound and audited, with additional consent where appropriate.

A case records type, business, customer reference, linked transactions, owner, priority, status, deadlines, communication and evidence. Suggested states: new, triaged, awaiting customer, awaiting merchant, awaiting provider, action required, resolved and reopened. Waiting states retain an owner and timer rather than disappearing from the queue.

Permission tiers separate ordinary support, financial operations, trust/safety and security administration. Viewing sensitive information, exporting records, changing payout-related details or issuing high-value adjustments needs appropriate controls. Every consequential action records actor, reason and before/after state.

A customer enters support from the affected activity; Console should receive permitted context automatically. Route merchant fulfilment questions to the merchant first with escalation paths, while Taplo owns platform faults, hardware orders it sells and the responsibilities established by its terms/payment arrangement.

Acceptance: a support agent can identify a failed notification without viewing full payment credentials. A case can link an order, booking and payment dispute without merging their states. Duplicate cases can be linked with history preserved. Closing a case does not change a payment or return unless an explicit authorised action did so.
