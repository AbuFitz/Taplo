# Mobile setup and Studio follow-through · 5 November 2026

Packet: P02 responsive interaction, supporting P03 onboarding to first offer.

## Corrected

The shared setup/Studio preview divider previously allowed 58% of the visual viewport without reserving a usable form area. On short screens this crowded the fields and persistent action row. Its accessibility value also started at an unrelated 220px and advertised a fixed 600px maximum.

The divider now reserves 360px for navigation, task controls and actions on ordinary portrait screens, with a 96px floor on unusually short screens. ResizeObserver reports the actual stage size; browser viewport changes clamp an oversized preview. Pointer identity/capture loss is handled, and keyboard endpoints use the same bounds as dragging. The page preview remains mounted.

Onboarding now focuses the first invalid field after submission. A valid business name no longer takes focus when the editable page link is the actual error. Focus scroll is immediate and limited to the nearest scroll position.

## Evidence

Seven size-budget cases passed, including short portrait screens, rotation and keyboard endpoints. TypeScript and targeted ESLint passed. Two browser regressions were added for invalid-link focus and viewport shrink with persistent Continue; browser execution remains pending CI. Local Chromium is unavailable under this environment's socket restrictions; no device or screenshot evidence is claimed here.

This corrects two observed code defects. It does not complete P03 or the broader Studio redesign, auth integration, onboarding claim/publish or P04–P12. Production database configuration remains unchanged; the earlier deployment-target approval block remains unresolved.
