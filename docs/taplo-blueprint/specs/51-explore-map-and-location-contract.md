# 51 · Explore map, coverage and location search

Working product scope · Map is part of proposed Explore. The latest inline concept demonstrates location entry/filtering; it does not yet demonstrate a real map, geocoder or verified merchant coordinates.

## One search, two views

Explore offers List / Map for local discovery, preserving query, area, categories, offer filters and selected business. List remains the default broad/mixed discovery experience. Map appears when geographic exploration is useful. Online-only results remain accessible as a clearly separate group and do not receive fabricated pins. No fresh data source or alternate catalogue for map results.

The list keeps distinctive business windows and useful offer widgets. On Map, selecting a pin opens one compact business window with a relevant offer, Save and Visit business; it is not a stack of directory cards over the whole map. Opening the merchant keeps the return context. Map/list, selected point, zoom and query survive this visit. Selected point and result window are linked for keyboard/screen reader use; a complete accessible list is always available.

## Location types

| Business mode | Public map treatment | What the customer is told |
| --- | --- | --- |
| Public premises | Verified visitable branch point | Address, opening/appointment rules; directions when suitable |
| Multiple branches | Distinct branch records grouped under one merchant | Which branch owns the offer, availability and fulfilment |
| Mobile / comes to you | Honest coverage area, optional safe public base only if deliberately published | Eligibility requires service address/postcode check; no fake storefront |
| Private studio / home business | General area or no point according to privacy setting | Exact address released only under a deliberate policy and eligible relationship |
| Online only | Separate online section, no geographic pin | Remote delivery mode and timezone implications |
| Ships goods | Dispatch/pickup shown only if useful and public | Shipping reach does not imply local premises |
| Temporary event | Verified venue and effective dates | Date-specific availability; not permanent merchant address |

Service area differs from travel radius, visitable address and delivery shipping zone. Store these separately. A merchant can have more than one mode. Directions only target a safe public/authorised destination; never use a hidden customer job address in discovery.

## Search location, permission and privacy

Explicit “Use my location” request; permission is not required to browse. Always offer typed town/postcode and country context. Autocomplete shows distinguishable area suggestions with locality/region/country where names collide. Selecting an area defines the search centre/extent; user can change radius/area when appropriate. Denied, unavailable, timed out and approximate permission each have useful manual recovery. Do not claim precise distance from coarse or stale location. Explain why an address is requested at booking separately from optional Explore location.

Location lives in the minimum suitable scope; exact browsing position is not exposed to merchants. Do not reuse a saved delivery/home address for discovery without deliberate choice. Saved search area and precise transient GPS are separate. Permission revocation, account switch and shared-device use clear inappropriate retained context. Analytics use coarse aggregated areas where possible; retention and consent are specified before implementation.

## Moving the map and ranking

Panning does not repeatedly replace results under the user. Show “Search this area” after a meaningful viewport change; explicitly applying it commits new bounds. Distinguish pending map movement from applied search. Provide loading, count, no results, partial results and retry without clearing the previous stable view. Ignore stale request responses. Clusters expand at useful zoom; dense co-located branches remain selectable. Do not disclose private positions via clustering or raw payloads.

Map ranking and list ranking use the same eligibility rules; distance is one signal, not proof of quality. Disclose paid placement if introduced; no invented ratings, “open now”, “available today” or “near you”. Opening hours require timezone, exceptions and freshness. Mobile providers match service coverage, not distance to an assumed office. Online matching and national shipping do not imply nearby. Merchant visibility/paused status and moderation changes propagate to both views.

## Provider and release work

Choose map tiles, geocoding/autocomplete and routing providers on licensing, attribution, costs, accessibility, privacy, coverage, caching terms and native/web compatibility. Mapbox is now the working provider in [EXPLORE-MAP-PROVIDER-DESIGN-AND-COST.md](../EXPLORE-MAP-PROVIDER-DESIGN-AND-COST.md); real configuration, licensing and costs still require proof. Keep credentials restricted, geocoding behind controlled boundaries where needed, rate limits and abuse controls. Use sourced geometry/coordinates, verified addresses and proper attribution. Never draw an invented geographic map or pin sample brands at unverified addresses.

Test urban/rural density, ambiguous town names, poor network, permission refusal, approximate location, international formats, antimeridian/viewport edge cases where supported, mobile service polygons, multi-branch selection, hidden addresses, online-only queries, stale results and accessible list parity. Real map/device validation remains open work.


## Visual experience extension · 0.9

Spec 55 adds mobile/desktop region composition, marker/selection and map visual states. Atlas map frame is a layout schematic only; no provider geometry or real map implementation is claimed.
