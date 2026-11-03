# 103 · Block composition, logo and theme resolution

Working edition 1.9 · 3 November 2026 · Adopted detailed design/engine rules extending 08, 31–35, 45, 48, 61 and 90. These rules do not replace the need to produce full populated block designs.

## Layered model

Separate business facts/assets, offer/work records, page block instances, page composition, appearance tokens and personal app preferences. A block references source records; it is not a cloned product/calendar/customer database. Theme resolution cannot write commercial values, change permissions or declare readiness.

Resolution order: platform safety/accessibility constraints → coordinated look tokens → page choices → permitted block appearance overrides → task-surface tokens. Explicit inherited/preset/override state is visible and resettable. Merchant page branding does not override operator platform theme, official payment/Wallet badges or critical financial disclosure contrast.

## Identity arrangements without forced profile badges

Default transparent artwork is rendered without an added circular avatar, border, white patch or shadow. Respect actual transparency; do not mistake transparent for white. A background plate is an explicit previewed contrast option, not an always-on outline around every business logo. If the logo itself contains a baked-in border/background, explain crop/replacement options; CSS cannot reliably remove it as though it were separate metadata.

Use contained aspect-ratio-aware rendering for wordmarks and marks, with authored focal/crop settings only where appropriate. Never crop a wide wordmark into a round face slot. Portrait treatment is an intentional person/profile option, distinct from brand logo. No logo: deliberate typography-led identity with collapsed asset slot, no generated initials. Wordmark includes business name: don't repeat the same display name adjacent just to fill a template.

Provide coordinated arrangements: type-led, mark plus name, wordmark-led, cover plus compact identity and portrait-led for appropriate personal businesses. These are working arrangement families, not final pixel-locked templates. Long names, short names, wide/narrow/transparent/dark/light assets and no-cover cases must all produce readable compositions at mobile/desktop sizes.

## Block design recipes

| Block family | Compact composition | Interaction and special states |
| --- | --- | --- |
| Primary action | One understandable task, restrained support text and strong target | Correct action/provider handover; unavailable/permission states truthful |
| Services | Readable short list or coordinated tiles; price basis and duration where relevant | Service detail/eligibility/booking; no guessed starting price |
| Goods | Bounded horizontal rail, image/name/price/one fact, next-card peek | Variant/product popup, bag, stock/fulfilment; no image uses intentional text-led design |
| Classes | Date/quantity-relevant preview, venue/online context | Occurrence/course/ticket selection and capacity; waitlist distinct |
| Quotes/enquiry | Concise prompt for relevant scope/intake | Contextual form; draft/validation/success/recovery; no fake confirmed work |
| Team | Scoped professional shelf or short list, relevant role/name | Merchant-nested profile, eligible services; no duplicated business header |
| Gallery/work | Bounded strip/mosaic with genuine work captions | Accessible image/project viewer; rights/privacy and missing media |
| Reviews | Genuine permitted quote/summary with clear provenance | More detail/source/report; no stock evidence or fabricated score |
| Hours/location | Useful current public fact and coverage/premises distinction | Full hours/directions/coverage; private service address excluded |
| FAQ/about | Short question/summary, no large initial wall of text | Accessible expand/detail without losing position |
| Media/download | Useful still/label, file/type context | User-controlled media; safe download/access; no autoplay competing with booking |
| Links/social | Recognisable destination and concise purpose | Actual external destination; accessible label and correct navigation |
| Private For you | Next permitted personal task, modest and distinct | Scoped booking/order/reward details, authentication and stale state |
| Rewards/Wallet | Actual benefit/progress when appropriate | Terms/redemption/provider issuance distinct; anonymous state does not leak balance |

Every recipe needs one-item, many-item, empty, archived/unavailable, loading/error and no-media treatments as applicable. Public empty blocks collapse; Studio explains what to add without showing broken empty boxes to customers. Duplicate visual blocks share operational identities. Horizontal rail position restores after close/back and respects predominantly vertical touch gestures.

## Popup grammar

Clear, Colour cap and Split tone share rounded geometry, neutral readable body, predictable close/back and a stable task context. Owner can choose approved appearance, not remove crucial labels/financial terms. Product, booking, gallery, quote, location, messages, share and Wallet are different task compositions over the grammar, not one giant generic popup.

Don't stack modals for options → price → policy → payment. Keep internal steps/focus/history deliberate. Small mobile can use near-full-height detail for a long task; desktop composition need not be a huge mobile sheet. Close retains safe draft or explains what is discarded; a submitted payment is not cancelled by closing a surface.

## Smart theme behaviour

Recommend safe contrast pairs from actual artwork/colour; extracted colours are suggestions, never authority to recolour an uploaded logo. Reflow long names and change suitable identity arrangement rather than shrink text indefinitely. Suggest supported recipes for content type/count, but do not secretly reorder an owner's published priorities on each visit. Preview consequences and preserve authored content/overrides across look changes.

Draft appearance revision, validation and publish are separate; roll back appearance without rolling back bookings/payments. Cache by public tenant/page revision and permitted scope; private return blocks are not cached into anonymous HTML/CDN responses. Asset failures, unknown fonts and theme migration have explicit fallback without logo/name repetition.

## Required visual production

Create a block specimen catalogue with real-content fixtures, identity arrangement matrix, popup family/state set and mobile/desktop compositions. Each specimen binds to source fields, semantic icons/type/tokens and acceptance IDs. The current references illustrate selected recipes; the complete catalogue and systematic visual competitor study do not exist yet. This spec is the construction contract, not substitute visual evidence.
