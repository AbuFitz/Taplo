# 65 · Commands, lifecycles and integration recovery

Edition 1.0 · Companion files: state-machines.json, command-contracts.json and command-inputs.json. The state graphs specify intended guarded transitions; they are not deployed workflow code.

## Command protocol

Every write resolves principal and business on the server, validates typed input, checks expected version for an existing aggregate, and scopes an idempotency key to principal/business/command. Store input hash and durable operation/result identity. Reusing a key with different meaningful input returns conflict. Retry of an uncertain original operation retrieves/reconciles it; it must not create a second charge or booking. Proposed error vocabulary distinguishes verification, forbidden/not found, invalid field/rule, version/availability conflict, rate limit and temporary failure. Field errors use stable keys and preserve user values.

Return current record version, safe next actions and request reference. An async accepted operation returns an operation/status link with pending wording. The browser never changes order/booking/payment state by posting a desired status enum. Commands express intentions; rules decide transitions. Field schemas are not permission to set provider refs, paid amounts, arbitrary role or historical policy on the client.

## Transaction boundary

Authorise → lock/compare relevant rows or use equivalent atomic constraints → recalculate/validate current facts → persist aggregate changes, audit and outbox in the same local transaction → respond. Deliver emails, provider calls, pass updates and search invalidation through durable tracked work after commit. Use an outbox/inbox pattern or an equivalent reliability mechanism; an event bus is not mandatory merely because events exist. Background jobs recheck authority/record version where required.

## Important lifecycle meanings

Reservation held/committed/released/expired is separate from booking requested/confirmed/completed/cancelled/no-show. An instant free booking can be created and confirmed atomically without presenting an artificial waiting screen. Payment succeeded remains financial history after a refund; Refund has its own requested/processing/succeeded/failed state. Order status is separate from per-line fulfilment and return state. A fully supplied order can later acquire a return/refund case without rewriting original completion facts.

Reschedule operates on a confirmed booking version, securing eligible replacement capacity before relinquishing the original. If payment adjustment is needed, define a recoverable staged change; do not discard the old booking while waiting for an unrelated provider call. A sent quote is immutable; revision creates a new version and supersedes the old. Acceptance of stale/expired quote returns a conflict with the current permitted next action.

## External provider recovery

Track ProviderOperation with subject, environment/account, idempotency reference, attempt count, provider reference, status and next retry. States include uncertain, not just success/failure. On timeout, query/reconcile before creating a replacement. Pin a supported provider API version and validate the exact selected integration path; do not copy preview API examples into production automatically.

Stripe documents duplicate deliveries, non-guaranteed event ordering and versioned event payloads [R7]. Proposed handler: validate signature/raw payload and account/environment → durably save inbox receipt → acknowledge → process/reconcile authoritative object → guarded idempotent local update → outbox follow-ups. Return acknowledgement only after durable intake; otherwise allow retry. Transport-event deduplication and business-effect deduplication are separate. Never order state solely by timestamps or process a “paid” event into the wrong merchant.

For provider writes use stable keys and persist operation identity beyond a provider's transient cache window. Stripe's API v1/v2 idempotency semantics differ [R8]; Taplo cannot assume a universal provider retry contract. Reconcile domains, pass issuance and messaging similarly, using provider-specific status logic. Accepted email delivery does not mean read; registrar order accepted does not mean hostname active; pass generated does not mean installed.

## Failure table

| Failure | Required effect | User/owner recovery |
| --- | --- | --- |
| Last stock/time taken | No invalid commitment | Preserve input; offer current alternatives |
| Payment succeeds after hold expiry | Verify feasibility; commit only if safe, else defined refund/recovery | Explain actual state; case/queue if unresolved |
| Commit succeeded, response lost | Same command key resolves original result | Status lookup, no duplicate button-induced charge |
| Notification fails | Transaction remains committed; retry tracked | Activity/Studio remain authoritative; operator sees delivery issue |
| Search projection stale | Final action rechecks live source | Correct result/removal; public cache invalidation tracked |
| Reward/pass update fails | Ledger/entitlement remains authoritative | Pending sync and support path; no double earn |
| Closure while provider work pending | Respect closure scope and existing commitments | Retained operation owner and customer access |

## Observability and controlled replay

Trace command → aggregate/version → provider operation → event → notification/case with safe correlation IDs. Metrics include conflicting reservations, uncertain payments, reconciliation age, outbox lag, notification failure and unresolved cases. Replay is a privileged, version-aware recovery action, not “run all events again”; irreversible effects remain deduplicated. Audit financial compensation separately. Test concurrency, duplicate/out-of-order events, failures after each boundary, tenant mismatch and old-client payloads before enabling real commitments.
