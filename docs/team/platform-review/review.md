# Platform review through the team lens

Sources: rendered marketing home, product page, how-it-works, pricing, dashboard (first run) at 390 and 1440; setup journey at both widths; the 12 looks; the nine profile arrangements; the inspiration gallery and detail. Limits: no real users or devices; analytics are not collected, so no funnel numbers exist.

## What is working
- Marketing home: confident hero, real page examples, clear plan summary. Strong foundation.
- Looks and arrangements now adapt to logo, cover and name length (profile matrix), with ranked suggestions.
- Setup reaches a designed page from a name alone; Save and exit is labelled.
- Inspiration lets a visitor compare looks and arrangements per example.

## Findings and owners
| # | Finding | Lens | Fix | Status |
|---|---|---|---|---|
| 1 | Dashboard first run is text-heavy, uses "stays in this browser" jargon, no picture, ticks as decoration | UX architect, microcopy, illustration | Replace with an illustrated first-run: one message, one action (Start setup), a three-step checklist | planned |
| 2 | Empty and locked states vary: some say "Not built yet · Phase 5" | dashboard, microcopy, illustration | One `EmptyPanel` pattern with a code-drawn illustration, honest copy, one action | analytics done; bookings, upgrade, verify, connect to do |
| 3 | No short feature loops in the product or dashboard to show tools in action | motion, illustration | Code-drawn animated explainers (reduced-motion safe) for share/QR, booking, gallery, services, analytics; reuse in marketing | planned |
| 4 | Marketing relies on static frames and two films | growth, motion | Add a short looping strip per feature on `/product/*`, built from the real renderer | planned |
| 5 | Example cards on dashboard mix looks inconsistently; unclear why each is shown | UX architect | Label each with its look and the job it demonstrates; link to inspiration | planned |
| 6 | Legacy specs assert old defaults (garage, editorial, none|subtle) | design system manager | Update expectations to the current system | in progress |
| 7 | Plans and limits provisional | CEO strategist | Keep the visible notice; founder approves before launch | open |
| 8 | No "Continue setup" route on the home page for returning visitors | onboarding, growth | Add a resume entry when a draft exists | planned |
| 9 | Figma file mirrors tokens only; no component or screen frames | visual director | Add key screens and components once the system settles | planned |

## Sequence
1. Fix specs and unblock the suite (design system manager).
2. Ship the empty-state set and the dashboard first run (UX architect, microcopy, illustration).
3. Feature explainer loops, then marketing strips (motion, growth).
4. Resume entry and dashboard example labelling.
5. Figma screens.

## Metrics to instrument later (provisional)
Setup completion, time to first designed page, share action within a day of publishing, upgrade click after a plan-limit prompt.
