# Customisation teardown: retain the depth, remove the confusion

Edition 0.4 · Direct observations and proposed changes are deliberately distinguished. This is a reconstruction plan, not a claim that every existing control is broken.

| Area | Evidence or concern | Direction | Priority |
| --- | --- | --- | --- |
| Identity density | The FixNow Phone preview repeats its wordmark and full business name inside a tall profile before the main action | Handle wordmarks intelligently; keep a semantic business heading while avoiding redundant visual identity. Reduce padding/metadata repetition and offer intentional compact arrangements | First composition pass |
| Product density | Each current rail item carries a long name, facts, paragraph and separate external action | Keep a useful image/name/price/distinguishing fact on the shelf; move fuller details and native purchase choices into the popup | First product pass |
| Actual Studio access | Initial unconfigured entry concealed the full editor; onboarding-to-Studio revealed it | Make the current workspace/preview/setup state explicit and link to the correct next place | Navigation pass |
| Content and preview state | The sampled Content list showed unconfigured service widgets while the phone displayed labelled starter examples | Clearly distinguish owner draft source readiness from a starter preview. Never let placeholder content become a merchant commitment | Content model pass |
| Action wording | Onboarding selected Request a booking while the sample preview used Book now | Derive CTA wording and confirmation from actual action mode; request, confirmed booking and enquiry remain distinct | Interaction pass |
| Colours versus Looks | Both are real distinct controls and should remain so | Colours changes palette; Looks applies a coordinated visual package. Preview the wider effect rather than making either silently replace unrelated choices | Editor pass |
| Background and palette | Style contracts expose page background colour and a background system; source precedence needs to be understandable | One effective source of truth with explicit precedence; linked controls reflect the same underlying change. Solid, gradient, image and shader settings get relevant fields only | Engine/editor pass |
| Global versus per-block style | Both exist; their relationship can be hard for a new owner to infer | Follow page by default. Show the selected block scope, explicit exceptions and a local reset | Editor pass |
| Preset provenance | Many fields/sections were marked CHANGED in the appearance workspace | Distinguish look-provided values from owner edits; do not imply that every computed or preset value is a manual change. Trace the effective value before diagnosing a bug | Engine/editor pass |
| Surface options | Solid/Soft/Frosted/Outline plus corners, borders, shadows and padding are available | Offer coordinated surface families first and optional fine adjustment in context. Validate corner, opacity, border and text combinations together | Design-system pass |
| Profile arrangements | Optional suggestions, several arrangements and a photo-dependent disabled state already exist | Preserve that flexibility. Recommend using actual logo proportions, cover, name length and contrast; do not force a single identity card | Composition pass |
| Motion | Background pace and layout/motion settings are distinct in the current model | Explain background motion versus interaction motion; keep one reduced-motion contract and a static fallback | Design-system pass |
| Typography | Heading/body, size, case, weight and alignment exist in source contracts | Coordinated pairs first; fuller controls remain optional. Preview wrapped names and real offer text, not only alphabet samples | Design-system pass |
| Block library | A substantial, grouped, category-suggested library is already present | Retain suggestions and free access across types; adapt recommendations to capabilities and existing content, not a restrictive category allowlist | Content pass |
| Ordering | Existing reorder actions and accessible alternatives are present | Preserve them; align list selection, preview selection and contextual editing. A move changes presentation, not source record identity | Content pass |
| Popup appearance | The current product bottom sheet already follows the dark business style | Elevate that shared system: clear title, useful facts, native cart, options, bounded recommendations and consistent close/back. Do not build an unrelated popup-theme editor | First popup pass |
| Preview coverage | Page preview and responsive controls already exist | Add useful state previews for item, service, booking and cart. A beautiful base page alone does not establish a coherent experience | Preview pass |
| Plan gates | Current draft has provisional plans and visible locked-block messages | Review actual packaging after economics. Preserve content on downgrade and explain entitlement without treating today's limits as permanent decisions | Commercial pass |

## Practical editor structure

Keep the useful Content/Profile/Design/Settings separation unless task testing supports another structure. Inside Design, lead with the current coordinated look and the familiar Colours/Looks distinction. Detailed background, typography, surface, button and motion controls are subordinate tools. Selecting a block opens Content/Layout/Style for that block; popup previews are tied to it. Show a visible scope label such as “Entire page” or “Products block” so every change has a comprehensible reach.

The simplification comes from fewer simultaneous decisions and predictable consequences, not deleting customisation or moving all settings into another enormous accordion.

## Smart rules before AI

Recommended deterministic inputs: available images and their aspect ratios; logo ink/proportions; business-name length; content types/counts; operating capabilities; selected composition family; effective background/contrast; user overrides. Recommended outputs: suitable arrangement ordering, safe typography/contrast recommendations, compact block variants, intentional empty states, coherent popup tokens and warnings about incompatible changes. Explain the reason and let the owner reject a stylistic suggestion.

Hard rules protect meaning: never invent stock/credentials/reviews; never make a quoted service look fixed-price; never alter booked duration or agreed policy when a look changes; never solve contrast by hiding essential text. AI can later assist inside the same validated system.

## Completion criteria for reconstruction

An unfamiliar owner should be able to identify the scope of a control, change a look without losing content, override one block and reset it, preview what a product tap does, and return to the correct offer editor without coaching. Test with actual imagery, no imagery, a wide wordmark, long names, few/many offers and a mixture of services/products. Record task errors and observed hesitation; the table above is a design plan, not a completed usability study.
