# 77 · Complementing an existing business website

Edition 1.0 · Added 3 November 2026. Taplo can be the business's compact action and return experience while its existing website remains its main information/brand destination. A full website migration is optional, not an onboarding prerequisite.

## Clear value without demanding replacement

Recommend three setup intentions: “Use Taplo alongside my website”, “Use Taplo as my main business page”, and “Start with one useful action”. These change guidance and initial composition, not the underlying merchant identity. A business with a substantial existing site may want a fast booking, enquiry, native shop, staff link, reward or NFC experience without redesigning that site.

| Existing business situation | Useful Taplo role | Entry/return |
| --- | --- | --- |
| Good website; booking happens through messages | Taplo services, eligible booking/request and private Activity | Website Book button → Taplo task; clear business identity and Back to website |
| Good website; limited mobile/social conversion | Compact shareable action space | Social bio, NFC, QR and website action link → same merchant mini-space |
| Informational site; wants selected goods | Taplo native catalogue, bag, payment and fulfilment | Shop link or approved embed → Taplo-owned commerce for those offers |
| Established shop with an existing checkout | Optional separate Taplo capabilities such as enquiry or rewards | Existing shop stays authoritative for its transactions; no implied stock/order sync |
| Multi-professional business | Staff profiles and professional-specific booking | Staff social link → merchant-scoped profile and eligible staff selection |
| Regular customer business | Saved relationship, bookings/orders, messages, rewards/Wallet | Useful direct link or optional app; installation not required |

Native Taplo commerce remains the intended commerce engine for Taplo transactions. This direction does not become a generic connector that imports every external shop's orders/payments. External website links are ordinary destination links, not a promise of integrated inventory, refund or customer history. Businesses choose the capabilities they want to adopt and the responsibilities are explained.

## Domain and navigation composition

Keep the primary website/domain intact. Offer the standard Taplo address initially; optional merchant subdomain such as book.example.com or a suitable custom host can serve Taplo without replacing example.com's website. Connecting a subdomain follows ownership, DNS, HTTPS and tenant-routing contracts. Do not alter the root domain, nameservers or email DNS as a shortcut. Imported website URL is not proof of domain ownership.

Taplo page can contain a restrained “Visit our website” link. On a directly linked booking/product flow, show the merchant and a useful website return, without loading a duplicate full website header/navigation. Customer can also manage the task later in Activity. Return destinations must be validated merchant-owned/approved URLs; never reflect an arbitrary attacker-supplied redirect. A return from an external site cannot be assumed to restore that site's private session or exact internal state.

Start website integration with links/buttons and useful deep URLs. Embedded widgets are an optional additional implementation surface, requiring separate mobile height/keyboard, cookies/privacy, accessibility, third-party storage, payment challenge, browser history and fallback testing. A broken embed must have an “Open booking/shop” path. Do not promise an arbitrary site can accept a fully integrated embed without checking its platform and security policy.

## One authority per operational commitment

Ask what currently handles each adopted capability. For Taplo bookings, Taplo's booking/resource model owns the commitment; any external-calendar import is an explicitly supported availability input, not an assumed two-way booking engine. Existing appointments must be migrated/reconciled or accounted for before enabling competing public availability. An iframe or copied timetable does not prevent double booking.

For goods, decide which stock/locations are sold through Taplo. Reusing the same physical units in two unconnected selling systems can oversell; require an actual supported synchronisation design or deliberate stock allocation. Do not label them synchronised because a product image was imported. Customer-facing terms, seller, payment status and support route follow the actual transaction system.

## Search/SEO and identity

The original website may remain the primary broad information destination while Taplo has distinct useful task/item/profile routes. Write concise task-relevant Taplo content rather than cloning every page. Maintain accurate business facts across destinations. Select canonical/redirect/indexing rules per actual content/host; do not blindly canonicalise every Taplo page to the website homepage, or claim a canonical tag forces a search outcome. Website redesign, domain change or Taplo departure must not silently break physical links and existing customer records.

## Onboarding and acceptance

“Already have a website?” → optional ordinary website link → choose what Taplo should handle → map current system/authority → enter and validate relevant facts and capability setup → preview compact page/action → publish deliberately → supply website button/link instructions and test full return/manage path.

Acceptance: owner keeps primary website and email DNS; customer books through its button with consistent merchant identity; staff social link opens the right person; no app install is required; existing website remains visitable; a product import cannot imply current stock/payment integration; switching the merchant's preferred public address preserves historical records and stable NFC/QR destinations.


Spec 79 supersedes the earlier onboarding-import suggestion: initial setup stays manually guided; any later content assistant belongs in Studio and excludes prices/operational configuration.
