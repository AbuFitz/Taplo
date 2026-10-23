# Tools: versions, licences and what was not adopted

Checked against the installed packages (`node_modules/*/package.json`) and the official repositories at the time of writing. Nothing here is a bulk install: each entry names the gap it fills.

## Adopted

| Tool | Version | Licence | Used for | Notes and limits |
| --- | --- | --- | --- | --- |
| Radix UI (`radix-ui`) | 1.8.x | MIT | Dialog, popover, navigation menu, the shared overlay foundation (`src/components/taplo/overlay.tsx`) | The navigation menu and the mobile sheet use it too. |
| react-day-picker | 10.0.2 | MIT | The date strip in the booking journey (`src/components/ui/calendar.tsx`) | Version 10 API verified in the installed package before use. |
| Base UI (`@base-ui/react`) | 1.9.0 | MIT | The non-modal drawer in the mobile editor, so the live preview stays interactive | Adopted for a demonstrated gap: a Radix dialog is modal and blocks the preview. Not used for any other overlay. |
| motion | 14.6.0 | MIT | Restrained transitions (marketing scene, editor) | Always respects reduced motion. |
| qrcode-generator | 2.0.4 | MIT | The share QR code (PNG and print SVG) | Error-correction level chosen for print. |
| jsqr | 1.4.0 (dev) | Apache-2.0 | Tests decode the generated QR to prove it encodes the link | Test-only. |
| HyperFrames | 0.8.186 (CLI via npx) | Apache-2.0 | The 15-second film (`marketing/film`) | Renders deterministically from HTML; needs Chrome and ffmpeg. GSAP is loaded from jsDelivr by the project (edit-time only; the render is a file). |
| opentype.js | 2.0.0 (dev) | MIT | Outlines type into the flat example logos (`scripts/marketing/logos.mjs`) | Misreads a few glyphs of some static fonts (Barlow T, Fraunces s); those letters are avoided. |
| @fontsource static packages | fraunces, lexend, space-grotesk, bricolage-grotesque (dev) | SIL OFL | Source fonts for logo outlining | Dev-only. |
| sharp, Playwright | existing | Apache-2.0 | Marketing captures at 2× (`scripts/marketing/capture*.mjs`) | Chromium only. |

## Evaluated and not adopted

| Tool | Why not |
| --- | --- |
| Embla Carousel | CSS scroll-snap covers the collections (peek, touch, keyboard, previous/next, labels, no autoplay, reduced motion). Embla would add a dependency for drag physics and loop modes nothing here needs. |
| PhotoSwipe | The lightbox covers arrows, keyboard, counter, zoom, swipe, Escape and return of focus to the opening thumbnail (tested). No demonstrated gap. |
| FullCalendar Standard | The owner calendar (agenda, day, week, month, blocked time) is built on the booking engine and a few hundred lines. FullCalendar's resource and scheduler views are Premium (commercial), so adopting it would risk an accidental commercial dependency for no gap. |
| React Hook Form | Forms are small and validated with zod; no second form system. |
| Base UI Drawer for the public sheets | The shared Radix-based overlay already provides dialog, detail and full-screen mobile sheet with focus, Escape, safe areas, scroll lock and visual-viewport keyboard avoidance (tested). |
