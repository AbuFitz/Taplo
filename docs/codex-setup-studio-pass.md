# Setup and Studio design pass

Continues from `a08e303` on an isolated `codex/setup-studio-design` branch.

## Changes

- Category cards separate the photograph from the label, with clear blue selection and compact icons. The category sheet has more room by default on phones, while its preview and three snap positions remain.
- Setup has short explanations for each decision, a named progress indicator and clearer draft completion wording. Existing steps, persistence, optional skips and look/colour controls remain.
- Studio home has a business heading, a next-step panel, a cool-colour page stage and direct services, bookings and team destinations. Existing readiness, publication and sharing logic remains.
- Optional animated guides explain changing colours and organising sections. These are labelled illustrations with text instructions, run only when opened and respect reduced motion. They are not recorded product videos.
- Bakery and photographer examples use newly generated, clean, contemporary imagery, with versioned files and provenance in `public/showcase/originals/CODEX-ASSETS.json`. Original files and customer assets are preserved.
- Gradient/shader page backgrounds now ease into their base colour at the top edge behind content, instead of relying only on a safe-area-sized scrim. Browser chrome still uses a solid colour; physical iOS appearance needs verification.

## Verification

- Production build succeeds, including TypeScript and all 72 generated pages.
- Unit tests: 391 pass, 39 skipped across 44 files (42 pass, 2 skipped).
- Targeted ESLint has no errors; unused imports in touched components were removed.
- Browser QA is pending: the managed preview service passes Vite-only `--host` and `--strictPort` flags to this Next.js application. No application scripts were changed to conceal that infrastructure mismatch.

## Remaining

This is a focused implementation pass, not completion of the full platform redesign. Physical mobile keyboard/safe-area checks, full theme curation and marketing film production remain. Review the changed screens on the branch preview before merging.
