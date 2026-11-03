# Explore: business windows and useful actions

Status: proposed customer experience, edition 0.7. The visual is an illustrative interaction concept, not a live marketplace or verified availability feed.

## Discovery representation

Explore presents compact windows into businesses: recognisable identity, honest category/location/delivery scope, restrained brand styling, one useful image and a small number of relevant offer blocks. It should not reproduce every merchant widget or load a full editable mini-site iframe per result. Nor should it reduce every business to a logo, star rating and identical booking button.

Use a safe, bounded discovery view model derived from the same business and offer records as the public page. A business can choose featured eligible offers; relevant search intent may select a better match within agreed rules. The card renderer normalises density, text limits and accessible actions while respecting coordinated merchant identity. Owner customisation must not hide platform disclosure, eligibility or essential price meaning.

Offer types stay truthful. A fixed diagnostic, from-priced product, recurring tuition package, quote-led commission and menu are different actions. Never invent ratings, open-now status, available slots, travel time or delivery eligibility to fill a result card.

## Customer choices

Search supports business names, services and products. Offer filters such as Services, Shop and Online can overlap: a business may sell products and services. Location is explicit; mobile service area, physical premises, online delivery and product shipping require different matching rules. Do not treat them as one distance field. A useful default can be broad; location permission is optional and manual input remains available.

An offer action opens the selected business/offer popup. Visiting the business opens its canonical mini-space with a contextual Back. Save is an independent, clearly labelled control; avoid wrapping the whole card in a link containing nested buttons. Customer tabs are Explore, Saved, Activity and Account until evidence justifies more. Saved is deliberate following/return access; Activity records actual transactions and requests.

## Navigation contract

Retain originating tab, query, selected filters, location, result position, pagination cursor and selected business/offer IDs. Returning from a page or closing a popup restores context. A deep link works without that context and offers a sensible business return. A private activity link verifies access and resumes its intended task.

Keep stable IDs separate from handles and display names. Opening an offer does not freeze stock or a time slot indefinitely; commitment revalidates current values and shows relevant changes. A cart is scoped to the merchant. Cross-business navigation cannot silently move goods into another merchant's checkout.

## Result states and performance

Use request cancellation/versioning to avoid showing stale search results from an earlier query. Distinguish loading, no matches, unavailable network, partial results and unavailable businesses. Preserve a useful query and retry path. Offline cached information is labelled appropriately and cannot certify current stock/time.

Bound each result's height and load photos responsibly. Use paginated/cursor results and deliberate continuation; avoid loading an unbounded full mini-site DOM for every business. Suppressed/unpublished items stop appearing in discovery promptly while legitimate private transaction records remain accessible. Sponsored placement, if introduced, is clearly labelled and does not redefine relevance silently.

Acceptance: search for an offer across mixed business types; inspect it; save the business; enter its page; return with filters/position intact; find it in Saved; later reach the same business from Activity. Try no results, no location permission, a withdrawn offer, stale price and lost connection. Record real task outcomes before treating the proposed design as proven.


Revision 0.8: specs 48–52 extend this contract. Appearance examples do not approve an app brand colour or justify generated logo marks. Map, full overlay families and feedback have dedicated contracts.
