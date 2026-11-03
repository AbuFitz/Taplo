# Taplo · Payment and refund decisions in one place

Working edition 2.3 · 3 November 2026. Consolidates 16, 24, 74–76, 82, 87, 97 and 101. UK-first planning defaults, not legal advice, signed supplier approval or a verified working integration. Payment architecture is chosen; final financial/legal/technical readiness is not established by this document.

## The decision

Merchant customer purchases use Stripe Connect direct charges in the merchant's account, hosted merchant onboarding and Stripe-set merchant processing prices. Prefer a supported configuration with Stripe responsible for connected-account payment losses. Exact account/controller/risk settings must confirm that preference; pricing alone does not establish liability. Stripe documents that direct-charge negative transactions affect the connected account and platform losses still belong to the platform. [P4]

Taplo charges its own software subscription and own physical products separately. No pooled platform wallet, escrow representation, multi-merchant basket, revenue splitting among staff or automatic chair-renter settlement at launch. Normal team members are scoped users, not automatically separate legal sellers or Stripe accounts. Independent sellers need their own explicitly supported model before collecting their money.

## Flexible merchant settings with bounded choices

| Capability | Working offer | Guardrail |
| --- | --- | --- |
| Book without upfront payment | Yes for eligible services | Capacity confirmed under booking rules; outstanding balance honest |
| Deposit at booking | Optional fixed amount or percentage | Cannot exceed payable amount; rules preview and accepted version recorded |
| Full payment at booking | Optional for supported offer/method | Authentication/payment/capacity confirmation handled as separate facts |
| Collect remaining balance | Staff records lawful payment or sends a fresh supported payment request | No automatic debit from a previous card without valid separate authority |
| Save card / later no-show fee | Planned separate protection capability; not promised as ready in all packages | Reviewed consent, provider support, SCA/off-session/fee/notice/exception handling and precise contract required before release |
| Refund full/partial | Authorised finance roles and supported policy automation | Remaining refundable amount, dispute state, seller account and currency validated |
| Change cancellation policy | Supported reviewed templates and safe parameters | No all-circumstances non-refundable switch; accepted bookings retain agreement version |
| Credit/rebooking instead of money | Voluntary customer choice where lawful | Never force credit instead of a refund owed |

Deposits are real payments credited against the service price, not indefinite card holds. Availability protection is a defined reservation; a successful payment cannot create a booking after its slot was taken without a recovery rule. If a late payment succeeds after reservation expiry, route to reconciliation/refund or an explicitly accepted alternative rather than silently double-booking.

One sale/booking keeps an auditable amount breakdown: price, discount/tax basis, paid, refunded, justified cancellation outcome, balance owed and provider fees separately. Cancellation removes unearned service balance unless a lawful distinct amount remains due. A late-cancellation charge cannot be added on top of retained money for the same loss.

## Refund routing without taking every dispute onto Taplo

| Event | System action | Who owns the decision |
| --- | --- | --- |
| Customer cancels in accepted free window | Cancel, release capacity, initiate eligible authorised refund | Pre-authorised reviewed policy; finance exception if provider fails |
| Merchant cancels/cannot supply | Present refund owed or voluntary alternative; initiate under actual authority | Merchant obligation, monitored Taplo case if unresolved |
| Ordinary late cancellation | Show proposed policy outcome, check required circumstances/mitigation, allow waiver/review | Merchant within reviewed rules and applicable rights |
| Attendance/service quality/rights disputed | Preserve evidence, request scoped review, explicit next step and escalation | Merchant commercial responsibility; Taplo technical/process support; independent rights retained |
| Duplicate charge or platform error | Reconcile and coordinate authorised correction | Taplo owns platform fault, merchant/provider money authority respected |
| Card dispute already open | Use provider dispute process and deadlines; guard duplicate reimbursement | Merchant/provider process; no bot promises outcome |
| Refund pending/failed | Show actual state and funding/action task | Named finance owner; no success screen until supported evidence |

Stripe's current refund documentation says direct refunds debit the connected account; original processing fees are not returned, insufficient available funds can leave card refunds pending, and normal refunds go to the original payment method. [P13] These costs and states are seller/operations facts, not automatic permission to deduct fees from a customer's refund entitlement.

CMA guidance requires fair transparent terms and warns against blanket retained prepayments or excessive cancellation charges. Loss and reasonable mitigation matter; disclosure alone does not make a fee fair. [P14] Category-specific rights, distance-contract cancellation, services begun early, goods/digital content, exceptions and actual jurisdiction need a reviewed rules matrix. No generic checkbox can turn all these transactions into the same contract.

## Customer, Studio and Console states

Customer cancel review shows exact booking time/timezone/cutoff, paid amount, proposed refund/retention, remaining balance and reason before Confirm cancellation. The cancellation fact and financial outcome have separate statuses. Pending refund says processing with an expected next update where known, not refunded. Easy challenge route collects relevant facts without disproportionate sensitive proof.

Studio finance task has the same agreement/payment history, masked customer details, remaining refundable value and actual action permission. Partial refund requires amount and reason; repeat tap returns the same operation. Insufficient funding explains the merchant/provider next step, not a generic try again loop. Merchant sees a payout separately from payment success.

Console distinguishes software error, merchant policy review, provider money event and bank dispute. Support does not impersonate the merchant or debit funds with a generic admin button. High-impact commands require explicit permission, reason and audit; automation may prepare evidence but cannot improvise authority. Data export is redacted and scoped to that case. Policy exceptions preserve their rationale without changing all later bookings.

## What is settled versus still required

**Settled working choices:** Stripe, merchant direct-charge architecture, hosted onboarding, separate Taplo billing, optional upfront-payment modes, merchant-authorised automation, full/partial refund support, bounded cancellation configuration and distinct dispute pathways.

**Required before selling:** actual supported account/risk configuration and agreement; pinned APIs/event schemas; exact checkout/refund commands and finance permissions; category/jurisdiction policy review; balance/funding and closure ownership; tax/receipt obligations; signed-event/replay/out-of-order/reconcile behaviour; real test-mode and production-readiness evidence. No assertion that every integration is decided or every refund is simple.

Minimum connected rehearsal: £80 service/£20 deposit; cancel within window; late cancel with £12 justified retention/£8 refund and no residual £60 service balance; merchant cancellation; already partially refunded; insufficient funds; cancellation/payment race; reservation expires before payment succeeds; active card dispute; merchant leaves; team member without refund permission. Record actual expected/observed facts across customer/Studio/Console; specification alone is not a passed test.

P13 https://docs.stripe.com/refunds ; P14 https://www.gov.uk/guidance/writing-a-fair-contract-for-customers . P4 is registered in PROVIDER-STACK. The reports of Booksy refund complaints remain a research lead, not verified complaint-rate evidence.
