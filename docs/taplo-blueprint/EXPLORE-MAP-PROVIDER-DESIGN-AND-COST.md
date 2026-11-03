# Taplo · Explore map provider, design and cost

Working edition 2.8 · 3 November 2026. Adopt Mapbox as the working basemap/style provider, refining the older undecided statements in specs 51/55. This is a blueprint decision, not an account purchase or a live geospatial integration. Uber is a visual quality reference; no claim about Uber's supplier is made.

## Product and integration split

Web: Mapbox GL JS. Native: supported Mapbox iOS/Android SDKs through an evaluated pinned React Native/Expo integration; the exact wrapper, SDK version and billing classification must be rehearsed. A WebView is not automatically billed as native MAU. Mapbox Studio supplies a hosted custom style. Taplo supplies the merchant search index, public location/coverage projections, ranking, pins, clusters, results windows, filters and navigation. Do not call paid provider POI/category search for each Taplo merchant query or import external businesses as if they joined Taplo.

Use provider location lookup only where needed for town/postcode/address input. Merchant address/pin authoring and transient customer location search have different data licences/retention. The Search Box API says returned data is temporary; do not persist those results as merchant coordinates. Permanent geocoding requires actual permitted account/use terms, including public display/distribution scope, not only paying an endpoint. Independently supplied/authorised coordinates also need provenance and appropriate publication/privacy checks. Geocoded accuracy is not a verification badge.

## Taplo map design

Create platform light/dark styles with muted neutral land/buildings, legible roads/localities and restrained water. Default 2D and north-up keeps landmarks useful; decorative 3D/tilt is not a prerequisite. Use one platform accent for selected state, not each merchant's whole theme. Keep required provider/data attribution visible above safe-area/navigation/sheets. Review provider basemap layers/style compatibility, not a screenshot coloured over a map.

| Part | Mobile composition | Desktop composition |
| --- | --- | --- |
| Search | Compact query + chosen area, focused search view when keyboard opens | Stable top search/area and useful filters |
| Map | Main remaining viewport, unobscured place labels/recentre | Remaining workspace beside one results rail |
| Markers | Calm single point, explicit cluster count, selected outline/size plus colour | Same language linked to rail focus |
| Business preview | One bottom sheet: collapsed identity/action; expanded bounded offer preview | Selected result expands in rail; no duplicate floating card |
| State retention | Applied query/bounds/zoom/selection retained across business/offer/back | Same |
| Location privacy | Area-only representation for private/mobile businesses; no raw private point in payload | Same |
| Accessibility | Visible Map/List switch, explicit sheet controls, equivalent accessible list | Keyboard-linked markers/results and full list alternative |

Taplo-owned style tokens: light land #F4F4F1, roads #FFFFFF with #D5D5D0 boundaries, text #202124; dark land #141619, roads #30343A, text #ECEEF1; water muted #C9DCE4 / #233844. Selected accent starts Cobalt #3457D5 with tested contrasting outline/label; exact provider layer rendering and contrast remain to verify. These are proposed map tokens, not a replacement merchant palette. Maintain user light/dark/system choice, reduced motion and no location tracking by default.

Pan shows Search this area; it does not constantly replace results. Applying bounds sends one eligible merchant query; stale responses cannot overwrite the current sequence. Style switching should reuse the active map instance where supported, without defeating provider billing rules. Avoid remounting the map when a business sheet opens. Initial map creation is lazy after Map selection; useful List works on denial, quota/provider failure or unsupported graphics. Hide a map only with an honest recovery state; never evade attribution/metering.

## Reproducible tariff inputs and examples

Current published map-display inputs: web 50,000 loads included, next 50,000 at $5/1,000, next 100,000 at $4/1,000; native 25,000 MAU included, next 100,000 at $4/1,000, next 125,000 at $3.20/1,000. A GL JS map load starts on map initialisation and has a maximum 12-hour session; ordinary pan/zoom/style interaction within it is not another initialisation. Source links below.

The calculator separately illustrates the displayed standard Search Box interactive pricing (2,500 included units, next band $11.50/1,000) and explicitly labels its billing unit as the supplier's standard-pricing unit. The page also displays introductory session pricing; do not silently assume either tariff applies to a selected account/version, or equate keystrokes, requests and sessions. Confirm live SKU/session-token implementation and rate before enabling it. Permanent-coordinate acquisition, reverse/category/autofill/navigation, hosted extra data and other products are excluded from map-display totals.

Run contracts/calculate-map-and-fee-options.py; map-and-fee-results.json contains original worked examples using assumed £0.80/USD. First small display-only case may cost £0; this does not make every map-associated feature free or fund engineering/design work. Retain £10 early map reserve as a budget, not guaranteed invoice/ceiling. No separate purchased Uber-template licence is assumed. Design/build labour remains part of the product budget.

## Cost and safety controls

Separate counters for GL JS loads, each native SDK application's applicable MAU, location-query product/units, permanent geocode and server merchant-search work. Confirm how multiple apps/devices/different SKUs aggregate on the account; don't assume one person can never count twice. Set actual billing alerts and internal spend forecasts, conservative abuse limits and permitted token restrictions; tokens shipped to clients are scoped public credentials, not secrets. Secret tokens stay server-side. Origin restrictions alone are not a native app security system.

At forecast threshold, notify operations and investigate hot paths; at provider failure, keep legitimate list/manual-area journeys useful. Don't delete accepted work or turn the entire customer app off. External directions hand over to a suitable installed/browser map route to a public/authorised location; Taplo is not providing paid turn-by-turn navigation or route optimisation at launch.

## Proof still required

Real style/attribution on supported devices; exact native wrapper/SDK licence and billing classification; place-query account tariff and coordinate storage rights; merchant/public/private projections; dense clusters and area business; API/stale response/permission/keyboard/slow tiles/safe back states; measured invoice and performance. No provider-backed map has been tested by this document.

Official sources checked 3 November 2026: https://www.mapbox.com/pricing ; https://docs.mapbox.com/console-tools/studio/ ; https://docs.mapbox.com/mapbox-gl-js/guides/pricing/ ; https://docs.mapbox.com/api/search/search-box/ ; https://docs.mapbox.com/accounts/guides/pricing/ .
