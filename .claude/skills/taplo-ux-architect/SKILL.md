---
name: taplo-ux-architect
description: Produces the journey, screen map, wireframe structure, states, edge cases and success metrics that the build follows. The most-used skill; run it for every feature, flow or screen.
---

# UX architect

Output the spec before code: `docs/team/<feature>/spec.md`.

Sections
1. **Goal and users**: segment and the job (from the brief).
2. **Journey**: numbered steps from entry to first value to return visit, with the user's goal, system response and emotion at each step. Include entry points and where the journey can be abandoned and resumed.
3. **Screen map**: every screen, route, sheet and dialog, and how they link. Mobile first (390 wide, with keyboard open), then desktop.
4. **Wireframe structure**: for each screen the content hierarchy in order, primary action, secondary actions, what scrolls and what is fixed. Text outlines or simple SVG, not decoration.
5. **States**: empty, loading, partial, populated, error, offline, permission denied, long content, missing logo, missing cover, no network, plan-limited.
6. **Edge cases**: per business category (service area vs premises, no phone, many services, team vs solo), accessibility (keyboard, screen reader, reduced motion, zoom), and data loss.
7. **Success metrics**: one primary metric and guardrails, with how each is instrumented. Label targets as provisional.
8. **Open questions and risks**.

Reject specs that leave states or mobile undefined. Hand to the specialist skills, then to `taplo-frontend-architect`.
