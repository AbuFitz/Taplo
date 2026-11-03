# Current site review: block direction and actual editor access

Edition 0.4 · 31 October 2026. This review separates direct browser observations, inspected source and an earlier bounded automation report. It does not claim every option or category was exhaustively exercised.

## Directly observed this revision

- FixNow public frame: dark/yellow identity card; quote CTA; six-service price block; coverage text; gallery; three-product horizontal dash-cam rail; supporting links, FAQ, social and footer. Product detail opens in a modal. Current example products use external-shop links; native Taplo purchasing is the intended redesign rather than a requirement to keep that destination.
- In the Appearance workspace, selected FixNow from the visible Business dropdown and inspected the Phone preview. Its compact-width layout and product bottom sheet were actually viewed. The parent workspace initially showed another saved scenario despite the query; selecting the visible scenario resolved it. The mobile profile currently occupies substantial vertical space and repeats the wordmark/business name before the main action.
- Opened the Thinkware F70 product detail in the actual Phone preview. The sheet shows image, name, £125, Camera/Front facts, description and View in shop. This directly supports the founder's rail → popup concept.
- Onboarding: visited category, name/profile, style, primary action, services, plan preference and finish. Used the existing North Studio draft, preserved its business facts, skipped adding real services and followed Open Studio. No account creation, purchase or publishing was performed. This was one complete path, not exhaustive testing of every category or upload.
- Optional identity controls include a line about the business, logo/photo and cover. Style has distinct Colours/Looks choices, Undo and optional profile arrangements. The arrangement chooser included a no-image typography recommendation, several alternatives and a cover-dependent option disabled with an explanation.
- Service pricing sheet offers fixed, from, quote and free; service duration changes the intended booking/enquiry behaviour. Plan prices are displayed as provisional and remain open product decisions.
- After onboarding, the actual Page builder was accessible: Content/Profile/Design/Settings; Add content; widget order controls; hide/move actions; Phone/Desktop; Fit/Actual size; preview; undo/redo and draft/publish controls.
- Design overview: Colours, Starting look, Background, Typography, Buttons, Block surfaces, Layout & motion and Readability. Block surfaces exposed Solid/Soft/Frosted/Outline, corner choices, and advanced border/shadow/padding choices. The interface points owners to per-block Appearance for individual emphasis.
- Opening an empty service-backed content choice led to a source-record service form that explicitly says it can be used anywhere on the page. Inspected pricing mode, booking mode, duration and expanded details: grouping, price unit, description, inclusions, image and delivery modes. Closed without saving. This is an existing connected-data pattern to preserve and improve.
- Add content included category suggestions plus Services/Products/Vehicles/Offers, images/text/video/downloads, proof/FAQs, contact/share/link actions and location/area/notices. Suggestions explicitly describe themselves as a starting point.

## Important correction to the earlier automation report

The initial automation encountered the unconfigured Studio welcome state and reported block addition, reordering and full preview controls as not found. It also described a much narrower sample design screen. Directly walking onboarding into the configured editor revealed the richer interface above. Do not preserve that earlier “not found” statement as evidence that the actual editor lacks those capabilities. Its general judgement that popups are inherently a problem is also not adopted; the current directive explicitly uses them.

## What needs reconstruction

1. Scope: page design, profile arrangement, block presentation and operational offer facts need clear ownership and return paths.
2. Inheritance: distinguish preset-provided choices from intentional owner overrides and explain reset scope.
3. Density: reduce unnecessary profile height and repetitive product detail on the page. Horizontal rails and coherent popups are valuable foundations.
4. Preview: evaluate the item/cart/booking states alongside the landing page, not only a static phone screenshot.
5. Entry state: an owner should understand whether they are in onboarding, a sample preview or their actual workspace, and reach the relevant editor reliably.
6. Feedback: verify control behaviour after transitions. Several browser observations settled after an additional state read; no confirmed code-level cause or universal failure is inferred.

## Evidence boundaries

Deployment metadata resolved to commit `6fecf4ecfaa837b264114629388265ae27b55109`; inspected Frame, style contracts, real-business scenarios, Collection and editor source. The shared frame builds the public PageRenderer view model; appearance changes do not require a separate imitation renderer. Collection source defines native horizontal scrolling, next-item peek, count/navigation and reduced-motion behaviour. Source inspection is not a claim of newly executed application tests.

The public site/repository has not been changed by this documentation/prototype revision. The existing research and Inspiration review are preserved below for context.

---

# Current Inspiration and example-page review

Read-only browser interaction review completed 31 October 2026. Public entry: https://mytaplo.vercel.app/inspiration . Scope: the gallery and public Northgate Heating & Plumbing and FORM Objects examples, including preview controls, enquiry forms and reported product detail interaction. No owner account was created and no actual enquiry, booking, payment or publication was submitted. This is a bounded UX review, not an exhaustive test of Studio or every example.

## What was observed

- Gallery cards offer “Look closer”; category pills and keyword search help find examples. “Style the examples” opens design selection. “Open the demo” provides a standalone example route such as `/inspiration/northgate-heating`.
- The preview overlay includes Phone/Computer size controls, “Try another look”, “Arrange the top”, “Open the demo” and “Use this design”. The inspected picker exposed 13 looks and 8 top arrangements. Those choices describe the sampled picker, not an independently verified count of every possible design combination.
- The gallery preview overlay leaves the gallery URL unchanged. Its Close button, Escape and backdrop dismiss it according to the interaction report. Phone content and the control panel scroll in separate regions.
- Northgate presents service prices, team, work photos, FAQ and contact actions, supporting a compact service-business home. FORM presents ceramics/catalogue content with details and enquiry actions, supporting another business type through the same broad grammar.
- The enquiry forms in both examples showed unrelated café options, including Flat white and Mushrooms on toast. The reported observation should be reproduced and traced to its actual data binding before assigning a code-level cause. It demonstrates the need for strict business/offer context in forms.

## Conclusions to carry forward

Keep the compact business destination and immediate visual preview. Simplify the choice hierarchy, avoid several nested scroll areas when one clear layout works, and preserve selected design choices into setup. The preview picker is an owner decision environment; its complexity should not appear in customer Explore.

Make relevant public items shareable through canonical routes and define browser Back behaviour. The observed gallery overlay URL behaviour is not proof that every individual business item lacks a route; inspect those flows individually during implementation.

The current review does not demonstrate the authenticated Studio editor's full customisation burden. The founder's assessment that Studio is overly complicated remains important input; validate it with task-based owner tests. Similarly, no visible Escape hint or filter animation is automatically a usability defect. Accessibility and feedback should be judged against real behaviour and user tests, not decorative indicators.

## Next focused evaluation

Ask an owner to choose a look, replace starter content, add an offer, change the primary action and preview the customer journey without coaching. Record where terminology, duplicate settings or too many choices cause hesitation. Then ask a customer to arrive through Explore, inspect an item, return to results and later retrieve their activity. Compare the same tasks in the proposed journey.

## Source snapshot boundary

Earlier repository/deployment research inspected commit `6fecf4ecfaa837b264114629388265ae27b55109`. The included historical report lists exact files and calendar behaviour. The browser review is a separate observation of the public site on this date, not a claim that every observed page still maps to that exact commit. Repository code and deployment were not edited for this work.


## Sharing page reference, edition 0.7

Read and visually inspected https://mytaplo.vercel.app/product/sharing on 31 October 2026. It presents a restrained dark No. 6 Coffee card/plaque preview with prominent typography and a clear QR area; the text describes link/QR sharing and forthcoming plaques/Wallet cards. This is a visual reference, not proof that a Wallet pass was issued. Future product copy and actual release state should remain synchronised.


## Identity, frameless and full interaction revision · 0.8

Owner correction, revision 0.8: synthetic initial marks and repeated business names in prior concept visuals are not desired. They were authoring assumptions, not observed requirements. Latest concept removes invented initials and duplicated description. Provisional green did not establish Taplo branding. No fresh live-site audit was performed for this revision.


## Deeper construction and coverage revision · 1.0

Edition 1.0 produced offline designed references, not a fresh audit or change to live Taplo. Example records/people are labelled. Prior actual site/source observations remain dated; no claim they reflect a later deployment.

## Fresh follow-up · 3 November 2026

See LIVE-REVIEW-2026-11-03.md for the new bounded onboarding/Studio walkthrough. It records actual reached routes separately from links, skipped controls and hypotheses requiring reproduction. Existing prototype remains fully replaceable; the audit does not overrule the proposed experience direction.
