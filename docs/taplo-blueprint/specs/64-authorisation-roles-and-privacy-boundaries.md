# 64 · Authorisation, roles and privacy boundaries

Edition 1.0 · `contracts/permissions.json` defines recommended role action sets. Role names alone never authorise arbitrary records. Apply relationship, tenant, assignment, lifecycle and field rules server-side.

## Decision sequence

Authenticate principal → resolve authoritative business/record → verify active membership or own verified customer relationship → evaluate location/assignment/role/action → enforce field projection → evaluate lifecycle/capability/version → record privileged reason/audit → act. Default deny. Apply checks on reads, commands, exports, attachments, background jobs and realtime streams, not just visible buttons. This follows current OWASP guidance on least privilege and per-request authorisation [R11].

| Principal | Allowed example | Excluded without separate grant |
| --- | --- | --- |
| Customer / verified guest | Own eligible record, own message, request permitted change | Another customer's work, private merchant notes, modifying paid price |
| Owner | Merchant management, authorised export/closure | Provider truth overwrite, raw card credentials, unrestricted Console |
| Manager | Catalogue/work/page operations and scoped refund request | Ownership transfer, bank/payout change or all-data export by implication |
| Scheduler | Scheduling, relevant contact and work | Private learner support notes or all financial reports |
| Practitioner | Assigned work and necessary participant context | Entire customer base, payout data, unrelated learner notes |
| Fulfilment | Assigned order/preparation and needed delivery contact | Tutoring notes, unrestricted messages, payment credentials |
| Finance | Financial views and authorised refund workflow | Appearance/team/claim administration by implication |
| Merchant support | Relevant conversation/case and limited contact | Cross-merchant customer access or unconditional refund |
| Console triage | Case intake, limited metadata and assignment | Full evidence/financial action by default |
| Console specialist | Assigned permitted case and scoped action | Unbounded impersonation/export or self-granted access |
| Provider worker | Validated reconciliation for its configured scope | Client-initiated arbitrary state changes |

## Field and relationship boundaries

Payer can manage a participant only through a verified current authorisation relationship. Do not infer guardianship from a name/email match. Practitioner access depends on assignment and purpose; expiry/reassignment removes future access as appropriate while preserving permitted audit records. Public business-address disclosure and private job-address disclosure have separate rules. Message attachments inherit thread/record access, with short-lived scoped download URLs. Exports receive the same privacy policy plus step-up verification and safe expiry.

## Consequential operations

Ownership transfer, bank/payment configuration, domain transfer, business export and closure require appropriate re-verification. Refund authority includes amount/record scope and any configured approval threshold; a staff role cannot bypass the remaining-refundable balance. Threshold values are commercial/operational decisions to set before release, not guessed here. Provider reconciler can apply verified outcome only within the configured account/environment and supported event types.

Console elevation is time-bound, purpose/case-bound and audited. Distinguish assistance preview from acting as a user; any assisted mutation records the real operator and justification. No hidden reusable session transfer to a support operator. Avoid logging confidential message/attachment content when an event/reference suffices. Suspended membership invalidates new actions, exports and subscriptions/streams promptly; a stale browser UI cannot retain authority.

## Negative acceptance scenarios

Guess another business record ID → no disclosure or mutation. Change business_id in a write body → rejected against server scope. Scheduler requests financial export → denied. Practitioner loses assignment mid-session → subsequent access checked. Guest verification link for one order cannot claim every order sharing a guessed address. Console triage cannot download a learner attachment simply by linking a case. Duplicate/reforged provider event does not confer access. UI role hiding is helpful communication, not an enforcement boundary.
