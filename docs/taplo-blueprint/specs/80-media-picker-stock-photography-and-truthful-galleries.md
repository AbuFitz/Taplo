# 80 · Media picker, stock photography and truthful galleries

Edition 1.1 · 3 November 2026 · Recommended product design; provider integration/licensing remains to be selected and approved.

## An editor image library, not a fabricated business portfolio

Offer a reusable image picker in the relevant editor: Your uploads, Stock photos and Taplo backgrounds. Stock search is an optional feature, not a compulsory onboarding stage. Suggested categories can shorten search without auto-inserting a photo. A business that chooses no imagery still gets a strong typographic composition. Page cover/decoration is distinct from public work gallery, actual team/premises and products for sale.

| Intended placement | Recommended source / treatment |
| --- | --- |
| Decorative cover, atmosphere or background | Suitable licensed stock, uploaded brand artwork, or Taplo backgrounds |
| Real portfolio / completed work | Business-authorised images of their actual work; stock picker not offered as evidence |
| Staff profile photo | Actual authorised person/brand asset, or a deliberate image-free layout |
| Product listing | Actual product or authorised manufacturer imagery representing that item |
| Premises | Actual authorised venue imagery; do not imply a stock interior is theirs |
| Review, credential, result comparison | Genuine supported evidence; never stock proof |

Keeping the picker context-aware prevents a harmless decorative choice becoming a false business claim. Do not put a stock haircut into “Our recent work”, a random portrait on a named employee, or a luxury interior under “Visit our studio”. Where imagery could imply something inaccurate, choose a less literal decorative treatment or clear appropriate context. Rights to use an image do not prove every claim made by its placement.

## Provider comparison checked 3 November 2026

**Unsplash:** offers a documented photo API. Its guidelines require provider image hotlinks, attribution and a download-tracking request when a user selects a photo for use [R42]. Evaluate first for an intentional photo picker, with the required credit treatment carried through published use. Its generic image licence and API integration requirements are not interchangeable.

**Pexels:** offers photo/video search APIs and attribution guidance [R40]. Its help article updated 2 November says API limit increases are currently paused [R41], despite general documentation discussing larger limits. Suitable for evaluation, but do not design Taplo's scale around guaranteed unlimited access. Confirm intended SaaS integration eligibility, request budget and public/picker attribution before selecting it.

Both providers restrict recreating a stock service as the product itself. Taplo's use would be a supporting media-selection feature. This is not a recommendation to scrape either library or build a new public free-stock marketplace. Provider-specific storage, delivery, editing, attribution and selected-use reporting must be implemented as required; no blanket permission to download, rehost or sell images is assumed.

## Picker interaction

Open from the selected image slot → context-appropriate source tabs → search/curated suggestions → progressive results with creator/provider credit → image preview and correct crop/aspect ratio → owner selects → attach with provenance → update page preview. Cancel preserves the previous asset; changing the theme does not silently replace imagery. Crop, focal point, alt text, remove and revert have obvious scope. Mobile keyboard/search and results remain usable without excessive controls or endless auto-loading.

Show useful loading/empty/network/quota/unavailable-image states. Replacing an asset retains old content until the new selection can be used. Protect API credentials server-side and apply supported request throttling/caching/deduplication; do not suggest bypassing provider limits. User photos and private job/learner media remain tenant/role-scoped, never mixed into a cross-merchant library.

## Source and lifecycle contract

Asset metadata identifies source kind, provider/photo ID, canonical source URL, creator/credit links, selected-use event reference where needed, rights/terms version and retrieval time, allowed delivery strategy, owner crop/focal point/alt, and placement. Preserve the distinction between merchant upload, manufacturer asset, provider stock and Taplo-owned background. Attribution remains available in the picker and in the public context in a provider-compliant form; do not assume a hidden Studio-only credit satisfies every published-use requirement.

On provider deletion/unavailability/terms change, provide a safe replacement/remove path without changing business facts. Export/portability respects original rights and delivery rules. Do not remove provenance when an owner crops an image. Actual supplier approval, asset retention policy and photo/model/property restrictions require review for the intended use before launch.

## Recommended sequence

First make Upload / no-image / Taplo backgrounds excellent. Then evaluate one stock provider and build a restrained contextual picker with required attribution. Add more providers/video only if useful. This gallery improves visual setup; it does not justify automating the owner's price, catalogue or operational decisions.
