# 61 · Concrete design system and reference screens

Edition 1.0 · Proposed implementation baseline. Final brand approval remains open; numeric values make the recommendation reproducible rather than immutable.

Open VISUAL-REFERENCE.html for designed reference screens and local interactions. This adds content, hierarchy and component styling beyond the edition 0.9 region atlas. It covers selected core surfaces, not every final screen. The document controls outside the depicted product let reviewers switch screens and themes; those controls are not part of Taplo's customer UI.

## Token baseline

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| canvas | #FAFAFB | #17191E | Frameless app/workspace ground |
| surface | #FFFFFF | #23262E | Sheet, required raised surface |
| inset | #EFF0F4 | #30343E | Input/choice support, restrained grouping |
| text | #20232B | #F2F3F7 | Principal facts and labels |
| secondary | #5F6572 | #BEC4D1 | Supporting content; verify each actual pairing |
| line | #D6DAE3 | #535B6C | Necessary control boundaries, not boxes around everything |
| action | #2B3040 | #E2E6F2 | Platform primary action |
| action text | #FFFFFF | #202431 | Action foreground |
| focus | #4F63D7 | #B4BEFF | Visible focus; selected state also has a non-colour cue |
| danger | #A92D3B | #FFB4BE | Errors/destructive intent with explicit text |

Merchant tokens stay independent. Example yellow/blue/warm ceramic palettes belong to their merchant context. Semantic success/warning/pending colours need verified foreground/surface pairs; do not reuse a merchant accent as a status. Define tokens in one versioned source, exported consistently for web/native rather than copying literal values into each product. The reference uses a neutral platform action colour while final Taplo brand exploration remains open.

Spacing baseline: 4, 8, 12, 16, 20, 24, 32, 48px. Mobile page inset 20px, narrow fallback 16px; desktop content inset 32px and deliberate bounded reading widths. Type baseline: 14px supporting, 16px body/input, 20px section, 28–32px principal title; body line-height about 1.5. Short display copy can be tighter; prices, times and control labels remain comfortably readable. Use actual approved brand font once resolved; the reference does not establish a new brand typeface.

Radii baseline: 10–14px controls, 16px internal content widgets, 24px merchant window, 28px sheets. Avoid applying all radii to all surfaces: frameless work lists and operational rows remain open. Sheet shadow is restrained and used with an opaque surface/backdrop; no heavy shadow around every item. Aim for 44px primary touch targets; a smaller visible icon may sit inside that target. WCAG criteria and complete testing remain the accessibility reference, not just a target-size shortcut [R10].

## Component recipes

| Component | Anatomy | State/behaviour |
| --- | --- | --- |
| Business identity | Actual wordmark OR name; optional actual symbol/photo; area/mode | Absent artwork collapses; long name wraps; Save remains accessible |
| Business window | Identity, concise content, optional image, bounded relevant offers | Save/Visit; no repeated large name or fabricated ratings |
| Product shelf | Heading, horizontal items with continuation, useful facts | Controls/keyboard; product details preserve rail position |
| Sheet | Merchant/task context, Close, task title, body, primary action | Back internal; one active overlay; full route when needed |
| Choice | Label, value, impact; selected indicator | Explicit selection; unavailable reason; no colour-only meaning |
| Form field | Label, appropriate input, hint/error | Required meaning, retained input, inline validation on meaningful action |
| Work row | Subject, actual status/time, reason/next action | Whole-row affordance without nested ambiguous hit targets |
| Status | Label and optional semantic icon/tone | Never merely a coloured dot; provider pending distinct from completed |
| Notice | Specific outcome/problem and optional action | Inline for persistent problems; polite status for brief confirmations |
| Conversation | Recipient once, optional record context, messages, composer | Draft/discard, send state, attachments and reply permissions |

## Screen production inventory

Designed references: customer Explore, a merchant mini-space, booking selection/review sheet, customer Activity, appearance settings, Studio Today, Studio page editor, Console case. Local actions demonstrate navigation, offer selection, theme, filters, saved state, message draft and a support interaction. They are examples, not live transactions. A real map, complete checkout/financial recovery, all categories and native handovers still need finished UI views before claiming visual completeness. See specs 54–60 for the full inventory and review frames.

Before approving a component, place it within a real screen in both modes and widths. Verify actual contrast, keyboard focus, text enlargement, absent imagery and slow/error states. The research establishes useful accessibility criteria; it does not certify this reference or the eventual product [R10].
