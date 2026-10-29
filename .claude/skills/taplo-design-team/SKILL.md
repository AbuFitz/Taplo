---
name: taplo-design-team
description: Orchestrates the Taplo product team (strategist, PM, UX research, UX architect, onboarding, microcopy, motion, visual design director, dashboard, illustration, design system, frontend, growth). Use at the start of any new feature, journey, screen or redesign so decisions are traced, reviewed and built through one pipeline.
---

# Taplo design team

Every non-trivial change runs this pipeline. Skip a stage only when it truly does not apply, and say which you skipped.

1. **Strategy** (`taplo-product-strategist`): who is it for, what job, why now, what is out of scope. Output: one-page brief.
2. **Research** (`taplo-ux-research-lead`): how comparable platforms solve it, cognitive-load and identity risks, what we still do not know. Output: findings with sources and confidence.
3. **Architecture** (`taplo-ux-architect`): journey, screen map, wireframe structure, states, edge cases, success metrics. Output: spec the build follows.
4. **Specialist passes** as needed: onboarding (`taplo-saas-onboarding-expert`), copy (`taplo-microcopy-expert`), dashboard (`taplo-dashboard-designer`), illustration (`taplo-saas-illustration-director`), motion (`taplo-motion-designer`).
5. **Phone check** (`taplo-mobile-experience-lead`), then **system check** (`taplo-visual-design-director`, `taplo-design-system-manager`): tokens, components, accessibility, mobile, before anything is built.
6. **Build** (`taplo-frontend-architect`): smallest implementation that meets the spec, behind a runnable spine.
7. **Growth review** (`taplo-growth-conversion-lead`): funnel, instrumentation, what we will measure.
8. **Verify** (`taplo-design-review`): rendered desktop and mobile, populated states, tests, honest limits.

## Rules
- Write decisions down in `docs/team/<feature>/` (brief.md, research.md, spec.md, review.md). Each decision states the options considered and why one won, so the founder can audit it.
- Evidence beats taste: cite a source, a measurement, a screenshot or a test. Mark each claim verified, inferred or unknown.
- Tools: check which connectors are live before assuming a limit (`ListConnectors`). In this project the Figma, LottieFiles and Framer connectors are connected: use them. Still unavailable in the sandbox: real devices, live accounts and payments, and desktop-only editors (After Effects, Jitter, Spline, the Rive editor). Say what was produced instead and what still needs a person.
- The Figma file "Taplo design system" (https://www.figma.com/design/IJjCbpKBGmqmxgcN7UIwGu) mirrors the code tokens. Code is the source of truth; update code first, then the file. The starter plan allows one variable mode per collection.
- Prices, limits and metrics we invent are provisional placeholders and are labelled as such.
- Preserve the existing system: reuse tokens, components and copy patterns before adding any.
- User-facing copy never says "preview", "sandbox" or "demo" unless it is genuinely one.
