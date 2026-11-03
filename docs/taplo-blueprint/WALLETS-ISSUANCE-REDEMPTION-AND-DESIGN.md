# Taplo · Wallet issuance, redemption and design

Working edition 2.6 · 3 November 2026. Deepens spec 37, rewards and native release. Apple Wallet/Google Wallet passes, Apple Pay/Google Pay checkout, physical Taplo NFC tags and phone widgets are different capabilities. No issuer account, entitlement or live pass was configured by this blueprint task.

## The first useful pass

Working initial scope: merchant-specific loyalty/relationship passes tied to an eligible rewards programme, offered on Pro/Business. A customer can use the programme/return view without installing a Wallet pass. Payment wallet availability at Stripe checkout is independent and does not require a Pro loyalty subscription. Do not issue a meaningless generic pass merely because a public business link exists.

Later ticket/admission/membership/pass types need the exact supported supply/issuer/access/expiry contract; a reward point is not cash or stored monetary value. Do not turn the same pass into clinical identification, a regulated ID, a transferable gift balance or a cross-merchant settlement promise by changing its title. The business owns its reward promises; Taplo operates the projection/issuer integration under actual agreements.

## Provider account and server components

| Provider | Required integration | Operational responsibility |
| --- | --- | --- |
| Apple Wallet | Eligible pass type, company-controlled Pass Type ID/signing certificate/key, signed .pkpass, controlled HTTPS distribution/update service | Certificate renewal, protected signing, serial/pass identity, device registration/auth token, APNs/update recovery |
| Google Wallet | Issuer account, supported loyalty class/object, authorised service account, approved publishing scope and signed save action | Template/class approval, object revision/state, key/IAM rotation, API retry/reconcile and publisher status |
| Taplo | Rewards ledger, business/programme/holder/entitlement mapping, pass projection/version, redemption command and audit | Server truth, customer privacy, safe self-service, staff permission and support |

Apple documents signed passes distributed through web/email/apps and a device-registration/update service. Wallet add does not require the related app. Google documents class/object and signed save links plus publishing approval; demo issuance is not live publishing access. [P1–P4] Choose the merchant/aggregator issuer model and actual brand permissions with provider terms before live issue. Merchants should not need an Apple/Google developer account each merely to use the managed supported programme, unless the selected provider arrangement actually requires it.

Signing/API keys live in protected server configuration, never Studio browser/mobile assets. Separate test/live registry and least-privilege service accounts. Do not use a generic admin key for every support request. Pass service authenticates registered calls and limits disclosed data; identifiers/tokens are not analytics labels. Avoid sensitive customer values in pass JSON, signed JWTs, URLs, push/logs and public asset names.

## Studio setup and customer flow

Studio Rewards → create a supported programme → define earning/redemption/expiry/exclusions in reviewed limits → choose coordinated pass appearance → see sample with realistic long names/no logo → preview terms/issuer → enable only when ledger/provider readiness is verified. Keep optional imagery and advanced fields secondary. A draft preview cannot mint an entitlement or points. Existing programme rule changes preserve accepted promises and relevant versions.

Customer sees rewards in the business's private For you section and Activity. **Keep your rewards handy** → clear preview showing the actual business/programme/current progress → eligibility/access check → official platform Add to Wallet button → provider-controlled add flow → return with truthful state. Show the appropriate platform first but allow a choice/help. No marketing checkbox required to add a pass, no app-install gate, and no public profile QR exposing a person's membership.

Desktop provides an appropriate secure phone handover. An optional requested email/link is purpose-limited; personal issue links require authentication or a narrow expiring verified flow. Never put a full personal save JWT in a public QR/share card. Opening the provider URL records action started, not proof saved on the device. Installation/provider-save evidence is distinct from issued entitlement. Duplicate add/reissue uses stable identity where supported rather than creating multiple earnable accounts.

## Visual rules and customisation

Taplo controls its own preview/round-corner task sheet, neutral body, merchant accent, asset crop and explanatory copy. Wallet providers control system add screens and supported pass fields/layouts. Do not promise that Apple/Google pass UI adopts all three Taplo popup families or arbitrary CSS. Use official badges under current brand rules; no recoloured imitations.

Editable: approved logo/wordmark, programme title, supported image treatment, a few contrast-safe colour presets, permitted short explanatory line and customer help route. Generated: true programme/issuer/business relationship, current points/stamps/status, terms link/version, safe membership reference and actual redemption code. Wordmark containing the name is shown once; absent logo collapses to typography, never invented initials or a mandatory circular outline. No tiny white text over a busy photo.

Keep front concise: business/programme, one progress/balance fact, membership reference and valid supported barcode where applicable. Secondary help/terms belong in appropriate provider detail fields, not a paragraph crammed into the front. Test light/dark/system appearance, long name, large text, missing images, disabled programme, stale balance and both providers' rendered pass results. Open WALLET-AND-WIDGET-REFERENCE.html for a selected surrounding composition, not a signed native pass or final provider rendering.

## Reward updates and redemption

Authoritative business event → one append-only reward ledger mutation → new pass projection revision → durable update job → provider acceptance/retry → last verified update state. A delayed push cannot alter the ledger. Granting/refunding/reversing/redemption retries use stable idempotency and proper concurrency. A pass's cached displayed balance is never sufficient proof for a financial/reward action.

Initial redemption: QR/barcode identifies a scoped opaque pass/relationship reference; authorised Studio staff scans/opens the redemption task, server checks current business/programme/entitlement/balance and returns the permitted reward. Staff confirms under their permission; atomic redemption prevents reuse/concurrent double spend. Display only relevant customer context. Public business QR, static NFC URL and personal redemption code are separate token types.

Static codes/screenshots can be copied: possession alone must not grant account access or redeem high value. Depending on actual risk, require a current in-app challenge/customer confirmation or other supported higher-assurance flow; do not claim a cached Wallet barcode rotates securely on a precise schedule without tested provider capability. No offline redemption at launch, no decrement only on the phone and later guess at reconciliation. Network failure means show Needs connection and a safe operational alternative; do not display success.

Apple contactless VAS and Google Smart Tap are optional separate programmes with entitlement/terminal/merchant prerequisites [P5–P6]. Buying ordinary NFC tags does not enable wallet-to-terminal loyalty tapping. Default launch redemption remains the supported server-validated scan flow; research/price actual NFC readers and provider rights before offering tap redemption. Taplo physical-card URL writing remains in its separate NFC lifecycle.

## Lifecycle and failure ownership

States: programme draft → ready → active → paused → closed. Pass entitlement eligible → issued → active → suspended/expired/voided; provider projection jobs queued → updating → accepted/needs_attention. Track device installation evidence separately and never infer removed-from-all-devices from a database update.

Customer removes pass: device/provider installation state changes where observable, ledger/account remain. Customer loses phone: revoke sessions, restrict/replace relevant token under authorised recovery; do not issue a second independent reward balance. Business changes programme, leaves Taplo or is suspended: preserve lawful promises, appropriate support and source history under reviewed exit, then update the pass as supported. Deleting personal data follows purpose/obligation retention, not an uncontrolled purge of every ledger reference.

Revocation/update delivery can be delayed or unavailable; an old visual card may persist on a device. Server validation rejects a revoked entitlement regardless of the displayed card. Credential expiry is monitored ahead of time; Apple says installed passes can remain while signing/update ability is affected by expiry, so renewal is an operations dependency rather than a decorative certificate task. [P1] Invalid registration/push tokens are removed appropriately. Pending update and rejected class/object need an owner-visible repair path and restricted Console diagnostics.

Console shows issuer/environment, actual readiness, pass ID safely masked, source/programme revision, last job/provider outcome and reason. Permitted actions: scoped reconcile, retry valid update, investigate failed issue, authorised reissue/revoke. It cannot arbitrarily add reward points or export signing secrets. Reward adjustments remain separately scoped with reasons/audit.

## Cost, privacy and release evidence

The Apple developer account is already a shared annual account cost, not another fee per merchant. Google issuer and cloud/service conditions, signing/storage/update infrastructure, monitoring and maintenance require actual cost/terms confirmation; no unverified per-pass fee or unlimited free guarantee is inserted. Existing Pro entitlement does not prove service costs are fully measured. Notification/contact and Wallet-specific provider settings remain distinct from marketing consent.

Rehearse real iPhone/Android issue/add/reopen/update, private guest handover, no related app, duplicate add, partial refund, concurrent redemption, revoked/lost pass, offline screenshot, merchant exit, provider demo-only/rejection, expired certificate, service-account rotation and device registration privacy. Select exact payload/API versions and validate pass art in real Wallet before approval. No local HTML preview is evidence those provider flows work.

P1 https://developer.apple.com/wallet/get-started/ ; P2 https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes ; P3 https://developers.google.com/wallet/retail/loyalty-cards/web ; P4 https://developers.google.com/wallet/generic/test-and-go-live/request-publishing-access ; P5 https://developer.apple.com/documentation/corenfc/nfcvasreadersession ; P6 https://developers.google.com/wallet/smart-tap/introduction/pass-configuration . Current primary guidance checked 3 November 2026. Generic-publishing examples inform issuer readiness; final loyalty-specific programme terms/scope must be confirmed.

## Public sharing-card extension and change-message restraint

STUDIO-SCANNING-BUSINESS-CARDS-AND-HARDWARE defines Core+ owner/team public business-card passes separately from Pro+ customer loyalty passes. Studio phone scanning is the default customer reward operation; no extra terminal needed. Wallet change messages are reserved for appropriate time-critical pass updates, never used as a marketing broadcast channel. Current Apple HIG/WWDC26 pass-design guidance informs supported art/layout, with older-device fallback and actual provider rendering still to verify.
