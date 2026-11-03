# Taplo · Studio scanning, business-card passes and storefront hardware

Working edition 2.6 · 3 November 2026. Founder steering incorporated while completing auth/store/repository/rewards/launch logistics. First redemption method is Studio phone-camera scanning; no extra merchant hardware required. Business-card Wallet passes are a different public-sharing product from private customer loyalty passes.

## The initial shop-floor flow

Customer opens their Apple/Google loyalty pass and shows its QR. Authorised owner/team member opens **Taplo Studio → Scan** (also reachable from Today/Rewards). Ask for camera permission at that task, with torch and an accessible manual-code alternative. Recognise the allowed Taplo code type locally; treat QR contents as untrusted data, never execute script, open arbitrary links or automatically mutate a record.

Scan → resolve the scoped programme/relationship on server → show business, safe customer context, current progress and permitted next actions → staff reviews → confirm → one ledger operation → receipt/activity → queued Wallet update. The phone does the scan; Taplo's server performs authorisation and accounting. A scanned code is not proof an eligible purchase/visit occurred.

| Task after scan | What staff must see/do | Guard |
| --- | --- | --- |
| Find customer/rewards | Current relevant programme and permitted context | Correct business/location, active membership, minimal data |
| Credit qualifying work | Select an eligible completed/paid/attended record not yet credited | No arbitrary Add a stamp from QR alone; unique earn reference |
| Record supported walk-in/cash work | Create/confirm actual supported transaction/attendance with truthful cash/manual status | Separate permission/audit; do not label it Stripe-verified |
| Redeem reward | Specific reward, eligibility and effect; confirm under role | Atomic reservation/redemption; no double spend |
| Correct a mistake | Request/approve adjustment with reason and scope | Different authority from ordinary scan; limits/second review as configured |

A repeated scan doesn't repeat an earn/redemption. If a callback times out, show Checking outcome and retrieve the operation; do not immediately try another debit. If the wrong merchant/programme is scanned, explain and provide a safe switch only if staff actually has that membership. Revoked/cancelled/suspended states fail safely. Offline camera decoding can work, but no offline reward spend/earn confirmation is offered at launch. A lost network retains safe context and returns current outcome on reconnect.

Default customer QR is an opaque scoped reference, not name/email/full account URL or unrestricted login token. A copied screenshot cannot access the person's whole account or automatically redeem a reward. High-value redemptions use the supported additional holder/current challenge verification policy. Manual lookup is restricted against enumeration. Never reveal clinical/learner/private notes just because a public scanner decoded a code. Wallet update lag is disclosed honestly; the ledger is immediately authoritative after commit even if the phone card has not refreshed.

## Public business-card passes for owners and team members

Working scope: **Core and above**, no per-team-member charge. Free keeps public QR/share links and ordinary professional profiles; Pro adds customer loyalty/rewards passes separately. The pricing page must say Business card in Wallet versus Customer loyalty passes rather than one ambiguous Wallet checkbox. Cost/provider capacity still needs validation; no unlimited issuer guarantee is implied.

Studio → Sharing → Business card for the business; a permitted member gets My profile → My business card. Choose the owner-approved public profile destination, business theme and permitted public details. Preview → publish/owner approval where required → official Add to Wallet flow. A staff member cannot make an unpublished profile public, change seller identity, redirect bookings elsewhere or expose another worker's contact. Membership/profile rights remain distinct from pass possession.

Public card fields: business identity, person's chosen public name/title where applicable, short task caption and QR linking to the canonical public business/professional route. Optional photo must be authorised; no invented initial/forced circle, no personal phone/address unless deliberately approved for public display. Preferred captions: **Scan to book with Sam** or **Scan to view our business**. A visitor scans with their ordinary phone camera, opens the same mini-space and can book/contact/save. No Taplo app required merely to view it. An optional contact-save action occurs after opening the public page; do not force address-book access or silently add a contact.

This QR is public-sharing data; it cannot redeem customer rewards, log in as an employee or prove professional licensing. Keep code namespace/purpose/schema separate from private loyalty codes. A name/title change versions the card; the stable public destination remains controlled. A team member leaving triggers profile/public-link policy and pass update/revocation as supported. The old image may persist on an offline device, so the server destination must enforce current public availability, with a clear no-longer-available/business fallback where the original policy permits. Do not silently redirect the employer's link to a former employee's unrelated new business.

## Provider support and actual design

Use the appropriate reviewed generic/pass type and the actual issuer arrangement. Google's official developer blog explicitly describes digital business-card uses with supported image functionality; its Generic pass API supports flexible defined fields. Apple's current generic pass styles cover broader purposes, but the exact business-card payload/distribution/brand use still requires provider terms/capability validation, not an invented approval. Do not masquerade a business card as a payment card or verified official identity.

Current Apple WWDC26/HIG materials include Pass Designer/newer pass presentation options; evaluate these against supported OS versions rather than assuming the oldest archived template is the only design. Baseline generic layouts and proper fallback remain. Long names, compact displays, no logo/portrait, dark/tinted treatment, QR quiet zone/contrast and actual Wallet rendering are required design evidence. Essential fields remain text/semantics rather than baked into a decorative picture. Official add badges and OS screens retain provider styling.

Opening a business-card pass does not make two phones support NFC contact exchange. The supported simple promise is show QR → scan → public mini-space. Physical Taplo NFC URL products provide a different tap-to-open mechanism. Do not market generic phone-to-phone Wallet tapping without a specific supported integration.

## Physical storefront products: sequence by actual job

| Product | Useful purpose | Decision |
| --- | --- | --- |
| QR/NFC desk stand or card | Customer opens the public business page, joins eligible rewards, books/reviews | Good initial accessory; no automatic earning/redemption from a public tap |
| Merchant's existing phone with Studio | Scan customer pass and operate rewards | Default launch redemption setup |
| Screen-capable 2D barcode scanner | Faster repeated scans at a busy counter | Later assessed accessory; prove phone-screen QR capture, pairing/input security and Studio workflow |
| Dedicated display/kiosk | Controlled check-in/reward workflow in a fixed location | Later managed device with explicit restricted session, anti-abuse/privacy/update support |
| NFC Wallet terminal | Contactless customer pass recognition/redemption | Later Apple VAS/Google Smart Tap entitlement/reader/provider product; separate from ordinary NFC tags |

A public stand cannot grant unlimited stamps every time somebody taps. If later self-service check-in is offered, tie it to an actual eligible visit/order and reviewed anti-abuse/authority rules. Hardware must earn its extra setup, stock, warranty/returns/security/support costs. Do not order stock until real sample compatibility and supplier/product/territory obligations are checked. Optical screen-friendly QR capture matters; a conventional laser reader is not automatically suitable for phone displays.

## Remaining exact contracts and acceptance

Pin scanner code formats/version/signature or opaque-reference lookup, staff endpoint/input/response/errors, redemption step-up rules and ledger limits; define lifecycle jobs for business-card/profile/public-link changes. Prototype actual Studio camera/Wallet flow on iPhone/Android, test low light, glare, malformed/foreign/public-vs-private code, duplicate/concurrent scans, screenshot, cash/manual work, offline/unknown result, removed staff, inaccessible customer details and issuer lag. The HTML visual references do not prove the native camera/provider integration.

Current primary sources checked 3 November 2026: https://developers.googleblog.com/explore-the-latest-updates-google-wallet-io-25/ ; https://developers.google.com/wallet/generic ; https://developer.apple.com/design/human-interface-guidelines/wallet/ ; https://developer.apple.com/videos/play/wwdc2026/209/ ; https://developer.apple.com/wallet/get-started/ . NFC prerequisites remain in WALLETS-ISSUANCE-REDEMPTION-AND-DESIGN.
