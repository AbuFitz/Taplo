# Popup appearance families and inheritance

Status: proposed owner-controlled appearance system. Edition 0.7. These are appearance treatments, not different popup shapes or different customer workflows.

## Three initial families

| Family | Appearance | Where brand colour appears | What stays neutral |
| --- | --- | --- | --- |
| Clear | Clean light reading surface; compact brand identifier; uncomplicated product stage | Small mark/details and primary action | Main text, facts, inputs, product background and separators |
| Colour cap | A soft brand-tinted upper region connects identity/media to the white reading area | Carefully derived header tint, small facts and primary action | Body/price/inputs; no low-contrast colour flood |
| Split tone | Dark identity/media frame with a separate light reading surface | Brand mark and restrained action detail | Product imagery and the main information/choice area |

Keep the same rounded sheet geometry, Close/Back meanings, readable reading order and action hierarchy across all three. Variants can change material, header/media treatment and placement emphasis while retaining the same transaction contract. A larger set is possible later; these three are a useful starting set to validate rather than a permanent limit.

## Owner control without another confusing builder

Page appearance includes a Popup appearance choice with three live previews. The business accent follows its coordinated palette by default. Advanced per-block overrides remain optional, scoped and resettable. Selecting a widget offers Preview item/service/cart/share so the owner sees what a customer tap produces.

Suggested conceptual settings: popup appearance family; accent follows page or explicit custom accent; nullable per-widget appearance override. Store validated choices rather than arbitrary CSS. The actual schema may change. Do not require the owner to configure separate text/background/button colours for every popup before it looks coherent.

## Token and contrast resolution

Resolve appearance in order: safe family defaults → page-level popup choice/approved accent → permitted block exception → customer accessibility adjustments. Task-surface text does not blindly inherit the page wallpaper/text pair. Compute appropriate foregrounds for accents and check real rendered states. Low-contrast custom choices receive a clear explanation and a safe recovery; do not silently lose the selected brand.

Use distinct roles for reading surface, header, primary/secondary text, fields, separators, focus, action, error and success. Image areas preserve truthful product colours and a calm backdrop. A vivid business page may sit behind a neutral floating sheet. App dark mode needs a reviewed family mapping; a popup should not become an illegible transparent overlay merely because the page is dark.

## Apply across tasks

Product, service, cart, booking, quote, share and Wallet preflight use one shell family with task-appropriate content modules. A brand cap is not permission to recolour Apple/Google system screens or official Wallet buttons. Financial, permission and provider-controlled screens retain required meaning and presentation boundaries.

Acceptance: change family without losing selected options/cart/form progress; switch page look and see the intended inherited accent; override and reset one widget; test dark/light/expressive merchant pages, long names, text zoom, 320px layout and assistive input. Validate primary/secondary/action contrast and focus/disabled/error states. Shape remains consistently rounded across the three previews.


Revision 0.8: specs 48–52 extend this contract. Appearance examples do not approve an app brand colour or justify generated logo marks. Map, full overlay families and feedback have dedicated contracts.


## Visual experience extension · 0.9

Specs 53 and 58 distinguish app appearance preference from public merchant styling and define complete visual-state review.
