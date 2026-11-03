# Reconstructing Studio customisation

Status: recommended reorganisation grounded in the actual post-onboarding editor. Keep capability depth; redesign scope, hierarchy and feedback.

## What already exists

The reviewed editor has Content/Profile/Design/Settings tabs, a widget library, reordering controls, per-block actions, Phone/Desktop and Fit/Actual size preview, Undo/Redo, draft/publication controls and design areas for Colours, Starting look, Background, Typography, Buttons, Block surfaces, Layout & motion and Readability. Source contracts additionally separate page styles from optional widget appearance overrides.

This is considerably richer than the initial empty Studio entry suggested. The fix is not to replace these capabilities with only two templates and two font choices.

## Reorganise by scope

| Scope | Owner task | Primary controls | Secondary controls |
| --- | --- | --- | --- |
| Page content | Decide what customers see | Add, select, show/hide, order and group blocks | Source/filter/featured selections |
| Profile | Introduce the business | Identity, imagery, short text, arrangement, primary action | Focal point, image fit, responsive adjustments |
| Page style | Coordinate the whole mini-space | Current look, Colours and Looks as distinct choices, coordinated type/surface family | Background, detailed type, buttons, spacing and motion |
| Selected block | Present this content | Content, Layout, Style tabs in a contextual inspector | Optional style exceptions and reset |
| Selected popup | Check what a tap produces | Live Item/Service/Cart/Booking preview from the selected block | Approved content emphasis; inherits the business style |
| Business settings | Change operational facts | Relevant source record and policy editors | Permissions and specialist configuration |

Do not move operational price, stock or duration into appearance settings. A contextual source editor can open from a block and return to it. If multiple widgets use an offer, say that editing the offer changes all current presentations.

## Main editor interaction

Desktop: content list and live preview with one active inspector; selecting the preview and selecting the list resolve to the same block. Mobile: clear mode switch between Preview and Edit; selected-block controls in a sheet that keeps a useful preview visible until a focused editing task needs the space. Avoid two independent mobile sheets stacked over a scrollable phone frame.

Selecting Colours does not secretly replace the whole composition. Selecting Looks previews changes and explains what it would override. Owner logo/cover/no-image choices recommend suitable arrangements without blocking alternatives that can work. Wide wordmarks retain proportions. Font, button and block choices should be coordinated by default.

## Inheritance and change visibility

Values distinguish: follows current page; supplied by the current look; explicitly customised. Reset removes the intended override rather than copying a literal default everywhere. “Reset this block” does not reset the whole page. A whole-look replacement previews which manual adjustments are retained/replaced. Undo remains one meaningful operation per user action.

Do not label every preset-derived value as though the owner personally edited it. When more than one control affects the visible result, show effective scope and the responsible source. A design summary should state useful facts, such as “Your products follow the page style; one featured block is customised.”

## Reduce overload with better organisation

Keep advanced controls accessible in context; do not permanently delete them to make the first screen look simple. Reduce repeated explanations, competing setup guides and unnecessary above-the-fold status. Empty/hidden/locked/not-yet-configured are different states. Pricing gates in today's prototype are provisional product decisions, not permanent limits preserved by this blueprint.

Acceptance: an owner changes a product widget to a shelf, previews its popup, changes its accent only, resets only that accent and returns to the page without losing source content or position. Switching looks preserves agreements, source records and compatible content. A new owner can distinguish a visual change from a business-data change without coaching.
