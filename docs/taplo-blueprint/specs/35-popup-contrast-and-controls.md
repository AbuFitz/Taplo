# Popup contrast, composition and control placement

Status: recommended interaction/design standard. Edition 0.5. The business-page colour scheme should not automatically paint every transaction surface in the same tones.

## Separate presentation from readable task surfaces

A business may choose a dark, vivid, photographic or expressive landing page. Product, cart and booking sheets use a coordinated neutral task surface with their own text, border and control tokens. The business accent, photography and selected identity cues provide continuity. Price, options, labels and body text retain predictable hierarchy and contrast.

For the current FixNow concept, recommend a light product sheet: opaque white/near-white surface, deep charcoal primary text, readable mid-grey secondary text, restrained separators, clean product imagery and the business's yellow primary action with dark text. Background dimming and modest blur separate the task from the page. Do not rely on transparent glass over busy content to carry essential transaction details.

White is a proposed default for this example, not a permanent ban on dark transaction surfaces. A carefully designed dark alternative can work when it meets the same hierarchy, contrast and legibility requirements. The important engine change is separating public-page tokens from task-surface tokens rather than blindly inheriting everything.

## Controls and shape

Use a coherent rounded sheet with inset content and related corner sizes. On phones, title/close occupies one clear header; the close control has a stable top-right position and a comfortably sized target, even if its visible icon is small. Product-to-product navigation uses a labelled Back action; Close exits the whole detail context. These actions have different meanings and should not randomly swap positions.

An X is a sound familiar close control when labelled accessibly. A visible “Done” can suit a short informational view. Use “Cancel” for abandoning an edit/task when that is the actual consequence. A decorative drag handle may signal sheet behaviour, but swiping must not be the only way out. Do not show a handle that implies drag-to-dismiss unless implemented safely.

Long details scroll inside an appropriate content region while the header and necessary action remain usable. Ensure keyboard focus, the mobile keyboard and safe-area insets do not hide fields or the primary action. Protect meaningful unsaved work; ordinary product browsing can dismiss without a warning ceremony.

## Visual hierarchy and token contract

Independent task tokens: surface, primary text, secondary text, border, field surface, field text, focus, error, success and primary-action pair. Photography must be true to the item. Price/options/availability and the main action should stand apart from optional descriptions and recommendations. Recommended products remain bounded and subordinate to the current item.

Target WCAG 2.2 AA: normal text contrast at least 4.5:1, qualifying large text at least 3:1, and applicable non-text control indicators at least 3:1 against adjacent colours. Check actual rendered combinations, including opacity/backdrop, focus and disabled states; do not treat one palette calculation as full accessibility conformance.

## Acceptance

The selected product and price are immediately readable against the sheet, including on an expressive page background. Close/Back remain identifiable and keyboard usable. Text zoom and 320px reflow retain all controls. The light/dark task variants preserve the same meanings. Changing the page wallpaper cannot accidentally make popup body text disappear. The local concept checks a selected set of text/action token pairs and interaction paths; a broader accessibility review remains part of implementation.

Source: https://www.w3.org/TR/WCAG22/ .


## Appearance choice, edition 0.7

Spec 45 adds three initial owner-selected appearance families: Clear, Colour cap and Split tone. All retain rounded geometry and the same task meaning. Colour, material and identity/media treatment vary; essential reading surfaces and contrast remain deliberate. Page-level defaults, optional block exceptions and safe token resolution are specified separately from the customer interface.
