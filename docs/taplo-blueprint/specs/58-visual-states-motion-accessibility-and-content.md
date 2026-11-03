# 58 · Visual states, motion, accessibility and content

Edition 0.9 · Extends specs 35, 46 and 52 with a visual review contract.

## Component state coverage

For each applicable control define rest, hover, focus, pressed, selected, disabled, loading, error and success. Not every state requires a new colour or animation. Every transactional screen also reviews initial, populated, empty, partial, offline, permission denied, expired session, stale/conflict, timeout and unavailable-record cases. Avoid generating dozens of meaningless duplicates: identify which states affect each surface in the coverage matrix and show those frames.

Reserve height for images and loading regions. Skeletons should resemble the actual structure and not flicker for instant loads; honour reduced motion. Pending buttons use a meaningful label and preserve task context. When cost or availability changes, show the actual difference and require a fresh choice/review where material. Stable page layout is more valuable than decorative animation.

## Motion grammar

Motion explains entry, exit, selection and spatial continuity. A sheet opens from its task context; Back clearly reverses a step. Shelf movement follows the input; it does not autoplay. Do not zoom the whole phone/page to dramatise ordinary onboarding, loop promotional motion behind forms, or bounce success controls. Reduced motion uses immediate or restrained state changes while preserving meaning. Final timings/easing require visual/device review; placeholder values do not establish a brand standard. Never wait for an animation before committing or reconciling data.

## Readability and input

Use a small deliberate type hierarchy, comfortable body text and readable supporting text; mobile form inputs must not become cramped labels. Primary facts—price, total, date, timezone, merchant, fulfilment and action outcome—are not muted decorative metadata. Set token targets and verify contrast against the actual final surface, including brand accents, selected map markers, image overlays and disabled text where relevant. Link meaning, required fields and errors cannot rely on colour alone.

Controls retain visible focus. Keyboard order follows reading order; a desktop inspector does not intercept typing from an editor unexpectedly. Modal focus stays within the active task and returns appropriately. Headings and labels describe task and context without repeated business-name announcements. Native controls or well-tested accessible components are preferred over bespoke imitations. Larger text reflows rather than truncating price or hiding Close. Review screen reader announcements for loading/status and avoid announcing every map pan or input keystroke.

## Error and success wording

Use an action and consequence: “That time has just gone. Choose another time; your details are saved.” Avoid “Something went wrong” as the only recovery instruction. Do not state details were saved unless persistence succeeded. “Request sent” differs from “Booking confirmed”; “Refund requested” differs from “Refund completed”. Copy success depends on actual clipboard result. Support errors carry a safe reference, never raw provider/debug text. Error reporting captures useful context without requesting secrets.

Success gives the result and next step, then makes it findable later. Booking: date/time/location or joining information, policy and Manage booking. Order: reference, fulfilment status and View order. Quote: validity and Accept/Decline where eligible. Subscription: billing cadence and management. Reward: actual eligible benefit. Domain/NFC: verified state and useful next task. A confetti overlay never substitutes for a receipt/status.

## Imagery, placeholders and empty states

No fake initial logos, invented ratings, false stock or fabricated customer history. Optional imagery should improve the page, not leave blank panels when missing. Product photos use appropriate fit; wordmarks preserve proportions; human photos are not randomly cropped across faces. Owner previews label sample content distinctly from authored/public facts. In the real customer app, empty Activity explains how work appears there and offers an appropriate route, without sample orders masquerading as personal records.

## Content and localisation review

Centralise semantic strings and status labels while allowing genuine merchant content. Review singular/plural, long names, currency, decimal separators, local date/time, timezone and daylight-saving display, address formats and translated line lengths. Avoid unexplained jargon such as fulfilment in customer-facing microcopy when “Delivery or collection” is clearer. Labels describe real actions; merchant styling cannot rename a required confirmation into a misleading promotional verb. Review email, push, share metadata and printable receipts alongside screen copy so the same event does not acquire conflicting names.
