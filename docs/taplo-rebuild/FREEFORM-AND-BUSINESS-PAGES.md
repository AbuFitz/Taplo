# Freeform marketing and real business pages

Status: implemented and verified locally; preparing release. Full owner checklist remains active.

## Owner requirements implemented

- Homepage hero uses a real 3× capture of the engine-rendered Detail Dept. page: 1170×2532 pixels from a 390×844 viewport. Shared handset hardware on phone and desktop, bottom crop/fade, no hover lens, browser mockup or overlaid slogan. Source pose is recorded beside the image.
- Replaced the rejected service/pricing chooser with a freeform project composition. Hero-to-section transition fades through the same tones. Sections no longer all put copy left and artwork right. Booking illustration copy identifies an initial physiotherapy assessment, available days and times.
- Scroll entrances move short distances once. Content remains visible and interactive; reduced motion removes travel. No scroll hijacking or timed reading gate.
- Inspiration root opens directly to the live design catalogue. No site header, visible hero, intro or footer. Search, category/filter controls, real demos and design adoption remain.
- How it works uses distinct identity, design and customer-preview compositions with native FAQ disclosure. Existing websites and tools are explicitly supported.
- Product overview uses four pointer-intent/tap/keyboard tabs with one relevant feature link per scene. Desktop footer has three HD real-page captures in shared handset frames; that scene is absent on smaller screens. The Framer hover-tab and snapshot-footer references informed the interaction/composition; no licensed template code or assets were copied.
- Free pricing tier has no artwork. Paid-tier art and entitlement-based comparison remain.
- All feature-page copy/banners/illustrations received the plain-language review documented in COPY-REVIEW-25-OCT.md. Decorative illustrations do not repeat backend disclaimers; actual operational demo outcomes remain truthful.

## Actual business pages

`/fixnowmechanics` and `/brightlearn` render through the same PageRenderer, business schema, style resolver and block catalogue as Studio. The appearance frame also accepts `scenario=fixnow` and `scenario=brightlearn`. No page-specific renderer stylesheet or fake backend was introduced.

FixNow uses the existing black/yellow identity, original website photography, six source-priced repair services, three actual dash-cam products, quote/job-tracking links and contact/social channels. Quote and purchase destinations open the existing FixNow websites. The Google share link remains a normal Google destination, without asserting an imported rating or bypassing the engine's stricter Google-review validation.

BrightLearn uses the actual logo, online-only description, programme content, six monthly prices, free-introduction contact link, parent questions and social channels. The prices are per month, never misrepresented as single-lesson prices. Programmes open the existing programme pages; no tutor identities, testimonials, lesson availability or enrolled customers are invented. Both routes are deliberately noindex until their public domain/launch is configured.

Asset/content provenance: public/businesses/fixnow/sources.json and public/businesses/brightlearn/sources.json. The source pages and pricing were checked on 25 October 2026. FixNow's wordmark is code-native typesetting of the site's existing wordmark rather than an invented badge.

## Shared engine improvements

Services now support an optional price basis: per hour, session, month or course. This is display information, not recurring-payment configuration. One formatter serves editing, customer service detail and booking review.

Services can open an existing website/booking link, with editable link text. The editor validates safe web addresses, hides irrelevant Taplo booking settings when a link is present, and preserves these choices across reloads. List, menu, featured-service and booking-journey detail paths respect the destination. External services never expose Taplo time slots.

Service pictures also support filling the space or keeping the whole picture visible. BrightLearn’s original cutout illustrations use the latter, so the figures and numbers are not cropped away. The option is available in the service editor.

Product link text is editable, defaulting to short “View in shop” or “View listing” labels. The accessible name identifies the product and destination without placing a long domain across several visible lines. Affiliate disclosure and safe new-tab attributes remain.

The preview controller applies embedded/phone document attributes after client hydration, avoiding root-attribute mismatch warnings while preserving the shared viewport geometry.

## Verification

- Production build, source lint, TypeScript and whitespace checks pass.
- 276 unit tests pass; 39 tests that require the unconfigured database remain skipped.
- 53 production Chromium cases pass across phone/tablet/desktop: business routes, product overview, freeform routes, feature illustration states, pricing rail/comparison, hero/shared hardware, service authoring and persisted existing-site links.
- 44 distinct Firefox/WebKit cases verified. First native pass had four Firefox test failures because the test inspected offscreen lazy images without scrolling; 40 passed. After exercising the actual scroll/loading behaviour, all five Firefox freeform cases pass, covering all four formerly failing widths and reduced motion. No source behaviour was disabled to pass the test.
- Business-page interactions exercise actual source links, service popup prices, focus return, no duplicate local enquiry form, share URL, status-bar colour, accessibility and overflow at 320/390/768/1440.
- Visual review includes mobile and desktop pages, all four product scenes, actual hero capture and raised business profiles/blocks.

## Explicit remaining work

The full engine/theme/dashboard/onboarding and legal work is not complete. Continue deeper authoring and renderer review, rebuild the entire inspiration collection from the improved engine, and verify every category/tier/setup journey. Remaining legal operator identity/address and backend/auth/delivery/payment/wallet/domain connections are external dependencies, not completed features. No commissions, subscriptions, messages, public accounts or wallet delivery have been activated by this release.
