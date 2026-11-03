# Asset and motion direction

Use this playbook only when an asset or motion treatment has a concrete job in the reviewed direction. Do not run it as a prerequisite to every screen. The still interface, typography, information hierarchy and no-image states remain independently buildable.

## Write the asset job before producing

Record the intended user understanding, placement, medium, subject, aspect ratios, mobile crop, text/alpha constraints and source of truth. Distinguish three jobs:

- **Product proof:** show actual Taplo output or interaction. Capture the real renderer and representative data; do not generate a fake interface in an image.
- **Business identity:** support the particular business's atmosphere, service or work. Use authorised real assets or clearly labelled fictional demonstration material; a generated salon is not evidence of a customer's premises.
- **Explanation/personality:** an original illustration or motion unit clarifies a concept or gives a specific brand expression. Name that concept; “make it less boring” is not an asset brief.

Specify whether an asset is content, a control, informative decoration or purely decorative. This determines alternative text, semantic exposure and acceptable omission. Put essential text and controls in the accessible interface, not baked into pixels.

## Choose the medium deliberately

| Need | Useful medium | Review focus |
|---|---|---|
| Real page/feature evidence | Actual renderer capture or functioning embedded example | Current build, truthful capability, readable crop, no personal data |
| Precise UI/diagram/icon | HTML/CSS/SVG or existing icon system | Geometry, scale, semantics, consistency, real responsive behaviour |
| Photographic atmosphere or authored raster illustration | Available image generation or verified licensed imagery | Subject plausibility, visual direction, light/texture, composition, mobile crop, rights |
| Repeatable coordinated illustration set | One shared art specification and controlled variants | Material/light/stroke/perspective consistency, meaningful subject differences |
| UI feedback | Existing CSS/React/Motion capability | Trigger, continuity, focus, cancellation, still/reduced-motion response |
| Narrated/marketing sequence | Available dedicated authoring workflow only when authorised | Story, actual product evidence, sequence, export, sound/rights and accessible alternative |

A connector name is not a medium. Prove the specific Figma/image-generation/Framer/Lottie operation is available. If it is not, choose an adequate supported medium and report the limitation; do not stall the entire design awaiting a new integration.

## Raster/illustration iteration

1. Produce one representative asset against a precise brief. Do not generate a disconnected batch before establishing a shared visual language.
2. Inspect at its actual display size and crop, including a narrow mobile crop. A beautiful full-resolution image can fail as a 180px thumbnail.
3. Check subject, anatomy/geometry where applicable, unwanted text, edges/alpha, light/material consistency, awkward tangencies and distractions behind interface text.
4. Integrate in the real layout before approving the asset. Contrast, balance and hierarchy depend on that placement.
5. Revise the most consequential mismatch in one targeted pass. Preserve accepted invariants rather than rerolling everything.
6. Export appropriately sized versions. Avoid making mobile download a large source master just to display a thumbnail. Keep originals and derived crops separate.

Reject assets whose strongest association is a generic software landing-page kit. Reject stock art chosen only because it is available. A coordinated illustration family needs consistent perspective, stroke/shape language, material, palette and level of detail; matching colour alone is insufficient.

Keep provenance with the asset: file, source URL or generation prompt, creator/provider when relevant, licence/right information actually verified, transformation history and usage intent. Do not infer rights from public availability or a model's assertion. Do not claim an asset is a real person, premises, certification or testimonial without evidence.

## Motion brief

For each proposed treatment specify:

```
Purpose and user action:
Trigger and state before/after:
Element(s) whose relationship must remain clear:
Property/timing/easing and reason:
Interruption, repeated activation and navigation behaviour:
Keyboard/focus/scroll consequences:
Still and reduced-motion treatment:
Evidence needed to review it:
```

Use motion to explain state, relation or consequence. Typical useful cases are a selected look becoming visible, a sheet expanding while preserving context, a save acknowledgement, or a widget moving to its new location. A page-wide zoom or perpetual drift needs stronger justification because it consumes attention without an explicit action.

Use a coherent small set of timings/easings derived from the interface's existing motion language. Prefer compositor-friendly transform/opacity where they serve the concept, but do not animate everything with the same fade/slide. Avoid forced artificial waits, simulated loading and “success” before real persistence. Preserve the owner's still initial recommendation and explicit opt-in animated treatments.

Layout continuity matters more than flourish. A transition should make the new state understandable without moving active inputs away from the keyboard or losing the user's scroll position. Manage focus as part of the state transition; never let the moving visual replace a semantic state announcement.

## Motion verification

Review the still start/end states first, then the actual trigger and intermediate behaviour. The default capture adapter reduces/disables motion for deterministic screenshots, so those captures alone do not verify the animated treatment.

Provide an ordinary-motion recording or timed sequence and a reduced-motion capture. Verify:
- single and repeated activation, rapid reversal and interrupted navigation;
- no blank frames, clipping, layout jumps or unintended scroll changes;
- useful content remains readable and controls remain operable;
- the animation ends in the correct persisted state, not a visually convincing temporary state;
- no excessive work/large asset blocks the primary interaction;
- reduced motion retains feedback and meaning without forcing the same movement.

Separate observed runtime smoothness from measured frame/performance claims. A nominal duration does not prove a treatment feels natural. A downloaded Lottie file does not prove style fit, correctness, licensing or acceptable payload.

## Acceptance

An asset passes when it serves its stated job in the integrated layout, matches the reviewed direction, has adequate provenance and responsive treatment, and preserves an intentional fallback. Motion additionally passes its actual trigger/interruption/reduced-motion checks. The critic may return revise or unable-to-assess; no attractive source image or library name substitutes for that evidence.
