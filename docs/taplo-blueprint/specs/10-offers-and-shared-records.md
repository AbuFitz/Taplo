# Offers and transaction snapshots

Status: proposed domain contract. Implementation schema remains changeable.

Offer identity is stable. An offer has a business, type, title, content, visibility and operational settings appropriate to its type. Purchasable variants are separate from decorative page blocks. One offer can appear in multiple collections or page sections without duplicating stock or price.

Separate catalogue state from transaction state. Order lines and bookings retain agreed seller, item/variant, price, currency, duration, tax treatment where applicable, fulfilment and policy versions. Editing today's catalogue cannot rewrite yesterday's agreement. Archive referenced offers rather than destroying the history necessary for customers, accounting or disputes.

Proposed core records: Business, Membership, Offer, Variant, Location, Resource, AvailabilityRule, Session, CustomerRelationship, Cart, Reservation, Order, OrderLine, Booking, Payment, Refund, Fulfilment, Quote, Conversation, RewardEntry, HardwareAsset, SupportCase and AuditEvent. This list is conceptual; physical storage can differ.

Commands verify business ownership, permissions, version and relevant availability. Events carry stable IDs and an occurrence time. Retryable consumers deduplicate. Avoid assuming an event bus is required before the data model is coherent.

Acceptance: displaying one mug in two sections shares one variant stock balance. Archiving an appointment offer preserves existing bookings. Two merchants with the same customer email do not gain access to one another's records. Money uses integer minor units with an explicit currency; totals and discounts follow recorded rounding rules. Business-type changes do not invalidate transaction history.
