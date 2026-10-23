# Taplo brand assets

The final Taplo logo has not been supplied yet, and none has been invented. Until it arrives the product
sets the name "Taplo" in its platform typeface (Geist) as a plain, clearly provisional wordmark.

## Dropping the logo in

1. Put the supplied files here, with these exact names:
   - `taplo-logo.svg`: full lockup (mark and wordmark), for light backgrounds
   - `taplo-logo-light.svg`: full lockup for dark backgrounds (optional; falls back to a CSS invert)
   - `taplo-mark.svg`: the mark alone, square, for favicons, avatars and tight spaces
2. In `src/lib/brand.ts` set `BRAND.logoSupplied` to `true` (and `markSupplied` if the mark exists).
3. Nothing else changes: every placement below renders through `<TaploLogo />` in
   `src/components/taplo/brand.tsx`.

## Placements (all use `<TaploLogo />`)

| Placement | Variant | Notes |
| --- | --- | --- |
| Marketing header | `lockup` | Links to `/` |
| Marketing footer | `lockup`, `tone="light"` on the dark footer | |
| Onboarding and sign-in | `lockup` | |
| Dashboard sidebar | `lockup`; `mark` when collapsed | |
| Public page attribution ("Made with Taplo") | `mark` + text | Shown by plan entitlement only |
| Share card, Open Graph image, marketing exports | `lockup` | Raster exports embed the SVG |
| Favicon and app icon | `mark` | `src/app/icon.svg` once supplied |
