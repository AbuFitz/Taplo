# Round two: gallery, homepage, QR, messaging, widget system

Written against the second corrective brief and the three clarifications that arrived while it was being built: the QR code is **Taplo's own** (the Taplo mark in the middle, not each business's logo), the example designs were outdated and weak, and the widgets needed to behave like one system.

## What changed

| Area | Result | Where |
| --- | --- | --- |
| Marketing labels | Every decorative uppercase eyebrow is gone from the homepage, product, pricing, how-it-works and gallery pages. Hierarchy now comes from headings, composition and imagery. Real navigation headings (footer columns, menu groups) stay. | `src/app/**`, `src/features/marketing/*` |
| Homepage | Rebuilt around what Taplo does, one format per idea: a large hero composition, the 15-second film, a live running page, a swipeable row (people, stock, products, photos, prices, reviews), message bubbles, static QR artwork, a look switcher, the setup journey in three captures, plans. Motion is a single rise-in on headings and a crossfade in the look switcher. | `src/app/page.tsx`, `src/features/marketing/home/*` |
| Designs gallery | `/inspiration` is now a gallery that leads with previews: filters for style (Dark, Light, Bold colour, Photo-led, Type-led) and what the page has (Booking, Team, Products, Vehicles, Photos, Reviews, Messages), a Desktop / Phone switch, and one action. "Shown with" is a separate, clearly labelled choice of example business: it never filters a design out of reach. | `src/features/inspiration/Gallery.tsx`, `facets.ts` |
| Using a design | For someone with a page, the button applies the design's look and arrangement only. Their words, prices, photos and widget order are untouched and the change is one undo away. For someone starting out it begins setup from the design. | `src/features/inspiration/UseDesign.tsx` |
| Example designs | Seven examples rebuilt: real photography for six of them (the seventh, a physiotherapy clinic, is deliberately type-only), a distinct header and desktop composition each (split, columns, centred), photo galleries where the business has something to show. All of it is the owner's own configuration (Header and Design tabs); nothing is showcase-only. | `src/features/showcase/lab-state.ts` (`EXAMPLE_OVERRIDES`), `examples.ts`, `content.ts`, `public/showcase/CREDITS.md` |
| Widget system | One spacing scale (s1 to s8) and one type scale (xs to 2xl, following the owner's text size) now drive every widget rule. Before: 14 font sizes and 12 gaps. A test fails if a raw value is added. Fixed a bug where a poster header shrank to its content on desktop. | top of `page.css`, `page-css.test.ts` |
| Design options | Specialist type and card options (heading weight, case, alignment, border, shadow, inner space) moved under "More type options" and "More card options". Nothing was removed and no saved value changes. Found and fixed a page showing two booking buttons when the header used button mode. | `src/features/appearance/sections.tsx`, `view-model.ts`, `Header.tsx` |
| Messaging | Five things kept apart: opening the customer's text app, an enquiry, appointment messages, reminders, promotional messages. A real **Text us** widget opens the customer's own messages app (`sms:`, nothing sent by Taplo). A central status list says which are working and which switch on when a messaging service is connected; marketing, product pages and setup read it. | `src/lib/feature-status.ts`, `src/app/product/messages`, the `sms` widget |
| QR codes | One renderer for the on-screen code, the SVG, both PNG sizes and the share image. Taplo mark centred, Taplo ink on white, soft modules and rounded finder corners. Details below. | `src/features/qr/*` |
| Launch wording | The marketing narrative no longer says "preview" or explains the backend. What is not connected appears where someone tries it (publish, share, pricing note), from the one capability list. The sandbox badge remains in the app. | `src/lib/capabilities.ts` |
| Setup | The clean first step now carries through: plan and example are small chips in the header, not banners; the finished step says "Saved as your page" in the sandbox rather than "Published (demo)". | `Onboarding.tsx` |

## The QR code

**Evaluation.** The existing renderer drew plain squares and could not place a mark. `qr-code-styling` 1.9.2 (MIT) would have worked, but it draws on canvas in the browser, cannot run in a unit test, and gives less control over finder patterns and the mark's clear area. I kept `qrcode-generator` for the encoding and wrote the drawing: no new dependency, one function (`qrSvg`) that produces the same SVG everywhere.

**Rules the renderer enforces itself:**
- quiet zone of 4 modules, always, on a plain background;
- finder patterns drawn whole; only their corner rounding varies (never full circles, which a strict decoder lost);
- dark modules at least 7:1 against the background, darkening or falling back to black if needed; a dark page background falls back to white;
- the mark is at most 20% of the code's width (4% of its area) with one module of clear space, which is far inside what error correction Q (about 25% recoverable) can lose; without a mark the code uses M;
- the destination is the page's own address. An unpublished draft has no public address, so its link is the one that opens in this browser, the panel says so, and every file is named `-preview-`;
- a wide logo is left out rather than squeezed (not relevant to the Taplo mark, kept for any future use).

**Exports:** SVG with the mark embedded as a data URI (self-contained); PNG at 1024 px (screen) and 3000 px (25 cm at 300 dpi, print); the 1080 × 1350 share image that carries the business's own logo, name and line above the code. File names say what they are: `marlowe-and-finch-preview-qr-1024px.png`.

**Verification (export, decode, destination):** 82 unit tests render the SVG, rasterise it at 256, 512, 1024 and 3000 px, and decode it with jsQR for six styles including the real Taplo mark, a short URL, a local URL and a 250-character URL, plus the colour, correction and logo-size rules. An end-to-end test downloads each file from the share panel, checks its size and name, and decodes the QR PNG at both sizes, the SVG and the share image back to the exact link.
Honest limits: jsQR is a strict decoder and loses very large images to its own thresholding, so files are decoded at a camera-like working size (the file's own dimensions are asserted separately). No physical phone was available, so a scan by a real camera app is **not** verified; the first thing to do on a device is scan the 1024 px PNG from the share panel.

## What is not connected, and what was not tested

- No SMS, email or payment provider is connected, so appointment messages, reminders, promotional messages, email delivery of enquiries and deposits are described as switching on when connected, never as sent. The `sms:` button works because it only opens the customer's own app.
- Accounts, public addresses and a shared database are not connected; pages and the QR destination are local until they are.
- Chromium only; no physical devices, no Safari or Firefox, no screen reader. Photography is stock under the Unsplash licence; the people in some photographs are not named or implied to be the fictional businesses' staff.

## Results

See the end of this file for the exact figures of the last run.
