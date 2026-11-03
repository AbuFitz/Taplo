# 55 · Map visual composition and selection

Edition 0.9 · Extends spec 51. Diagrams in VISUAL-EXPERIENCE-ATLAS.html show layout regions only; they are not a geographic basemap or verified merchant locations.

## Mobile composition

Top: compact search query and area controls, a clear Map/List switch, then only the most useful active-filter summary. Main region: navigable map with readable place labels and enough uncovered area to understand geography. Location/recentre control is separate from search and has a label. Bottom: result count and one selected-business sheet above safe-area/global navigation. Attribution remains visible. Collapsed selection shows merchant identity, delivery/visit mode and one useful next action. Expanding reveals a bounded business window, not the entire catalogue. Switching to List preserves the search.

Do not make the map a postage stamp below a giant heading. Do not float a dozen pills over the same area. The selection sheet has a visible expand/collapse control in addition to any drag gesture. At large text sizes or with the keyboard open, use a focused search/result screen instead of layering every panel over the map. Global navigation can yield during a focused merchant task but returns consistently afterwards.

## Desktop composition

Top navigation establishes Taplo identity; search/area and relevant filters are in a stable search region. A constrained results rail sits alongside the map. Selecting a rail item selects its marker and reveals the corresponding preview within the rail; avoid adding a second duplicate card over the map. The map uses the remaining width without forcing the rail text to be excessively narrow. An optional filter drawer replaces the rail temporarily or opens as one explicit panel; not a permanent third results column. Tablet transitions to a single map with selection region when side-by-side readability fails.

## Marker language

Use one calm base style, distinct selected state and explicit cluster count. Focus/selection must not depend on hue alone. Single points represent eligible public premises or disclosed venues; service coverage uses a labelled area treatment with boundary/opacity that keeps roads and place names visible. Approximate area must look approximate, not a precise home pin. Online-only offers have no geographic pin. Multiple branches have meaningful branch names; the selected offer is scoped to that branch where required. A selected cluster opens its contents/zooms; it is not presented as a single business.

Show actual nearest/available/price badges only when supported and relevant. Do not paint each merchant's entire palette onto the basemap or use colourful logo pins as the sole identification. A small genuine mark can be considered in the selected preview, with safe name-only fallback. Merchant popularity, paid placement and map selection are separate concepts. Public area labels must not reveal private coordinates via a tooltip, payload or clustered point.

## Gesture and request behaviour

Panning changes the viewport without committing a new query. “Search this area” appears after meaningful movement and commits bounds on activation. Keep prior stable results while loading; show updated count when the new result set is ready. Stale requests cannot replace newer results. If filters or location change, selected business remains only if eligible; otherwise explain that it is outside the current results and clear selection. Recentring should not silently enable precise tracking. Gesture handling must let the surrounding page scroll, especially on embedded web views.

Selection → merchant → product/booking → Back restores query, applied bounds, zoom, selected business and rail/selection-sheet position. When a listing has moved/closed/been withdrawn, preserve the user's private transaction record and offer another browsing path rather than pretending the merchant still trades.

## Map-specific visual states

Initial permission-unasked state uses chosen/manual area, not an assumed personal location. Approximate permission shows the correct precision. Permission denial keeps manual search. Empty search shows one useful recovery action, without hiding the map completely. Provider failure shows readable list results if available; a blank grey rectangle is not an acceptable failure state. Partial results explain scope without invented completeness. Tile-loading, attribution, geocoder ambiguity, disconnected map/list, safe address disclosure and route handover all have explicit review frames.

## Review evidence required

Actual provider-backed light/dark basemap, real mobile gestures, keyboard/assistive alternative, dense clusters, mobile service coverage, hidden-address business, multi-branch offer, no location permission, narrow landscape and text enlargement. Verify tile/geocoding terms, data freshness and accessibility against current provider documentation when selecting/implementing it. Mapbox is now the working vendor; see [EXPLORE-MAP-PROVIDER-DESIGN-AND-COST.md](../EXPLORE-MAP-PROVIDER-DESIGN-AND-COST.md) for current design/cost/storage boundaries.
