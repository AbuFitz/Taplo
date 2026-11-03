# Capability atlas: 120 areas for deeper specifications

Working scope map, not a release commitment. Each row identifies a concrete behaviour to expand when that journey enters implementation. The 30 linked specifications provide the current connected design. Do not create 120 disconnected tickets and assume the product is specified.

For each implementation brief, add: actor and trigger; prerequisites; fields and source of truth; states/events; permissions; money/inventory/time effects; UI and copy; empty/loading/error states; notifications; cancellation/undo; analytics; acceptance scenarios; migration and release dependencies.

## Identity and access

Related specifications: 01, 26.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A001 | Account and workspaces | One person can switch customer and business roles without mixing data. |
| A002 | Business handles | Old public handles redirect after a permitted rename. |
| A003 | Membership roles | An employee receives only the authorised business permissions. |
| A004 | Multi-location roles | A location manager sees the permitted working scope. |
| A005 | Guest ownership | Historic activity requires verified claim rather than email matching alone. |
| A006 | Account recovery | Recovery cannot become a shortcut around merchant ownership checks. |
| A007 | Session revocation | Removing a staff member removes continued business access. |
| A008 | Delegated support | Assisted access has purpose, expiry and a recorded actor. |
| A009 | Participant roles | Payer, attendee, recipient and guardian can differ. |
| A010 | Data export | Exports retain the requested tenant and role boundary. |

## Mini-site and interaction

Related specifications: 03, 04, 08.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A011 | Canonical page | Every entry reaches the same business identity and offers. |
| A012 | Public offer routes | A shared item opens meaningfully without prior navigation. |
| A013 | Return context | Back restores origin, filters and scroll. |
| A014 | Composition system | Changing layout preserves offer content and operational facts. |
| A015 | Look inheritance | Owners can distinguish defaults from explicit overrides. |
| A016 | Draft and publish | Preview changes before publishing, with recoverable history. |
| A017 | Collection views | A larger catalogue remains browsable without redesigning the whole site. |
| A018 | Dialog focus | Opening and closing details preserves correct keyboard focus. |
| A019 | Form recovery | Errors preserve entered values and identify the correction. |
| A020 | Responsive content | Long names and missing images remain usable at narrow widths. |

## Studio setup and work

Related specifications: 06, 07, 09.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A021 | Capability selection | Adding products plus appointments produces coherent tools. |
| A022 | First offer | Owners reach a useful offer without irrelevant setup questions. |
| A023 | Today queue | Each urgent item has a reason, owner and next action. |
| A024 | Offer readiness | A blocked offer explains the exact missing requirement. |
| A025 | Contextual editing | Selecting an offer edits its single source record. |
| A026 | Settings impact | Schedule changes identify affected future commitments. |
| A027 | Navigation adaptation | New capabilities appear without restarting onboarding. |
| A028 | Content provenance | Starter content cannot leak into another business form. |
| A029 | Mobile operations | Owners can prepare orders and review requests from a phone. |
| A030 | Bulk actions | Batch edits show scope and respect individual exceptions. |

## Discovery and return

Related specifications: 02, 05, 19.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A031 | Intent search | Search distinguishes local, online, delivery and service-area needs. |
| A032 | Date relevance | Time filters use trustworthy current availability. |
| A033 | Optional location | Manual location input works without device permission. |
| A034 | Empty results | Alternatives do not silently alter the requested intent. |
| A035 | Publication eligibility | Direct availability and Explore listing are separate controls. |
| A036 | Saved businesses | Saving gives a return shortcut rather than marketing consent. |
| A037 | Saved offers | Saved items revalidate price and availability on return. |
| A038 | Rebook | Preferences carry forward while commitments are revalidated. |
| A039 | Reorder | A new cart uses current items, price and stock. |
| A040 | Sponsored placement | Any paid ranking is clearly identified. |

## Catalogue and commerce

Related specifications: 10, 11, 21.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A041 | Offer types | Each transaction type has appropriate operational fields. |
| A042 | Variants | Variant image, price and stock agree throughout the journey. |
| A043 | Stock policy | Finite, made-to-order and backorder promises stay distinct. |
| A044 | Cart persistence | A returning customer recovers a valid merchant-specific cart. |
| A045 | Price snapshots | An old receipt retains the price and policy accepted then. |
| A046 | Totals and rounding | Currency, discounts and taxes follow recorded rounding rules. |
| A047 | Mixed purchase eligibility | Only compatible product/service combinations share checkout. |
| A048 | Appointment collection | The product fulfilment link is visible beside the appointment. |
| A049 | Part plus fitting | Stock, compatibility, staff skill and duration are coordinated. |
| A050 | Archived items | Historic transactions survive catalogue withdrawal. |

## Scheduling

Related specifications: 13, 14, 15.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A051 | Weekly availability | Working windows and breaks intersect correctly with commitments. |
| A052 | Date exceptions | Absences identify affected work without silent cancellation. |
| A053 | Staff eligibility | Any-available selection allocates a genuinely eligible staff member. |
| A054 | Resource allocation | Rooms and equipment obey their own capacity rules. |
| A055 | Buffers and processing | Staff release and resource occupancy can differ. |
| A056 | DST semantics | Local intended times survive clock changes correctly. |
| A057 | Manual appointments | Owners can add real bookings as well as blocks. |
| A058 | Customer changes | Cancel/reschedule evaluates the accepted rules and applicable rights. |
| A059 | External sync | Busy-time synchronisation defines source, privacy and failure handling. |
| A060 | No-show handling | Recording absence is separate from successful fee collection. |

## Sessions and repeat offers

Related specifications: 15, 17.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A061 | Session capacity | Attendee quantities cannot oversell remaining places. |
| A062 | Payer and attendees | Booking and payment participants have explicit visibility. |
| A063 | Attendance | Check-in updates the attendee rather than deleting session history. |
| A064 | Waitlist fairness | Invitations expire and seats are allocated once. |
| A065 | Series rules | This occurrence and future-series changes remain distinct. |
| A066 | Package entitlements | Concurrent reservations cannot consume the same final credit. |
| A067 | Membership billing | Payment failure, pause and access changes have clear rules. |
| A068 | Quote versions | An accepted quote preserves exact scope and terms. |
| A069 | Deposits and balance | Remaining due is traceable to the agreed commitment. |
| A070 | Mobile-service travel | Addresses and travel rules constrain feasible times. |

## Payment and fulfilment

Related specifications: 12, 16.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A071 | Merchant onboarding | Processor requirements map to explicit transaction eligibility. |
| A072 | Financial responsibility | Charge arrangement and negative-balance exposure are chosen deliberately. |
| A073 | Reservations | Time and stock holds have expiry and recovery behaviour. |
| A074 | Duplicate protection | Retries and duplicate events create one financial effect. |
| A075 | Late payment | Expired holds trigger reconciliation and defined compensation. |
| A076 | Collection handover | An appropriate proof records who collected and when. |
| A077 | Shipping exceptions | Partial fulfilment and carrier problems have visible next steps. |
| A078 | Digital entitlements | Delivery and revocation reflect payment and applicable terms. |
| A079 | Partial refunds | Refund amounts, lines and remaining value reconcile. |
| A080 | Returned stock | An inspection/disposition controls whether goods become resellable. |

## Activity and communications

Related specifications: 18, 19.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A081 | Activity timeline | Customers see what happened and their next useful action. |
| A082 | Private deep links | Authentication returns to the correct authorised record. |
| A083 | Contextual threads | Messages retain their merchant and transaction scope. |
| A084 | Notification channels | Customer preferences and operational requirements stay distinct. |
| A085 | Reminder delivery | Failure creates a retry/attention state rather than changing the booking. |
| A086 | Change messages | Only committed reschedules send final new details. |
| A087 | Marketing consent | Purchasing, saving and rewards do not silently grant marketing permission. |
| A088 | Shared-device privacy | Sign-out removes private cached content. |
| A089 | Attachment handling | Files have type, size, access and retention controls. |
| A090 | Support handover | Permitted existing context follows the case. |

## Rewards and Taplo hardware

Related specifications: 20, 22.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A091 | Earning eligibility | Only qualifying transactions produce points or visits. |
| A092 | Pending rewards | Customers understand when earned value becomes redeemable. |
| A093 | Redemption reservation | Concurrent actions cannot spend the same reward twice. |
| A094 | Refund reversals | Adjustments reflect earning model and eligible refunded value. |
| A095 | Reward expiry | Published terms and reminders govern expiry where permitted. |
| A096 | Programme closure | Outstanding promises have an explicit resolution. |
| A097 | Accessory provisioning | Hardware identities map to legitimate orders and claim tokens. |
| A098 | Verified binding | Possession of a public URL cannot reassign a card. |
| A099 | Redirect lifecycle | Handle changes and replacement do not strand legitimate visitors. |
| A100 | Lost hardware | Revocation and replacement are traceable and recoverable. |

## Support and trust

Related specifications: 23, 24, 25.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A101 | Case triage | Issue type determines responsible queue and next action. |
| A102 | Waiting cases | Waiting retains an owner and deadline. |
| A103 | Return resolutions | Refund, replacement and rejection retain reasons and applicable rights. |
| A104 | Chargeback ingestion | Provider amount and deadline are authoritative. |
| A105 | Evidence submission | Reason-specific evidence has access and retention limits. |
| A106 | Refund-dispute conflict | Connected tools cannot double-compensate one financial issue. |
| A107 | Review eligibility | Verified reviews have a defined qualifying interaction. |
| A108 | Content reports | Reporting and appeals protect necessary confidentiality. |
| A109 | Suspension scope | Offer, discovery and account restrictions can differ. |
| A110 | Audit record | Consequential support actions identify actor, reason and change. |

## Operations and commercial

Related specifications: 26, 27, 28, 29.

| ID | Area | Behaviour to specify |
| --- | --- | --- |
| A111 | Retention | Personal, transaction and evidence data have explicit lifecycles. |
| A112 | Policy versions | Accepted terms remain retrievable with the transaction. |
| A113 | Subscription wind-down | Merchant billing problems do not strand customer records. |
| A114 | Reconciliation | Financial and reservation exceptions have owners and recovery jobs. |
| A115 | Observability | Support can distinguish a local error from an incident. |
| A116 | Backup restoration | Restore is tested against realistic records and totals. |
| A117 | Schema migration | Evolving models preserve agreements and reconcile counts/value. |
| A118 | Pilot measurement | Owners and customers attempt complete tasks without coaching. |
| A119 | Unit economics | Support, messaging, payments and acquisition costs inform pricing. |
| A120 | Decision revisions | Changes record evidence, consequences and affected documentation. |

