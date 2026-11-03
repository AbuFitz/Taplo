# 63 · Record contracts and data invariants

Edition 1.0 · `contracts/record-schemas.json` supplies typed core record definitions, required fields and enums. This is a proposed contract baseline, not a deployed schema or a complete physical storage design. Schema validation alone cannot enforce the relational and transactional rules below.

## Common fields and ownership

Records carry opaque stable ID, version ≥1, created_at and updated_at as UTC timestamps. Tenant records require business_id; User and Business are global identities. Membership authorises a user within a business; CustomerRelationship scopes a customer/verified guest to that business. Never join tenants by matching email. Domain/handle/name are mutable addresses, not primary identities. `additionalProperties: false` rejects unrecognised fields in the proposed contract; intentionally extend a version rather than accepting arbitrary mass assignment.

Optional means absent when not known/applicable, not an empty fabricated value. Null is not implicitly accepted. API writes use explicit patch/remove semantics where clearing is supported. Dates/times carry UTC instants plus an IANA timezone when wall time matters. Calendar rules preserve local intent and generate explicit occurrences; an unvalidated free-form recurrence string cannot directly create commitments. Distinguish event occurrence time, processing time and aggregate version.

## Record families

| Family | Principal records | Critical relationship |
| --- | --- | --- |
| Identity/access | Business, User, Membership, CustomerRelationship, Participant | Payer/learner/authorised staff are distinct |
| Offer/place/time | Location, Offer, Variant, Resource, AvailabilityRule, Session | Publication projects source facts; occurrence is concrete time/capacity |
| Commitment | Cart, Reservation, AgreementSnapshot, Booking, Order, Quote | Held intention differs from committed agreement |
| Money/work | Payment, Refund, Fulfilment, InventoryBalance, InventoryAdjustment, Subscription | Payment, operational completion and entitlement are separate |
| Relationship | Conversation, Message, RewardEntry, WaitlistEntry | Conversation/benefit has explicit eligible participant and origin |
| Connected services | WalletPass, Domain, HardwareAsset | Provider state and entitlement/destination are not inferred from a button click |
| Operations | SupportCase, AuditEvent, EventEnvelope, ProviderOperation | Every privileged or external action is attributable and recoverable |

Referenced contact/address/assets/offer configurations need dedicated implementation schemas with purpose, validation and retention. These are explicit extension requirements, not hidden JSON buckets. In particular: verified-contact proof expiry, asset scanning and ownership, coverage geometry, offer-specific durations/buffers, tax configuration, recurrence parsing and notification preferences. The four profiles in spec 62 specify their required behaviour; engineers must complete those storage/input definitions before implementing the corresponding feature.

## Enforced invariants

- Money: integer minor units with explicit currency; use a currency exponent registry rather than assuming two decimals for every currency. A single charge and its linked refunds use the same currency. Totals come from server calculations and versioned tax/discount/shipping inputs. Select deterministic line-level rounding and residual allocation rules; store the applied results. No browser-submitted total is authoritative.
- Inventory: available = on_hand − held − committed − unavailable; all quantities are nonnegative, and held+committed+unavailable ≤ on_hand for ordinary tracked stock. Incoming is not sellable until received. Fulfilment reduces on_hand and committed together for that quantity. Expiry releases held once. An inventory adjustment records reason/actor/origin; it does not overwrite an order agreement.
- Capacity: held_seats + committed_seats ≤ capacity; participants consume the agreed seat quantity. Staff/resource time overlap checks include configured setup/travel/cleanup. Acquire all necessary constraints atomically or roll back the whole local reservation. Async search results are hints; final reserve checks live data.
- Time: ends_at > starts_at; candidate interval must fit working time and resource constraints. Local DST ambiguity/nonexistent time requires a deliberate rule and visible review. Rescheduling secures the replacement before releasing the original. Multi-occurrence changes identify each affected agreement.
- Snapshots: accepted seller identity, item/service, quantity, money, tax treatment, delivery mode and policy version are immutable historical agreement facts. Changes become a new accepted variation/revision, not an edit to history. Corrections preserve an audit trail.
- Refunds: succeeded plus processing/refund-reserved amounts cannot exceed remaining refundable payment value. Merchant/platform fee refund decisions are explicit. Stock, reward reversal and refund each have their own idempotent origins.
- Rewards: signed integer ledger entries reference rule version and originating transaction; uniqueness prevents duplicate earn/reverse. Customer-visible balance is derived. Redemption reserves/commits benefit according to the agreement; no editable standalone balance field.
- Provider links: reference is scoped by provider, environment and connected account, not an unqualified ID string. No raw payment card data or private claim secret in public projections/logs.

## Public versus private projection

Public discovery includes only eligible published merchant/offer data and intentionally public location information. Private address, participant notes, customer references, capacity internals, provider identifiers and support evidence do not ship to the browser simply because hidden CSS exists. Read models return the minimum fields for the role/task. Public SEO/item routes use the same facts but never expose private operational records.

## Versioning, constraints and migration

Updates compare expected version and increment atomically. Important uniqueness constraints include host binding, claim ownership, provider operation/idempotency identity, inventory location+variant, message client key within conversation and reward origin/rule/action. Archive referenced objects, separating visibility/access/retention rather than deleting history blindly. Migrations use expand/backfill/verify/contract, resumable jobs and compatibility windows where required; test old saved designs and old app clients. A migration cannot silently change accepted policy or financial snapshots.

The contracts folder is useful for implementation planning and validation. It must be extended deliberately as unsupported features are defined; the existence of a schema is not evidence that the complete platform model has been solved.


Edition 1.0 extension: PolicyVersion, PolicyAcceptance, ConsentEvidence and TeamInvitation now have typed definitions. BusinessSubscription is separate from merchant-customer Subscription; SaaS billing does not invent a customer relationship inside the merchant’s own sales database. Their statutory applicability, evidence handling and enforcement follow 74–76.
