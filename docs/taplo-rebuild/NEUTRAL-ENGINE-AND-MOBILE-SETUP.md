# Neutral engine and mobile setup checkpoint — 24 October 2026

The owner rejects the current business-page design quality, not only the marketing presentation. The full frontend goal remains active. Profile composition, individual section design, hierarchy and owner setup must be judged together on actual mobile pages. The Gemini material is input for critical engineering judgment, not an instruction to implement every proposed effect.

## Implemented in this checkpoint

- New business setup starts from three white compositions and one neutral black composition. These use distinct profile layouts (feature, side, centred and minimal), content widths, desktop arrangements, surface treatments and section rhythms. All use neutral palettes, Inter and rounded/pill controls.
- The schema now carries optional layout.rhythm: even, editorial or tight. The real renderer applies it; the owner's Layout and motion controls expose it with normal undo/redo/reset/persistence. Individual widget appearance and business records remain independent.
- Existing looks remain resolvable and available in the full editor, after the new choices. Historical studio→clean and midnight→night aliases retain their meaning: the new IDs are open and ink. Existing saved designs are not rewritten.
- Business categories use consistent outline icons, including scissors, a detailing car, dealership car, coffee and the remaining business categories. Removed mixed photos and decorative icon collages. Selected state stays visible during hover.
- Mobile design selection has a bounded dynamic-height workspace, an actual-width frameless page canvas and a separately scrollable chooser. Continue remains visible; choosing a look preserves document position. Other setup stages keep natural scrolling.
- Setup canvas presentation removes decorative hardware/browser chrome and Actual size zoom. Full editor preview behaviour is preserved.
- Composition diagrams replace identical Aa swatches. Barber SVG source is neutral black; generated fallback marks have a rounded surface without a decorative ring.

## Verification

Final production build/typecheck passed. Targeted ESLint and diff checks passed. Full unit run: 212 passed; 39 database-dependent skipped. Final affected Chromium run: 27 passed, covering 320/390/1440 actual compositions and axe, complete setup at phone/desktop widths, document-position stability, saved look/section compatibility, owner profile controls, section rhythm undo/redo/reload/content preservation, Google-only review behaviour and customer booking preservation when changing preview width.

Actual full-page renders are in outputs/Taplo-handoff/review/neutral-engine. These are local production renders, not proof of a deployed revision or physical-device keyboard behaviour. Earlier broad-suite counts remain historical and are not claimed as rerun.

## Explicit remaining work, in priority order

1. Profile/header composition redesign: stronger intentional sets, image/no-image and logo/name-only states, long business names and action hierarchy. The four compositions are a first base, not acceptance of the engine's final visual quality.
2. Widget-by-widget structural design: services/prices, booking, stock, products, gallery, team, opening hours, contact and Google review states. Improve section hierarchy and elevation without repeated nested boxes or blanket colour swaps.
3. Redesign and review the six full UK customer examples with business-appropriate layouts. Their existing default configurations and most marketing captures still show the previous vivid direction; those are not represented as fixed by this checkpoint.
4. Apply consistent frameless preview presentation to homepage, gallery and widget marketing. Investigate desktop scroll ownership separately: no exact root cause for the owner's desktop-wheel complaint was established here. In the earlier mobile setup, 390×844 reproduction measured a 1263px document; changing the first looks did not reproduce a substantial automatic jump. The new workspace fixes the excessive stacked setup composition rather than hiding a scrollbar.
5. Refresh marketing captures, recordings and films once the revised customer-page direction is approved through rendered review; source media can still show previous branding/designs.
6. Physical iOS/Android keyboard, browser chrome, safe-area and expanded-preview review; narrow/zoomed setup fallback; cross-engine tests for this revision and updated performance measurement.
7. Full design-editing/stock tutorials and the previously open frontend integration/setup states. Backend authentication, public publishing, payments, notifications and Google import remain later work; do not invent successful live outcomes.

Stay on claude/modest-cerf-4tont1, sync before pushing, preserve concurrent work and unrelated untracked assets, never force-push. No Claude run or new dependencies were used.
