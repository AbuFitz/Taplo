# 106 · Link preview images and public metadata

Working edition 1.9 · 3 November 2026 · Adopted link-card system for marketing and merchant content. Extends 36–38, 40, 48, 103 and 105. No live tags/assets or real social posts changed in this edition.

## What it is

The image/title/description shown when sharing a URL is a link preview card. Open Graph defines core title, type, image and canonical object URL metadata in the document head. [R84] Platforms choose how/when to display it and may crop/cache/omit fields; Taplo cannot guarantee identical rendering in every message client.

## Route-to-card rules

| Route family | Public title/description | Image identity | Privacy/index rule |
| --- | --- | --- | --- |
| Taplo homepage | Clear Taplo proposition | Taplo mark/name and concise message with accurate product composition | Public marketing canonical |
| Capability/category page | Specific task/use case, truthful scope | Related designed product composition and concise page label | Distinct public content; no cloned generic title |
| Pricing | Current package summary, no misleading all-in claims | Simple brand-led pricing/topic image; volatile amounts optional | Prices only if synchronised to published pricing version |
| Guide/article | Actual editorial title/summary | Topic image and clear source identity | Public original article |
| Business mini-space | Merchant name once, authored concise description | Actual approved logo/cover or typography-led merchant name | Only published public facts; no private For you capture |
| Product/service/class | Offer title with merchant context and stable factual description | Real authorised offer image or designed merchant/type fallback | Public current route; availability not promised by cached card |
| Team professional | Person with actual merchant association | Approved public portrait/logo context | Profile published and media rights valid; former staff redirects handled |
| Explore collection | Curated actual place/category meaning | Appropriate public collection composition | No arbitrary private coordinates/filter tokens |
| Booking/order/payment/message/account | Generic Taplo secure-link title only | Generic safe Taplo card or intentionally no rich image | Protected; noindex where appropriate; never include customer facts/amounts |
| Draft/preview/support case | Generic access/preview context | Safe generic card only | Access controlled, not public indexed business content |

## Visual design

Generate a high-quality landscape raster, default 1200×630, with deliberately generous crop-safe content. LinkedIn's current help describes a 1.91:1 frame and 1200×627 image; test the slight crop rather than claim a universal exact-size requirement. [R88] Use a public supported raster format such as PNG/JPEG with appropriate content type; SVG is not the default social-card delivery format.

One principal brand identity, strong short title, controlled accent and enough contrast at small size. Do not place a full tiny webpage screenshot with unreadable text inside every card. Business mark is contained, no forced round outline/background; wordmark avoids adjacent repeated name. No logo/cover gives an intentional type-led card, never generated initials or a fake stock shopfront. Portrait/offer image has safe focal crop; user can choose an approved public asset/focal point.

Merchant card family matches the business's chosen palette in controlled areas, with neutral text regions. It is not a screenshot of the signed-in view or a clone of the WhatsApp/LinkedIn interface. Official provider marks retain their own rules. Test long names, no images, dark/light logos, translated text, square crops, blocked images and low-resolution display.

## Metadata contract

Server-resolved public metadata includes document title/description/canonical and Open Graph title/type/image/url plus useful image dimensions/alt and appropriate large-image card compatibility fields where supported. Values are escaped/validated; asset URLs absolute HTTPS, publicly retrievable without expiring login tokens/cookies or JavaScript execution. The metadata request is tenant/route/public-revision scoped and cannot inherit another merchant's cached output.

Head tags exist in the actual crawler response, not only after client hydration. Route fallback must not return the homepage card for every valid product URL or a previous tenant's title on an error. A missing/deleted merchant/offer has the correct safe status/metadata and no misleading old price or private record fallback.

## Generation, revision and caches

Publication selects public facts/assets → render deterministic image from trusted layout → validate asset/access/dimensions → store immutable versioned public image → publish matching metadata/route revision. Failed generation uses a safe already-valid merchant or platform fallback; do not publish an empty/broken image reference. Background regeneration cannot swap tenant assets.

Use revisioned image URLs so a changed logo/title gets a new asset. Update metadata and invalidate relevant Taplo caches, but do not claim third-party caches instantly refresh. LinkedIn Post Inspector can refresh retrieval for new posts; official help says existing post previews remain unchanged. [R89] Document this honestly in Studio Share preview/diagnostics.

Owner Sharing → Link preview shows an approximation, public title/description, image asset/crop, Last generated/revision and Regenerate if authorised. Changes affect published metadata only through the declared save/publish policy. No arbitrary HTML/CSS/remote URL execution in the rendering service. Uploaded images/URLs follow asset validation and safe-fetch rules, with rendering time/resource limits.

## Link unfurling is not a customer action

Messaging/security crawlers may request links before a person opens them. A GET used to generate a preview must not cancel a booking, spend a single-use financial authority, accept a quote or charge money. Sensitive action requires actual authorised interaction. Private link tokens are redacted from logs/analytics/referrer; generic preview responses never reveal who booked, what they bought, balance, health/intake or staff-only notes. No public image is generated from those records even if the URL is unguessable.

## Acceptance and support

Inspect raw unauthenticated HTML/head and public image fetch for homepage, feature, business, offer, professional and private links. Test custom domain/canonical, query campaigns, moved handles, expired/archived routes, no image, logo change, failed renderer, tenant-cache isolation and bot prefetch. Check LinkedIn Post Inspector and appropriate real client/device behaviour without publishing messages unless authorised. Contrast/typography/crop require visual inspection, not merely presence of og:image.

Console diagnosis shows route/public revision, chosen safe metadata/image, render/access status and known external cache behaviour. Operators cannot expose private data or forge a verification badge to improve a card. This edition specifies the system; final card artwork, live tags/generator/crawler tests remain required.
