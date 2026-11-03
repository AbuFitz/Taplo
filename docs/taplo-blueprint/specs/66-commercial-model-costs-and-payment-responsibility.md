# 66 · Commercial model, costs and payment responsibility

Edition 1.0 · Recommended operating assumptions for evaluation, not final pricing or a legal conclusion. Commercial approval and provider terms must agree before real payment enablement.

## Recommended starting model

Merchant sells its own goods/services; Taplo supplies business software, discovery and connected tools. Taplo sells its own physical accessories separately under its own seller responsibilities. Start with merchant-scoped checkout. Evaluate connected-account direct charges against actual supported account configuration, region and provider risk allocation. Stripe currently describes direct charges as a fit for SaaS platforms, while charge choice affects refund/dispute debits [R6]. This is a candidate technical configuration, not proof that Taplo automatically escapes financial or legal responsibility.

| Decision | Recommendation for evaluation | Unresolved evidence |
| --- | --- | --- |
| Merchant customer transaction | Clearly identified merchant seller; its fulfilment/policy | Provider agreement, legal/tax review, supported category/country |
| Payment configuration | Compare direct charges first for merchant-led sales | Account configuration, fees, losses, onboarding and supported methods |
| SaaS revenue | Predictable base subscription with clearly priced usage/add-ons | Willingness to pay, unit costs, support burden |
| Discovery pricing | Do not assume commission is necessary | Acquisition value, ranking fairness and economics |
| Domain/hardware | Distinct one-off/renewal terms and cost visibility | Registrar/reseller rights, supplier QA, fulfilment/support costs |
| Platform-wide rewards | Defer commitment until liability/funding established | Redemption settlement, expiry, reversals, abuse |
| Multi-merchant checkout | Keep outside initial evaluated payment design | Demonstrated demand, settlement/refund complexity |

## Responsibility before implementation

Write down: legal seller/contracting parties; processor account and charge owner; statement descriptor; processor/application fee payer; refund authority; application-fee refund policy; negative balance and dispute liability; payout schedule/holds; fraud review responsibility; identity verification/KYC responsibility; tax invoicing; failed merchant onboarding; support escalation; closure/insolvency handling. Provider account settings and terms, not a marketing sentence, determine technical responsibility. No promise of guaranteed payouts, escrow, deposit insurance or loss-free chargebacks without an actual arrangement.

The customer sees seller, total, fulfilment, material terms and how to seek help before commitment. Government guidance identifies required online-order information and confirmation requirements [R5]; exact policy applicability/exception handling requires current professional review for the supported offer, not a copied universal “14-day/no-refund” rule. Team profile attribution never hides the responsible merchant; independent operators need an explicit seller/payment model.

## Cost model

`contracts/commercial-model.json` contains input categories, formulas and illustrative scenarios. Unknown supplier costs remain null until quoted. Do not substitute placeholder values into public pricing. Separate recurring platform revenue, usage revenue, hardware contribution and domain contribution so a profitable accessory sale does not hide an unprofitable SaaS account.

Per active merchant/month: allocated hosting/storage/observability + messages by channel + payment/platform charges actually borne by Taplo + support minutes × fully loaded cost/minute + expected fraud/refund losses actually borne + onboarding amortisation + other integration costs. Contribution = net recognised revenue − variable/allocated servicing costs. Target contribution margin must be chosen explicitly; break-even revenue = cost/(1−target margin) where denominator is positive. Acquisition payback uses monthly contribution, not gross subscription revenue. Cash timing, VAT/tax and annual prepayments need separate treatment.

Test ordinary low-volume use, busy appointment operator, image-heavy seller, support-heavy account and messaging spikes. Include failed delivery/retry cost, storage/egress, moderation and device/domain support. Fees refunded to customers may differ from costs returned by suppliers. Avoid “unlimited” allowances before testing abuse and heavy-user economics.

## Packaging without punishing existing customers

Recommended structure: basic business presentation; a clear capability package; optional usage/connected services. Exact tiers/prices/allowances remain open. Customers should understand which tools are included before setup. Usage counters show what counts, period, timezone, remaining amount and next action. Alert before limits; no surprise automatic billable overage without agreed terms. Cap optional spend where practical.

If a limit is reached, protect existing paid work, receipts, lawful access and support. Restrict new optional usage or offer a deliberate upgrade; never make customers lose an accepted booking because their merchant exceeded page views. Transactional communication fallback and safety obligations need operational treatment, not an upsell trap. Domain renewal and hardware purchase are explicit separate commitments even when bundled.

## Billing lifecycle

Trial/free → paid activation with full terms → renewal → upgrade/downgrade with effective date/proration preview → failed payment/dunning → grace/restriction → cancellation/exit. SaaS billing is separate from merchant customer membership billing and payment processing. Display the next amount/date and scope; a cancellation is not immediate erasure of customer commitments. Account ownership change and subscription payer change are separately verified. Public prices are published only after cost inputs, supported scope, liability allocation and customer evidence support them.

## Team packaging · 1.8

Spec 99 adopts included team logins/bookable members, no per-member fee, with actual usage/service costs modelled separately. Final software price/allowances remain unset. Employee identity does not imply separate connected seller account. Spec 101 records the current Stripe-handled versus platform-handled pricing distinction; verify the actual supported account/risk agreement before treating it as Taplo's supplier quotation.

## Pricing evaluation · 1.9

Spec 104 and proposed-packages.json now supply concrete test anchors/allocation. They are not approved public tariffs; supplier/support/tax/capacity and willingness-to-pay evidence must support release. Preserve current illustrative scenarios: they expose loss-making combinations at appealing headline prices, rather than being hidden to justify them.

## Reproducible economics · 2.1

108–109 supply full package costing/bundles and logistics. contracts/economics-assumptions.json, calculate-economics.py and economics-results.json complement the earlier illustrative cost model; ECONOMICS-RESULTS.md is the generated human readout. Do not treat assumed per-merchant allocations as supplier quotes or add fixed base bills twice. Four packages in launch plan; all capabilities/entitlements/billing must actually be supported before sale.
