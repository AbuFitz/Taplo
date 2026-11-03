# Profile, section and asset engine — 24 October 2026

## Design read

Taplo helps an owner turn actual business information into a compact customer page. The owner has explicitly rejected generic builder styling and says quality must come from useful automatic decisions, not only a new palette. Primary use is mobile: identify the business, understand its offer and act. The canvas is mainly white with neutral black options; images show the business's work rather than decorating an interface.

Profile composition has two new native arrangements: Editorial introduces identity and its main action before photography; Photo profile brings a work image into business information through a short, page-colour fade. Text and actions remain on a solid readable surface. No-photo and long-name states must remain useful. Existing profile IDs are preserved.

Section presentation provides Open, Soft, Raised and Spotlight recipes on actual panel widgets. These replace only the surface recipe; content references, button styling and independent accent choices remain intact. Each control previews the owner's actual selected section. Collections and action-only buttons keep their own presentation contracts and do not get misleading panel recipes.

Image preparation must preserve original composition for identity/cover uploads. No mandatory square crop for a wordmark, no forced JPEG background on a transparent logo, and no destructive fixed-ratio cover crop before the page layout is chosen. Focal controls account for the actual contained-image rectangle, including letterboxing. Transparent identity marks carry optional derived ink metadata, allowing a contrasting backing without changing their pixels. Existing images without metadata are unchanged.

## Primary research

- Linktree's official profile guide separates classic, photo-led and banner arrangements. Apply the principle of different identity structures, not its exact visuals: https://linktr.ee/help/en/articles/9036585-change-profile-image
- Linktree's official featured-layout guide distinguishes compact actions from content-led previews. Taplo's recipes are for service/info panels, with real content and independent button controls: https://linktr.ee/help/en/articles/8580581-use-featured-layouts-links
- Framer documents reduced-motion handling as a functional constraint. Preserve composition and remove nonessential movement: https://www.framer.com/help/accessibility/

## Engineering boundaries

Same schema, appearance resolver, actual renderer and editor history. No new library or backend integration. New read-only control previews mount only near the visible shelf; no fake HTML rendering or data mutation. Local surface roles, muted text, separators and focus are derived for inverted sections; explicit border and padding choices must remain effective with emphasis enabled.

## Verification and remaining work

Production build/typecheck, targeted ESLint and diff check pass. Full unit run: 219 passed, 39 database-dependent skipped. Final affected Chromium run: 64 passed; two existing upload/published-asset journeys also passed. Native Firefox/WebKit: 24 passed on final source. Checks cover 320/390/1440 profiles, light/dark treatment and hover contrast, transparency/aspect and cover composition preservation, no-photo/long-name fallbacks, selection, rapid independent undo/redo, reload, saved-style compatibility, onboarding and Google-only review behaviour. No physical-device claim.

Visual review caught and corrected viewport-sized headings inside narrow desktop columns. Engine checks also corrected an emphasis rule that overrode explicit padding/borders, and inverted panels whose hover/focus and outline/soft buttons inherited page-level roles. A stale selection test targeted an unconnected Google review block; it now tests a ready hours section rather than inventing review data.

Actual captures and a three-column mobile review board: outputs/Taplo-handoff/review/profile-engine/. Cross-engine captures: review/profile-engine-native/. These are actual page-renderer output, not generated mockups.

Frontend upload storage keeps bounded, uncropped derivatives in the browser. Cloud storage of full original files, server derivatives and authentication are not implemented here.

The full frontend goal remains active. Remaining: customer example redesign and neutral identities, owner flows beyond these controls, collection/product/gallery presentation, remaining booking/widget detail states, marketing/frame/film refresh, physical-device keyboard review and fresh performance measurement. Backend publishing/authentication/payments/notifications/Google import remain a later phase. Never describe local simulated outcomes as live integrations.
