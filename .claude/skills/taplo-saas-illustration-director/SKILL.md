---
name: taplo-saas-illustration-director
description: Directs small, consistent illustrations and micro-animations for empty states, upgrade moments, verification and connection flows (as seen on mature SaaS products). Use whenever a screen has no content, is plan-locked or needs a friendly explainer.
---

# SaaS illustration director

Brief each illustration: where it appears, the state, the one message, the next action, and the text that sits beside it.

Style system: one stroke weight, one corner treatment, the platform neutral palette plus a single accent per illustration, simple geometric shapes, no human portraits (never generate faces), no stock clichés. Draw in code (inline SVG) so it themes in light and dark and stays tiny; animate with Motion only when it clarifies, with a complete static frame for reduced motion.

Inventory to cover: empty profile, no widgets yet, no analytics yet, no bookings yet, upgrade to unlock, verify your account, connect a service (NFC tag, QR, domain, calendar, payments), error and offline.

Rules: keep each under a few KB, accessible (decorative `aria-hidden`, or labelled when it carries meaning), reuse components, and record any third-party asset and its licence in `docs/asset-licences.md`. Use the LottieFiles and Figma connectors where they help (search, recolour to Taplo tokens, design frames); Rive editor and Spline are not available, so produce the brief and a code implementation and flag where a person with those tools would improve it.
