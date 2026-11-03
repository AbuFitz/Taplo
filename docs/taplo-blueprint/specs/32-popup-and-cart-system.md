# Popup, sheet and cart system

Status: proposed interaction contract aligned to the founder's popup-first direction. Replaces the implication that product action necessarily navigates to a separate conventional shop page.

## A shared container, appropriate content

Use a branded bottom sheet on phones and an appropriately sized dialog/panel on wider screens. The container supplies header, title, Close/Back, content region, accessible modal behaviour and safe action area. Content modules differ for product, service, booking, quote, gallery, reward and cart. Do not force a gallery and a payment form into identical dimensions.

The item detail carries the business's accent, compatible typography and corner family within an independent readable task surface; it does not blindly inherit the landing-page background and text colours. Spec 35 defines the contrast system. Keep text contrast, focus and essential transaction hierarchy safe. The originating block remains the return context; its scroll and selection survive. Direct links still resolve meaningfully using the same item state.

## Product detail

Order: meaningful image/gallery; full name and exact price basis; relevant options; concise description and key facts; delivery/collection/fitting requirements; quantity; Add to cart; bounded same-business recommendations. The main purchase action is easy to reach, and the price consequence of an option is visible before adding. A long explanation can expand within the sheet without making every public card taller.

Recommendations follow explicit relevance: compatible accessory, related product, owner-selected set, or eligible same-merchant fallback. Exclude the current item, withdrawn items and incompatible products. Do not invent compatibility or make recommendations from competing businesses on a merchant's own detail. No automatic preselected paid extras.

## Flow and state

Item → Add to cart produces clear confirmation, an updated cart count and a choice to keep browsing or view cart. Opening a recommended item replaces the sheet content with a useful Back path; it does not pile another dialog on top. Cart lists actual selected variants/quantity, editable lines and a subtotal labelled with any remaining charges. Checkout follows in the same full-height sheet where workable, or a dedicated route with equivalent return semantics if required by payment/device constraints.

Service detail similarly leads into booking/request/quote steps in the same sheet shell, with a progress indicator only when meaningful. Card-on-file consent, full total and applicable terms are explicit at commitment.

## Accessibility and resilience

Use accessible dialog semantics, focus management, labelled controls, keyboard operation, close and focus restoration. Avoid a large duplicate close icon plus several unrelated navigation bars. Keep controls above safe-area/keyboard occlusion. Allow Escape/backdrop dismissal for ordinary detail; protect meaningful unsaved work appropriately. One active modal layer is the default.

Browser Back should unwind the current item/task before leaving the business. Reload, direct link and payment return need deterministic route states. A popup appearance can still have a URL. Recommendations and cart changes preserve pending form values where sensible without exposing private records.

Acceptance: Add once, retry after a timeout, change quantity, remove, open recommendation, return and close all reconcile to one consistent cart. Empty cart has a clear return action. An unavailable variant fails with a precise correction. Close restores the public page and shelf position. A cancelled booking selection does not discard an unrelated product cart.
