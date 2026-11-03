# Taplo · Atomic rule register

Edition 1.0 · Initial cross-feature invariants and failure contracts. This is a concrete starting register, not a declaration that all possible rules are enumerated. Each rule needs implementation and corresponding evidence before its capability is enabled.

| ID | Trigger / rule | Boundary / outcome | Recovery and affected surfaces |
| --- | --- | --- | --- |
| A01 | Merchant has no logo | Collapse artwork slot; readable authored name | Onboarding, Explore, page, popup; no generated initials |
| A02 | Uploaded wordmark already contains name | One principal identity; accessible name once | Preview placements; alternate name fallback on asset failure |
| A03 | Personal theme changes mid-task | Keep values/focus; merchant artwork intact | Settings, system shell, popup; provider screen retains own rules |
| A04 | Save or copy operation fails | Do not claim durable success | Restore state/selectable link; concise retry feedback |
| A05 | Staff accepts an invitation | Verify token/principal; grant only approved scope | Own workspace; expired invite recovery; audit |
| A06 | Staff can view own calendar | Server limits record and field scope | No colleague client details via API/export/push link |
| A07 | Leave/block conflicts with accepted work | Do not silently erase/shift appointment | Impact review, resolution/communication; Today/Calendar |
| A08 | Owner revokes member | Remove private authority promptly | Resolve future work/public links separately; historical attribution stays |
| A09 | Public staff link starts booking | Preserve chosen professional/location | No-time alternatives explicit; never silent substitution |
| A10 | Staff changes profile | Whitelist own fields; merchant publication policy | Draft/approval/publish status; no price/theme takeover |
| A11 | Two parties seek final unit/seat/time | Atomic constraint permits only eligible commitments | Retained input and current alternatives; no double sale |
| A12 | Cart item was added earlier | Recheck price/stock/fulfilment before commitment | Show material difference; new review; no indefinite hold |
| A13 | Hold expires | Release once under server clock | Expiry message; refresh alternatives; no misleading confirmation |
| A14 | Payment result uncertain | Same operation/key; reconcile existing attempt | Persistent pending record; customer/Studio/Console agree |
| A15 | Provider delivers duplicate/out-of-order event | Deduplicate effect; reconcile source; guard version | No repeat stock/reward/refund/notification effect |
| A16 | Payment arrives after hold expiry | Commit only if still feasible | Otherwise defined compensation/case; no invented success |
| A17 | Reschedule replacement fails | Keep original commitment | Safe retry with current alternatives and exact old/new state |
| A18 | Quote changed or expired before acceptance | Reject stale commitment | Show latest permitted scope/amount; acceptance does not imply time reservation |
| A19 | Two learners/attendees share payer | Count actual participants/seats | Separate authority, joining details and payer contact |
| A20 | Waitlist quantity does not fit opening | Apply explicit fairness/group policy | No silent party splitting; expiry/next candidate once |
| A21 | Order partially fulfilled/returned | Quantities per line and eligible amount | Operational disposition separate from money/refund |
| A22 | Returned item is damaged | Do not automatically restore available stock | Record disposition; refund evaluated independently |
| A23 | Cancellation fee/deposit requested | Applicable reviewed rule and authority; no double recovery | Exact impact before action; appropriate support route |
| A24 | Reward reversal needed | Signed ledger entry with origin/rule/version | Idempotent benefit adjustment; pass sync separate |
| A25 | Wallet add opens or update queues | Issuance/installation/entitlement are distinct | Official UI; pending/failure; server entitlement authoritative |
| A26 | NFC item is tapped or UID read | Not sufficient ownership proof | Protected exclusive claim; stable safe redirect |
| A27 | Domain order accepted | Not yet verified/HTTPS-active | Tracked order/DNS/host/certificate states and fallback |
| A28 | Customer enters precise service address | Minimum private task disclosure | Never leak into public map/SEO or broad staff feed |
| A29 | Search/map result stale | Final source validation on action | Remove/update projection; preserve useful browse context |
| A30 | Conversation/attachment opened from old link | Recheck participant/role and safe download scope | Verify/recover; no private preview leakage |
| A31 | Notification fails | Transaction truth remains committed | Retry delivery; persistent Activity; owner exception queue |
| A32 | Guest claims record/account changes | Verify exact authority; safe merge/conflict policy | No matching-name/email bulk data claim |
| A33 | Marketing opt-out or import | Suppression/purpose evidence retained | Import cannot reset opt-out or invent consent |
| A34 | Merchant changes policy | New version; preserve accepted snapshots | Future/existing scope review and durable notices |
| A35 | Data rights/deletion request | Verify scope and applicable retention | Secure delivery/redaction/provider jobs; tracked deadline |
| A36 | Subscription limit/payment failure | Distinguish new optional usage from existing obligations | Clear billing/grace/exit; keep appropriate record/support access |
| A37 | Merchant closes | Resolve commitments, data, money and connected services | Tracked plan, verified export, safe domains/NFC/pass treatment |
| A38 | Public content/review reported | Proportionate permitted investigation and outcome | Moderation/case/appeal; rights/privacy and actual legal scope |
| A39 | New category capability enabled | Explicit required configuration and reviewed scope | Draft/enquiry remains useful; unsupported commitment blocked |
| A40 | Public/client submits authoritative fields | Server resolves authority and protected values | Reject mass assignment and cross-tenant mutation |

For implementation, add owner, command/input schema, record/version, permission/field policy, source or proposed-policy rationale, acceptance fixture and observed evidence to each rule. The source ledger and specs identify the current recommendation; the system coverage audit identifies unresolved breadth/depth. Future discovered rules join this register rather than becoming undocumented exceptions.

## Additional connected invariants · 1.2

| ID | Trigger | Required invariant | Visible/recovery consequence |
| --- | --- | --- | --- |
| A41 | Deposit selected | Advance is allocated toward an agreed total, not charged twice | Show pay-now/balance and auditable adjustments |
| A42 | Stored method available | Token existence does not establish authority for another charge/merchant | Require specific valid authority or customer payment action |
| A43 | Cancellation assessed | Versioned fair rules and applicable rights; avoid duplicate loss recovery | Explain outcome, refund progress and challenge route |
| A44 | Merchant-branded email sent | Authenticated actual sender; authorised reply route and safe factual fields | No spoofed From or unmonitored promised reply |
| A45 | Reminder dispatches | Current booking version and deadline still valid | Suppress stale reminder after change/cancellation |
| A46 | Website widget reports action | Public host receives no private transaction payload by default | Safe fallback and scoped callbacks |
| A47 | Required calendar goes stale | Never interpret unknown busy state as all time free | Affected instant booking gated; explicit request/reconnect |
| A48 | Appearance changes | Tokens cannot change permission, price or transaction authority | Stable records; preview/published revisions distinct |

These are proposed invariants for later typed/implementation coverage, not evidence they already run.
