# A product story that leads somewhere

24 October2026. Scope: replace the homepage’s boxed18-second slideshow after registration checkpoint109b120. Do not mark the broader homepage hierarchy, earlier hero preference, Product/Pricing, portal or example catalogue complete.

Design read: owners need to understand that Taplo serves different business operations, then try the relevant experience. Three intentionally paced11-second stories: detailing request, vehicle enquiry/viewing, café menu/hours. Use real licensed photographs and captured actual renderer states, no invented customer data, generated icon art or fake successful transactions. Each composition and its clear text link opens its corresponding explorable design/demo page.

Render the animation as native HTML/CSS on a transparent canvas, rather than embedding another opaque MP4 and calling it transparent. Photograph and actual product surface enter in sequence; text explains their relationship. Different placements and proportions distinguish the scenarios. Mobile uses full-width readable artwork, then concise text; desktop uses a wider composition. Neutral tones, no phone bezel or enclosing video box. Existing downloadable films remain available but are no longer the homepage experience.

Autoplay only when visible, document active and motion permitted. Pause when hovered/focused; choosing a story stops automatic changes for that visit. No play/pause overlays. Reduced-motion renders the still composition and manual business choices; retain all essential text and real links without JavaScript. Do not announce automatic changes or move keyboard focus. No new runtime library.

Reference reviewed: https://www.framer.com/ — its product-specific canvas examples and direct feature actions inform demonstrating a useful operation with a destination. This is an interpretation, not a claim of reproducing Framer’s implementation.

Verify mobile320/390/430, desktop/tablet, each destination, image loading, no overflow, selection persistence, automatic progression, hover/focus/offscreen/document pause, reduced motion, contrast/accessibility and screenshots on both light/dark canvases. Public deployment verification required.

Release verification: normal production build/typecheck and targeted lint/diff pass.46 affected homepage/marketing/walkthrough cases passed together. Final6 story cases pass after visual corrections:320/390/768/1440, each real demo destination, actual complete images without cropped product facts, accessibility, automatic11-second progression, offscreen/hover/manual/reduced-motion behaviour and both light/dark canvases. Final native Firefox/WebKit12 pass. Images are refreshed current renderer states; prior cached screenshots with coloured legacy booking styling were caught in visual review and replaced. Product photo and surface motion begins on entering view. No runtime dependency added. Public deployment verification pending at commit time.
