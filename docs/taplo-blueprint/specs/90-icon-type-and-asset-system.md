# 90 · Icon, type and asset system

Working edition 1.3 · 3 November 2026 · Researched recommendation, not installed packages or final visual approval. Extends 48, 53–61 and 86.

## Coherent pack, not several random libraries

Recommend Phosphor as the primary product icon family, using Regular for normal controls and an approved Fill treatment for selected navigation where the silhouette remains recognisable. Its official React project supports multiple weights and consistent custom-icon extension; the project identifies MIT licensing. Lucide is a credible simpler outline alternative with ISC licensing and Feather-derived notices. [R58–R59] Choose one product family after checking actual coverage and small-size rendering; do not ship both just because individual screens prefer different styles.

Maintain a semantic icon registry: meaning → approved asset/export → visual size/weight → accessible use → permitted category variation. Resolve icons through the registry, not arbitrary component names stored in merchant content. Check exact exports against the pinned package during engineering preparation; conceptual names below are semantic IDs, not guaranteed package import identifiers. Missing mappings fail review; do not silently fall back to an unrelated sparkle icon.

| Semantic meaning | Stable symbol concept | Category adaptation |
| --- | --- | --- |
| Work/today | Agenda/calendar | Stable across categories |
| Bookings | Calendar with appointment cue | Label may say Lessons/Sessions; retain recognisable calendar meaning |
| Orders | Bag/package | Only present where goods workflow enabled |
| Offers | Catalogue/list | Subtypes can use service/product/session symbols |
| Customers/participants | Person/group | Label depends on actual role; avoid conflating payer/learner |
| Team | Group | Stable; own profile uses person |
| Payments | Card/receipt | Stable; distinguish payment, refund and payout in detail |
| Page/appearance | Layout/palette | Stable across businesses |
| Messages | Conversation | Stable, with text/unread treatment |
| Sharing/NFC | Link/contactless tag | Distinguish sharing, QR and hardware configuration |
| Support/security/settings | Help/shield/gear | Stable across all surfaces |
| Category illustration | Scissors/car/book/cup/camera/weight | Allowed in onboarding/category selectors and contextual empty states |

Do not turn Settings into scissors for barbers or change core navigation silhouettes every time a capability changes. Personalisation should improve recognition, not make support instructions or muscle memory unreliable. Mixed businesses use capability-specific areas and choose their primary context; never jam two category icons into one control.

## Icon behaviour

Proposed size tokens: 16px inline/table, 20px navigation/actions, 24px prominent controls; optical review can adjust within the family. Hit target is separate and follows accessibility requirements, not a 16px clickable area. Avoid thin weights at small sizes. Status uses text and/or shape as well as colour. Decorative icons are hidden from assistive tech; icon-only controls have meaningful labels and tooltips where helpful. Loading/progress does not impersonate success; respect reduced motion.

Use official provider/payment/Wallet badges according to their brand rules rather than redrawing them in the generic icon pack. A pack's brand glyph is not proof of permission or payment-method availability. Custom Taplo-specific icons are a last resort after catalog coverage review and must match grid/weight/optical rules.

## Typography recommendation

Use Inter Variable for operational body text, forms, tables and calendar density. Its official project documents UI-oriented text/display design, tabular numerals and OFL licensing. Evaluate Manrope 650–750 for prominent headings/brand expression, with the actual licensed font files/weight support checked; its official OFL file is recorded. [R60–R61] Final selection needs side-by-side composition review, not a claim that two fashionable fonts make the product distinctive.

Recommended scale: body 16px/1.5, dense supporting text 14px/1.45, section heading 20–24px/1.25, page heading 28–36px/1.15 adjusted responsively. Avoid critical 11px grey labels. Body weights 400/500, strong text 600, display 650–750 where supported. Tabular numbers for amounts/time columns; proportional text for prose. Test £, %, decimals, long business names, narrow columns and locale-specific dates/numbers.

Studio/customer/Console share a product type system; merchant page typography remains a curated separate customisation layer. Merchant font choice does not recolour/retype financial/security platform UI arbitrarily. Do not load every merchant font into the shell. Email uses robust compatible fallback stacks rather than relying on variable webfonts loading everywhere.

Self-host approved WOFF2 subsets where licence permits, retain notices, pin source/version/hash and limit loaded faces. Define fallback metrics and loading strategy to avoid layout shifts/invisible text. Existing Latin choices do not prove Arabic or every future language is supported; approve script-specific fallback/RTL design before claiming support. User text must never become missing-glyph boxes merely because it falls outside a decorative font's coverage.

## Delivery and coverage gate

Create an asset manifest covering screen/meaning, icon family/export, size, weight, state, accessible name and licence provenance; a typography token sheet; no-logo/wordmark/logo fixtures; all light/dark/status states. Audit navigation, empty states, tables, dialogs, maps, Wallet/share and Console actions. This edition defines that gate and semantic mapping, not an assertion that every required icon/export/font fixture is already supplied.
