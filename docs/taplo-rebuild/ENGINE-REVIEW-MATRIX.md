# Theme and layout engine: review contracts

24 October 2026. This defines the evidence needed to judge the engine, beyond the seven showcase screenshots. It is a review specification, not a claim of completed implementation or tests. Read SCOPE.md, ENGINE-AUDIT.md and ROUND4-RECONCILIATION.md with it.

The existing contracts already separate BusinessContent, PageDoc v2, StyleSpec, partial page overrides, widget references and widget appearance. Keep that useful structure. The style contract declares five header layouts; three widths; centered/split/columns desktop modes; solid/gradient/image/shader backgrounds; page and per-widget surfaces; and saved looks/styles. These are current capabilities to assess, not a demand for hundreds more controls. Reconfirm the current schema before implementation.

## Required review matrix

| Contract | Representative evidence | Current status / limit |
|---|---|---|
| Records independent of presentation | Apply three looks to one populated business; compare record IDs, widget IDs/order and hidden state before/after | Open; style replacement/Undo alone was checked |
| Industry independent of look | Same barber content in a cover-led and compact text-led composition; same look with detailer and tutor content | Open; do not lock a layout to an industry |
| Clear precedence | Theme defaults → page overrides → widget overrides; inspect actual effective tokens and reset at each level | Existing structure; edge failures E01–E03 confirmed |
| Saved look behavior | Save/customize/apply/rename/delete look, switch base, Undo and reload; scoped changes explained | Open; current main picker replaces overrides and Undo works in one isolated check |
| Saved widget style | Apply saved style to two widgets, edit one, verify copy semantics and reset to page defaults | Open |
| Safe document migration | Old saved centered/split/columns documents, unknown look fallback, missing fields, stale record references | Open; no silent composition loss during retirement |
| Header composition | Each supported header with long name, wide wordmark, portrait, no image, cover crop and no available contact channel | Source has cases; full rendered matrix open |
| Desktop adaptation | Identical content at phone and desktop; action/identity relationship, reading/tab order and collection layout | Folio reference exists; remaining catalogue/saved modes open |
| Preview/public parity | Same document and viewport in editor iframe, public page and showcase/capture pipeline | Shared renderer exists; parity evidence open |
| Breakpoint continuity | 360/390/768/900/959/960/1280/1440 widths and constrained editor panels; focus and scroll preserved during resize | Representative review set, not completed checks |
| Content density | Compact/comfortable density and compact/comfortable/roomy padding with short, long, empty and many-item collections | Earlier bleed fixed per upstream; independent regression check open |
| Readability on actual surfaces | Solid/gradient/image fallback and loaded image, surface opacity, glass, transparent/accent widget, outline/soft/solid button | E01–E03 fail latest source; hover/focus/disabled/image states open |
| Media art direction | Landscape/portrait crops, focal point, wide logos, failed image load and slow loading without layout jump | Open; generated photograph alone is insufficient |
| Type and hierarchy | Long UK business/service names, price qualifiers, multi-line buttons, text zoom and 200% zoom | Open; large hero type does not prove widget hierarchy |
| Widget breadth | Every registry type plus meaningful variants; summary/detail/edit, missing records, long content and disabled action | 30-type inventory; 9 candidate explicit workbench gaps |
| Primary action | Auto/manual action choices with booking enabled/disabled, missing phone/channel, page with no actionable content | Open; protect earlier fixed header-action behavior |
| Booking state model | Direct service/general/staff entry; one/multiple providers; service → staff → time → details → review/result; Back/retry at each | Live J01/J02 failures; no real booking submitted |
| Item enquiry binding | Selected vehicle/product remains identified in header, form, payload and received record | J03 fails in current source/live form |
| Persistence and history | Add/edit/hide/reorder/style, Undo/redo, reload, storage/network failure, correct draft/published state | Open; no wholesale pass implied by isolated Undo check |
| Accessibility and motion | Keyboard-only selection/reorder, focus entry/return, Escape, contrast, reduced motion and static shader fallback | Open beyond source contrast findings |
| Performance budget | Initial page/customer bundle, image sizing, font loading, animation cost and low-capability fallback | Existing implementation requires measured evidence |
| Export identity | Page appearance and actual destination preserved across share preview, QR PNG/SVG and print | Open; decode exported assets independently |

## How to use the matrix without multiplying work unnecessarily

Use representative combinations to expose interactions first. Anchor each case to a real document fixture with stable IDs and record the exact viewport, version and expected result. Cover every enum at least once; add pairings where inheritance or composition interacts. For the known surface problems, explicitly pair changed wallpaper + transparent widget, changed widget background + outlined button, and glass page + transparent widget. Do not generate the full Cartesian product or screenshot thousands of equivalent states.

A flagship example is successful only when it exercises this system: a UK detailer with packages and quote enquiries; a barber with service/provider/time; a dealer with real-looking stock records and item-specific enquiry. The evidence must show the same working engine can produce their different hierarchies. An image pasted into a fixed generic page does not establish composition quality.

Every row needs a current result or an explicit open limitation in ACCEPTANCE.csv. Automated checks should protect state/data/readability invariants. Visual review should assess useful hierarchy, personality and density. Neither category substitutes for the other.
