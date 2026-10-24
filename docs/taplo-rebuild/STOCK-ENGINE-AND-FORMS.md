# Stock layouts, UK dealership and shared forms

24 October 2026. Full frontend goal remains active on the same Claude branch.

## Delivered

Products now offer an owner-selectable Large cards layout (`catalogue`) with real-content choice previews. Cards use a 3:2 photograph and one readable column on a phone; a container query pairs cards only when the section itself is wide enough. A narrow section on a wide desktop stays one column. A single card keeps this presentation instead of accidentally inheriting the older horizontal feature treatment. Existing grid/list/swipe settings remain valid. Large photographs request suitable responsive image sizes.

Brookfield Motors is a new authored fictional UK example with the Forecourt look: compact wordmark/header, clear stock cards, three coherent original illustrative forecourt photographs, available/reserved/sold states and a pending viewing-request journey. A reserved car offers enquiries about similar cars; a sold car has no enquiry action. A selected-car enquiry stores its stable item ID, kind and name. No invented reviews, real vehicle claims or external messages were added. Unfinished fourth estate-car source input remains a QA input, not a marketing listing.

The gallery now features eight current examples, including Station Road, Parkside and Brookfield. Superseded Marlowe/Aldous pages and their start links still work via the full catalogue. New industry suggestions lead with High Street, Workbay and Forecourt. Fixture industry keys are normalised to the actual product presets, so starting Brookfield reaches Add your first vehicle instead of an unrelated service form. Sample stock/identity/photos are never copied into an owner's setup.

Industry changes now compare the actual previous default look and complete default widget settings. A fresh page follows the newly selected industry; an owner's changed look, colours, section titles or section layout are preserved. New car-dealer pages start with Large cards. Existing saved pages are not migrated or rewritten.

## Shared defects found and fixed

1. Enquiry forms used fixed message/select IDs. A page form plus a product dialog could create duplicate IDs and labels pointing at the wrong field. Each form now gets stable unique React IDs, including error associations. Browser checks use the active dialog and verify all message fields have different IDs.
2. The shared input primitive forced a white background while inheriting light profile text. Rendered measurement found approximately1:1 contrast in Workbay, Night, Colour, Photo, Terracotta and Forge (six of thirteen starting looks). The primitive now uses paired semantic background/foreground tokens. The same measurement with typed text now passes4.5:1 in every starting look. This does not claim every possible owner-authored colour combination has been audited.
3. Font metadata was entangled with stylesheet imports. The labels/stacks are now pure metadata, while the renderer keeps its font stylesheet entry. Catalogue/config consumers can use the definitions without pulling CSS into non-UI tooling.

## Verification

Production build/typecheck and targeted lint pass. Full unit182passed,39database-dependent skipped. Browser run61passed across stock, contrast, marketing, widgets, previews and automated accessibility; a further19editor/booking checks passed after the input change. Final targeted37passed after setup/default integration, including six new large-card workbench stories across light/dark, single-item and desktop cases. The additional dealership viewing test passed through to a stored pending request. This is targeted evidence, not the entire browser suite.

New real-renderer phone/desktop captures and Forecourt thumbnail were generated. Phone/full desktop screenshots were inspected. The gallery and three UK detail pages at390and1440px have no serious/critical findings in the enabled axe rules; that is not a complete accessibility certification.

## Still open

The whole marketing site, feature artwork, remaining UK examples, setup/editor polish, the wider engine acceptance matrix and new films/ad formats still require work. Prioritise the full homepage/feature narrative and current-renderer film production next; do not spend the night only multiplying examples. Backend remains a later project, with all frontend review capabilities available by default.
