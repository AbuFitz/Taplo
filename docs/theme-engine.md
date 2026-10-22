# Theme engine

Four separate concepts (spec §5.1): **industry preset** (vocabulary, suggested services, default layout) · **layout preset** (ordered block instances + variants) · **visual tokens** · **capabilities/business data**.

## Pipeline
`BusinessContent (Zod)` → industry defaults → versioned layout (alias/fallback + warnings) → token preset + validated overrides (contrast-checked) → entitlements → drop blocks with no meaningful content → `PublicProfileViewModel` → `ProfileRenderer` → block registry.

`buildPublicProfileViewModel` is the single projection for preview and live; callers differ only in *which data* they pass (draft for authorised preview, published snapshot for public). `src/features/themes/renderer/view-model.ts`.

## Files
- `contracts/` blocks (discriminated union per block type + variants), tokens, layout/profile config, industry preset schemas.
- `presets/industries` (data), `presets/layouts` (data + `resolveLayout` with alias/fallback), `tokens/` (presets, contrast, resolver, `tokensToCssVars`).
- `blocks/` one file per block type; each exports a variant switch. `registry.tsx` is the only place stored references become components.
- `fixtures/` synthetic datasets (mechanic, detailer, barber, tutor, consultant, unlisted + edge cases).

## Tokens and scoping
Tokens are `--tp-*` custom properties set inline on `[data-taplo-theme]` by `ThemeRoot`. `globals.css` bridges them to Tailwind utilities (`bg-tp-surface`, `font-tp-heading`, …) and re-maps shadcn's semantic variables inside the root so owned primitives pick up the profile theme. Overlay primitives (`dialog`, `sheet`, `select`, `popover`, `tooltip`, `dropdown-menu`) portal into the root through `PortalContainerProvider`, so booking dialogs stay themed. Dashboard/marketing never set `--tp-*`.

Variant classes are literal strings in static maps; no database value is interpolated into class names. Colours are `#rrggbb`, fonts come from `FONT_KEYS`, and overrides must keep ≥4.5:1 text contrast or are dropped with an owner-visible warning.

## Adding an industry
Add one entry to `presets/industries/index.ts` (key, label, keywords, default layout, terminology, suggested services). No page or block changes. Verified by `themes.test.ts` ("every industry preset points at an existing layout").

## Adding/changing a layout
New `LayoutPreset` object with a new id, or bump `version` and add an alias in `LAYOUT_ALIASES`; stored profiles keep working and show a warning.

## Extension points (not built)
Section reordering/hiding (`config.sections` already honoured), owner palette/font/radius overrides (validated), premium themes (extra token presets + layouts in the registry). No marketplace infrastructure.
