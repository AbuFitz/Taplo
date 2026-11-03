# 102 · Smart category search and capability resolution

Working edition 1.9 · 3 November 2026 · Adopted working behaviour. Extends 07, 62, 73, 79 and 99. Exact production taxonomy/search index and specialist coverage remain to be built and validated.

## Search should understand language without inventing a business

Owner types what they actually do: detailer, car valeting, maths tutor, mobile tyre fitting, pottery classes or something unusual. Search resolves likely category concepts through curated aliases, normalisation and typo-tolerant matching. It suggests relevant capabilities and language; it does not invent prices, licences, eligibility, testimonials or operating facts.

Keep stable category IDs distinct from user-facing labels, synonyms, supported capabilities, specialist constraints and localisation. Store authored self-description independently. Unknown businesses can create a useful identity/contact/enquiry draft; absence from a dropdown is not failure or permission to enable an unsupported regulated transaction.

## Candidate behaviour

| Input/context | Candidate presentation | What must not happen |
| --- | --- | --- |
| detailer | Car detailing, with related Car valeting if the taxonomy distinguishes it; ask context if ambiguous | Automatically choose automotive when text could mean another profession |
| mobile detailer | Car detailing with Mobile service suggested, owner confirms | Turn mobile into a separate duplicate business/account |
| maths tutor | Tutoring with subject suggestion retained as authored context | Assume learner age, guardian authority or prices |
| barber selling products | Barber with Appointments and Products selectable | Force owner into either retail or appointments only |
| pottery classes and shop | Workshops and Products capabilities | Treat a dated seat as ordinary inventory without session rules |
| repair | Ask useful distinction: mobile/vehicle/device/other work | Quietly choose medical/automotive authority from a broad word |
| spelling error | Offer likely correction and original/custom description path | Replace authored text without showing the interpretation |
| no reliable match | Use your description; choose customer actions/capabilities directly | Dead end, fake certainty or an irrelevant default category |

Related candidates must have a useful semantic relationship, not just substring overlap. Keep a short visible ranked set and Show more; explanation such as Matches car valeting helps. No result count or ranking implies market popularity or platform verification.

## Proposed matching pipeline

Normalise whitespace/case/Unicode safely → exact label/approved alias → token/phrase relevance → bounded typo matching → related-category candidates. Preserve original text. Use curated exclusions to reduce harmful matches and test short/ambiguous terms. Do not silently strip meaningful accents/script. Use versioned rules and an evaluation fixture set; category ID is selected deliberately, not inferred permanently from the highest score.

Initial implementation is deterministic and explainable. Semantic/AI ranking may later improve candidate recall only after comparing against a labelled set; it must not directly grant capabilities or overwrite the category. Scores/thresholds are calibrated on actual data, not made up as a universal 90% confidence rule.

## Setup result

Capture description, selected category IDs, intentionally enabled capability IDs and taxonomy/rule version. Recommend primary action, terminology and next setup task. Public classification is independently reviewed/published; sensitive/unsupported categories need scope checks. Category is not a permission and changing it cannot expand staff grants or automatically publish new transaction types.

Owner can change or add category later with an impact preview: new relevant controls, existing records retained, unavailable features explained. Existing offer/booking/order IDs and agreements survive. Category-driven labels are mapped consistently across Studio/help/notifications; underlying action semantics stay stable.

## Interaction/accessibility states

Search label and editable input; accessible candidate list with keyboard selection, announced loading/result state, clear selected item and no forced autocomplete. Support empty query, current choice, no results, slow/offline results, stale query response, custom description, long/multilingual input and category change. Ignore an older response arriving after a newer query; do not move focus while someone types. Avoid a keyboard-blocked result list on mobile.

## Evidence and acceptance

Maintain fixture entries for exact labels, aliases, common misspellings, ambiguous terms, mixed business, unsupported specialist, malicious/very long input and no match. Check top candidates, offered capability set, no privilege increase and no lost authored values. Measure owner correction/backtracking and first-offer relevance; a search box with attractive chips is not evidence of smart classification.
