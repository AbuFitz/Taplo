# Logo evaluation and decision

**Material inspected.** Everything supplied lives in `public/logo/` (one set: symbol, wordmark, horizontal lockup, stacked lockup, rounded app icon, square app icon, maskable icon, favicons; black and white; SVG and PNG). No other logo candidates exist in the repository or on its branches. The contact sheet is `docs/brand/logo-contact-sheet.png` (every file at 16, 24, 40, 72 and 140 px height on white, cool grey and near-black; regenerate with `node scripts/review/logo-sheet.mjs`).

**Are the SVGs real vectors?** Yes. Each is hand-built geometry (one to eight paths, arcs and straight segments, 400 to 1,100 bytes), not an embedded raster and not an auto-trace. Nothing was redrawn.

| File | Geometry | Legibility small | Spacing | Fit with a cool neutral platform |
| --- | --- | --- | --- | --- |
| Wordmark | Geometric sans with circular bowls; clean, even stroke | **Readable at 16 px**, strong at 24 px | Generous side margins; trim with negative margin | **Best.** Flat, confident, neutral |
| Symbol | A "T" cut by a stepped shadow notch | Inner notch merges into a lump below about 24 px; the dimensional cut reads as 3D | Tight | Distinctive at 40 px and above; the extruded look sits apart from the flat type |
| Horizontal lockup | Symbol + wordmark | Below 28 px the symbol outweighs the wordmark and the pair muddies | Good at 40 px+ | Good large (footer, end card) |
| Stacked lockup | Symbol above wordmark | Wordmark unreadable below about 40 px | Good large | Good for square placements |
| App icon (rounded / square / maskable) | Symbol, white on black | Fine at 40 px+; at 16 px the notch closes up | Maskable safe area respected | Good as an app icon |

**Decision.**
- **Primary platform logo: the wordmark.** Header, mobile menu, onboarding, dashboard. It is the only supplied form that holds at navigation sizes.
- **Horizontal lockup** only where it is large (footer, end card, share images).
- **Symbol / app icon** for app-icon and favicon placements. At 16 px the favicon remains weak; that is a property of the supplied symbol, and a simplified small-size mark would need to come from the logo's designer, not from a casual redraw here.
- Black on white and cool grey, white on near-black (`#0b0d12`). No tinted or recoloured variants.

Wiring: `src/lib/brand.ts` (which file each placement uses) and `<TaploLogo variant="wordmark" | "lockup" | "mark" | "app" | "stacked" tone="dark" | "light" />`.
