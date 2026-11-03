# Engine audit: concrete findings and decisions

24 October 2026, Europe/London. Source baseline: `e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52`. Historical baseline. Round four is now confirmed deployed at `4a08d1ffe3c163b21d6b4b2060c602ba18b0ebc8`; see ROUND4-RECONCILIATION.md. Actual-source re-execution at that version reproduced E01–E03 unchanged in ENGINE-PROBE-R4.json. Full browser reproduction of those style edges remains open.

## Implementation follow-up

Code commit e08f9d0 fixes E01–E03 and the analogous page-outline case. Tests and rendered scope are in INITIAL-IMPLEMENTATION.md. Earlier probe JSON remains historical reproduction evidence at its recorded SHA. Complex image/gradient coverage and owner feedback remain open; do not turn this initial correction into full engine acceptance.

## Confirmed resolver findings

The actual pinned `resolveStyle` and `widgetStyle` source was executed in an isolated preparation folder with Zod 4.6.7, Culori 4.0.2 and Radix Colors 3.0.0. Only module import paths and font CSS side-effect loading were adapted; no resolver logic was changed. Results are in ENGINE-PROBE.json. These are function-level reproductions; full live-browser reproduction remains open.

### E01: transparent widget checks the stored palette instead of the actual wallpaper

Start from Night. Set a white solid wallpaper and black page text. Give a widget no surface and request white text. The resolver checks the widget text against `spec.colors.background`, which remains the dark Night palette value, so it keeps white text. The actual resolved page background is white: contrast is **1:1**. All three page-level readability checks in this case report passing values.

Code path: `src/features/page/themes/resolve.ts`, `widgetStyle`, the `a.text` branch uses `spec.colors.background` for a transparent surface. The page wallpaper is independently resolved through `--tp-background`.

Required correction: derive the effective visual background for the widget before resolving its foreground; include widget-level readability in the owner's feedback. Account for wallpaper images/gradients/compositing instead of assuming one palette hex describes them all. The static white-wallpaper case must be solved first and then verified in the rendered UI.

### E02: outlined button colours ignore a widget's changed background

Start from Night. Set a widget background to white, widget text to black and its button fill to outline. The widget's main text becomes black, but `deriveButton` receives the page's original colours and only the fill/accent overrides. The resulting button text is `#f3f3f5` on transparent, above white: approximately **1.11:1** contrast.

Code path: `widgetStyle` calls `deriveButton(spec.colors, spec.buttons, { fill: a.buttonFill, accent })` without the effective widget foreground/background.

Required correction: resolve button text/border/focus states against the surface where the button actually appears. Verify featured/accent/solid/soft/glass/transparent widget combinations, then verify existing page button choices and overrides still behave predictably.

### E03: no-surface widgets retain a glass page's blur

A page with glass cards resolves `--tp-card-blur: 22px`. Setting an individual widget surface to transparent changes its card background but does not override that blur. `.tp-card` still uses `backdrop-filter: blur(var(--tp-card-blur)) saturate(1.5)`. The observed inherited blur is 22px.

Required correction: make the no-surface choice explicitly remove inherited blur/effects, and check that surface-specific border selectors do not continue matching a more distant page ancestor. Verify in the browser over a patterned/image background; a plain background can hide the problem.

## Confirmed editor behavior; prior assumption corrected

### E04: look application replaces current style changes

The actual `useAppearanceModel.applyLook` calls `setAppearance(id, {})`; LookPicker calls it directly. This differs from an older `setTheme` helper and older documentation saying overrides are preserved.

A reversible live test on the agent's isolated Barber sample changed the accent to `#d12c40`, applied Clean, and observed: “Clean applied. Your earlier style changes were replaced.” The accent became `#1f5eff`. Undo restored Night plus the custom accent; a second Undo restored the original Night accent `#c6f432`. Nothing was published, and the sample's original appearance was restored.

This is not evidence of record loss. Treat replacing styling as a product decision: provide a clear preview/apply model, communicate the scope before applying, and keep Undo. Do not tell Claude to fix an override-retention behavior that this picker does not have. Inspect what saved page/section looks do separately.

## Source-confirmed workbench gaps

### E05: Header group calculated before header stories are added

In `src/features/workbench/stories.ts`, STORIES aliases the mutable story array, but GROUPS is calculated before the header loops append their stories. Header examples therefore exist in All/direct routes, while the group list omits Header. `WorkbenchIndex` uses GROUPS to build its navigation.

Required correction: finalize the story catalogue before deriving group metadata. Verify every story is reachable through its group and direct URL. This affects inspection/discovery; it does not prove header render tests were absent.

### E06: coverage claims need to follow the actual registry

The inspected WIDGET_TYPES list contains **30 types**, while older documentation describes 27. The static workbench declarations do not explicitly cover every current type. Use WIDGET-COVERAGE.csv as an initial source inventory; it identifies candidate gaps and does not claim the rest of the test suite lacks coverage.

Missing explicit workbench declarations in this baseline include SMS, custom links, offers, payment, leave-review, standalone image, video, document and announcement. Review variants as well: before/after gallery and list credentials are not represented by the current named workbench cases. This audit does not require adding new product capabilities; it requires inspecting what is already supported.

## Layout decisions needing visual evidence

- Desktop `columns` uses CSS multi-column flow (`columns: 2`), which fills down columns rather than defining row pairs. Assess hierarchy, keyboard reading and uneven long content; do not approve it merely because it fits without overflow.
- `split` makes the header sticky beside widgets at 900px. The owner explicitly wants desktop identity/content to remain related to mobile. Evaluate on real phone/desktop captures and choose the intentional default for each composition.
- Editor and customer viewport breakpoints differ (960px editor layout versus 900px customer layout); this is not intrinsically wrong. Test 900–959px and constrained preview space before diagnosing a mismatch.
- The preview controller uses a real iframe viewport, which is appropriate for triggering customer media queries. Distinguish that viewport from its scaled outer representation. At the inspected wide editor, the phone preview was visibly small; evaluate Actual size and panel proportions before changing the renderer.
- Page-wide tokens and per-widget variables already exist. Repair composition boundaries and defaults rather than replacing this with arbitrary stored CSS or a second page engine.

## Reproduction assets

`probes/engine-regressions.test.ts` contains desired contracts for E01–E03; it is expected to fail on the audited baseline. After copying the preparation folder into the repository, an existing Vitest environment can run:

```sh
npx vitest run --config docs/taplo-rebuild/probes/vitest.config.ts
```

The preparation pass executed the actual-source numeric probe, not this full repository Vitest command. Revalidate imports/configuration on current HEAD before use. No production fixes are included in the preparation pack.
