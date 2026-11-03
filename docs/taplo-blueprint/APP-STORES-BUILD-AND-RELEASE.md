# Taplo · App stores, builds and release logistics

Working edition 2.6 · 3 November 2026. Deepens spec 43 with current supplier/store rules. Two native products are the working direction: Taplo for customers and Taplo Studio for owners/members; Console stays web-only. Both iOS/Android projects share backend truth and suitable packages, not identities/data copied per app. Scope is blueprint construction; no enrolment, purchase or submission occurred.

## App stores distribute the apps; the backend runs separately

Use Expo/React Native for each mobile app, EAS Build/Submit as the working build/distribution service, and real-device development builds/TestFlight/Play testing before public releases. Production API, data, jobs, public web and monitoring continue on their selected infrastructure. An App Store/Play listing does not host Neon, Stripe webhooks, calendar sync or future reminder jobs.

The native product must provide actual native-quality tasks and supported device features, not merely wrap an unfinished website. Taplo: browse/save/Activity/business task access and relevant notifications/Wallet/share. Studio: today's work, bookings/orders, scoped staff tasks, updates and supported NFC configuration. Full editing remains available through the responsive Studio website; do not declare every desktop control a launch-native feature without designed/tested scope.

## Company account logistics and costs

| Item | Current published anchor | Working responsibility |
| --- | --- | --- |
| Apple Developer Program | US$99/year, local pricing where offered | Legal organisation account, enrolment authority/D-U-N-S/domain work contact and company ownership |
| Google Play Console | US$25 one-time registration | Organisation verification, D-U-N-S and functioning public/contact facts |
| Expo EAS Starter | $19/month plus usage; retrieved $45 build credit | Initial planning tier; actual build/update volume and team needs verified |
| Backend/database/messaging | Separate selected provider invoices | Stores do not replace these services |
| Physical test devices/security/release labour | Not quoted | Explicit budget; simulator-only checks insufficient |

At assumed £0.80/USD, Apple is approximately £79.20/year, Google £20 once, and EAS Starter £15.20/month before tax/FX/overages. These are account/service anchors, not fees per merchant. Do not double the developer-account fee just because two apps exist in the same eligible organisation. Extra binaries, tests, updates/support still consume real build and labour capacity. Add/reconcile these costs in runway/shared operating budgets rather than pretending they were already in the £20 database estimate.

Use the actual Taplo legal entity, not an invented company name or an agency/friend's personal store account. Organisation applications need verified facts; D-U-N-S lead times can delay publication. Apple/Google requirements differ; do not assume Apple's timings apply to Google. Individual-account testing requirements must be checked if that account type is actually used; the organisation choice does not eliminate Taplo's own test plan. Keep contacts/agreements/annual renewal current and account-recovery ownership documented.

## One release identity per product/platform/environment

Maintain a registry for app display name, owner, bundle ID/Android application ID, store app ID, Expo project ID, package version/build number, supported OS/SDK, signing keys/certificates/profiles, Apple team/services IDs, Google OAuth clients, push credentials and associated domains. Final IDs use the actual owned namespace and are reserved deliberately; no IDs are registered by this document. Do not casually rename permanent production identifiers after publication.

Manage secrets through approved signing/CI services with backups/recovery, authorised roles and rotation. Public client configuration contains only public identifiers; Expo public environment variables cannot hide a Stripe key or backend secret. Separate development/staging/production endpoints/signing/deep links. Native dependencies require a new compatible build when necessary; over-the-air updates cannot introduce arbitrary new native permissions or bypass store review. Runtime/version compatibility gates are explicit.

## Login, privacy and account deletion

Taplo/Taplo Studio offer Apple, Google and email-code sign-in as defined in SIGN-IN-IDENTITY-AND-RECOVERY. Apple's current login guidance describes the required equivalent privacy-preserving option when applicable; do not assume a business-app exception covers the customer app [S1]. Register/configure native/web provider clients and callback domains intentionally; a web OAuth setup alone does not prove native sign-in works.

Maintain actual Apple privacy disclosures/privacy manifests/required-reason APIs where applicable and Google Play Data safety from the real SDK/network/data inventory. Claims must match analytics, support, maps, email, payments, crashes and app behaviour. Location, camera/photos, push, biometrics/NFC and tracking permissions appear only for a relevant task with a useful denial path. Use system pickers/minimal access where possible; no background location or contact-book import just to improve marketing.

Account deletion must be initiated inside apps that support account creation, plus the applicable public web route required by Play [S2–S3]. Provide actual deletion/status/auth revocation and purpose-specific retained-obligation handling. A request that only deactivates login is not described as complete deletion. The route remains reachable without downloading/reinstalling. App-level device permissions, marketing preferences and person/business deletion are distinct.

## Payment eligibility per offer, not one universal Stripe button

| Offer/payment type | Working native policy boundary |
| --- | --- |
| Physical product; barber/repair service consumed outside app | Stripe merchant checkout where eligible under actual store/provider rules |
| Real-time 1:1 remote session | Separate reviewed mode: Apple person-to-person rule; Google's conditions include two individuals and no replay in Play apps |
| Online group session, recorded course/digital download, in-app digital membership | Store-specific digital-goods/billing assessment before native purchase; not assumed Stripe-eligible |
| Taplo software subscription/paid feature/SMS pack | Separate app/store/region review; do not silently expose web Stripe upgrade inside a native companion |
| Physical NFC accessory/domain service | Assess actual SKU/supply and app context, not automatic same treatment as software upgrade |
| Rewards/pass/gift-value product | Separate liability/payment/store assessment; no stored-money wallet implied |

Current Apple rules distinguish outside-app goods/services and real-time individual versus group digital services. Google has its own billing conditions [S1, S4]. Region-specific programmes/entitlements can differ; do not generalise a US/EEA allowance to UK or other storefronts. The authoritative purchase-eligibility matrix must use platform, storefront/country, SKU type, delivery mode and actual permitted route/version. An AI classifier or category name alone cannot decide it.

Initial conservative Studio native scope is an operational companion: access existing entitled workspaces; no native SaaS upgrade/text-credit purchase or external-buy CTA until the exact distribution/policy mode is confirmed. Full web Studio billing remains available through ordinary web use. Do not add a hidden webview/link to evade store rules, and do not claim companion status automatically guarantees approval. Relevant digitally consumed offers need a separately approved native route before publication there; preserve lawful website scope without misleading app availability.

## Release packet and workflow

1. Resolve entity/account authority, product scope, payment matrix, actual backend contracts and supported region/device list.
2. Build device-tested development versions. Verify auth/Apple relay, payments/3DS, booking concurrency, private links, messaging preferences, offline state, Wallet and NFC where offered.
3. Prepare real screenshots/icons/descriptions, age/content declarations, privacy/support/delete URLs, permissions and accessible guidance. No fake review counts/downloads or unfinished placeholder capabilities in store listings.
4. Supply reviewer accounts/instructions and a functioning review environment with safe realistic data. Public email OTP cannot require a reviewer to access a real customer's inbox; arrange permitted review access without a backdoor available to all users. Explain hardware/provider prerequisites and regional payment differences.
5. Run TestFlight and Play internal/closed testing as applicable; fix material failures, check actual submission requirements/target SDK at release time and submit each product/platform intentionally.
6. After approval, use controlled release/phased rollout where supported; monitor crashes/auth/provider errors and named support cover. Store review/approval time is not a promised fixed number of days.
7. On incident stop rollout/release affected server capability, communicate, repair compatibility and issue replacement builds as needed. Store distribution cannot guarantee instantly downgrading binaries already installed.

App build and API version coexist. Backend changes support older installed clients until a deliberate deprecation/security gate. Push payloads carry minimal opaque context; opening rechecks authorisation. Invalid/duplicate/out-of-order notifications do not create bookings or change money. Denying push never cancels a user's transaction or forces marketing signup.

## Evidence required before release is called ready

Signed build and actual-device coverage, store-account/configuration ownership, verified links/installed-uninstalled fallback, sign-in/recovery/MFA by method, accurate privacy/deletion behaviour, applicable native purchase classification, provider webhooks/reconciliation, permission denial, lost connectivity, account switch/shared device, accessibility, backend compatibility and support/incident readiness. These are specified requirements, not passed production evidence.

S1 https://developer.apple.com/app-store/review/guidelines/ (current revisions include October 2026); S2 https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/ ; S3 https://support.google.com/googleplay/android-developer/answer/13327111 ; S4 https://support.google.com/googleplay/android-developer/answer/10281818 . Account sources: https://developer.apple.com/help/account/membership/program-enrollment ; https://support.google.com/googleplay/android-developer/answer/6112435 ; https://support.google.com/googleplay/android-developer/answer/13628312 . Build source: https://expo.dev/pricing and https://docs.expo.dev/build/introduction/ . Checked 3 November 2026; policy/price/SDK requirements rechecked at actual submission.
