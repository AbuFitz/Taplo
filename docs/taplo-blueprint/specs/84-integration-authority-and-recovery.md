# 84 · Integration authority and recovery

Edition 2.3 consolidation: PROVIDER-STACK.md, INTEGRATIONS-AND-SUPPORT.md and PAYMENTS-AND-REFUNDS.md refine supplier, support, integration and finance choices. Their current boundaries supersede earlier open-ended suggestions; actual provider/legal/readiness evidence is still required.

Working edition 1.2 · 3 November 2026 · Recommended integration boundaries. Extends 47, 65, 67 and 72. Provider selection is a product/operating decision, not a badge collection.

## Initial priorities and explicit exclusions

| Integration | Recommended scope | Authority and permissions | Failure/exit |
| --- | --- | --- | --- |
| Stripe Connect | Merchant payments; separately Taplo SaaS/hardware billing | Merchant identity and financial permissions; provider verified states | Keep reconciliation/refund obligations after disconnect; no arbitrary payout control |
| Google Calendar | Selected calendars as busy inputs; optional Taplo event export | Per-member delegated connection and least necessary provider scopes | Stale/revoked state visible; conservative booking behaviour; source IDs prevent loops |
| Microsoft 365/Outlook | Same defined busy/export contract | Per-member delegated connection; enterprise consent may block access | Provider-specific delta horizon and renewal handling; no promise all tenants permit it |
| Transactional email | Verification, agreements, reminders, delivery outcomes | Authenticated sender; purpose-scoped recipient | Bounce/complaint suppression, alternative contact and auditable resend |
| SMS | Optional operational reminders, later eligible campaigns | Country/sender readiness; distinct marketing authority | Delivery state, cost cap and working opt-out; no universal delivery promise |
| Apple/Google Wallet | Merchant relationship/loyalty pass under issuer rules | Entitlement server-owned; device pass a projection | Revocation/update/install status distinct; sensitive details minimised |
| Maps/geocoding | Public premises/service areas and customer-selected location | Provider licence, attribution and precise-location privacy | Manual search/address input; do not reveal mobile worker home base |
| Registrar/custom hosts | Merchant-owned domain connection; buying only if terms support it | Verified registrant and DNS authority; separate from email sending | Renewal/transfer/export, grace/fallback and email DNS protection |
| Stock imagery | Optional decorative picker | Provider eligibility/licence/attribution | Asset provenance/removal; never false business-work evidence |
| Google Business Profile | Later approved narrowly scoped integration | Owner OAuth plus permitted purpose/storage, not public URL scraping | No inherited verification badge or unrestricted permanent copy |
| Webhooks/automation | Later signed scoped events and controlled actions | Merchant-configured destination, secret rotation, permitted events | Retry/dead letter/replay with deduplication; no unrestricted PII broadcast |

No external-shop stock/order sync is included. iCalendar subscription is not equivalent to low-latency bidirectional sync. Video meetings, accounting export, WhatsApp and delivery integrations each require their own researched authority/failure contract before they are promised.

## Calendar truth

Taplo owns Taplo appointment commitments. External calendars provide explicitly selected busy inputs and/or exported views. An external event deletion is not customer cancellation, a dragged external event is not automatically an approved reschedule, and an imported private title is not public service content.

A member may connect their own calendar without granting every colleague access to event subjects/attendees. Prefer busy intervals and minimal metadata. Scope provider access according to the actual chosen endpoints; verify exact Google/Microsoft permissions during integration design rather than writing an unverified scope string into an engineering contract.

Google documents initial/full plus incremental sync, pagination and invalid-token recovery. Microsoft calendarView delta is tied to a calendar/date range and has its own token/paging semantics; a provider-neutral syncToken assumption is wrong. [R53–R54] Model independent cursors, provider IDs, calendar IDs, windows, last successful full/incremental sync, connection health and write acknowledgements.

Proposed stale policy: when external busy data required for safe booking exceeds the configured freshness threshold, stop instant confirmations for affected resources and offer a clearly labelled request path where supported. Do not silently mark all time free or retroactively cancel existing bookings. Owner sees last successful check and reconnect/review action. Final threshold remains an explicit operating decision, not an arbitrary number hidden in code.

## Shared integration lifecycle

Connect → grant required authority → verify capabilities → initial reconcile → healthy operation. Distinct attention states include consent revoked, permission missing, rate-limited, stale, provider outage and merchant action required. Retry transient faults with bounded backoff; permanent auth errors need reauthorisation. Uninstall/disconnect revokes tokens, cancels appropriate future jobs and preserves lawful historic evidence without promising ongoing provider access.

Every provider operation needs tenant, resource, idempotency/correlation key, purpose, attempt count, last safe result, retry deadline and support visibility. Verify callbacks, reject replay where appropriate, handle duplicates/out-of-order events and reconcile missed deliveries. Never put raw credentials into analytics/support notes. Rotating a secret must not orphan queued work without an explicit policy.

## Console capability

Show connection health and impact rather than a wall of green integrations. An operator can identify affected appointments, messages or payments, see the last verified event, and trigger a permitted scoped reconcile. Reconnect requires the merchant/member who can grant authority. Console cannot invent consent, provider approval or successful money movement.

## Acceptance

Disconnect during an in-flight payment; calendar token expires; recurrence exception disappears; recurring event crosses DST; a busy calendar has private events; provider rate limit; callback forged/replayed; export arrives twice; staff member leaves; DNS accidentally changes email records; WhatsApp not enabled but SMS is; external-shop purchase arrives through an ordinary link. Test the exact integration mode, not only a happy-path OAuth button.
