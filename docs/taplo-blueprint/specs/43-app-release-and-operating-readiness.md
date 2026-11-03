# App release and connected operating readiness

Current continuation · 2.6: access, repository/domain, native release, rewards/Wallet/widget/scanner and launch decisions are consolidated in the new root documents linked from START-HERE. These resolve earlier open method/binary/domain questions; actual implementation/provider/legal evidence remains required.

Status: release architecture and acceptance plan, not a claim that apps have been implemented or submitted.

Preserve three product environments: Taplo for customers, Taplo Studio for owners and Console for operations. Their delivery channels can include web and native mobile. An owner-native Studio capability is recommended for consistent NFC writing; the customer app provides repeat Activity and related convenience. Current default: separate Taplo and Taplo Studio native binaries sharing appropriate packages and backend identity; Console remains web-only. Audience/task evidence may revise this, without duplicating identities.

## Shared app contract

Use the same authoritative business, offer, booking, payment, reward, accessory and support records as the web. Mobile caches are versioned representations. Show stale/offline state, forbid unsafe financial confirmation offline and reconcile retries. Secure tokens use platform-appropriate storage and revocation; deep links recheck permission and return to the intended record after sign-in.

Native bridges cover NFC, Wallet, secure storage, push and share with documented capability/fallback semantics. A web wrapper is not sufficient evidence that these features work or that a store will approve it. Universal/App Links require verified domain association and tests on actual devices. Keep a platform-controlled link domain so customer-owned domains do not each become an unplanned native-association dependency.

## Release evidence

| Journey | Evidence needed before offering it |
| --- | --- |
| Business page → popup → purchase/booking | Correct real records, totals, availability, confirmation and customer/owner updates |
| App installation/opening | Published store destination, installed/uninstalled links, sign-in return and supported fallback |
| Wallet | Real signed pass, provider publishing access, add/update/revoke scenarios and secure redemption where offered |
| NFC | Real hardware sample, claim/ownership checks, supported device read/write, QR and interrupted-session recovery |
| Domains | Test/live boundary, actual registrar order reconciliation, verification, HTTPS, renewal and transfer/release path |
| Notifications | Permission choice, correct recipient, delivery state, deep link, preferences and duplicate protection |
| Support | Contextual cases, appropriate permissions, deadlines, incident visibility and authorised recovery |

## Store, privacy and payment preparation

Maintain bundle/package identifiers, signing ownership, app association files, environment-separated credentials and secrets rotation. Prepare honest store descriptions/screenshots, support/privacy URLs, account deletion, permission purpose text, Google Play Data safety and reviewer access. Check current provider/store requirements at submission; requirements and geography change. [R1–R2]

Classify payment types before embedding checkout: physical goods/services, digital content consumed in-app, merchant SaaS subscriptions and regulated/stored-value features can have different store/payment requirements. Do not assume the same web payment flow is permitted for every SKU in every native distribution/region. Record the chosen supported scope and obtain specialist/provider review for financial or regulated obligations.

Use internal/device builds and beta distribution, then a staged release with crash/error monitoring, backend compatibility gates, support cover and rollback/kill-switch strategy. Backups and restore, migration/reconciliation, credential expiry, Wallet signing expiry and registrar balance/renewal alerts need named owners.

Acceptance: run complete real-device journeys against a production-like environment and provider test modes, then a controlled authorised live verification where appropriate. A release is ready because these connected outcomes work and recover, not because each screen has been drawn. Current documentation and prototype checks do not substitute for that evidence.

Sources: R1 https://developer.apple.com/app-store/review/guidelines/ ; R2 https://support.google.com/googleplay/android-developer/answer/10144311 and https://support.google.com/googleplay/android-developer/answer/13327111 .
