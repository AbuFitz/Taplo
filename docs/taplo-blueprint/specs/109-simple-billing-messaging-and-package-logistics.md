# 109 · Simple package, messaging and billing logistics

**Current decision:** [PRICING-DECISION.md](../PRICING-DECISION.md), edition 2.2, supersedes the included-SMS recommendation. Four launch plans: Free £0 / Core £12 / Pro £24 / Business £49; operational email and team included, optional SMS. Earlier amounts below are historical modelling scenarios, not the current package default.

Working edition 2.1 · 3 November 2026 · Adopted customer-facing logistics. Extends 66, 83, 104 and 108. All four packages are in the launch plan, not staged out by the earlier pricing experiment.

## The bill should be explainable

Three concepts only: your monthly plan, optional extra message packs if you need them, and explicit optional purchases such as a domain or NFC item. Ordinary operational email is included. Paid plans include stated marketing email allowances; SMS is an optional purchased service. Card processing is disclosed separately because the provider charges it for transactions; do not hide it until checkout or pretend it is Taplo commission.

Price cards show monthly total/tax treatment, main value, included team access, included message counts, optional message-pack prices and clear domain/hardware purchase distinction. Advanced detail lives behind one expandable comparison, not fifteen contradictory footnotes. Before upgrade show the actual next bill/effective date, not just an attractive annual-equivalent number.

## Proposed optional top-ups

100 UK SMS units £9; 500 UK SMS units £39, inclusive of applicable VAT as the proposed headline policy. At 5p supplier cost, standard UK card charges and modelled VAT, contribution is about £2.17 and £6.72 respectively before support/general overhead. These are modest margins; actual sender/routing/FX costs can remove them. These are product units, not a transferable cash wallet or permission to launch stored value.

Current default: use deliberately purchased SMS units; no monthly SMS allowance is included. Extra SMS units persist under the agreed active-account terms; do not silently expire paid value at month end. The marketing-email monthly allowance resets; it does not roll over. Unused prepaid units, refunds, tax recognition, departure and provider changes need reviewed terms/accounting; supplier nonrefundability does not determine customer rights.

Auto top-up defaults off. Owner may enable it only with explicit amount, threshold, monthly spend cap and billing authority. Marketing staff cannot spend unlimited business funds merely because they may compose a campaign. Pause/suppression/consent and budget checks run again at dispatch. No automatic paid-plan upgrade to cover volume.

## Segment complexity stays behind a clear preview

Show This message uses 1 text / 2 texts and the audience total before send. Use compact templates and genuine stable links so ordinary reminders can fit one unit where encoding permits. Avoid unnecessary emoji/long repeated branding that increases segments. International rates and WhatsApp remain separately supported/reviewed services, not magically included as UK SMS.

Reserve units for scheduled sends under a documented policy, then consume/release exactly once according to actual attempt lifecycle. Duplicate jobs/callbacks must not debit twice. A cancelled/rescheduled appointment invalidates stale reminder jobs and releases appropriate reservation. Permanent failed delivery has a defined customer credit/refund policy; supplier failed-message costs remain in the cost model rather than hidden as successful delivery.

## Exhaustion and defaults

Warn at 80% and before a scheduled job cannot be funded. With no units/spend authority, do not incur an unapproved bill. Necessary operational email and in-app Activity remain available; show the owner SMS needs attention. Never falsely claim an SMS reminder was delivered. Customer notification fallback must follow a lawful/useful route, not assume an email exists or send marketing on another channel after opt-out.

Messaging settings show one balance/allowance view, current period/reset, reserved/available quantities and recent use. Separate operational/promotional purpose internally for consent/reputation; customers should not calculate provider exchange rates or buy several different vendor wallets. The single UI can still show different country/channel costs honestly before use.

## Sender and email identity

Default email from an authenticated Taplo domain with merchant display-name/logo context and authorised reply route, as in 83. Branded templates do not require a separate sending domain per merchant; custom website domain is not custom email authentication. Provider multitenant permission, reputation isolation, suppression/bounces and sender ownership must still be verified.

Initial SMS design evaluates an approved platform sender identifying the actual business in its message. Do not assume generic/shared sender approval or reply support. Dedicated numbers/merchant sender IDs may carry real per-account costs and should not be included automatically without economics. One-way sender must not promise Reply STOP; use a working appropriate opt-out path. Provider-level suppression can affect other intended sends and needs visible recovery, never a bypass.

## Entitlement and billing transitions

Successful verified subscription activation grants entitlements/version and marketing-email allowance under the current billing-period rule. SMS units are granted only by a verified pack purchase. A payment-success animation is not the entitlement source. Duplicate provider events cannot grant another allowance. Refund/cancel/downgrade cannot erase records or disable management of accepted bookings/orders.

Upgrade: show proration/effective date and deliberate approval. Grant only documented incremental marketing-email allowance for remaining period, with no repeated upgrade/downgrade loop minting texts. Downgrade takes effect at the stated renewal; owner selects which offers/locations remain active if new limits apply. Existing paid work and lawful access persist. Extra message units are not silently destroyed by a plan switch.

Account overdue/restricted: communicate clear grace and supported restrictions based on real terms/staffing; no financial/notification hostage-taking. Billing contact, legal owner, operator role and payment seller are separate identities. Cancellation/merchant closure resolves pending work, units, refunds, data, domain and physical links together under the existing exit design.

## Self-service recommendation and real total cost

Package selector asks simple optional questions about adopted capabilities, locations, expected appointments/orders and SMS use. Show a suggested plan and expected total including an explicit top-up scenario, with assumptions. It cannot promise exact usage or hide a cheaper package that fits. Never require customer knowledge of database rows, staff seats or provider credit multipliers to choose a plan.

Current example: Pro £24 plus 300 one-unit SMS uses three 100-unit packs (£27), so the initial software-plus-text purchase total is £51, with no opening unit balance. A 500-unit pack costs £39 and leaves 200 units for later, making that initial purchase £63. Show actual cash bill and carry-forward rather than pretending either is the universal monthly cost.

If many customers need 300+ reminders, compare a deliberately priced larger-message bundle or a provider contract with lower actual rate before launch. The selected allowances are a tested hypothesis, not an instruction to ignore their needs. Plain package design should simplify choices without concealing genuine cost tradeoffs.

## Launch acceptance

All four plans render truthfully; VAT/receipt/subscription match; feature entitlement enforced server-side; allowance cycles and timezone clear; original Free commitments preserved; duplicate grant/send blocked; multiple channels/purposes handled; message preview counts encoding; budget/top-up permissions; downgrade/closure/credit handling; provider outage/payment pending; refund and invoice correction. Exact typed billing/credit/metering contracts remain required before production; proposed-packages.json is still a design model, not the billing engine.
