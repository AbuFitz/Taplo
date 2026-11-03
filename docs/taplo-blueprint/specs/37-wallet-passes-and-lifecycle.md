# Apple Wallet and Google Wallet

Current continuation · 2.6: access, repository/domain, native release, rewards/Wallet/widget/scanner and launch decisions are consolidated in the new root documents linked from START-HERE. These resolve earlier open method/binary/domain questions; actual implementation/provider/legal evidence remains required.

Status: researched capability design. These are passes, not payment cards. NFC Wallet redemption is a separate integration from ordinary Taplo URL tags.

## Purpose before appearance

Define the actual pass purpose: a merchant loyalty/membership card, eligible booking/event admission, or another supported useful pass. A generic business/contact pass is an option to assess against each provider's supported use and policies; do not assume every saved web link belongs in Wallet. Saved businesses inside Taplo remain useful regardless of Wallet eligibility.

A pass has an issuer, business, type/template, stable pass identity, holder/entitlement where personal, current status and version, permitted display fields, barcode reference and update state. The authoritative reward balance or booking remains on Taplo; a Wallet view is a distributed presentation of it.

Apple documents signed passes distributed from web/email/apps and updates using the same pass identity; customers need not install a related app. Google documents issuer onboarding, pass classes/objects and signed Add to Google Wallet links. Publishing access, signing credentials and current badge rules belong in implementation/release requirements. [W1–W4]

## Customer journey

Eligible business/Activity context → preview the actual card and what it is for → verify access if personal → official Add to Wallet action → OS/provider-controlled add screen → return to Taplo. On desktop, offer a secure phone handover, appropriate link/email if requested, and ordinary Taplo access. Detect capabilities to recommend a platform; retain a user choice and a useful unsupported-device state.

Taplo designs the surrounding rounded sheet, readable neutral surface, business accent, card preview and explanation. Apple/Google control their system add screens; do not promise they can be recoloured to match a merchant. Use official Wallet buttons/assets with prescribed treatment, rather than arbitrary recoloured imitations. Never show “Added” just because an outbound link was opened; use a truthful completion/return state.

## Updates and redemption

A completed eligible visit, refund, reward redemption or booking cancellation updates the source record, then queues the appropriate pass update. Track retries and stale presentation; the server remains authoritative during redemption. Account deletion, membership expiry, business closure, stolen passes and credential rotation each have explicit lifecycle rules.

Use opaque, scoped references in barcodes. A shared screenshot must not become unrestricted account access or allow the same reward twice. Public business QR codes and personal redemption tokens are different types. For higher-value redemption, require a current authorised validation flow; static possession is insufficient.

Apple NFC-enabled passes require a special entitlement. Google's Smart Tap needs compatible terminal/provider arrangements. These are not delivered merely by purchasing NTAG cards. A barcode/QR-based useful first version can precede those optional programmes. [W5–W6]

Acceptance: add/reopen/update an eligible pass on supported iPhone/Android devices; cancelled booking/refund updates are reconciled; duplicate redemption fails safely; signing-expiry and provider outage have operational ownership. No pass contains another merchant's private customer data.

Sources: W1 https://developer.apple.com/wallet/get-started/ ; W2 https://developer.apple.com/documentation/walletpasses/distributing-and-updating-a-pass ; W3 https://developers.google.com/wallet/generic/web ; W4 https://developer.apple.com/wallet/add-to-apple-wallet-guidelines/ and https://developers.google.com/wallet/generic/resources/brand-guidelines ; W5 https://developer.apple.com/documentation/walletpasses/pass/nfc-data.dictionary ; W6 https://developers.google.com/wallet/smart-tap/introduction/overview .
