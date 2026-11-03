# Automated SEO without changing the compact experience

Status: researched architecture recommendation. Edition 0.5. Sources checked 31 October 2026. Automation can maintain technical search foundations; it cannot manufacture genuine business facts or promise rankings.

## The key connection: a popup can have a real address

Each public business and substantive public offer has a stable, crawlable URL with meaningful server-rendered content. From the business's block/rail, the item opens as a popup using that route and preserves its return context. From search or a direct link, the same item renders as a focused branded detail surface with enough context to understand the seller and act. This does not require adding a traditional website menu or a tall catalogue grid.

Use normal anchor links with real href values for public item discovery, enhanced into the popup experience. Do not make essential product content exist only after a click handler or rely on Google swiping a carousel. Google documents that its search renderer does not interact with pages to trigger lazy content. Large catalogues need deliberate crawlable collection/pagination links, not only a JS-only View all action. [S1–S2]

## What the engine can maintain

| Layer | Proposed automation | Needed source facts |
| --- | --- | --- |
| Page metadata | Sensible title/description defaults and share images, with owner override | Business/offer name, true description, imagery and permitted location |
| Public HTML | Server-rendered identity, item details, semantic headings, meaningful links and correct status codes | Published records and actual visibility |
| Canonical URLs | One preferred public address per entity; coherent custom-domain/handle migration | Verified preferred domain and stable identity |
| Sitemaps | Eligible public URL inclusion, genuine last-modified dates, withdrawal and redirects | Publication and content change events |
| Structured data | Appropriate valid business/product/offer records where eligible | Correct entity type, price/currency/availability and required facts |
| Images | Responsive sizes, descriptive source-provided alt text or reviewed suggestions, dimensions and appropriate loading | Real images and their meaning |
| Performance | Shared asset optimisation, caching and restrained client code | Real performance measurements |
| Monitoring | Broken-link/schema checks and owner-facing search issues; optional Search Console connection | Verified property access and a secure integration |

Metadata and schema derive from the same current records as the page/popup. An offer-price edit invalidates the relevant HTML/cache/schema representations. Keep previous transaction snapshots unchanged.

## Category-aware treatment

A shop can publish Product/Offer data, including accurate variants and applicable merchant policies. Google documents requirements and eligibility for merchant listings; markup does not guarantee display. [S3]

A business with actual public premises can use an appropriate LocalBusiness type and real location information where its data meets the requirements. Google's LocalBusiness rich-result requirements include an address. A mobile or online-only business must not expose a private home or invent a storefront to fill that field. Choose truthful eligible organisation/service information and verified Business Profile treatment instead of pretending every category gets the same local enhancement. [S4]

Reviews and testimonials do not automatically qualify a merchant for search-result stars. Apply Google's review rules to the actual site/entity context; do not generate an aggregate rating from invented or ineligible material. [S4]

A tutor or consultant needs clear expertise, actual offerings, delivery mode and useful descriptions. A public class/event needs its actual dates, venue/online details and appropriate eligibility before event-specific markup is introduced. General service schema can describe meaning without implying a special Google service rich-result feature. Do not apply Product markup to every service just because it has a price.

## Custom domains, privacy and duplicates

Choose a preferred host for a business and use coherent canonicals, links and redirects where appropriate. Google treats canonical annotations as signals and ultimately selects its canonical; do not promise guaranteed consolidation. [S5]

Keep private customer activity, drafts, Studio and Console behind proper access controls; noindex is additional indexing control, not security. Cart/session/search-filter URLs need explicit indexing policy and should not flood sitemaps. Expired or withdrawn public offers need meaningful availability or correct removal status depending on the actual situation; do not return a misleading purchasable page forever.

## Human work that remains

Owners supply and verify real identity, location/service area, descriptions, credentials, images, product identifiers where applicable and policies. The engine can suggest improvements and draft wording for review. Do not auto-publish invented claims, reviews or repetitive town pages. Google's spam rules address doorway pages and scaled low-value content. Useful genuine location/service content is assessed on its actual value rather than generated for every postcode. [S6]

## Acceptance and Studio presentation

Owner-facing SEO should be a quiet “Search appearance” area: automatic defaults, a search-result preview, editable title/description and specific prompts for missing business facts. Avoid a decorative universal SEO score. Explain technical validation separately from observed search performance; never present a ranking or rich-result guarantee.

Test raw/initial HTML and Google-rendered output, crawlable links, public route reloads, selected variants, policy/price consistency, rich-result validation where eligible, custom-domain canonicals, sitemap scope and private-route exclusion. Preserve the block/popup experience through all of it.

Sources:
- S1: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- S2: https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading
- S3: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing and https://developers.google.com/search/docs/appearance/structured-data/product-variants
- S4: https://developers.google.com/search/docs/appearance/structured-data/local-business
- S5: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- S6: https://developers.google.com/search/docs/essentials/spam-policies

## Platform marketing and share preview extension · 1.9

105 adds Taplo-owned marketing acquisition/content architecture and 106 adds per-route public metadata/card generation with private-link safety. These extend merchant-route SEO without making every draft/private task searchable. SEO automation uses public facts and cannot guarantee search traffic.
