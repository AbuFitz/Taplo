# Simple customisation with depth when wanted

Status: recommended redesign. Current examples: 13 looks and 8 top arrangements exposed in the reviewed picker.

Primary design journey: start from the current coordinated design, explore Colours and Looks as distinct choices, add business branding, preview the actual block/popups and publish. Profile arrangements and deeper control remain available in context. Composition means hierarchy and geometry; look means coordinated colour/type/surface choices. Owners should understand the visible difference without learning the internal theme model.

Provide a few strong recommendations suitable for the actual content. Offer the full library behind “More looks”. Keep advanced controls available for owners who want them, grouped by outcome such as Header, Offers and Page background. Selecting a photo on the page opens its content editor; selecting an offer opens that offer's source record.

Record whether a value is inherited, preset or explicitly overridden. Show reset at the appropriate level. Undo and draft history support experimentation. Switching composition preserves content and compatible intentional overrides; explain any incompatible setting before dropping it. A theme's safe contrast rules constrain combinations without silently changing brand identity.

Preview real content at mobile and desktop widths. Publication is explicit, with a useful change summary and rollback. Two owners editing concurrently should not overwrite one another without conflict handling.

Acceptance: an owner changes the page's appearance in three understandable decisions and can recover their previous version. Adding another offer does not demand another layout decision. A business name that wraps, missing imagery, high-contrast mode and translated text remain readable. Design changes never write sample prices or booking settings into live offers.


The current reconstruction is specified in 33: explicit page/block scope, source records versus presentation, inherited/preset/custom provenance, live popup previews and meaningful reset/undo. This retains the existing range of customisation rather than replacing it with a small fixed-template system.
