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
