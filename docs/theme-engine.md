# Theme and composition engine (v2)

Four concepts, deliberately separate:

| Concept | Lives in | Chosen by |
|---|---|---|
| **Industry preset** | `features/themes/presets/industries` (data) | owner, in onboarding. Supplies terminology, suggested services, suggested booking mode, *suggested* theme and *starter widgets*. Restricts nothing. |
| **Visual theme** | `features/page/themes/catalogue.ts` (8 themes) | owner (gallery). A complete `StyleSpec` of defaults: colours, fonts, header, background, buttons, cards, layout, decoration. |
| **Composition** | `PageDoc.widgets` + `StyleSpec.header/layout` | owner. Ordered widget instances, header arrangement, width, density, desktop arrangement. |
| **Widget** | `features/page/widgets` | owner. Settings + appearance overrides bound to business records. |

Business records (`BusinessContent`) are separate from the page document and are never copied into it.

## Pipeline
`BusinessContent (zod)` + `PageDoc (any version)` → `migratePage` → `resolveStyle(theme, overrides)` (readability guarantees, notices, CSS variables) → entitlements → per-widget `status` (ready / empty with reason / locked with reason) → `PageViewModel` (`widgets` = everything for the editor, `visible` = what visitors see) → `PageRenderer`.

The editor preview iframe, the demo published page, the sample profiles and the real public route all call `buildPageViewModel` + `PageRenderer`; only the *data passed in* differs (draft vs frozen published copy).

## Files
- `contracts/` — `style.ts` (StyleSpec, StyleOverrides, WidgetAppearance), `widgets.ts` (27 settings schemas, instance type), `page.ts` (PageDoc).
- `themes/` — `catalogue.ts`, `resolve.ts` (`resolveStyle`, `widgetStyle`, `deriveButton`), `color.ts`, `fonts.ts`.
- `widgets/` — `registry.ts` (definitions), `renderers.tsx` (the only place a stored type becomes a component), `client.tsx` (booking/enquiry dialog, simulated payment, click-to-load video), `types.ts`, `icons.ts`.
- `renderer/` — `view-model.ts`, `PageRenderer.tsx`, `Header.tsx`, `Background.tsx`, `page.css`.
- `editor/` — `MyPage.tsx` (workspace), `ContentTab.tsx`, `DesignTab.tsx`, `SettingsTab.tsx`, `WidgetList.tsx` (dnd-kit), `WidgetEditor.tsx` (field generator + per-widget appearance), `Dialogs.tsx`, `controls.tsx`, `ThemePicker.tsx`, `useEditor.ts`, `image.ts`.
- `starter.ts` (starter planning), `migrate.ts` (legacy + repair).

## Safety model
Only enums, numbers in range and `#rrggbb` colours are stored; there is no owner CSS/HTML/JS. Colours become CSS custom properties; finite choices become `data-*` attributes matched by static CSS. Text/surface/button/overlay contrast is enforced at resolve time with plain-language notices (never silently unreadable). Links must be http(s); video is YouTube/Vimeo only, loaded only after a tap; stored images are relative/https URLs or small jpeg/png/webp data URLs (never svg).

## Theme switching
`setTheme(id)` changes only `themeId`. Widgets, business records and owner overrides are untouched; the Design tab shows how many custom settings sit on top and offers reset (per control, per section, or everything). Free plan keeps the industry's suggested theme (a plan boundary, not an industry restriction).

## Adding things
- **Industry:** one data entry (suggestions only).
- **Theme:** one `ThemeDefinition` in the catalogue; it appears in onboarding, the gallery and `/demo/themes` automatically.
- **Widget:** settings schema + registry definition + renderer case (+ icon). The editor form is generated from `fields`.
- **Schema change:** bump a widget's `version` and add `migrate`; stored pages upgrade on load with a note.

## Not built (extension points only)
Per-widget responsive arrangements beyond the three desktop modes, true video backgrounds (a drifting gradient exists, reduced-motion aware), file uploads to Storage, analytics events on clicks (`data-event` attributes are in place), live Stripe/booking behind the booking/payment widgets, premium/marketplace themes.
