# Using the fictional content inputs

Runtime update, 24 October: `src/features/showcase/uk.ts` now parses these inputs for Station Road Barbers and Parkside Valeting, adds their authored image/wordmark bindings and isolated demonstration scheduling. Their PageDocs live in showcase/content.ts and their editable looks in page/themes/looks.ts. The generated input files remain conservative source data; the other four have not yet been integrated. See CONNECTED-EDITING-AND-UK-DESIGNS.md for verification and limits.

The editorial source is `businesses.json`. Run `python3 build-fixtures.py` from this directory to rebuild `business-content-inputs.json`. The adapter is deterministic and reads/writes only these preparation files. It does not connect to Taplo or seed an account.

The generated input objects passed the actual repository `businessContentSchema` at commit `e4cee6d1f169cfbd9ffcd76a39b8965e5fea4c52`, using Taplo's lockfile version Zod 4.6.7. See `schema-validation.json`. Revalidate against the current repository schema before integration; the reported commit is not a promise of future compatibility.

## Mapping decisions

- `exact` editorial pricing maps to `fixed`; `pricePence` becomes `priceMinor`. Missing price/duration values are omitted, not passed as null.
- Vehicles are `products` with `kind: vehicle`, explicit `availability` and factual specification rows. Source status is retained.
- Staff use the existing `serviceIds` binding. Barber service eligibility is preserved.
- The generated Stillwater image is the only available media binding so far. Uncommissioned photos are absent, not broken asset paths.
- Fake social handles, phone numbers, directions, reviews, credentials and opening hours are not invented for runtime inputs. No review is marked permission-confirmed.
- All online booking flags are false, all service actions default to contact, and staff are not bookable. This deliberately does not create an apparently operational booking setup. A separate isolated demonstration availability fixture is still required to show the proposed full booking experience.
- No `PageDoc` or widget arrangement is supplied by this adapter. Author that separately through the current theme/composition contracts, using the creative briefs. Do not treat content passing a schema as a completed showcase.

## Integration boundary

Keep this content in an explicit fictional demo namespace. Load it through the same renderer/view model used by the product, not a marketing replica. A demo wrapper must intercept actions so no real enquiry, booking or outbound message is sent. Label fictional examples consistently. Never merge the fixture into an existing owner's records as a side effect of applying a look.

Before calling an example complete, verify the rendered page, actual image loads/crops, empty-contact behavior, prices, stock states, staff eligibility, the intended PageDoc, and any isolated demo availability. Test phone and desktop. Runtime schema validation proves data shape; it does not prove layout quality or functionality.
