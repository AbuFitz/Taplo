# Mobile registration redesign and interactive light

24 October 2026. Owner rejects the previous mobile split and gradient responsiveness. Desktop composition remains liked. This supersedes the previous mobile overlap treatment, not its data, crop, accessibility or persistence requirements.

## Decision brief

Audience: a local business owner setting up from a phone, often interrupted and using the system keyboard. Promise: build a useful business page without configuring a website. Main risks: the preview consumes space before there is meaningful content, unrelated choices appear together, and the keyboard interrupts context.

System/editorial direction: early setup gets an uncluttered full canvas with one question and minimal fields. The phone becomes prominent at the design and review stages, when there is meaningful content to see. Full-size preview remains one tap away throughout. Desktop keeps the side-by-side workspace. Existing form state and real renderer remain shared; no duplicated mobile wizard or fake examples.

Signature motion: a reactive monochrome light field. Pointer/touch/focus bend the actual field and create a local disturbance that settles; setup stage shifts the light's composition. This replaces moving the whole background layer. Keep autonomous flow, monochrome grain, calm text regions and no interaction-blocking canvas. Motion has a CSS fallback and live reduced-motion/visibility handling.

## Research and evidence

Sources accessed 24 October 2026. Linktree screenshots supplied by the owner are the visual evidence for its identity and theme states; current official help validates behavior, not pixel-level reconstruction.

- Linktree, How to create your first Linktree, updated 12 October 2026: https://linktr.ee/help/en/articles/5434134-creating-your-linktree. VERIFIED: setup prompts introduce first links and themes. Implication: expose work in purposeful stages, not the whole editor at once. Taplo keeps its service/business model and does not imitate creator sign-up copy.
- Linktree, Customize Linktree design, updated 15 October 2026: https://linktr.ee/help/en/articles/8614125-customize-linktree-design. VERIFIED: real content before design; mobile preview above design controls and desktop preview at the right. Implication: reserve a large persistent mobile preview for design, with an explicit full preview elsewhere.
- Apple Human Interface Guidelines, Virtual keyboards, updated 9 June 2025: https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards. VERIFIED: appropriate input semantics/keyboards and keeping relevant controls visible matter. Native keyboard layout APIs are not web APIs. Implication: preserve inputmode/autocomplete and a browser-specific viewport strategy.
- MDN, VisualViewport: https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport. VERIFIED: visible viewport measurements differ from layout viewport when a mobile keyboard opens. Implication: use resize/scroll/focus listeners, independently scrolling fields and an anchored action.
- MDN, VirtualKeyboard API: https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API. VERIFIED: limited browser availability. Implication: do not rely on it as the only keyboard solution.
- web.dev, Test forms across devices and platforms: https://web.dev/learn/forms/cross-platform-testing. VERIFIED: keyboard/focus and multiple device contexts need explicit testing. Implication: test fast input, return/back, crop, reload, narrow widths and native browser engines; do not label desktop emulation physical-device testing.
- Paper shader docs: https://shaders.paper.design/mesh-gradient and core public API https://github.com/paper-design/shaders/blob/main/packages/shaders/src/index.ts. VERIFIED against installed 0.0.82 declarations: ShaderMount supports a fragment shader, direct uniform updates, speed, pixel budget and visibility scheduling. Implication: use the existing engine to render pointer-dependent light, not React re-renders or translating a mesh canvas.
- Rive official runtime: https://rive.app/docs/runtimes/web/web-js. VERIFIED: an authored animation asset/runtime is appropriate for designed interactive illustrations. INFERRED: it adds an asset-authoring pipeline without solving this procedural light field, so do not add it for this job. It remains a possible future film/illustration tool, not a shipped feature.

## Tool decision

Paper ShaderMount + the existing Motion spring system. Custom, compact fragment math for flowing light and local distortion; bounded canvas, direct spring-to-uniform writes, zero React state updates per pointer frame. CSS fallback stays static with reduced motion. No additional runtime library is downloaded. The already installed Paper core 0.0.82 is declared directly in the package manifest/lock, retaining its exact version and existing license.

## Mobile states

1. Identity: no permanent phone consuming the top half. Name, logo prompt, short introduction and optional cover popup. Full preview in the compact top controls.
2. Business type: focused search and a few relevant suggestions; no separate sample-business marketing block competing with the decision.
3. Contact action: concise current action, one contact field and a focused chooser. No sprawling matrix by default.
4. First content: relevant service/vehicle/photos, sensible keyboard semantics, practical details in a popup.
5. Design: real phone above a scrolling tray of actual style choices, separate background/profile controls, stable Continue.
6. Review: meaningful customer preview plus completeness/actions; no misleading public publication, provider or authentication claims.
7. Keyboard: preserve draft and scroll; keep focused field reachable, reduce decorative space, retain continuation and access to full preview. No disabled browser zoom.

## Acceptance and limits

Record actual320/390/768/1440 layouts. Verify ordinary/keyboard-reduced viewport, field focus/back/reload, crop-before-apply, full-size preview, design changes with real content, rapid chooser-to-field input, no horizontal overflow and consistent desktop phone. Pixel tests must distinguish autonomous motion, response to pointer position and reduced static mode. Inspect rendered results as well as test counts.

INFERRED: the proposed arrangement reduces interruption and clutter; it is a design hypothesis, not a measured conversion result. PROVISIONAL: final art direction until owner review. Physical iOS/Android keyboard/touch/performance remains unverified until tested on real hardware. Live authentication, publishing, payments and messaging remain later backend work.

## Implemented outcome and verification

The mobile controller now uses a full input canvas for identity, category, contact and first content. Design/review get the larger shared handset above their controls. A compact, accurately labelled full-size preview is available throughout; the hidden working preview stays mounted so business state keeps updating. Loading geometry matches the new first stage. Keyboard handling now also responds to focus changes and is checked with a reduced viewport.

Setup and existing marketing MonoField surfaces share the new LiquidLight controller and an original fragment shader on Paper's core ShaderMount. Motion springs write pointer/focus/typing/stage uniforms directly. The light bends locally and flows independently; no whole-layer translation is used. Dark marketing light is contrast-limited under white copy, while the desktop backdrop retains the full tonal range. Rendering is capped near 240k pixels on mobile and 650k on desktop. Visibility and live reduced-motion preference remove the shader; unsupported/lost WebGL falls back to a functional static surface. Existing Paper core 0.0.82 is declared explicitly, with no package-version upgrade or additional runtime downloaded.

The first shader integration failed the input pixel checks because a shared resolution uniform had mismatched precision. That was corrected against the installed vertex shader, and the controller now uses the core's explicit lifecycle with guarded construction and disposal. Passing layout checks alone did not qualify the background as working.

Final production Turbopack build/typecheck, affected lint and diff checks pass. All 43 affected Chromium cases pass together, including an unavailable-WebGL flow, and all 52 Firefox/WebKit cases pass together. Mobile and desktop pixel checks freeze the shader clock, change pointer position, verify changed pixels with no canvas translation, then separately verify autonomous flow and exactly zero changing pixels under reduced motion. Both recorded zero browser errors. Existing accessibility checks for the complete setup/design/review flow pass.

Ten actual setup images and the silent 33.88-second, 780×1928 setup walkthrough were refreshed. Separate mobile/desktop live-input light recordings are saved for review and fully decoded. These are actual browser recordings, not the proposed replacement marketing film. Physical-device keyboard/touch/orientation and measured device performance remain unverified. Owner design approval and measured conversion improvement are not implied.

Broader work remains active: deeper profile/section/media/logo composition, business layout variety and adoption, other marketing/product/pricing pages, the rejected film replacement, compact owner portal/navigation/draft continuity, physical-device/performance testing, legal identity facts and the later backend project.
