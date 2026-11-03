# 48 · Identity, logo assets and brand placement

Working recommendation · Revisable · Supersedes generated initial badges and duplicate name examples in earlier concepts.

## Identity is authored, not guessed

Store merchant display name, legal entity name, optional logo asset, optional profile photo, optional wordmark asset and short description separately. No automatic initial logo, invented monogram, inferred trading name or compulsory avatar. An absent image collapses the slot cleanly; the display name remains. Studio may offer an explicit optional “Create a mark” action later, with owner approval before use. It must never silently create a brand.

Onboarding asks for a business name, then optionally an image. “Skip for now” is a complete supported path. Missing imagery does not prevent a tidy page. Do not reuse the same image as both avatar and background by default. Offer upload, replace, crop, preview, remove and accessible image description where needed. Respect original aspect ratio for wordmarks; do not force a wide logo into a circle. Review light/dark visibility, transparent padding, illegible uploads, long names, non-Latin scripts and loading failure. Asset file checks and safe processing remain implementation requirements.

## Placement contract

| Context | Primary identity | Secondary information | Avoid |
| --- | --- | --- | --- |
| Explore window | Display name once; optional actual mark | Area or online/mobile mode | Initial avatar plus duplicate wordmark/title |
| Business page | Wordmark OR readable name as principal heading | Genuine symbol/photo only when it adds information | Logo spelling the name followed by the same large heading |
| Business popup | Compact merchant context once, then task title | Selected offer, fulfilment or date when relevant | Taplo logo + merchant avatar + merchant name repeated in body |
| Taplo navigation | Taplo identity once at app level | Current location/account as needed | Merchant branding replacing global navigation colours |
| Studio | Studio identity and active business switcher | Current task/page title | Separate persistent logo/name blocks for the same business |
| Console | Console identity; explicit case subject | Merchant/customer in case metadata | Impersonating merchant interface without a clear support context |
| Activity row | Merchant name and transaction identity | Status, next action, date | Repeating merchant name as both title and subtitle |
| Message thread | Recipient identity in thread header | Related booking/order attachment | Logo/name repeated on every bubble |
| Wallet pass | Merchant identity once on the pass | Reward/booking purpose and issuer detail where required | Adding a second marketing header to native Wallet controls |
| Share preview / QR | Business identity and destination | Useful share title | Generic Taplo title hiding whose link this is |
| Receipt/support/legal | Recognisable merchant plus required responsible entity | Reference and contact route | Hiding legally required information to reduce repetition |

A wordmark that contains the name still needs an accessible name. Avoid announcing the same name twice: decorative image has empty alt when adjacent text names it; wordmark-only principal identity receives the full business name. Accessibility and transactional attribution take priority over cosmetic deduplication.

## Identity presentation modes

Recommend three safe options: name only; actual symbol plus name; actual wordmark. These are presentations of supplied assets, not generated logos. Owner can explicitly choose photo plus name when appropriate. Preview within Explore, direct business page, popup, message, share and Wallet contexts; never assume every uploaded asset suits every placement. Critical merchant identity cannot be hidden by decorative controls. Legal names do not replace customer-facing trading names everywhere.

## Review examples

No logo → name-only header with no empty square. Wordmark contains “FixNow” → no second oversized FixNow title below it. Two similarly named businesses → show area/context, not invented suffixes. Long name → wrap without squeezing Save or Close. Rebranded business → stable business ID and updated public identity; historical receipts preserve their issued snapshot. Failed image → readable name fallback, never broken-image icon. Imported initials → treated as explicitly supplied artwork only if owner approved it.
