# Taplo · Wallet, scanner and native device test pack

Working edition 2.7 · 3 November 2026. This closes the vague testing instruction with prerequisites, fixtures, steps, acceptance and evidence. It is a test specification, not a claim any real pass was issued or any native app ran. No signed native build, issuer credentials or physical devices have been supplied to this blueprint task. Browser composition checks are a different evidence class.

## Readiness and ownership

Engineering owns signed pass generation/update, native build, API authorisation/ledger and safe telemetry; design owns actual OS rendering and readable scanner/permission/recovery states; QA records device results; operations owns issuer accounts/certificate rotation/recovery and restricted staff tools. Record actual accountable people before execution; role labels are not an imaginary staffed team.

Use Taplo-controlled developer/issuer accounts and explicit test businesses, participants and programmes. Apple requires signed passes and the relevant certificate/identifier. Google issuer demo mode restricts issuance to authorised/test accounts until publishing access is granted. A Google Play developer account is not automatically a Google Wallet issuer. Do not use real customer profiles or merchant balances in test fixtures.

For Apple update delivery, the official pass web-service documentation says pass-update push operates in the production APNs environment. That does not authorise a public launch: use the supported production endpoint with isolated test passes, allowlisted test holders and no live customer money. Record exact issuer/certificate/environment; never invent a sandbox APNs push success. If this prerequisite is absent, the case is blocked, not passed.

## Device and installation coverage

| Axis | Required coverage |
| --- | --- |
| Customer pass display | iPhone at supported minimum and current stable OS; Android at supported minimum and current stable OS with Google Wallet/eligible account |
| Studio scanner | iPhone and Android; at least one older supported camera/device and one current midrange device; real cameras required |
| Cross-platform pairings | iPhone pass → iPhone Studio; iPhone → Android; Android → iPhone; Android → Android |
| Entry methods | Safari/web and native Apple add; Chrome/web and native Google add; install cancelled, already installed, unsupported device/account |
| Native app links | Fresh install, already installed, logged out, wrong business selected, app absent and browser fallback |
| Presentation | Light/dark where supported, large text, screen reader, long names, no logo, portrait absent, colour-poor brand and provider layout fallback |
| Conditions | Low brightness, glare, dim room, weak mobile data, network loss, app background/resume, camera denied/revoked and changed role |

Pin supported OS versions in the actual release manifest after the native dependency matrix is selected. Do not infer the whole device estate from one screenshot, emulator or high-end handset. A test pair can be reused across scenarios; this is coverage, not a demand to buy a separate phone for every row. Watch pass rendering is separately verified if advertised; it is not covered merely by iPhone success.

## Safe fixtures

Programme A: Chapter Barbers loyalty, one stamp per eligible completed appointment, reward after eight, no default expiry. Customer A has seven stamps. Completed appointment A has not been credited. Customer B has an eligible reward. Programme B belongs to a different merchant. Staff S may redeem in A; Staff T has no redemption grant; Staff U is removed mid-session. Professional Sam has an owner-published public card. These are fictional test identities; no real contacts. Use fixed low-value test entitlements without actual charge authority. Prepare expired/revoked/malformed/foreign/public QR fixtures. Every command has an operation key and audit trace; evidence contains redacted references, never credential secrets.

## Execution and expected outcomes

| ID | Steps | Exact acceptance |
| --- | --- | --- |
| W01 | Issue Apple test pass; add through web, then native entry; cancel once | Genuine signed pass rendered in Wallet; cancellation never says saved; returning to Taplo does not infer install from a click |
| W02 | Issue Google demo/test object; save through web/native eligible account | Intended class/object attached to correct account; test status recorded; no public publishing assertion |
| W03 | Reopen add link on same device and on second authorised device | Same intended relationship/pass identity; no duplicated loyalty account or balance |
| W04 | Scan Customer A on each of the four phone pairings | Server resolves correct business/programme; staff sees permitted safe context; no ledger mutation on decode |
| W05 | Select completed appointment A and confirm earn | Exactly one earn and one eligibility transition; reference to source appointment; UI receipt and authoritative progress eight |
| W06 | Repeat scan/confirmation on two staff phones concurrently | Same source cannot earn twice; second attempt retrieves existing result or conflict; one authoritative ledger effect |
| W07 | Redeem Customer B on two devices concurrently | At most one success; second shows current outcome; no negative reward balance or second entitlement |
| W08 | Disconnect before request, after server commit and before response separately | No false offline success; unknown outcome reconciles by original operation key; no blind replacement debit/earn |
| W09 | Scan wrong merchant, public professional card, foreign URL, malformed, expired or revoked code | No mutation; clear safe explanation; no arbitrary URL launch/script execution; no unauthorised tenant switch |
| W10 | Scan as staff without grant; remove authorised staff before confirmation | Server denies consequential action under current membership; cached UI cannot authorise it; no leaked private customer details |
| W11 | Copy loyalty QR screenshot; try high-value redemption and account access | Static reference is not account login or sufficient holder proof; required policy/challenge enforced; no automatic success |
| W12 | Record cash visit through supported manual workflow; earn; reverse eligible transaction | Correct manual/cash provenance and authority; source-linked earn/reversal; never labelled Stripe-confirmed |
| W13 | Update ledger and queue Apple/Google pass update; hold phone offline then reconnect | Ledger changes once; queued/delayed/failed status truthfully visible; provider cache is not money authority; eventual rendering observed and timed |
| W14 | Remove pass, add again; rotate signing material with approved procedure | Update registrations/objects handled without leaking access; documented recovery and continuity; no simulated certificate-expiry claim |
| W15 | Add Sam public card; scan with ordinary phone camera | Correct published mini-space/staff booking context opens without compulsory Taplo install; public code cannot redeem rewards |
| W16 | Unpublish Sam profile/remove staff while old pass remains on another offline phone | When public destination is requested it enforces current publication; no unrelated new-employer redirect or false promise remote card image is erased |
| W17 | Deny camera, revoke permission in OS, background scanner, scan under glare/low light | Accessible permission recovery/manual-code option; request only at task; no duplicate action on resume; no frame uploads unless separately justified |
| W18 | Change plan, pause programme, close merchant, refund already-earned qualifying work | Earned obligations retained under specified policy; new entitlement gates and financial/reward ledgers stay separate; no blanket points deletion |
| W19 | Inspect pass/back fields, scanner, logs, public link, push payload and screenshots | No email/private notes/balance secrets in public card; secrets/opaque tokens redacted from telemetry; scanner data minimised |
| W20 | Open customer/Studio widgets logged out, expired, removed staff and stale snapshot | Private fields redacted by default; no live-availability claim; deep link reauthorises; widget never directly refunds/redeems |
| W21 | Upgrade backend with older supported native build installed | Version compatibility or explicit safe upgrade gate; accepted work still has browser/support recovery route |
| W22 | Exercise VoiceOver/TalkBack, large text and malformed input; verify copy and screen bounds | Correct reading/focus/error order, usable close/back/confirmation, QR readable with quiet zone; no clipped essential total/action |

Do not use presentation QR decoration to compromise the provider barcode. Public share cards may use approved brand styling; customer redemption codes must retain verified readability and namespace separation. A static QR's screenshot risk is not fixed by promising it is uncopyable. Implement the actual holder-verification policy and test it.

## Scanner screen states

Ready → permission request if needed → scanning → recognised/looking up → review → submitting → confirmed OR checking outcome/rejected. Back from review does not act. Camera pauses after recognition; resume is deliberate. Manual code is a separate rate-limited lookup, not an enumeration endpoint. Confirm button names the effect, e.g. Redeem free haircut, with applicable item/reward/remaining information. Distinguish customer account balance, reward progress and money; no ambiguous balance label. Essential receipts stay in the activity view instead of vanishing with a toast.

## Evidence and release result

For each case record build commit, API/schema version, issuer/class/pass reference redacted, phone model/OS/Wallet version, environment, actor/grants, fixture, steps/time, expected/observed result, audit/ledger/provider event references, defect and retest. Evidence owner signs the actual result. Allowed states: specified, blocked_prerequisite, ready, running, passed, failed, retest_required, not_applicable_with_reason. No synthetic past execution timestamps.

Money/permissions/ledger/privacy failures block the affected release. Provider-add/update cases must genuinely pass before that Wallet feature is advertised as available. Cosmetic defects are triaged for accessibility/task impact; no numeric correctness percentage is inferred. Camera/OS testing is not replaced by browser checks. NFC terminal/Smart Tap/Apple VAS and physical accessory safety/compatibility require separate future packs.

## Current official references

Checked 3 November 2026: https://developer.apple.com/wallet/get-started/ ; https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes ; https://developer.apple.com/documentation/walletpasses/distributing-and-updating-a-pass ; https://developers.google.com/wallet/retail/loyalty-cards/getting-started/issuer-onboarding ; https://developers.google.com/wallet/generic/resources/terminology . Provider approval and runtime results are not obtained by reading these pages.
