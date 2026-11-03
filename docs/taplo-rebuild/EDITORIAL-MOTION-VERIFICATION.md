# Homepage illustration and motion rebuild

## Owner direction and final behavior

Marketing images now communicate a simplified idea rather than reproduce the complete product interface. Functional demos, inspiration and authoring previews retain the actual renderer. This supersedes the master handoff's hero block lens and the later actual-renderer anatomy experiment.

The hero has original HTML/CSS compositions: a Detail Dept. handset with a brief wordmark, headline, action silhouette and selected car-care photograph; desktop adds a separate Marlowe & Finch browser composition. Both use the shared PhoneChrome / BrowserChrome hardware, including handset buttons and the intended mytaplo.com address. There are no hero iframes, screenshots, category switches, hover lens, flips or drag switching. The lower device edge crops into the page deliberately. The offer card links to Services; design discovery links to Inspiration. Mobile has shorter copy and one handset, desktop has different framing and two business examples.

The autoplay section is a purpose-designed continuous illustrated scene, built from five restrained pieces: a central fictional studio identity and four service, time, social and photographic blocks. It has layered materials, contact shadows, shallow perspective and an original typography/content composition. The decorative pot was removed. Mobile has a separately composed vertical arrangement with the calendar above the central name; desktop spreads the objects horizontally. Cards trace small circular paths around deliberate anchors instead of crossing through the central content in a large orbit. Playback pauses when offscreen, hidden or reduced motion is requested. The reduced-motion view is a complete composition, not a missing animation. The whole artwork is one useful Product link, with a visible caption and keyboard focus. There are no player controls or simulated success states.

The booking section now uses its own minimalist service/calendar artwork, rather than a captured appointment screen. Try a booking still leads to the actual booking journey. The service story is a single coherent offer example; the redundant feature chooser is removed. The design section has no repeated category radios. A real carousel leads with the owner's strongest dark examples, Marlowe & Finch and Detail Dept., followed by health, portfolio and founder designs. Each example still has its actual demo and setup adoption. Repeated oversized section curves have been removed.

## Bugs found and fixed

- Programmatic smooth scrolling could report intermediate cards as selected, so rapid Next taps could lose the intended destination. DesignRail now preserves the requested target, while manual pointer/wheel gestures can take over. Real centering and the adoption URL are checked after three quick taps.
- The dark browser address bar inherited a white address background and low-contrast text. Its material and text contrast now match.
- The artwork's explicit accessible label conflicted with visible content. The single link now derives its name from the visible caption while its illustrative scene stays decorative.
- A Safari test focused an offscreen, intentionally lazy carousel without bringing it into view. Its setup now scrolls to the actual visible UI before inspecting the mounted preview. This does not remove the lazy-loading requirement.

## Verification and exact limits

Final local production build, source lint, TypeScript and whitespace pass. Unit suite: 272 passes, 39 database skips. Chromium: 29 illustration/design/sharing cases pass. Native Firefox/WebKit: 45 passes in the broad run plus the corrected visible-carousel Safari case, covering all 46 distinct cases. The quick-tap regression passed in both native engines. Prior broad checks and the final screenshot proof are in work/editorial-verified-browser.log, work/editorial-verified-native.log and work/editorial-webkit-visible.log.

Reviewed real 320/390/768/1440 renders and mobile/desktop screenshots; checked shared hardware, actual local assets loading, keyboard links, no horizontal page overflow, QR/sharing regressions and whole-home accessibility. Artwork is original code with existing relevant repo photography; no screenshot media or third-party Framer assets were copied, and no new library was added. The final scene was reviewed with the mobile calendar clear of the central brand.

The Framer references inform material, hierarchy and motion rather than prescribe a copied template. The reference/asset brief and superseding owner instructions are recorded in OWNER-DIRECTION-25-OCT.md.

This is a homepage/artwork pass, not completion of the full checklist. Pricing composition/icons, the complete inspiration redesign, all feature-page content/illustration review, deeper profile/block engine and all-theme rebuilding remain. Legal/operator/provider/account/wallet dependencies remain explicit. No account, payment, delivery or publishing capability is claimed as connected merely because its illustration exists.
