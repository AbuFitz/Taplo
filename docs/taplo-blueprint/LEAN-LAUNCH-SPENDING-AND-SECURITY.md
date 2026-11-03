# Taplo · Lean launch spending and security review

Working edition 2.8 · 3 November 2026. Corrects the impression that edition 2.7's upfront allowances were mandatory fees. They were unsourced planning reserves selected by the blueprint author, not quotations, legal requirements, purchase instructions or commitments. No such purchases occurred. Keep the larger scenario as optional funded contingency; do not present it as the minimum price of launching Taplo.

## Cash, reserves and work are different

| Earlier line | Correct interpretation | Working lean default |
| --- | --- | --- |
| £2,000 legal/accounting | Broad optional quote allowance, not an established fee/complete legal opinion | Prepare actual schedules/drafts internally; obtain targeted relevant review/actual quote before relying on it; cash amount unpriced |
| £1,500 security review | Optional independent-review allowance, not a universal requirement at that price | Continuous internal security review/testing; targeted outside review by actual risk/quote |
| £600 test devices | Allowance only if current phones cannot cover support claims | Inventory existing suitable iPhone/Android/borrowed authorised devices first; £0 new-device purchase assumed until a gap is demonstrated |
| £150 NFC/Wallet samples | Over-broad mixture of software testing and potential hardware samples | £0 physical Wallet-QR samples; no NFC stock order. Physical NFC sample cost only when an actual hardware product is selected |
| Apple/Google accounts | Published enrolment anchors converted with assumed FX | Approximately £99.20 combined first-year Apple/one-time Play; local fee/tax varies; account ownership requirements still apply |
| £25 domains | Planning renewal/registration allowance | Existing domain invoices/ownership first; spend only if actually needed |

Wallet pass signing/provider setup, hosting, updates and staff time are real work. A Wallet QR shown on an existing phone needs no purchased NFC terminal/card. NFC tag interoperability/sample tests become relevant only when selling/encoding the physical NFC product; they are not a cost per digital loyalty card. A Phone pass can be scanned by Studio phone camera.

Very narrow first-store-account/domain illustration: £99.20 + £25 = £124.20; existing suitable phones mean £0 new-device spend in that case. This excludes actual legal/accounting/security review quotes, build/design/labour, hardware orders, insurance and every unquoted company requirement. It is not a conclusion that Taplo can lawfully/safely launch for £124.20.

## Monthly platform budget

The selected low-usage supplier anchors total £121.29/month in edition 2.7's assumptions. Other rows are £70 internal planning reserves plus £38.26 cushion, giving £229.55 funded envelope. A reserve is not another unavoidable supplier subscription. A low invoice doesn't remove recovery, monitoring or support work. Selected paid tools can be reconsidered against actual free-tier constraints, but don't silently change the assumed service/security scope to achieve a lower headline.

Three cash views: (1) actually due invoices/accounts, (2) accessible contingency/risk reserve, (3) human/product work. Do not add a backup reserve and the same paid backup invoice twice; reconcile actual spend into its bucket. Provider usage/seat/tax/FX changes and store policy remain. The £4,374.20 upfront/£5,751.47 six-month allowance is retained as the previous review/device-funded scenario, not minimum obligatory cash.

## Internal security work, deliberately designed

Yes: internal review is part of the normal engineering process. Use versioned threat modelling, least privilege, protected secrets/sessions, code review, dependency/secret/static analysis, tenant/field negative tests, rate limits, signed/provider event checks and actual restore drills. Scan tools assist; they don't prove missing business-logic or authorisation flaws absent. Agents can critique/build tests but cannot certify their own output safe by saying reviewed.

| Risk | Concrete internal evidence |
| --- | --- |
| Tenant data leak | Adversarial owner/staff/customer tests across HTTP, exports, realtime, file URLs and background jobs |
| Money/reward theft | Server authority, fresh step-up where required, idempotency, limits, concurrency and unknown-result reconciliation |
| Account takeover | All-method MFA/assurance enforcement, invite/link/recovery/session rotation and lost-device tests |
| Upload/private file abuse | Type/content/size checks, safe storage/rendering, access recheck, retention and malware handling appropriate to scope |
| Provider or credential compromise | Scoped secrets, event authentication, replay protection, rotation/revocation and incident rehearsal |
| Failed backup/restore | Restore real test copy; reauthorise integrations; reconcile provider truth before jobs replay |
| Supply-chain/change regression | Lock/pin dependencies, review migrations/build artefacts/permissions and actionable vulnerability triage |

Assess remaining risk before handling real sensitive data/money. Independent review can challenge blind spots, especially auth/tenant/money and scope-specific requirements; choose a bounded statement of work and retest, not an unexplained £1,500 mandatory tick box. Self-review is not equivalent to independent assurance. No external-review cost or legal obligation is invented without actual scope/provider/contract assessment.

## Spend triggers

Buy a device only for a documented supported-device coverage gap; buy an NFC sample only for an actual planned accessory; commission review against a concrete risk/question and deliverable. Assign spend owner, quote, tax/renewal/exit terms and source budget before purchase. Existing conditional enthusiasm about sign-up does not mean an account or order has already happened. No platform accounts, supplier orders or external messages were made in this task.

Reference: https://www.ncsc.gov.uk/collection/developers-collection (current internal secure-development practice guidance, checked 3 November 2026). It is not evidence Taplo meets every applicable standard.
