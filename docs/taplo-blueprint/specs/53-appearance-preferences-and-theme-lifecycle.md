# 53 · Appearance preferences and theme lifecycle

Edition 0.9 · Light and dark settings are part of the intended experience. Final palette remains open.

## Preference hierarchy

Offer System, Light and Dark in Settings → Appearance in Taplo, Studio and Console. First launch follows the device. Switching applies immediately without losing the current task; no Save button is needed for an immediately applied personal preference. Label the selected option and show a small representative preview, not an overwhelming theme catalogue. Appearance is a personal setting, not the business's public design.

Recommend an optional “Make Taplo yours” moment after successful account setup, with System already selected and Skip available. Do not add a compulsory aesthetic questionnaire before a customer can finish a booking, payment or save. If signup began within a task, finish/return to that task before offering optional preferences. The owner can choose another point in onboarding after visual review; this recommendation is not a locked funnel.

Recommended resolution: an explicit choice on this device wins; otherwise use the account's saved default when signed in; otherwise System. Distinguish “Use on this device” from an optional “Set as my default” so changing one device does not unexpectedly recolour another. A signed-out local choice may be offered as the new account default; do not silently overwrite an established account preference. Private-window storage loss has a safe System fallback. Sign-out clears private state; a non-identifying device appearance preference can remain if the setting is explicitly device-scoped. Shared managed devices can reset it.

## Merchant colour and customer appearance

App theme controls navigation, search, settings, Activity and system dialogs. Merchant styling controls the merchant mini-space. A dark customer shell can contain a deliberately light merchant space and vice versa; a clear transition is preferable to silently inverting a logo, product photo or curated design. Merchant popup variants use safe neutral content surfaces and controlled accents. If future adaptive light/dark merchant designs are offered, the owner previews both; they are coordinated designs rather than automatic colour inversion. Critical transaction controls remain readable under either shell.

Studio's theme changes the workspace; Page preview remains the actual chosen business design, labelled as such. Console theme never changes the merchant's appearance. Wallet, OS permission, provider payment and native share sheets retain platform-controlled appearance; Taplo cannot promise to restyle them. Map tiles must have an appropriate provider-supported theme and readable attribution, selected markers and coverage overlays in both modes.

## Transitions and edge states

Resolve preference before the first painted shell where practical to avoid a light flash during dark launch. Do not animate the entire app through distracting colour transitions. System mode responds to device changes while preserving reading position and input; explicit Light/Dark ignores them. Respect contrast and reduced-motion settings independently from the theme. Test auto keyboard, date/time pickers, autofill, disabled controls, photos, charts, rewards, native handovers and legal pages rather than just the home screen.

Account sync failure should retain the applied local choice and say the default could not sync, with retry. Preference schema/version migrations preserve known choices and safely fall back to System for unsupported values. Deep links must resolve theme before showing private task content. Email remains readable across client behaviour; it does not rely on inheriting the app's selected mode. Print/export receipts use an intentionally printable layout.

## Acceptance

Switch theme mid-composer and retain text/focus. Launch direct to a booking from a notification without a flash or lost task. Sign in with a different account on a shared device without exposing private content. Show an unchanged merchant wordmark on contrasting app shells. Changing Studio theme leaves published business appearance untouched. All three settings are labelled and keyboard/screen-reader operable. Theme candidates remain subject to whole-system visual review.
