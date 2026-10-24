# Six current UK examples and a responsive feature header

The primary gallery and owner welcome now offer six newly authored UK examples: Station Road Barbers, Parkside Valeting, Brookfield Motors, Corner Table Café, Oakfield Home Repairs and Rowan Learning. The gallery retains eight examples overall and all older example URLs remain compatible. These are clearly fictional demonstrations, not verified operating businesses.

## New designs

Counter uses warm cream, restrained brown and green, an editorial heading and a proper café menu. Corner Table has café opening hours and a group enquiry, without presenting coffee orders as appointments.

Fieldwork uses muted green, an original home-repair photograph, a simple wordmark and a wide photo/identity header. At sufficient available width the photo sits beside the business identity; on phones and inside narrow desktop columns it stacks. This is a reusable, saved header choice in the engine and visual editor, rather than an example-specific layout exception. Oakfield offers a visit request, a separately quoted shelving job and a free discussion of longer work.

Notebook combines a readable serif heading, navy accents and an approachable tutor portrait. Rowan features a free introduction and keeps it out of the subsequent lesson list, while retaining it in the business's records. GCSE and A-level lessons remain available. Requests finish pending; the example does not claim a lesson is confirmed or paid.

## Shared engine changes

- Service lists can exclude services already shown by visible featured-service sections. The renderer, owner summary and empty-state explanation share the same selection function. Hiding the featured section restores the service to the list.
- Featured-service actions follow the service's actual request, instant or contact mode unless the owner supplies a label.
- Starting a new page from an example strips sample record references using registry field definitions. New owners get their own services and people, without stray fictional record IDs. Existing owner records and saved appearance remain intact.
- Three new reusable looks, Counter, Fieldwork and Notebook, bring the look library to sixteen. Relevant industries receive updated starting suggestions.
- New gallery and look thumbnails come from the real renderer. The capture command now rejects unknown requested IDs.

## Media and evidence

Three original generated illustrative photographs and two code-native SVG wordmarks are included with provenance in public/taplo-demo/assets.json. No third-party business identity, invented accreditation, customer review or claimed availability was added. All five assets are in the preparation pack as well as the implementation repository.

Six fresh phone/desktop marketing captures and three look thumbnails are generated. Reviewed phone and desktop screenshots are in the delivery package. The desktop Oakfield first viewport includes its useful service choices instead of a banner consuming the whole screen.

Production build and TypeScript pass. Full unit suite: 200 passed, 39 database-dependent skipped. The affected browser run passed 59 checks before the final container refinement; the final UK journeys and connected editing repeat passed all 21 checks, including 390/768/1440 feature-header geometry. Targeted lint and stylesheet/selection regressions are checked again before commit. This is Chromium browser evidence, not a claim of physical-device or full cross-browser testing.

## Still open

The full engine/journey matrix, older remaining industries, service detail simplification and full product walkthrough clips remain part of the rebuild. These examples and checks do not close those requirements. Backend integrations remain separately scoped.
