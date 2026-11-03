# Language, content and status contract

Status: proposed cross-product wording system, edition 0.7. Good wording must reflect the actual action/state; a general instruction to make copy polished is insufficient.

## A shared vocabulary with context

| Context | Clear wording pattern | Meaning to preserve |
| --- | --- | --- |
| Discovery | Search businesses, services and products; Visit business; Save | Choosing and returning, without an accidental purchase or marketing enrolment |
| Public service | Book a time / Request a time / Ask for a quote | Instant booking, owner-accepted request and quotation are distinct |
| Product | Choose options; Add to bag; View bag | Selection and cart actions do not imply payment |
| Checkout | Review total; Pay [amount] where an actual payment is committed | Make amount, terms and commitment clear before the final action |
| Pending payment | Payment is being confirmed | No duplicate purchase prompt while the outcome is unknown |
| Booking result | Booking confirmed / Request sent | Confirmation is only used when the relevant commitment exists |
| Quote | Quote ready; Accept quote; Changes need your approval | Exact scope/price/version and remaining obligations |
| Refund | Refund requested / Processing / Refunded | Approval and completed reversal are separate states |
| Wallet | Preview card; official Add to Wallet action; Open Wallet where supported | Link opening does not prove a pass was installed |
| Sharing | Copy link; Share; Download QR | Cancelled native share is neither an error nor a completed share |
| NFC | Claim accessory; Choose destination; Ready to scan; Written and checked | Reading, ownership, activation and successful write-back are distinct |
| Domain | Buy domain; Verify ownership; Connecting; HTTPS ready; Renew | Provider order acceptance is not active registration plus working hosting |
| Studio appearance | Entire page; This block; Follows page; Customised; Reset this block | Owners can predict the scope and recovery of a change |
| Support | Waiting for the business; Action needed; Resolution recorded | Case status does not pretend a provider/bank outcome happened |

The examples are patterns, not final universal strings. Each actual screen needs the correct verb for its offer type, role and state. Choose one noun for cart/bag throughout each supported locale rather than randomly mixing them. A label can adapt to merchant terminology without changing its underlying promise.

## Content provenance and rendering

Business facts come from source records. Merchant-written descriptions, platform-required notices, suggested copy and starter examples have explicit provenance and editing rights. Do not invent reviews, professional credentials, availability, locations or policy promises. Suggested text needs owner verification where it makes factual claims.

Retain semantic heading order, meaningful button names, text alternatives and labels independent of visual effects. Secondary text can be quieter but remains legible. Essential prices, errors and commitments cannot depend on a tooltip or disappear in a low-contrast surface. Avoid decorative microcopy that obscures the next action.

Handle long names, no images, multiple languages, pluralisation, currency, time zones and dates deliberately. Do not crop a price basis or cancellation condition to fit a pretty tile. A compact card can summarise and disclose detail in a labelled sheet; the final commitment still includes required information.

## Review method

For each surface, record: actor; intent; exact state; claim source; primary/secondary action; error/recovery; permission boundary; localisation; accessibility label and contrast context. Read the complete journey aloud from discovery to receipt/support. Include empty/loading/offline/stale/expired/blocked states. Public wording describes the actual service; implementation caveats stay in internal release tracking.

Acceptance: a user can tell whether they are saving, requesting, booking or paying before activating the control. Changing visual style cannot change the promise. Two linked surfaces do not contradict the current status. “Success” is replaced by a specific truthful result where it matters.
