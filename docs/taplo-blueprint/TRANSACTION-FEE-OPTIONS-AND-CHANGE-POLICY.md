# Taplo · Transaction fee options and fair price changes

Working edition 2.8 · 3 November 2026. Current default remains £0 added Taplo transaction commission on all four plans. The founder has opened fee exploration; no fee has been silently activated and no forever-price promise is made. Provider processing fees remain separate. Do not add a permanent fee merely to fund optional one-off sample/device allowances.

## Working recommendation

Keep the existing £0/£12/£24/£49 ladder and 0% added commission as the current offer while closing real usage/support economics. Model Free-only 1% and all-plan 0.5%/1% as explicit alternatives, not hidden rights already exercised. A Free-only fee could fund low-subscription users but complicates Free and has tax/refund/acquisition effects. No default change is justified solely by speculative GMV; gather actual merchant/payment mix evidence. Never advertise 0% if an unavoidable Taplo charge is collected under another name.

A merchant with £10,000 processed volume would pay £100 extra at 1%, above the software and processor fees. That can matter more than a £12 subscription and incentivise off-platform payments. Model retained contribution/refunds/support/conversion instead of treating all fee revenue as profit. Explore-origin/new-customer-only commissions add attribution/dispute complexity; no such tax is adopted.

## If a fee is later adopted

Use the supported Stripe Connect application-fee arrangement with merchant direct charges, subject actual controller/fee/loss/provider agreement. Current UK Connect material allows additional transaction fees under both pricing models; adding an application fee does not by itself require the platform-prices-processing model. Conversely, don't assume there can never be new Connect/account/payout/FX costs. Validate actual configuration. Revenue sharing with Stripe is qualification-dependent, never baseline guaranteed income.

FeePolicyVersion includes business/plan/scope, effective date, integer basis points, fee base, tax treatment, rounding, refund rule and agreement version. FeeQuote records eligible amount, fee minor units, tax/total and chosen policy; the server calculates it. A client-sent platform fee is never authority. Initial version is zero. Keep processor fee, Taplo service fee, merchant tax, customer total and payout separate.

Proposed alternative modelling basis: percentage applies only to money actually captured through the eligible Taplo payment path, not full appointment value when only a deposit is taken. Later balance collected through Taplo gets its own fee on that new amount; no double charge. Exclude voluntary tips and separately collected tax where the final approved rule requires it; final fee base must be expressly defined. Cash/manual records are not automatically chargeable platform GMV. No card surcharge/customer service fee is implied.

Refund alternative: refund Taplo's application fee proportionately to refunded captured amount, returning all on a full refund, with cumulative rounding preventing over-refund. Stripe does not automatically refund that fee by default; actual refund commands must explicitly request/track fee refund. Processing fee non-return is a different provider item, not permission for Taplo to keep its own fee silently. Chargebacks and fee-tax credit notes require their own provider/accounting rules and reconciliation.

## No blank-cheque price clause

Business merchant subscriptions and consumer checkout have different legal relationships; consumer guidance is not automatically a rule for all B2B SaaS terms. Have the actual terms reviewed. Working commercial policy: clear actual fee schedule at signup, defined reasons/method for prospective changes, at least 30 days' notice and a genuine penalty-free cancellation/export path before the new rate starts, subject any longer applicable requirement or actual agreed fixed term. Material new commission needs deliberate merchant agreement to the changed charging basis before new affected work, not a buried footer update.

Do not retroactively change the fee version for already accepted bookings/quotes/orders or collect a new fee on an old committed deposit/balance under an incompatible promise. Apply reviewed changes to new eligible agreements on/after the stated date or a clearly agreed new period. Annual/prepaid terms need separate protection. A user declining a new fee still has safe completion/refund/export for accepted work. No indefinitely misleading 0%-forever headline followed by a hidden unilateral right.

Possible legal-draft direction, not ready-to-publish clause: Taplo may propose prospective changes to published charges for specified operating/service reasons; notice explains amount, basis, effective date, affected new work and cancellation/export rights; existing agreed charges remain governed by their agreement. The entity, reasons/formula, timing and review still need drafting; this paragraph is not a universal enforceability guarantee.

## Model and evidence

contracts/calculate-map-and-fee-options.py models original scenarios at 0%, 0.5% and 1% over actual eligible captured GMV with an assumed 5% refunded volume and 20%-VAT-inclusive fee-revenue case. It shows gross collected fees and revenue after modelled VAT/refunds, before support/provider/tax/admin/losses, not profit. Existing subscription cohort model does not assume any commission. No double-counted revenue or unapproved bill is introduced.

Before adopting: exact processor pricing/loss/fees agreement, fee base/tax/rounding, partial/full refunds/chargebacks, billing/native store scope, terms/version migration, merchant-visible statement/invoice and measured commercial reaction. A higher fee is not a substitute for fixing setup and avoidable support.

Sources checked 3 November 2026: https://stripe.com/gb/connect/pricing ; https://docs.stripe.com/connect/direct-charges?platform=web&ui=stripe-hosted ; https://www.gov.uk/guidance/writing-a-fair-contract-for-customers . The last is consumer guidance and a transparency design reference; it is not represented as a complete B2B legal assessment.
