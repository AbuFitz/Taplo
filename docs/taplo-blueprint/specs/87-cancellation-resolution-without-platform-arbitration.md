# 87 · Cancellation resolution without default platform arbitration

Working edition 1.3 · 3 November 2026 · Proposed UK-first operating design. Extends 24, 74–76 and 82. Requires reviewed policy rules and provider agreement; this is not final contract wording.

## What problem to solve

Protect real merchant losses without making customers fight for refunds owed to them, and keep Taplo from manually judging every missed appointment. The solution is a transparent agreement, reliable evidence and bounded self-service. It is not a rule that always sides with either party.

The founder reports complaints about Booksy refunds. That is an investigation lead, not established review evidence in this edition: no representative review sample or complaint-rate analysis has been completed. Current Booksy UK help documents merchant no-show/deposit options and a provider-led refund route. Its help wording is not legal authority for Taplo. Current CMA guidance remains the legal-design reference for fairness. [R56–R57]

## Four different events

1. Cancel appointment: releases future capacity and records who cancelled/when. It need not finish the money decision in the same instant.
2. Apply agreed cancellation outcome: determines the proposed refund/retention under the accepted policy and applicable rights.
3. Request review: challenges facts, circumstances or calculation. It is not an immediate automatic refund merely because a ticket exists.
4. Bank dispute: separate provider/card process with its own authority and deadlines. Taplo cannot promise to prevent or overrule it.

## Merchant configuration

Offer → Booking protection shows no payment/deposit/full/guarantee choice, cancellation window, supported calculation basis and a plain-language customer preview. Use legally reviewed capability/category templates with limited safe parameters, not unlimited legal prose and a Non-refundable in all circumstances toggle. Owner sees why each setting matters and how a cancellation is handled. Any custom exception outside supported rules needs review rather than silent acceptance.

Use an explicit local timezone and boundary rule: a cancellation at the deadline qualifies for the free window when received by the server on/before the stated cutoff. Preserve event timestamp and displayed cutoff timezone; handle daylight-saving changes deliberately. Merchant-side changes cannot shorten an already accepted window retroactively.

## Outcome routing

| Situation | Recommended handling | Owner and customer experience |
| --- | --- | --- |
| Within accepted free window | Automatically initiate agreed eligible refund on merchant-authorised rules, subject to provider state | Show cancellation and refund separately; merchant notified; failures enter finance queue |
| Merchant cancels/cannot perform | Straightforward customer choice of refund owed or voluntary alternative | No forced credit; no customer cancellation penalty |
| Outside free window, ordinary facts | Apply reviewed disclosed rule with any required loss/mitigation assessment | Show paid amount, proposed retention/refund and reason; easy waiver and challenge |
| Scope/price changed, disputed attendance, rights exception | Financial decision requires a scoped review | Preserve evidence, give next step and escalation; do not pretend a universal timer determines rights |
| Duplicate charge/verified platform error | Technical reconciliation and appropriate correction | Taplo owns the software incident; do not send customer back and forth |
| Bank dispute already open | Follow provider workflow and deadline | Prevent uncoordinated duplicate refund; preserve evidence and merchant access |

Automatic refunds require merchant permission established in the actual agreement/provider configuration. If the platform cannot initiate one, expose a clear merchant action and monitored overdue case instead of claiming automation. Customer statutory/provider rights are not suspended while a merchant review runs.

## Lightweight merchant review

One Review cancellation task contains appointment/agreement facts, cancellation time, payment/refund state, customer explanation, any relevant resold capacity and a proposed calculation. Actions: Refund eligible amount; Partial refund with itemised reason; Waive fee; Request relevant information; Maintain proposed charge with explanation. Restrict financial actions to authorised staff, validate remaining refundable value and record every adjustment. Never demand disproportionate medical proof or reveal other customers' identities to establish that a slot was filled.

A rebooked slot is evidence to reassess loss, not proof that every original cost vanished. Conversely, an unfilled slot does not automatically prove any chosen fee is fair. The policy evaluator can support a reviewed calculation; it cannot automatically decide every legal circumstance. No cancellation plus retained deposit plus new charge may compensate the same loss twice.

## Customer review and escalation

Cancel action shows the exact current impact before confirmation. Afterward: Cancelled; Refund processing; Review requested; Merchant response available; or Contact support, with plain explanations. A review request records the disputed basis and what remedy is requested. Notify the merchant, preserve an auditable timeline and provide a bounded response target defined in the support operating policy. Do not invent a legally required deadline where none has been verified.

If the merchant does not respond, route to an overdue case with documented permitted next actions. Do not silently resolve all cases in the merchant's favour, automatically refund all money without authority, or force the customer to wait beyond applicable rights/provider deadlines. Choosing escalation/ADR responsibilities is a launch operating decision, including applicable legal disclosures.

## Taplo Console role

Console separates technical error, ordinary merchant policy review, suspected abuse and bank dispute. Operators see only relevant evidence, reason, owner, response target and next permitted action. They may correct a platform state under an approved command, coordinate communication and supply an evidence export; they do not become unrestricted judges of service quality or debit funds by improvisation. Serious/repeated merchant failure can trigger proportionate reviewed account action and appeal, with existing customer obligations preserved.

Evidence bundle: seller identity, agreement/policy versions, amount breakdown, authority for any later charge, booking/change/cancellation timestamps, communications, actual payment/refund references and relevant attendance/mitigation records. Redact third-party and unrelated sensitive data. Exporting a bundle supports the process; it does not guarantee a dispute win.

## Worked example and rehearsal

An illustrative £80 appointment has £20 paid. Customer cancels late. The accepted reviewed rule gives a proposed charge, then relevant facts/rights and reasonable mitigation determine what may be retained. If £12 is the justified outcome, refund £8 and cancel the £60 scheduled service balance. Do not keep £20, charge £12 again and still display £60 owed. The £12 is an example calculation, not a default fee or legal safe harbour.

Rehearse: cutoff race, cancellation while deposit is pending, partial refund already made, merchant marks no-show by mistake, customer disagrees with attendance, provider restriction, insufficient funds, slot resold, independent chair-renter seller, merchant closure and simultaneous bank dispute. Each needs distinct customer/Studio/Console states and an accountable recovery owner.
