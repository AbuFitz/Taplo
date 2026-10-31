# Taplo owner experience: design and interaction contract

This is a working design study and implementation contract, not a claim of completed usability testing. Research, observed browser defects and design judgement are distinguished below. A package installation is not evidence that an experience works.

## Product criteria

The first-time owner should see their business taking shape while making manageable decisions. The returning operator should reach a task without navigating an editor maze. The customer should recognise the business and find its main action. Keyboard, touch and low-vision users need equivalent control and recovery. These are evaluation perspectives, not fictional research participants.

Taplo's visual identity: white work surfaces; black, white or clear actions; selected states with a visible mark; restrained colour in art, page identity and coordinated surface roles. Avoid a sea of identical cards, repeated introduction labels, decorative gradients behind text or unexplained icon-only actions. Colour is not the only selection signal. Customer pages retain their own styling system.

## Preview contract

Persistent live feedback is fundamental on mobile. It must not be replaced by an optional 'See your page' button. The compact preview shows a readable window into the real renderer at the current mobile width, not an illegible whole phone scaled to fit a thumbnail. It follows the relevant part of the page: identity, action, services or selected block. Owner controls occupy their own scrolling region; the preview stays outside that scroll. An expand affordance provides inspection, not initial access.

The opening type/name steps reserve roughly a fifth of the mobile screen for preview. Design gets more room; pricing gets less because its comparison needs space. These are initial dimensions to verify, not universal magic numbers. The desktop stage shows the full phone at a natural fitting size rather than an arbitrary close crop. Keyboard opening temporarily yields preview space to the field and actions; closing it restores the preview automatically. Expansion must preserve the same iframe/draft. The page should not flash or reset on each choice. Respect reduced motion.

## Experience map

| Task | Composition and decision | Feedback and preview | Recovery / edge cases |
|---|---|---|---|
| Choose business type | Short icon/label grid, selected outline and check. Custom search replaces the grid. | Real starting composition adapts. No automatic forward navigation. | Back to categories; keep custom wording; no forced category photo. |
| Name the business | One named field; generated link below. Link editing is optional and clearly labelled. | Preview follows identity, not a large cover photo that hides the name. | Explain invalid/duplicate link locally; preserve entered text. |
| Add visual identity | Optional bio, logo and cover grouped together. | Actual asset appears in the renderer; typography remains a good fallback. | Replace/remove/reframe without losing business details. |
| Style during setup | Coordinated Colours first, Looks beside it; deeper arrangements optional. | Palette and composition affect the same live document; use a larger preview budget. | One Undo; preserve content; explain plan differences. |
| Main action | A short set of customer outcomes; reveal only the selected channel's fields. | Scroll preview to the action. A selected action must match visible output. | Correct keyboard type; optional skip; reject invalid contact values clearly. |
| First service/product | One complete record before a catalogue. Mobile service fields have readable labels. | Preview follows offer, not page top. | Existing records reused; archived records retained; pricing modes explained on demand. |
| Plan preference | All monthly prices visible, one selected visual comparison; full details expandable. | Artwork explains the chosen capability, not fabricated earnings or analytics. | Free remains initial; no automatic upgrade, fake discount or payment success. |
| Finish setup | Show what exists and what is left. Account/provider requirements are contextual. | Preview is the actual draft. | Enter Studio without pretending publication/account/payment succeeded. |
| Studio overview | Identity, page editing, real attention items and management destinations. | Clear draft/saved/published state; no invented stats. | Show the next useful task. Avoid multiple competing primary actions. |
| Content order | A vertical list with dedicated touch handles. Main row opens the block. | Preview follows selection and actual order; movement is one history action. | Menu movement and keyboard movement; Undo; do not hijack ordinary scrolling. |
| Add a block | Search plus format-specific pictures; only one creation flow. | Reuse actual business content where possible; conceptual art stays labelled by purpose. | No empty block silently added; no nested duplicate modal; retain incomplete entry when appropriate. |
| Edit a block | Content and Appearance separated; controls explain their effect visually. | Persistent preview shows the selected block. | Undo/save/reload; removal keeps underlying records; no destructive surprise. |
| Design | Visual task navigation, one of Colours/Look/Background/Type/Buttons/Surfaces/Layout/Readability at a time. | Real renderer; colour fine tuning behind an intentional disclosure. | Back returns to task list; saved looks and reset remain; recommendations optional. |
| Profile composition | Identity, layout, images and main action as distinct tasks. | Header preview follows identity; preview layouts must reflect supported options. | No loss of contact details; long names and missing logos must look intentional. |
| Crop an image | One clear crop surface; action labels name the asset; essential subject kept visible. | Show actual cropped result and cover positioning. | Cancel, replace, remove, oversized/invalid file and storage failure. |
| Calendar/availability | Agenda on small screens; working hours separate from individual requests. | Real booking states, local time labels and selected dates. | Empty day, conflict, time off, expired request, rescheduling, provider absent. |
| Services/products/team | Shared search, readable rows, task-specific details and images. | Edits feed the same records used in page blocks. | Validation, archive/recovery, no-result state, plan limits and long labels. |
| Share / QR | Link, share card and business-branded QR with a common destination. | Preview/download match; explain export use only when needed. | Unpublished draft has no fabricated public URL; decode exports; verify transparent code on its intended background. |
| Publish | A deliberate action separate from saving a draft. | State what was actually published and where. | Missing requirements, unavailable provider, failed save; never claim server publication for a browser-only draft. |
| Help | Small task-specific invitation; manual illustrated steps. | Show the action/result being described; essential instructions also in text. | Close, Back, replay, focus return; no timer-driven interruptions or autoplay while typing. |

## Microinteraction rules

- A selection shows a mark and a change in surface/outline, without moving the choice under the finger.
- Continue stays in a stable reachable footer. It may explain missing fields, but never silently does nothing. Back belongs in the mobile header; Skip is secondary beside Continue.
- Headings/instructions scroll with long forms, freeing working space. No form body is hidden behind a fixed footer.
- Text inputs use suitable keyboard, autocomplete, casing and input modes. A field label must describe the requested information; 'Web address' is too ambiguous for an owner choosing their Taplo handle.
- Switching task resets that task's working scroll where appropriate; returning from an individual block preserves the list context.
- A help popup cannot obscure an essential active input and must fit the current viewport. Its close control is always reachable.
- Motion explains state change. Ambient movement stays outside text and controls; honour reduced motion and pause hidden-document shaders.
- Menus, destructive actions, upload/crop, selected looks, empty states and errors are designed states—not leftover browser defaults.

## Research used and interpretation

- Apple Entering Data: minimise unnecessary typing and prevent errors near entry. Applied through generated handles, choices, focused fields and suitable keyboard modes. https://developer.apple.com/design/human-interface-guidelines/entering-data
- Apple Virtual Keyboards: treat keyboard and interface as one layout. The web implementation uses visualViewport and scrollable controls; physical-device verification remains necessary. https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards
- NN/g Visibility of System Status: feedback should make the result of an action clear. Applied as persistent live rendering and truthful saved/published states. https://www.nngroup.com/articles/visibility-system-status/
- NN/g Progressive Disclosure: initial visibility signals importance; advanced options should remain discoverable. Applied through task navigation and optional fine tuning, not removal of capabilities. https://www.nngroup.com/articles/progressive-disclosure/
- NN/g Recognition and Recall: visual cues reduce memory demands. Applied through previews and purposeful library diagrams, not unlabelled icons. https://www.nngroup.com/articles/recognition-and-recall/
- W3C Focus Not Obscured: fixed content can hide keyboard focus. Applied as a design constraint for footer, keyboard and popup layouts. https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
- Linktree's official design guidance: task separation and direct preview. Its brand expression is reference material, not an implementation to duplicate. https://linktr.ee/help/articles/8614125-customize-linktree-design
- Paper Mesh Gradient: organic low-speed field with static fallback; existing Apache-2.0 package. https://shaders.paper.design/mesh-gradient

## Verification gate

Use 360px and 390px narrow screens, a short-height screen, tablet and desktop. Check the complete state transition: select → visible change → Undo → save → reload. Inspect initial state, selection, deep editing, scrolling, overlay, keyboard, empty, invalid, pending, success and failure states where applicable. Do not call an experience finished because its component mounts or its build passes.

Current browser evidence and remaining limits belong in the PR, with commit IDs. CSS viewport checks are not certification of physical iOS/Android keyboards or Safari gestures. New mobile preview dimensions and guidance need rendered review before acceptance. A design study is not a substitute for observing real business owners using the product.

## Observed correction: colour step

In preview af73a77 at 390px, the persistent name/action window stayed visible while selecting Sage. Rendered --tp-background changed from #ffffff to #edf1ec, and Undo restored #ffffff. Inspection also exposed legacy !important rules forcing the palette to two columns. Those layout locks are removed; setup explicitly uses a compact three-column palette. This is a rendered observation, not an assumption that three columns are always appropriate for arbitrary future palette counts.

## Original visual language and asset-aware profiles

The Studio palette now distinguishes iris/periwinkle, sky, mint, rose, apricot, butter, lilac, pistachio and silver. Primary actions stay neutral. The original SVG scene set has separate dimensional compositions for services, calendar, products, team, reviews, analytics, settings and design. Gradients describe material, facets describe depth and shadows provide grounding. It uses no invented dashboard metrics. SVG remains crisp at mobile/desktop sizes without loading a 3D engine or running a continuous animation loop. Scene entrance and hover motion respect reduced motion.

Every management header uses the relevant scene at a deliberately smaller mobile size. Product/vehicle rows show the real item's image, price, availability and clear actions. Team initials use varied coordinated backings. The More navigation item reflects when the owner is inside its destinations. Setup category icon colours are individually chosen rather than a repeated three-colour cycle. Four additional tested customer palettes—Ice, Butter, Periwinkle and Graphite—remain optional and do not recolour existing drafts.

Profile direction is a deterministic suggestion from explicit inputs, not an AI claim about taste. It considers logo/cover presence, image proportions, long names and category. Logo colour takes priority over photograph colour. A monochrome mark gets a neutral direction. Category colour is a fallback suggestion; business-name wording is never used to guess brand colours. Portrait cover crops get an explanatory note. Owners see a real-renderer arrangement preview and colour comparison before accepting; layout and colour choices are separate undoable actions. Existing picture/gradient wallpaper is retained. Accepting colours updates an explicit solid wallpaper as well as colour tokens, fixing a mismatch between saved colours and visible background.

The profile layout selector leads with suitable arrangements and keeps all arrangements reachable through Browse every arrangement. Photo-required arrangements are disabled without a photograph. Saved content and existing selected layouts remain intact.
