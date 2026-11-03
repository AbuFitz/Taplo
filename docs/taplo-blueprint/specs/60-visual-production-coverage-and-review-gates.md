# 60 · Visual production coverage and review gates

Edition 0.9 · A specification is not evidence that every screen is designed or shipped. This contract makes the remaining design work concrete.

## Per-screen design record

Every screen family has: purpose; user/role; entry/exit; source records; important facts/actions; primary and secondary identity; content extremes; mobile/tablet/desktop composition; light/dark treatment; merchant/platform appearance scope; overlays and Back behaviour; initial/empty/loading/error/success variants; accessibility/input behaviour; cross-surface dependencies; and acceptance evidence. Optional fields may be marked not applicable with a reason. Screens cannot silently inherit an unsuitable product-popup pattern.

## Review progression

1. Composition: hierarchy, content order and task continuity; no final palette assumption.
2. Interaction: real choices, Back/Close, retained values, request/pending/success/recovery.
3. Visual system: typography, merchant/platform scope, contrast, spacing, images, focus and motion.
4. Cross-surface: same event in customer, Studio, Console, message/email/push and external handovers.
5. Device/provider: actual keyboard, permissions, map, payment, Wallet/NFC and slow/error paths.
6. Pilot evidence: observed customers/owners complete the end-to-end task without coaching; revise where they hesitate or misunderstand.

These are quality checks within the authorised work, not mandatory user-permission pauses. Review one connected journey at a time while maintaining whole-system coverage. No arbitrary requirement to screenshot hundreds of cosmetic variants before a useful pilot can progress.

## Suggested first review sets

| Set | Frames/interactions | Why |
| --- | --- | --- |
| Customer orientation | Guest Explore, Saved empty/populated, Activity attention/empty, settings appearance | Establish stable navigation and return value |
| Map and location | Narrow/wide map/list, selected business, coverage/private/online, permission denied, provider failure | Resolve geographic semantics before polish |
| Merchant and overlays | Name only/wordmark/photo, product shelf/detail, booking, message, share/reward | Prove recognisable but flexible mini-space |
| Commitment | Product/booking review, price/time conflict, payment pending/failure, confirmation | Prevent attractive UI making false promises |
| Owner work | First-run Studio, Today, calendar, offer editor, design scope, preview/publish | Prove owner simplicity and shared records |
| Recovery | Cancellation/refund, support case, private-link recovery, account switch | Avoid disconnected exception paths |
| Physical/external | Wallet add/update, NFC claim/scan, domain connect/renew/exit, app deep link | Validate actual ecosystem handovers |

## Evidence ledger

Record each review with design/spec revision, screen family, viewport/input mode, theme, state, observed result, unresolved defect and follow-up owner. Distinguish written contract, layout schematic, interactive concept, implemented UI, provider/device validation and customer validation. A local no-overflow check does not certify full accessibility; a mock booking is not a real slot reservation; a map layout diagram is not a licensed geographic map. Keep internal release evidence out of ordinary public product copy.

## Definition of a useful connected milestone

One pilot can discover/enter a real merchant, understand an offer, perform the eligible transaction, retrieve/manage it later, and receive an appropriate owner response. Owner handles it through Studio, and support can recover an authorised exception. Identity, wording, financial/operational state, theme and navigation agree throughout. Expansion is guided by this evidence, not by how many screens have been listed. All specifications remain revisable; no architecture, palette, pricing or launch scope is approved merely because it appears in this pack.
