# Catalogue work and regression recovery · 5 November 2026

## Grounded starting point

Canonical branch: `claude/modest-cerf-4tont1`. The previous application checkpoint `018d8f0` passed the primary verification job. Its separate full browser-regression job subsequently **failed**: run https://github.com/AbuFitz/Taplo/actions/runs/42035008519, job 127274984409, artifact 13427448687. The artifact contains 123 failure-context files. That count is evidence of captured failures, not a claim that every case has been diagnosed or fixed.

The failure set mixes real issues and stale assertions. Concrete real issues include inaccessible contrast in editor tabs, plan selectors and content illustrations, accessible labels that differ from visible actions, and an extra space in a team accessible name. Many remaining cases use removed disclosure controls, old sample-entry buttons, old copy about browser-only storage, or old dashboard composition. Other navigation, gallery, service-authoring and publishing cases still require case-by-case reconciliation. No skipped/deleted tests are used to turn this into a full-regression success claim.

## Product changes in this pass

Advances P02/P03 Studio composition and catalogue authoring, and the related interface recovery work:

- Makers and dealers with no upcoming appointments see their real catalogue work instead of an irrelevant empty calendar. A first-time owner retains the first-offer action. Actual mixed-business appointments still appear; an invalid timezone retains its recovery state. Calendar/tools remain accessible.
- The catalogue overview uses stored product names, prices and availability, excludes archived/example records and links straight into the correct product/vehicle creation form. It invents no orders, stock quantities, revenue or payment state.
- Product saves compare the current record at commit time, preserve unrelated records, detect changed/removed records and business changes, retain unsaved inputs after a failure, and retry a save without duplicating the item. Explicitly loading the latest record refreshes the price field too. Invalid input receives focus.
- Removed the internal development-status banner from the products workspace. Enquiry/link choices use clear merchant wording without implying a checkout operation succeeded. Native checkout, orders and payment-provider work remain separate unfinished contracts.
- Fixed known contrast and label mismatches in discovery, Studio tabs, content illustrations and setup plans. Real visible action names are used by assistive technology.
- Corrected old ordering assertions to move down in the actual vertical list rather than right across a removed grid. Updated affected design-use assertions to the visible action text. The functional behaviour remains tested.

## Verification and limitations

Added record-merge unit coverage for same-save retry, conflicts, deleted records and retaining unrelated products; connected phone/desktop coverage for catalogue priority, native creation links, validation focus, save failure/retry, concurrent edits and plan contrast. The primary CI job now also exercises the affected editor/discovery accessibility and vertical block ordering surfaces. Test results must be recorded from execution, not inferred from authorship.

This is the current frontend draft adapter, not a server-side commerce transaction. It does not complete cloud draft claiming, authenticated tenant authorisation, stock reservations, Stripe checkout/refunds, native apps, the customer return view or Console. No database configuration, migration or production data is changed here. The complete older regression failure set remains open until its cases are reconciled and executed against the current product direction.


## Connected follow-through

The first new browser run caught a genuine dealer gap: the old first-offer component deliberately returned nothing for vehicles, leaving an empty dealer without a useful starting action. Vehicle setup now has its own first-action card linked to the vehicle editor. Manual deployed review confirmed stock emphasis and field-error focus, and found that closing a route-opened creation form returned focus to the document. Route-opened forms now return to the catalogue add action; ordinary Edit buttons keep their own focus restoration. Catalogue counts no longer repeat uncountable navigation labels, and team labels follow the category terminology.


The first CI run passed 615 unit/database tests, 25 of 27 connected cases, 3 shell checks, 3 look/navigation checks, 3 mobile recovery checks, 5 of 6 recovery accessibility cases, all 7 vertical-ordering cases and all 104 public contrast/design-control cases. The two connected failures exposed the missing dealer first-action card (fixed in the follow-up). The remaining accessibility finding was the legacy “How it works” disclosure's low-contrast text (also fixed in the follow-up). Recovery browser groups now use separate output directories so a later passing group cannot erase the earlier failing group's evidence before upload. None of these targeted results closes the broader 123-context regression register.


Meaningful work now also precedes setup in the actual DOM on mobile: actual appointments, catalogue work or a timezone recovery take priority, while a first-time empty business keeps setup first. Desktop uses the same named grid areas. This is record-driven composition, not a CSS order override that disagrees with keyboard/reading order. Phone catalogue checks verify the work section precedes setup and capture its actual composition.


Dealer guidance is keyed to actual vehicle records, so an existing viewing service does not erase the first-stock action. Mixed vehicle/accessory catalogues count their actual record types rather than calling every item a vehicle. The dealer journey fixtures include an existing viewing service and an accessory product to verify both category-specific behaviour and cross-category flexibility.


The next editor scan advanced past the Content menu and found low-contrast descriptions in the legacy Profile task menu. Menu descriptions, neutral task surfaces and guidance now use the operational palette with defined fallbacks. Merchant colour-preview figures retain their explicit preview colours. Legacy fixed-light tab backgrounds are overridden in the operational scope, and mobile navigation text uses the same palette. Added scoped Profile-menu and editor-tab contrast checks at phone/desktop widths in both appearances; this does not claim every untouched panel is visually final.

The local execution workspace disconnected during this follow-through. These final text changes were reconstructed from the exact committed source through GitHub, with no changes to unrelated files, database settings or provider credentials. Validation proceeds against the actual committed source in CI; local or visual checks unavailable after the disconnection are not claimed.
