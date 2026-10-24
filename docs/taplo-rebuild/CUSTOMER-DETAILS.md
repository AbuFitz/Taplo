# Customer collections and detail views

24 October 2026. Continues the mobile-first frontend after the registration/marketing checkpoint.

Design read: a customer needs to see work clearly, compare supplied before/after photographs without losing position, and move from a person's services into booking without searching for an action. Keep gallery photography edge-to-edge inside a dark viewer, contain the original image rather than cropping it, and retain rounded controls with visible focus. The viewer stays inside the visual viewport and keeps controls above safe-area insets. Paired content has explicit Before/After buttons; no precision slider gesture is required. No auto-advancement or new dependencies.

Native horizontal collections should only offer scrolling controls when content actually overflows. Measured item rectangles and real spacing determine navigation and the visible range, regardless of owner typography, card size or spacing. Desktop rows with nothing to scroll should not advertise a carousel. Home/End and arrow navigation belong to the collection itself; child controls retain their own keys. Native vertical scrolling, browser zoom and reduced motion remain available.

Team profiles use the existing detail overlay and page tokens. The service menu has aligned prices and subordinate duration labels. A persistent booking action sits outside the scrolling biography, leading into one booking overlay with the selected person. Do not add invented people, qualifications, availability or transactional outcomes.

Evidence: current source and fixture contracts; maintained Lucide controls; existing Radix overlay foundation and booking eligibility. QA comparison images are synthetic test records, not claims of a real transformation. New example photography/attribution from the previous checkpoint is unchanged.

Verification and deployed commit evidence are recorded in the handoff. Remaining: physical mobile touch/keyboard/orientation, larger owner and booking-detail refinements, performance measurement, legal suite with verified operator details, and later backend integrations. This checkpoint does not complete the full frontend.

Owner steering received during this checkpoint: finish the current customer-detail work, then revisit the earlier hero, update other marketing pages with their own lead compositions and coherent feature narratives, slow and visually unbox the film, add responsive monochrome background motion, correct white backing/crop bugs around rounded previews, and give the design gallery stronger visual separation. Feature demonstrations should feel elevated through authored composition, lighting/depth/crop and restrained motion, rather than flat stock inserts. This supersedes treating the latest homepage composition as approved.

Visual review also found station's synthetic staff portraits still present despite the previous checkpoint's broader removal claim. This correction removes those particular portraits; neutral initials replace them. Historic hidden fixture imagery remains available for regression testing and is not all replaced.

Verification checkpoint: normal Turbopack build, lint, typecheck and222 unit tests pass (39 database-dependent skipped). Final affected production Chromium70 passed together. Native WebKit/Firefox14 customer-detail cases passed, with the final profile accessibility additions checked separately. Actual390px comparison viewer and profile screenshots were reviewed and corrected. Source changes retain browser-only booking truth. Public deployment verification follows before this step is marked shipped.
