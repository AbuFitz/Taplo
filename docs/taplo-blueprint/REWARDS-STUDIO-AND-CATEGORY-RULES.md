# Taplo · Rewards setup, activation and category rules

Working edition 2.6 · 3 November 2026. Deepens 20, 37 and private customer return. Merchant-specific programmes; Pro/Business software entitlement. No platform-funded rewards, cross-merchant exchange or stored-money wallet is implied. Existing records/screens are inputs, not a complete built loyalty engine.

## Simple owner setup

Studio → Rewards starts with **What would you like to reward?** Choose visits, eligible spend or a supported repeat activity; **Not right for my business** remains valid. Recommend a category preset, then three essential choices: how customers earn, what they receive and the threshold. Show a live customer explanation beside the fields (mobile Edit/Preview, no permanently tiny handset). Advanced eligibility/expiry/staff controls expand only when relevant.

Review → customer terms/preview → enable. Missing required facts, provider/ledger readiness, insufficient plan scope or unsupported reward type give a specific retained-draft next step. A Wallet provider pending approval does not prevent an otherwise ready web-only programme, but Wallet is not advertised/issued until its prerequisites pass. Enabling rewards does not turn on campaigns or enrol customers into marketing.

## Category presets are starting rules, not compulsory programmes

| Business model | Recommended starting model | Example rule and specialist guard |
| --- | --- | --- |
| Barber/beauty | Eligible completed visits | One stamp per qualifying appointment; eight stamps unlock the stated selected service/discount; not a stamp for merely creating a booking |
| Retail | Eligible paid item spend | One point per £1 of qualifying item subtotal after discounts, including applicable customer-paid tax in this preset, excluding delivery/tips/gift-value purchases; whole-point rounding per transaction |
| Workshops | Attended eligible sessions | One stamp per attended participant/session under the actual holder model; a free-class reward still requires capacity/booking acceptance |
| Tutor/coaching | Default explain packages versus rewards first | A prepaid lesson package is a purchased entitlement, not a loyalty stamp; do not mix balances or reward a child for marketing/data sharing |
| Mobile service/detailer | Eligible completed work or explicit no programme | Use meaningful repeat-service value, not a reward encouraging unnecessary work; travel/scope changes do not fabricate extra visits |
| Creative/photographer | Optional repeat-client offer | Fulfilled project/booking basis; deposits alone do not vest the reward; licensing/deliverables still follow original contract |
| Café/simple retail | Spend or visit under actual supported commerce | No repeated tiny split purchases to farm a visit; configured qualifying spend/period disclosed |
| Dealer/vehicle stock | No default points scheme | High-value irregular sales and distinct seller/consumer obligations need a supported reviewed use case before promotion |
| Clinical/regulated service | No default incentive | Specialist ethical/legal/category review before a programme is enabled or marketed; no sensitive-health targeting |

Eight visits/one point per pound are illustrative selectable defaults, not a claim they are profitable for every merchant. The business funds its discount/service value and must understand fulfilment cost; Taplo's subscription pays for software, not the rewards given away. A programme preview estimates the offered rule, not guaranteed return/marketing uplift.

## Configuration and customer wording

Editable fields: programme name, approved icon/appearance, earning basis, qualifying offers/locations, minimum qualifying amount where used, threshold, reward type/value/eligible offers, permitted expiry, maximum/combination rules, issue/support terms and customer-facing short description. Generated plain summary must match actual rules: **Earn one stamp after each eligible completed appointment. Collect eight for [defined reward].** No misleading Free haircut if only a limited discount is configured.

Scope/eligibility is explicit: one legal merchant/programme; allowed locations; holder/payer/participant model; refund/cancellation basis; exclusions; start/effective version. An eight-seat family booking is not automatically eight separate earnable accounts. One workshop booking may have several participants; use the defined participant relationship, not billing quantity guessed into visits. Changing category suggests a preset but never silently resets an active programme.

Supported initial reward types: fixed discount, percentage discount with an explicit cap where configured, or a precisely defined service/item entitlement. Minimum spend, tax treatment, stock/capacity, stacking and usage limits must be exact before that type launches. No arbitrary legal formula builder, transferable cash credit, platform-wide money or unrestricted merchant-written code. Expiry is off by default until a reviewed fair rule and customer notice are configured; do not silently expire earned value on a new terms edit.

Customer joins the named programme deliberately, sees earning/reward/exclusion/expiry terms and relevant version, then gets a private For you progress block. Default collect only relationship/contact facts genuinely required. Joining/saving/buying and marketing consent remain separate. No extra name/phone/birthdate required just because a template has a blank field. Customers can view activity and ask about mistakes without installing the app or adding Wallet.

## Engine, refunds and abuse

Maintain an append-only programme ledger: pending earn, confirmed earn, redemption reservation, redemption, refund/reversal, expiry and authorised adjustment. Every entry links the original transaction/fulfilment and rule version. Balance is a projection, never a free editable integer in Studio. Atomic guards/idempotency prevent double earn or concurrent redemption. Staff cannot grant value through a phone-widget tap.

Visits vest at the supported completed/attended/fulfilled event, not payment redirect or deposit capture. Spend uses the configured versioned eligible line calculation. Partial refunds reverse the original attributable eligible amount/points using documented rounding, not the current price/rule. If points were already redeemed, record the defined deficit/adjustment policy; do not charge a saved card or invent debt. Rewards used on a refunded order follow the accepted rule for restoration and refund allocation, with no duplicated value. Returned goods, cancelled/no-show sessions and mistaken completion have explicit reversal paths.

Redemption checks holder/business, programme status, current entitlement, threshold/reservation, eligible stock/capacity, applicable stacking and current authoritative ledger. Reserve/commit/expire are distinct. Failure releases only the correct reservation once; a receipt/status update does not perform another redemption. Tokens/barcodes are opaque and scoped; high-value redemption needs appropriate current validation. No offline double-spend promise.

Staff actions: rewards.read scoped appropriately; rewards.redeem within assigned business/location; rewards.adjust.request with reason; rewards.adjust.approve by authorised role/limits; programme.manage separate from finance/refund; programme.publish/version change requires owner/delegated authority. Solo owners may combine permissions with audit; multi-person operations can require second review for material adjustments. Never allow self-service customer balance editing or blanket Console add-points authority.

## Changes, suspension, downgrade and exit

States draft → ready → active → paused → closed, with explicit obligations for existing holders. Pause can stop new enrolment/earning without erasing legitimate balances; explain redemption treatment and the reason. Business improves rules: version/effective date and fair treatment of earned promises, no retrospective reduction by editing a description. Owner preview shows affected active members before a consequential change.

Downgrading from Pro does not silently delete rewards owed. Present the published plan/transition treatment and preserve a safe fulfilment/support path for existing obligations. New programme creation/earning automation may stop under actual terms; previously earned value/legal obligations need reviewed handling. Closure records customer notice, redemption/refund alternatives where owed, Wallet updates, retention/deletion and operator responsibility. A merchant's disappearing subscription is not permission for Taplo to confiscate points or guarantee funding them itself.

## Design packet and acceptance

Required states: no programme; recommended preset; incomplete rule; customer preview; review/activate; active summary; insufficient entitlement; no eligible offers; zero/stale balance; pending earn; refund reversal; concurrent reward reservation; reward redeemed; disputed adjustment; programme paused/closed; downgrade and merchant departure. Mobile keeps the summary/primary action clear with keyboard and readable long terms. Wallet pass and page block read the same projection and identity.

Rehearse barber completed versus no-show; retail multi-line partial return with rounding; workshop multiple participants; tutor purchased package versus reward; clinical preset blocked; expired redemption reservation; staff self-adjustment; late duplicate completion; rule change with earned balance; downgrade and certificate/provider outage. These requirements are defined; full final Studio screens, specialist category contracts and runtime/provider evidence remain unfinished.
