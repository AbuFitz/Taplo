# 67 · Support ownership, migration and merchant exit

Edition 1.0 · Proposed operating playbook. Response times below are classification examples; no contractual SLA or staffed 24/7 promise is established.

## Responsibility matrix

| Issue | First accountable party | Taplo's role | Provider/other dependency |
| --- | --- | --- | --- |
| Service quality, job scope, product condition | Merchant | Link record, evidence and contact; platform policy/escalation | Merchant insurer/appropriate specialist where applicable |
| App fault, wrong routing, access bug | Taplo | Triage, protect data, restore/reconcile | Hosting/auth/integration vendor |
| Payment pending/duplicate concern | Payment workflow owner plus Taplo technical triage | Status lookup, prevent repeat charge, scoped refund workflow | Processor authoritative outcome |
| Refund/service dispute | Merchant decision within applicable obligations | Track request, enforce supported platform policy, preserve evidence | Processor/chargeback channel; no guaranteed outcome |
| Payout/verification | Provider and responsible merchant/platform configuration | Clear status and correct escalation | Processor/KYC requirements |
| Domain DNS/renewal | Registrant plus designated service owner | Studio workflow, reminders, route recovery | Registrar/reseller agreement |
| Lost/wrong NFC item | Verified accessory owner; Taplo for its product faults | Claim/destination recovery, replacement process | Hardware/fulfilment supplier |
| Privacy/security report | Taplo privacy/security owner for platform; merchant for its processing as appropriate | Restrict exposure, investigate, record obligations | Relevant advisers/providers/authorities as applicable |

Support intake identifies issue type, linked record, user/merchant role and needed evidence. Do not force a customer to diagnose which integration failed. A single case can coordinate multiple parties while showing the customer one responsible follow-up. Staff see only permitted data. Platform support identity is explicit; no silent reply as merchant.

## Triage and action

Urgent: credible active security exposure or systemic money/availability failure → restrict affected capability and assign incident lead. High: customer commitment blocked/time-sensitive discrepancy → reconcile/offer practical next step. Normal: routine configuration/how-to/isolated recoverable issue. Low: suggestion/non-urgent cosmetic request. Set staffed hours, response targets, escalation contacts and emergency coverage before promising them; log actual due/follow-up times per case.

Runbooks cover payment uncertain, duplicate booking, oversold last item, notification failure, unauthorised access, domain wrong-tenant binding, lost accessory, merchant non-response and release rollback. Each records safe first action, evidence scope, owner, provider lookup, customer wording, retry/compensation and resolution. Refund, moderation and data access privileges are separate. Escalations preserve deadline and evidence rather than opening unrelated tickets.

## Import/migration

Provide a guided template: map fields → preview sample → validate → resolve duplicates/errors → dry-run summary → import with provenance → result and recoverable error file. Match by source stable ID where possible; email alone cannot merge unrelated people or infer consent. Import marketing consent only with source/date/evidence where valid; absence means no assumed opt-in. Historical appointments/payments are labelled imported, not replayed into charges/reminders/rewards. Treat formula-like CSV cells safely on export. Large imports are resumable and permission-scoped.

Design category-specific migration fields: learner/payer relationships; staff/resources/availability; inventory/variants; events/attendees. Existing provider payment credentials and recurring mandates may not be portable; require actual provider-supported migration rather than a promise that CSV moves everything. Reconciliation compares counts, selected totals and unresolved exceptions before switching. Preserve the original source for rollback within a defined retention window.

## Downgrade, cancellation and closure

Distinguish SaaS cancellation, page unpublish, capability pause, merchant closure and owner transfer. Show the effective date, active commitments, customer subscriptions, unpaid/uncertain money, disputes, domain renewals, NFC destinations and exports before confirmation. Customers retain an appropriate route to their existing records/support. Stop new transactions when necessary without deleting receipts. Terms determine restricted/read-only access period and retention; exact durations need approved policy, not arbitrary invented years.

Export permitted catalogue, customer relationships, authored assets/content, work history and financial references with readable formats and data dictionary. Never export raw card secrets or other merchants' data. Secure download, step-up and expiry are explicit. Customer/participant deletion requests require identity/scope checks and handling of retained lawful financial/audit records; do not promise instantaneous destruction across backups and providers.

Connected domains: preserve registrant rights; transfer/unlock/auth codes via supported verified workflow; explain external DNS/email impact; revoke host mapping safely and avoid takeover. Registered renewals/pending orders remain accountable. NFC: deliberate redirect/fallback/replacement policy after subscription ends; disclose any durable-link service terms when selling physical products. Wallet: update/revoke entitlement where appropriate; server remains authoritative for stale passes. A departing staff member is handled under spec 71; leaving a team never automatically transfers its client database.

## Post-exit evidence

Verify new purchase disabled where intended, old record accessible to authorised customers, provider tasks reconciled, exports delivered securely, access/memberships revoked, search/cache updated, domains safely detached/transferred and claims/pass treatment completed. Closure is a tracked process with outstanding obligations, not a single destructive database delete.
