# Ecosystem integration contracts

Status: cross-system design contract, edition 0.7. It joins the preceding specifications and exposes work that must be validated; it does not certify implementation completeness.

## Identity and source of truth

Stable business, offer, person, membership, transaction, accessory and pass IDs connect surfaces. A display handle, domain, email, product title or NFC UID alone is not that identity. Brand appearance and discovery projections consume the records; they do not become competing copies of the business.

Every significant handover carries a typed context: business and offer IDs; relevant variant/service/session/location; origin/return state; current quote/version; authenticated role where required; expiry for a reservation or invitation; correlation/idempotency references for retries. Include only needed data and validate it at the receiving boundary.

## Handover matrix

| Connection | Shared context | Required outcome and recovery |
| --- | --- | --- |
| Studio → public page | Published version, source records, appearance contract | Draft stays private; publication/cache updates are coherent |
| Studio → Explore | Publication/discovery eligibility and featured/relevant offers | Withdrawal removes current listings without deleting historic work |
| Explore → business | Business ID, originating query/filter/position | Same identity and facts; Back restores browsing |
| Explore/block → popup | Business/offer/variant plus appearance family | Correct item preselected; direct URL and Close work |
| Product → bag | Merchant, variant, quantity and validated offer reference | Merchant-scoped lines; stock/price rechecked before commitment |
| Service → booking/quote | Eligible service/staff/location and request mode | Correct promise; actual time/price/rules checked |
| Payment → order/booking | Payment intent, reservation and idempotency | Authoritative success/pending/failure; reconcile late or duplicate events |
| Order/booking → Studio | Committed work, ownership/assignment and next action | Today/Calendar/fulfilment show the same commitment |
| Transaction → Activity | Authorised participant and snapshot/status | Customer can manage the correct record after verification |
| Change/refund → communications | Committed version and correct recipient/channel | One truthful update; delivery retry without changing transaction truth |
| Completion/refund → rewards | Originating transaction and rule version | Earn/reversal ledger changes once |
| Rewards/booking → Wallet | Pass identity and permitted entitlement state | Queue update; server remains authoritative if the pass is stale |
| Share → recipient | Public canonical object or separately scoped private invitation | No personal session/data leakage; useful web/app fallback |
| Domain → public routes | Verified host, business and primary-address preference | Correct tenant, HTTPS, canonical/redirect and item path continuity |
| NFC → business | Stable accessory redirect and authorised destination | Quick customer access; safe fallback after a handle/domain change |
| Owner website → phone | Short-lived setup context and verified business membership | Resume correct task without transferring a reusable signed-in session |
| Claim/write → accessory record | Order/claim proof, hardware and destination | Duplicate claim blocked; write/read-back verified where writing is needed |
| Issue → Console | Case type, linked records, permitted evidence and owner | Appropriate support track; financial/provider statuses stay distinct |
| Account/role deletion → all channels | Person/membership scope and retention obligations | Access revoked; lawful retained records protected; pass/token treatment explicit |
| Catalogue/style evolution → clients | Versioned contract, migration and cache invalidation | New presentation preserves source facts and historical agreements |

## Consistency and external systems

Use transaction boundaries or explicit compensation for related state. External payment, registrar, messaging and Wallet operations are asynchronous: record intent, provider reference, current state and recovery owner. Deduplicate retries/events and tolerate out-of-order results. A frontend animation, URL redirect or API acceptance does not alone prove that the whole operation completed.

Wallet/NFC/domain integrations each retain their provider-specific capabilities and responsibilities. A shared UI shell should not hide meaningful limits. Console can inspect and act within permissions but must not rewrite financial truth independently. Existing customer commitments survive appearance changes and ordinary catalogue edits.

## Validation coverage

Run complete cross-surface scenarios, not only isolated component tests: product purchase plus return/reward reversal; service request versus confirmation; sold-out product or expired time hold; lost NFC accessory; custom-domain rename/expiry; Wallet update failure; merchant role removal; private guest claim; duplicate provider event; provider outage and reopened support case. Each has a customer message, owner task and support recovery where relevant.

Keep a decision/dependency register for unresolved architecture, policy, economics and specialist requirements. These written contracts identify the granular work; implementation, real-device/provider checks and customer testing establish whether the experience works.
