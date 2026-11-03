# Taplo brand assets

The supplied logo set lives in `/public/logo` and is used unchanged: horizontal lockup, stacked lockup,
wordmark, symbol, rounded app icon, maskable icon and favicons, each in black and white where it applies,
as SVG with PNG exports.

`src/lib/brand.ts` says which file each placement uses; `<TaploLogo />` (`src/components/taplo/brand.tsx`)
renders them everywhere on the platform (marketing header and footer, onboarding, dashboard, lab).
Favicons and the touch icon are wired in `src/app/layout.tsx` metadata.

| Placement | Component call |
| --- | --- |
| Marketing header, onboarding, lab | `<TaploLogo />` |
| Dark surfaces (footer, share cards, ad) | `<TaploLogo tone="light" />` |
| Dashboard sidebar | `<TaploLogo />` (`variant="mark"` when collapsed) |
| Public page attribution (plan controlled) | `<TaploLogo variant="mark" />` |
| Raster exports (OG, share card, ads) | embed the SVG from `/public/logo` |
