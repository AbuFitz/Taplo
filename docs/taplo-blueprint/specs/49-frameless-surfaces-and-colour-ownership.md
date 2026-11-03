# 49 · Frameless surfaces and colour ownership

Working direction · No Taplo brand colour is approved. The previous green customer shell was a concept choice, not a decision.

## Frameless means hierarchy without boxes everywhere

Use open layouts, deliberate spacing, alignment, type and restrained surface changes. Remove redundant outer device frames, outlined cards around every row, nested container borders and permanently boxed navigation. Keep recognisable merchant blocks: frameless does not mean removing the block/widget composition or turning the mini-space into a conventional website. Horizontal product rails remain bounded, with a visible continuation cue and accessible controls; not every product needs an additional frame within a framed shelf.

Popups stay rounded, opaque, elevated and readable. Use a quiet backdrop and one clear foreground surface. Inputs and selected controls must still be recognisable. Borders may support contrast where needed, especially high-contrast modes; “frameless” cannot remove keyboard focus, distinguishability or error indicators. Do not use glass blur as the only separation or rely on shadows to explain controls.

## Colour belongs to a scope

| Scope | Default | Allowed accents | Boundaries |
| --- | --- | --- | --- |
| Customer app shell | Neutral light/dark foundation | A future tested Taplo accent for key actions | Merchant yellow/pink/green must not recolour global navigation |
| Studio shell | Same semantic foundation, task-oriented density | Taplo action accent when approved | Merchant styling appears in editor/preview, not operational status meanings |
| Console shell | Same accessible tokens, information-led | Functional selection and status | No arbitrary merchant themes over operational controls |
| Merchant mini-space | Owner theme and composition | Curated palette or custom colour with safe pairings | Critical detail/transaction legibility protected |
| Merchant popup | Clear / Colour cap / Split tone | Merchant accent in controlled roles | Body text and inputs remain reliably readable |
| System location/security/support | Neutral platform surface | Platform action tokens | Never inherit whichever merchant happened to be opened last |
| Native payment/Wallet/share | Provider/OS-owned surfaces | Only supported configuration | No promise Taplo can skin all native UI |

Use semantic tokens: app surface, raised surface, primary text, secondary text, action, action foreground, selected, focus, danger, warning, success, pending and disabled. Merchant brand tokens are separate. A green brand cannot turn cancellation green; a red brand cannot make every ordinary action look like an error. Pair every status colour with a meaningful label or icon. Verify rendered combinations, not only palette swatches.

Appearance selection: app follows device by default, with a user preference considered during design. Merchant appearance remains intentional while popup treatment preserves contrast. Do not automatically invert merchant artwork. Owner custom colour input resolves safe action foreground and warns/rejects unusable combinations. If a preset or block override becomes unsafe after a palette change, show the corrected preview and which rule was applied. Inheritance and Reset follow spec 45.

## Full-surface review

Review default, pressed, selected, focus, disabled, loading, empty, error, success and offline in light/dark. Include text scaling, reduced motion, high contrast, long localisation and screen reader order. Review whole popup with its backdrop and parent page, not an isolated component. Neutral shell in this revision is a baseline for testing; final brand colour still needs design exploration across customer, Studio and Console. No palette is locked by documentation examples.


## Visual experience extension · 0.9

Spec 53 now defines Light/Dark/System preferences in detail. Light and Dark settings are intended scope; they are no longer merely a preference to consider. Palette and automatic merchant theme adaptation remain unapproved.
