# Taplo Studio experience architecture

Current interaction contract: [experience-system.md](experience-system.md). The persistent adaptive mobile preview supersedes earlier optional-preview decisions recorded below. The form and editor retain live feedback; expanded inspection is optional.

## Main journey

Setup produces a draft, Studio helps finish it, and the page editor shapes it. Business records remain independent from presentation. Changing a look never replaces those records. Mobile is the primary composition; desktop offers more working room around the same page.

## Setup

A slim continuous progress bar has an accessible value and no visible step count. Mobile has one scrolling form with a persistent action footer: Continue remains visible, Skip sits beside it, and Back is in the top header. The heading scrolls with the content, freeing space when long content or a keyboard needs room. Preview is an explicit mode, not a second surface competing with the form. Desktop retains a side-by-side full page and form without an arbitrary opening crop. Category selection uses icons and labels rather than ambiguous stock photography. White is the platform background and primary actions are black. A slow black-and-white gradient flows across the full setup canvas behind the desktop phone. Only the background position changes; no rectangular layer translates or rotates. Mobile uses a white task surface. Reduced motion keeps the desktop field still.

The identity step includes a separate optional cover-photo section. Its large upload surface opens the existing crop flow, then shows the actual cover with an Adjust action. Replace, focal-point adjustment and removal reuse the shared image control; image selection updates the same business identity used by the live renderer. No extra required registration step.

New drafts start with Signature: white, black rounded actions, Geist, a floating profile and softly raised blocks. Only six starting looks are exposed in registration; older looks remain resolvable for saved documents. Looks and Colours stay distinct. Deeper profile controls stay optional.

## Studio

The hierarchy is business identity → next useful action → current page → management destinations. The owner can reach Page, Services, Bookings, Reviews, Team, Products, Analytics and Settings through one shared navigation. Empty states and real data remain; no manufactured metrics. Management surfaces share spacing, fields, typography and floating material rather than bordered nested panels.

## Page editing

Content, Profile, Design and Settings remain the four destinations. On mobile they open as full working screens, starting with Content. Individual block controls use a contextual drawer; root screens no longer live inside drawers over a full-screen preview. Preview is a deliberate separate mode. Undo, redo and publishing remain grouped in the footer, with missing requirements available on demand. The focused mobile editor hides the separate Studio dock; its menu provides workspace navigation, freeing the bottom of the screen. Content is one vertical list matching page order, on touch and desktop. A dedicated handle owns dragging; the row owns selection. Movement also works through its menu and keyboard controls. The add library uses visual choices; suggestions are not repeated in the main groups. All record entry stays in the same flow.

## Contextual help

The previous dashboard animation is removed. Help is attached to Content (building blocks), reorder controls and Design. The owner opens a floating guide at the moment it is relevant. Each guide has three manually controlled illustrated steps, descriptive text, Back/Next, Close and Got it. No timers, automatic modal interruption, autoplay or forced tour. Completed-topic preferences use versioned optional local storage; help remains available afterward. Radix handles focus return, dismissal and collision positioning. The illustrations are interactive diagrams, not recorded videos. Production short recordings should be captured from verified interactions after the editor settles, with captions and no essential information available only in video.

Future event-based suggestions must name a user benefit: first empty editor, first add, repeated reorder cancellation or attempting to publish incomplete details. A suggestion should be a non-blocking prompt beside the relevant action, not an automatically opened film. Never infer hesitation from a timer alone. Never cover the active input or drag target. Dismissal suppresses recurrence for that topic/version.

## Design previews and plan rules

Draft preview renders the currently selected design even when the saved plan is Free. Published Free output uses the neutral Signature composition; paid plan rules are unchanged. The design step states this difference explicitly. Preview must never silently pretend that the selected paid appearance was published.

## Verification limits

Unit checks cover default styling, category adaptation, serialized theme selections and Free draft/published separation. The managed preview runner currently supplies Vite flags to Next.js and exits (`unknown option --host`). Browser review of this pass needs the deployed branch. Physical-device safe areas, touch dragging, keyboard overlap and popover placement are not certified by a successful build.


## Workspace rebuild (31 October)

The owner shell is replaced by WorkspaceNav and a new route-aware shell, rather than modifying the previous Studio phone/rail composition. Desktop has grouped Workspace/Business navigation, a business identity, a breadcrumb/action header and one content canvas. Mobile has a four-item bottom navigation and a complete navigation sheet; focused editing uses the same destination list from its menu.

Overview is rebuilt as a page hub with a draft/published state, next required action, direct business-record links, real booking/enquiry counts and upcoming bookings. Overview no longer embeds a competing page preview. The page card leads to editing and its publishing checklist is expandable. Services and products have search and denser action rows; original record ordering, archive/recovery and validation remain. Settings has separate Plan, Connections and Workspace data sections. Analytics explicitly shows unconnected measurements, never fabricated data. Team, reviews, booking/calendar/availability and editor controls use the same owner typography, navigation, spacing, fields and surfaces. Customer themes are unchanged by this rebuild.

The Something else category path now has one search-or-enter field. Typing supplies the custom business label; choosing a recognised match applies that category. There is no separate custom-type field followed by another search box.


## Registration refinement from the supplied Linktree recording

The initial closer desktop crop was superseded after feedback: the page now fits its available stage. Mobile preview-above-sheet was also superseded by the focused form and explicit preview mode.

Colours is the first tab in the style step. Signature remains the initial white-and-black design; each coordinated swatch shows background, surface, text and action roles. Looks remains beside Colours. The screen title is Style your page, so it covers both choices. These changes follow the recording's progressive disclosure and predictable layout without reproducing its branding.

Browser review now works on Vercel previews. The rebuild was walked from custom category through registration into Studio; service search, service editing/saving and Settings navigation were exercised. All management routes were inspected at 360px and 390px in real application iframes, with no document-level horizontal overflow. Overview was captured at 390px and 1280px. This is responsive browser verification, not certification of physical-phone keyboards, touch dragging or Safari behaviour.


## Issues found in rendered mobile review

A workspace stacking context placed the full-screen preview above the portalled editor sheet. Its z-index is restored below the sheet; block move-menu and Undo were then verified in the preview. Legacy global block-grid rules also overrode the intended list and created 168px tiles; an explicit row class now resolves to 72px controls. Root panels have since moved out of the drawer entirely. Individual block controls use a registered 72% point. Visibility controls have moved into each row menu, freeing space for readable content and a dedicated drag target. The sortable strategy is vertical-list specific. Physical touch dragging and keyboard drag remain unconfirmed; the accessible move menu was exercised successfully.


## Focused-form correction (31 October, pending browser review)

The crowded mobile composition has been replaced structurally. Category selection shows a neutral selected surface, black outline and check. Something else replaces the category grid with its own search screen, with an explicit return action. The name step generates the Taplo link automatically; its optional edit control is labelled Your Taplo link. Bio, logo and cover are grouped under optional profile personalisation. Mobile service entry uses labelled fields over two rows instead of narrow desktop columns. Long headings and instructions scroll with the form; actions stay separate. The live iframe remains mounted when toggling preview so draft state does not reset.

The focused mobile editor starts on the actual ordered content list. Root tabs retain one task per screen, preview opens only on request, and an individual block opens a contextual sheet. Help is available under How it works. Dragging and menu movement use existing dnd-kit history-aware actions; records and theme contracts are preserved. Overview has a compact page launchpad and expandable publishing requirements rather than an embedded phone and several simultaneous calls to action.

Code checks passed: 397 unit tests, 39 skipped; TypeScript; changed-component ESLint; production build. This redesign has not been browser-verified or deployed. The managed runner fails because it injects Vite-only flags into Next.js. Manual Vercel deployment was blocked by automatic approval review because the team-access grant has not been approved. Existing deployed screenshots do not show these changes. Physical keyboard, touch dragging, focus return and actual safe areas require verification on the new preview before declaring the work complete.

## Visual and task-led design pass

Studio uses white working surfaces and monochrome actions, with sage, lilac and muted sand reserved for identity artwork, navigation landmarks and explanatory diagrams. Customer page colours remain owner controlled. A marketing-wide button override now excludes setup and Studio, allowing those surfaces to own their control shapes.

Setup's old travelling linear-gradient layer is replaced by the already-installed Paper Mesh Gradient, a slow organic silver field. CSS supplies a static fallback and error boundaries preserve the form if the shader fails. The shader stops animating for reduced motion and hidden documents, caps rendered pixels, and only occupies a restrained header field on mobile. Paper shaders 0.0.82 is Apache-2.0; no new service or dependency was introduced.

Plan preference uses four visible monthly prices, one selected visual scene, four immediate highlights and an expandable complete feature list generated by the existing entitlement resolver. Free remains the initial choice. Recommendations are labelled and do not change the selection. No trial, discount or charge is invented. All prices and limits remain in the existing plan definitions; the preference disclosure remains visible.

Design opens one visual task at a time: Colours, Starting look, Background, Typography, Buttons, Block surfaces, Layout and motion, Readability. Each task reuses the shared appearance model and editor history. Reset remains available. Profile uses the same task navigation for identity, layout, images and main action. The underlying saved appearance contract and customer renderer are unchanged.

Block-library illustrations now communicate format: calendar/time choice, team members, gallery, reviews, lists or an action. They are conceptual SVG/HTML/CSS illustrations, not fabricated customer records. User-provided content still replaces conceptual art where supported.

Guidance is intentionally opt-in: block/reorder help in Content; design help in the Design task list; booking help beside booking controls and in the overview; sharing help beside sharing/export settings. Each has three manually controlled illustrated steps, focus return, dismissal and reduced-motion support. These are interactive walkthroughs, not exported video clips. No automatic tour interrupts typing or dragging.

Sources inspected: https://shaders.paper.design/mesh-gradient ; https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale ; https://linktr.ee/help/articles/8614125-customize-linktree-design . Sources inform responsibility and interaction structure, not a claim that Taplo has surpassed those products.
