# Marketing cohesion correction, 25 October

The latest instruction restores the normal website navigation on inspiration. “No header” now means no introductory hero, not removal of site navigation.

## Implemented

- Inspiration retains its direct gallery and gains the shared desktop navigation/mobile menu.
- Homepage removes the entire “Show what you can do” composition and the entire QR/plaque section. `/product/sharing` is retained.
- Homepage message sequence is business page → booking → existing tools → animated composition → plans. No replacement filler section was added.
- Homepage headings and explanatory text use concrete actions; footer and menu descriptions receive the same plain-language pass.
- Booking and pricing headings are more explicit. How-it-works ends with “Before you start.” Gallery/reviews details no longer repeat the same review destination twice.
- Hero fades into the light booking section; the existing-tools section fades back into the dark animation area.

## Evidence

- Browser inventory: 15 marketing routes at 390 and 1440 pixels (30 page loads), no horizontal overflow, broken completed images, page errors or non-200 responses. Screenshots and heading inventory in `work/marketing-cohesion/`.
- Navigation suite: 14 passing checks at 320, 390, 768 and 1440 pixels, including menu focus restoration and desktop dropdowns.
- Copy/pricing/booking/freeform suite: 19 passing checks, including preservation of the QR product route, removed homepage sections, gallery search, accessibility and pricing interactions.
- Marketing lint and TypeScript checks passed locally.

## Still required

This is a scoped correction, not a claim that every marketing page has been redesigned. The ten feature pages retain their shared opening layout and need more distinct, purpose-led compositions. The broader engine, dashboard, final theme collection and final media work remain on the main checklist. Service/package engine work is separate from this marketing change and must not be included accidentally in this release.
