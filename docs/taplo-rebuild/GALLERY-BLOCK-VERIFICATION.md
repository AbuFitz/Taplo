# Gallery block authoring and rendering

Owner direction: blocks should feel lifted, useful and visually editable, with restrained controls. This pass addresses the real gallery family before rebuilding inspiration themes.

Story: choose the gallery in My Page → select/order/edit photo references → persist the draft through the existing Editor update path → render the same selected images in the customer page and lightbox → reload without losing the selection, order or captions. This is the existing local draft data path; it makes no claim of cloud image storage or publication.

## Implemented

- A visual photo picker replaces the generic bordered list for gallery records. Each image opens its existing photo-edit popup. On page/Hidden is explicit, with keyboard-accessible earlier/later controls and screen-reader move announcements. Automatic inclusion of future photos remains available.
- A manual order belongs to that gallery’s reference list. Moving a photo does not reorder or delete the business photo library or another block’s references. Explicit selections omit deleted/duplicate references and retain the chosen order.
- Photo editing retains image/caption/before-image data, the pre-commit crop flow, cancel/save/delete controls and focus restoration. Ordinary photos can now retain their complete original proportions instead of being forcibly square-cropped; explicit crop targets still start in crop mode. Whole-photo instructions no longer refer to logos. Adding or removing a photo returns focus to Add photos, and an edited photo retains its own edit target. The photo popup has one title and no redundant inner Back/title bar or divider.
- The regular photo grid uses equal thumbnails rather than promoting every odd-count first image into a poster. Its column count follows the block width. Masonry uses recorded image proportions instead of rotating arbitrary aspect ratios, with a bounded thumbnail height.
- The three-photo editorial collage has a bounded lead image. Larger collages use a five-photo composition with filled tiles and a bounded overall height. Additional photos remain reachable in the real lightbox. Individual photographic objects retain the shared shadow/edge material.
- All six existing arrangements remain: grid, editorial collage, photo wall, swipe row, filmstrip and before/after. Single photos stay bounded. The viewer retains next/previous, focus return, original-size zoom and comparison-side controls.

## Verification

Production build, source lint, separate TypeScript and whitespace checks pass. 271 unit tests pass; 39 database tests remain skipped without a configured test database. Three new selection/order cases cover dynamic additions, stale/duplicate references and non-mutating per-gallery moves.

Seventeen final Chromium browser cases pass in work/gallery-upload-browser.log: authoring at 320/390/1440, all six customer arrangements, six-image collage access, actual paired before/after images, whole-photo upload/cancel/delete/Undo/reload, plus five existing complete-registration/crop/draft regressions. Photo-picker accessibility scans pass. All 24 native Firefox/WebKit cases pass in work/gallery-upload-native.log (1.1m). The earlier isolated gallery pass also covered both existing caption/collage regression cases. Rendered review includes the actual customer collage/viewer and the visual authoring controls.

The larger WebKit collage initially left empty portions beneath some thumbnails. Fixed grid rows and a bounded composition now make the whole tile photographic, preserving the opening target. This was treated as a rendering/interaction defect rather than accepting only Chromium results.

## Explicit remaining work

This is a gallery-family refinement, not completion of the whole editor or approval of the underlying themes. The combined whole-photo creation/cancel/delete/Undo/reload and before/after paths are now exercised. Additional deep media-library workflows remain part of the full engine audit. Bulk multi-file staging, a wider media library and mobile dragging are potential enhancements, not advertised as implemented. Physical iPhone behavior is unverified. Continue the full engine/dashboard/profile/service/block checklist before reproducing all inspiration designs.
