# Homepage motion and simplification

Owner correction: the scene should feel like placed animated artwork, without its own heading, exploration button or click target. Desktop hero should use the same phone composition as mobile, with no browser mockup. Replace the repeated starting-design section completely and reduce duplicate calls to action.

## Implemented

- Original FORM ceramics studio illustration: identity, clay workshop, calendar, studio photography and three social marks. Fewer words; no screenshot of the actual product. Existing original studio asset, shared brand icons, no new dependencies or copied reference assets.
- Separate narrow-screen arrangement with a silver sculptural loop, shallow material edges, contact shadows and small circular movement around stable anchors. No pointer tracking, play/pause controls or simulated booking state.
- Motion pauses outside the viewport and in hidden documents; reduced motion restores the authored still arrangement.
- Removed the scene heading and Explore the blocks CTA. The scene is a labelled illustration with no links or buttons; its existing section anchor remains valid.
- Removed the desktop browser illustration, hero artwork links and extra caption. Both sizes use the Detail Dept. phone and service illustration; desktop scales and positions the same composition.
- Replaced homepage design picker with a single coherent section explaining how a Taplo page can collect existing website, social and booking links. No category selector, demo carousel or extra CTA. The working inspiration library and product design examples remain available.
- Removed the duplicate Explore booking action, retaining Try a booking.

## Verification scope

Check 320, 390, 768 and 1440 widths in rendered browsers, no page overflow, no supporting block over the central name/action, all imagery loaded, no repeated artwork controls, real inspiration navigation, QR decoding, reduced motion, offscreen pause/resume and accessibility. Production build, source lint, TypeScript and whitespace checks are required before release. Native WebKit and Firefox cover the changed compositions. See release logs in the matching handoff proof folder for final results.

## Remaining broader work

This is a homepage refinement, not completion of the full platform. Pricing, inspiration redesign, all ten feature pages, deeper engine/dashboard/onboarding authoring, all-theme rebuilding and substantive legal drafting remain tracked in FULL-CHECKLIST.md. Real authentication, billing, publishing, delivery, operator identity and provider details remain external dependencies. Do not infer those services are connected from this artwork.

Final local verification: production build, source lint, TypeScript and whitespace pass. All 29 Chromium release cases pass (21.4s); all 22 native Firefox/WebKit composition cases pass (31.2s). Visual review caught and corrected mobile identity-mark overlap, a tablet primary-action overlap and low-contrast illustration captions. Regression assertions now keep the name and action clear of supporting art. Existing gallery tests were moved off the removed homepage picker to the actual inspiration library; explicit visibility precedes lazy-iframe assertions. Live deployment verification is recorded separately after publishing.
