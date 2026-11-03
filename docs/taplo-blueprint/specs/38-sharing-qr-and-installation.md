# Share sheets, QR codes and app installation

Status: recommended end-to-end interaction contract. Depends on: canonical public routes, private access and app links.

The public Share sheet uses the same neutral rounded task surface as product details. Show a clear business/offer identity, correctly encoded QR, concise destination and Copy link/Share actions. Preserve the merchant's accent in restrained places; keep the QR high contrast with its required quiet zone. Avoid placing decorative graphics over the code without scan validation.

Share the correct object: business, public product/service, public event, owner design preview or private activity invitation. Public sharing defaults to the preferred canonical domain. A private record requires a deliberately scoped invitation/access flow, expiry/revocation and verification; do not put personal details or an ordinary account session in its QR.

Use the browser/system share sheet where supported; Copy link and visible/selectable link remain fallbacks. Cancellation is not an error or a successful share. Clipboard denial gets a useful fallback. For image/QR downloads, use a valid generated file and predictable name, suitable print resolution and contrast checks. An analytics campaign parameter must not generate duplicate canonical pages or leak a customer's identity.

## Installation at a useful moment

Public browsing, basic buying/booking and ordinary tag use do not require app installation. Offer the relevant app after a useful action or when a native feature is needed: customer Taplo for repeat Activity, or Taplo Studio for owner work/native NFC configuration. Do not send an owner to a consumer-only app to complete a business task without a clear permitted owner mode.

Distinguish Install native app, Add to Home Screen, Save business and Add pass to Wallet. These are different actions. A PWA shortcut is not a promise of native Core NFC capability. Use current store links and official badges when published; do not simulate installation success in a browser.

Verified HTTPS app links/universal links should open a supported installed app route with web fallback. Apple documents background NFC URI/universal-link handling; Android documents trusted App Links. Installation does not automatically preserve arbitrary deep-link context: use an explicit, secure resume mechanism and let the person reopen the pending task if automatic continuation is unavailable. [A1–A2]

Acceptance: public links work installed/uninstalled, signed-in/out and on desktop. Copy succeeds or offers a fallback. Native share cancellation preserves state. A QR scans after printing. A customer is not trapped behind an install wall. Wrong-app or expired handover returns to an understandable web path.

Sources: A1 https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading ; A2 https://developer.android.com/training/app-links .
