# 57 · Signup, account and preference experience

Current continuation · 2.6: access, repository/domain, native release, rewards/Wallet/widget/scanner and launch decisions are consolidated in the new root documents linked from START-HERE. These resolve earlier open method/binary/domain questions; actual implementation/provider/legal evidence remains required.

Edition 0.9 · Customer onboarding is distinct from business creation. Account creation supports a task rather than becoming a barrier to browsing.

## Entry routes

Support app launch, public web browsing, direct business link, NFC/QR, shared offer, booking/order notification and private invitation. Public entry renders useful content before demanding account creation. A private link explains the verification needed and returns to the exact authorised record. An expired or already-used link provides a safe resend/recovery route without revealing another person's account. App installation is optional for ordinary public browsing and eligible web transactions.

Customer signup requests only information needed for identity/recovery and the current task. A transaction may separately require fulfilment/contact details. Marketing consent is separate, optional and unbundled. Guest flows, where offered, explain how to retrieve the transaction and claim it later. Verification challenge, resend/cooldown, wrong contact, changed device, expired code, rate limit and no-delivery all have readable states. The current method/security choices are in SIGN-IN-IDENTITY-AND-RECOVERY; this earlier UX chapter does not override them.

After success: restore pending intent first. If no pending task, show the ordinary customer experience with a calm welcome, optional area and theme setup, and optional interests only if useful. No forced contact-book import or compulsory location/notification permission. Permissions appear when the feature needs them. A customer must never accidentally create a business while trying to save a barber. “Use Taplo for your business” is a deliberate separate route.

## Settings structure

| Section | Content | Visual rule |
| --- | --- | --- |
| Profile and sign-in | Name, verified contacts, authentication/recovery, active devices as supported | Clear verification state; consequential changes require appropriate re-verification |
| Appearance | System / Light / Dark; scope/default choice | Small preview, immediate visible selection, no merchant-design controls |
| Language and region | Display language, timezone presentation, currency context | Never convert a merchant's actual charge silently |
| Addresses | Delivery/service addresses and explicit default | Clear purpose and deletion; never public discovery location by implication |
| Notifications | Bookings/orders, messages, rewards, marketing; channel/device permission | Distinguish device permission from account subscription |
| Privacy and personalisation | Search history, suggestions, data requests, blocked/report routes | Clear controls and consequences, no deceptive toggles |
| Wallet and passes | Eligible passes and update/help actions | Server entitlement and installed-pass state are distinct |
| Payments | Supported payment preferences and receipts | No raw card data in ordinary app records |
| Help | Contextual issue, current case, accessibility/contact routes | Carry authorised record context; avoid making users retype the whole issue |
| Account actions | Export/request deletion, sign out | Explain scope, active commitments and retained records as applicable |

Studio settings additionally cover business/team/locations, policies, payments/payouts, domains, NFC, notifications and capability settings with role checks. Personal appearance is not hidden among business brand controls. Console settings separate operator preference from organisation/access administration.

## Permission moments

Location: ask after Use my location; manual entry remains. Notifications: explain a useful reminder before OS prompt; denial does not block purchase. Camera: ask at scan/upload action and offer supported alternatives. Photo library/file access: limit to selected content where supported. NFC/native capability: check compatible task/device and offer factory-configured link/QR fallback. Wallet: eligible pass preflight then official add flow, with a reliable return. Each prompt has rationale, refusal recovery and a Settings route without repetitive nagging.

## Account edge cases

Handle contact changes with transaction continuity; different guest contacts cannot be merged merely because names match. Existing account detection must not leak sensitive membership information. Interrupted verification preserves safe non-secret form state. Sign-out, deletion request, pending refund and recurring commitment have explicit consequences and user-facing next steps. Business staff membership changes do not delete the person's customer activity. Switching personal/business contexts has clear identity and return controls; no ambiguous global role toggle that changes the current merchant silently.
