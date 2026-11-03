# Research ledger

Accessed 23 October 2026. Primary sources only for technical recommendations. Source dates are included where known; old behavioral research is not represented as a 2026 attention benchmark. Recommendations below are design inferences unless explicitly described as direct facts.

## Reference translation

| Source | Direct observation | Taplo decision |
|---|---|---|
| [Linktree homepage](https://linktr.ee/) | Large direct promise, clear starting action, people/business scenes paired with finished page examples; customization and sharing are separate stories. Browser inspected. | Show the owner's world and its useful page together. Each section should explain one outcome with a distinct visual. Do not reuse their colour identity, copy, people or imagery. |
| [Linktree templates](https://linktr.ee/s/templates) | Phone-shaped populated examples, category navigation, separate detail links. Browser inspected. | Lead Taplo's gallery with mobile outcomes. Use style and business-goal discovery without locking themes to industries. This is inspiration, not proof that this exact layout converts better. |
| [Framer](https://www.framer.com/) | Official page content inspected; platform, solution and resource navigation. Full rendered visual audit remains open. | Candidate reference for typography and compact navigation. Do not claim authenticated Framer editor behavior was tested. |
| [Apple iPhone](https://www.apple.com/iphone/) | Official page uses product-specific feature stories and comparisons. Full rendered motion inspection remains open. | Borrow discipline in focal objects, scale and feature explanations. No requirement that every widget use glass, tilt, blur or springs. |

## Attention and usability

[NN/g, How Long Do Users Stay on Web Pages?](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) — Jakob Nielsen, 11 September 2011. Historical research supports communicating value early and recognizes large variability in visit duration. It does not establish a universal eight-second human attention span. Taplo implication: test whether a new business owner can explain the product and find the next step after a short exposure; use five seconds as a chosen research task, not a scientific deadline.

[NN/g, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/) — Therese Fessenden, 15 April 2018. Desktop eyetracking found attention concentrated toward earlier page areas. The study is not Taplo-specific and does not establish current mobile percentages. Implication: put product evidence near the promise, maintain a clear reason to scroll, and avoid hiding every meaningful interaction behind a long introduction.

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum). AA target-size guidance specifies 24×24 CSS px or qualifying exceptions; choose a larger approximately 44×44 product target for common touch controls. Provide a non-drag pointer alternative to reordering, visible focus, accessible overlays, readable contrast and reduced-motion behavior. Automated checks alone do not establish conformance.

[web.dev, Web Vitals](https://web.dev/articles/vitals). Assess LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile as field goals. A lab audit is useful pre-launch; Lighthouse cannot directly establish real-user INP. Do not claim these targets are already met by Taplo.

## Tool decisions supported by documentation

- [Anthropic frontend-design source](https://github.com/anthropics/skills/tree/main/skills/frontend-design): original upstream instructions and Apache-2.0 license staged in this pack, with Git blob identifiers in UPSTREAM.md. Use for intentional choices; it is not an automated quality guarantee.
- [Storybook MCP](https://storybook.js.org/docs/ai/mcp/overview): official integration can expose components/docs and support story/testing workflows. Documentation labels AI capability preview. Taplo already has a workbench, so migration is conditional on a demonstrated documentation or tool-access gap.
- [Penpot MCP](https://help.penpot.dev/mcp/): reads and edits focused design files. Requires an actual connection and design file; remote/local modes differ. An account, focused page and credentials cannot be invented or inferred from availability of the documentation.
- [Base UI Drawer](https://base-ui.com/react/components/drawer): supports swipe handling and a virtual keyboard provider. Already declared in Taplo's dependencies. First inspect the installed API and existing wrapper; reproduce a keyboard/scroll defect before replacing a functioning overlay.
- [Chrome DevTools MCP](https://developer.chrome.com/blog/chrome-devtools-mcp): supports browser debugging/performance investigation; article now directs to DevTools for agents. Check current setup docs before configuration. Add only if current browser tooling cannot capture the required trace/network evidence.
- [Motion bundle guidance](https://motion.dev/docs/react-reduce-bundle-size): lazy/limited imports can reduce runtime cost. Motion already exists. Keep runtime UI motion focused and avoid importing a separate animation stack for the same controls.
- [React Three Fiber performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance): WebGL has device/battery costs; demand rendering is supported. Use optional 3D only for a specifically authored marketing scene, with static fallback. Do not require it inside booking or page rendering.
- [Radix Colors scale roles](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale): role-based scales help distinguish surfaces, interaction and text. Already installed; semantic Taplo tokens still need actual contrast verification for their composited surfaces.
- [HyperFrames introduction](https://hyperframes.heygen.com/introduction) and [source](https://github.com/heygen-com/hyperframes): editable HTML-based deterministic video rendering. Candidate for multi-format product stories. Existing film production project should be inspected first. Local rendering, hosted authoring, paid model generation and stock/audio rights are separate cost/permission decisions.

## Facts, proposals and unknowns

VERIFIED: repository/branch, declared package versions, real workbench, shared renderer architecture, seven baseline gallery examples, default Desktop gallery state, visible Claude progress statements.

INFERRED: a clearer mobile gallery and task-oriented editing will better support the stated product goal. This needs user task testing; no uplift percentage is predicted.

PROVISIONAL: all new theme names, fictional businesses, commercial example prices, copy and campaign directions in this pack. They do not change Taplo pricing or establish real customer claims.

BLOCKED / OPEN: incoming deployment identity, actual new screenshots, complete device/browser audit, production integrations, image catalogue beyond the first generated image, actual repository import, demo PageDoc compositions and isolated availability. Six adapted content inputs now pass the pinned repository schema; see fixtures/schema-validation.json.
