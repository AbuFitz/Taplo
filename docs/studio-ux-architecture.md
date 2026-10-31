# Taplo Studio experience architecture

## Main journey

Setup produces a draft, Studio helps finish it, and the page editor shapes it. Business records remain independent from presentation. Changing a look never replaces those records. Mobile is the primary composition; desktop offers more working room around the same page.

## Setup

A slim continuous progress bar has an accessible value and no visible step count. Continue occupies a full-width stable row. Back and Skip sit below, in opposite corners. Category selection uses icons and labels rather than ambiguous stock photography. White is the platform background and primary actions are black. A slow black-and-white gradient flows across the full setup canvas behind the desktop phone. Only the background position changes; no rectangular layer translates or rotates. Mobile lowers its intensity, white controls stay opaque, and reduced motion keeps the field still.

The identity step includes a separate optional cover-photo section. Its large upload surface opens the existing crop flow, then shows the actual cover with an Adjust action. Replace, focal-point adjustment and removal reuse the shared image control; image selection updates the same business identity used by the live renderer. No extra required registration step.

New drafts start with Signature: white, black rounded actions, Geist, a floating profile and softly raised blocks. Only six starting looks are exposed in registration; older looks remain resolvable for saved documents. Looks and Colours stay distinct. Deeper profile controls stay optional.

## Studio

The hierarchy is business identity → next useful action → current page → management destinations. The owner can reach Page, Services, Bookings, Reviews, Team, Products, Analytics and Settings through one shared navigation. Empty states and real data remain; no manufactured metrics. Management surfaces share spacing, fields, typography and floating material rather than bordered nested panels.

## Page editing

Content, Profile, Design and Settings remain the four destinations. The focused mobile editor hides the separate Studio dock; its menu provides workspace navigation, freeing the bottom of the screen. Content is one vertical list matching page order, on touch and desktop. A dedicated handle owns dragging; the row owns selection. Movement also works through its menu and keyboard controls. The add library uses visual choices; suggestions are not repeated in the main groups. All record entry stays in the same flow.

## Contextual help

The previous dashboard animation is removed. Help is attached to Content (building blocks), reorder controls and Design. The owner opens a floating guide at the moment it is relevant. Each guide has three manually controlled illustrated steps, descriptive text, Back/Next, Close and Got it. No timers, automatic modal interruption, autoplay or forced tour. Completed-topic preferences use versioned optional local storage; help remains available afterward. Radix handles focus return, dismissal and collision positioning. The illustrations are interactive diagrams, not recorded videos. Production short recordings should be captured from verified interactions after the editor settles, with captions and no essential information available only in video.

Future event-based suggestions must name a user benefit: first empty editor, first add, repeated reorder cancellation or attempting to publish incomplete details. A suggestion should be a non-blocking prompt beside the relevant action, not an automatically opened film. Never infer hesitation from a timer alone. Never cover the active input or drag target. Dismissal suppresses recurrence for that topic/version.

## Design previews and plan rules

Draft preview renders the currently selected design even when the saved plan is Free. Published Free output uses the neutral Signature composition; paid plan rules are unchanged. The design step states this difference explicitly. Preview must never silently pretend that the selected paid appearance was published.

## Verification limits

Unit checks cover default styling, category adaptation, serialized theme selections and Free draft/published separation. The managed preview runner currently supplies Vite flags to Next.js and exits (`unknown option --host`). Browser review of this pass needs the deployed branch. Physical-device safe areas, touch dragging, keyboard overlap and popover placement are not certified by a successful build.


## Workspace rebuild (31 October)

The owner shell is replaced by WorkspaceNav and a new route-aware shell, rather than modifying the previous Studio phone/rail composition. Desktop has grouped Workspace/Business navigation, a business identity, a breadcrumb/action header and one content canvas. Mobile has a four-item floating dock and a complete navigation sheet; focused editing uses the same destination list from its menu.

Overview is rebuilt as a page hub with a draft/published state, next required action, direct business-record links, real booking/enquiry counts and upcoming bookings. The page snapshot is supporting material on desktop, hidden on compact screens where it was competing with work. Services and products have search and denser action rows; original record ordering, archive/recovery and validation remain. Settings has separate Plan, Connections and Workspace data sections. Analytics explicitly shows unconnected measurements, never fabricated data. Team, reviews, booking/calendar/availability and editor controls use the same owner typography, navigation, spacing, fields and surfaces. Customer themes are unchanged by this rebuild.

The Something else category path now has one search-or-enter field. Typing supplies the custom business label; choosing a recognised match applies that category. There is no separate custom-type field followed by another search box.


## Registration refinement from the supplied Linktree recording

The opening desktop question uses a closer crop of the real preview, with a modest camera pull-back after category selection. The iframe stays mounted. Mobile keeps the existing preview-above-controls composition and does not inherit desktop zoom. Reduced motion remains respected by the shared camera class.

Colours is the first tab in the style step. Signature remains the initial white-and-black design; each coordinated swatch shows background, surface, text and action roles. Looks remains beside Colours. The screen title is Style your page, so it covers both choices. These changes follow the recording's progressive disclosure and predictable layout without reproducing its branding.

Browser review now works on Vercel previews. The rebuild was walked from custom category through registration into Studio; service search, service editing/saving and Settings navigation were exercised. All management routes were inspected at 360px and 390px in real application iframes, with no document-level horizontal overflow. Overview was captured at 390px and 1280px. This is responsive browser verification, not certification of physical-phone keyboards, touch dragging or Safari behaviour.


## Issues found in rendered mobile review

A workspace stacking context placed the full-screen preview above the portalled editor sheet. Its z-index is restored below the sheet; block move-menu and Undo were then verified in the preview. Legacy global block-grid rules also overrode the intended list and created 168px tiles; an explicit row class now resolves to 72px controls. Content opens at the tall registered snap point so organising blocks has room; other root panels use the registered 72% point, and contextual selection can stay at peek. Physical touch dragging and keyboard drag remain unconfirmed; the accessible move menu was exercised successfully.
