# 101 · Stripe Connect integration lifecycle and boundaries

Edition 2.3 consolidation: PROVIDER-STACK.md, INTEGRATIONS-AND-SUPPORT.md and PAYMENTS-AND-REFUNDS.md refine supplier, support, integration and finance choices. Their current boundaries supersede earlier open-ended suggestions; actual provider/legal/readiness evidence is still required.

Working edition 1.8 · 3 November 2026 · Adopted integration design direction subject to supported provider configuration/contracts. Extends 16, 24, 66, 82, 84, 87 and 97. Not deployed code, final API selection or professional legal clearance.

## Three financial relationships

1. Merchant accepts customer money for the merchant's goods/services through its connected account.
2. Taplo bills the business for software/usage under a separate SaaS relationship.
3. Taplo sells its own hardware/services under its own seller relationship.

Keep customers, provider-account mappings, agreements, receipts, disputes and ledgers scoped accordingly. A successful Taplo SaaS invoice cannot mark a merchant customer appointment paid. A worker login is not necessarily a separate seller/connected account; independent sellers need the explicit model before collecting their money.

## Cost model refinement

Stripe's current UK Connect page distinguishes Stripe handling merchant processing pricing from the platform handling pricing. It lists no additional account/payout fees to the platform for the former model; the latter lists £2/monthly active account and 0.25% + 10p per payout, with the specified active-account definition. This is a dated supplier input, not a universal quotation for Taplo's eventual agreement or proof all other payment costs vanish. [R69]

Working preference: Stripe handles merchant processing pricing, merchant direct charges/full dashboard and provider-held connected-account payment-loss responsibility where supported. Confirm these separate configuration dimensions together; a pricing label alone does not determine all risk. Do not charge per employee because a Connect active-account charge exists: employee logins and seller payment accounts are different objects.

## Connection and onboarding sequence

Owner chooses Connect payments; server authorises owner/business and retrieves existing account mapping. Idempotent creation/connection prevents duplicates after retries. Choose country/capabilities using supported scope, not a browser default. Hosted onboarding is the initial implementation preference to minimise duplicated sensitive verification collection; embedded onboarding is a later UX option only if its cost/authority/maintenance fits.

Provider onboarding link is created server-side for the authorised session, not a permanent share link. Expired/used link follows a safe refresh route; return resumes the correct tenant/task. Stripe documents that return can mean Save for later and does not establish completed verification. Retrieve/check actual account requirements and relevant capability states; account webhooks update the projection. [R70]

UI states: Not connected, Continue setup, Under review, Ready for selected payment capability, Restricted, Action required and Disconnected. Charges-ready and payouts-ready are distinct facts. Do not display a universal verified-business badge just because a payment account exists. Capability loss gates affected new payments and creates an owner task; existing financial obligations persist.

## Payment creation and confirmation

Validate tenant, seller account, current offer/quote/agreement, currency, amount, tax/discount basis and capacity reservation server-side. Create the selected provider checkout/payment object with account-scoped context and operation idempotency. Client cannot override payee, amount or financial authority. Store operation/provider references before presenting uncertain success as settled.

Use provider-hosted or supported embedded payment collection to avoid storing raw card details. Required authentication/challenge returns to the same safe task; abandonment/timeout uses status retrieval and expiry/reconciliation. A browser redirect is not financial verification. Connected-account event processing and authoritative retrieval determine payment state; booking confirmation additionally checks capacity/agreement guards.

Supported method selection follows finality and workflow. Do not enable every provider method on a scarce appointment because it appears in a dashboard. Asynchronous payments, refunds, card saving/off-session and in-person collection each need deliberate supported workflows. Card/Apple Pay/Google Pay visibility depends on actual device/method/provider eligibility, not a decorative badge.

## Event routing and processing

Provider account and connected-account event scopes differ. Choose and pin an actual supported Accounts/API version, endpoint event model and SDK; current documentation includes v1/v2 differences, so do not mix sample payload assumptions. Verify signature on the raw request, map the authenticated event/account to its tenant, persist durable receipt and deduplicate before applying state. Acknowledge only after safe acceptance; reconcile asynchronously with bounded retry/dead-letter visibility. [R71]

Maintain handlers for the selected account/capability updates, payment success/failure/action/pending lifecycle, refund changes, disputes and relevant payouts/deauthorisation. Exact event names/payload schemas are a required implementation contract for the selected version, not fabricated here as a universal list. Out-of-order events cannot regress verified state or double-adjust money; retrieval reconciles uncertain/missing events.

## Refunds, balances and disputes

Refund is an authorised separate operation constrained by remaining refundable amount, currency, previous refunds/disputes and provider state. Partial refund and application-fee treatment are explicit. Display Requested/Processing/Completed/Failed from real state; insufficient funding needs an accountable task/escalation rather than silent success. Processor fees retained by the supplier are not automatically deductions from a customer's legal refund.

Track pending/available balances, payouts and payment success separately. Stripe documents separate merchant/platform balances and possible platform reserves under relevant arrangements; a successful payment is not the same as money in the merchant's bank. [R72] Do not promise a fixed payout arrival or platform-held escrow. If Taplo cannot control a payout under its selected model, Console must not show a button suggesting it can.

Bank disputes create provider deadlines, evidence needs and financial effects. Merchant dashboard access and permitted evidence export support the merchant; Taplo cannot guarantee a win. Prevent duplicate unrelated refunds while a dispute is active. Review/supply-quality cases in 87 remain distinct from the card dispute process.

## Scope and privacy

Finance permissions are separate from calendar/attendance/customer access. Expose only necessary operational status to practitioners. Bank details and verification documents remain in appropriate provider flows; secrets stay server-side with environment separation/rotation. Never log full tokens, payment-method details or personal verification documents into support/analytics. Metadata contains stable safe correlation identifiers, not sensitive intake text.

Merchant disconnect/closure revokes future access where appropriate, stops unsupported new payment actions and preserves a lawful restricted history/escalation path. Do not create a new connected account to escape outstanding disputes or imply deauthorisation erases seller obligations.

## Integration acceptance and open contracts

Required: duplicate onboarding submit, expired link, return before complete, role/tenant switch, capabilities lost, account wrong/country unsupported, payment retry/3DS/abandonment, webhook tamper/replay/out-of-order, reservation expiry race, partial refund, insufficient funds, dispute, payout failure, secret rotation, provider outage and merchant exit. Test the actual selected modes in provider test environment and production readiness as applicable; mocks do not establish final agreement or financial correctness.

Still required: exact supported account/controller/pricing/risk configuration confirmation; pinned API/event payloads and typed commands; tax/receipt/provider-method scope; monitoring/reconciliation cadence; actual contract fees; specialist review and real integration evidence. This document deepens the integration map, not a claim the full integration is complete.
