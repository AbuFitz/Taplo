# Film storyboard — One good page

Audience: UK small-business owners who need a clear page customers can use. Three separately composed formats: landscape 1920×1080, portrait 1080×1920, square 1080×1080. Silent, 30fps, 18 seconds. See marketing/film/README.md for exact regeneration/check/render/finalization commands.

| Time | Screen line | Evidence | Motion |
| --- | --- | --- | --- |
| 0–3s | Your business. One good page. | Original illustrative local barber photograph paired with Station Road's actual page | Headline arrives first; photograph/page ease upward |
| 3–6s | A price. A time. You're in. | Current Haircut £22 / 30-minute detail and actual available-time picker | Two clear phone screens enter together |
| 6–9s | Same business. Your own look. | Station Road's content in High Street, Mono, Workbay and Forecourt | Four-picture arrangement, recomposed in each ratio |
| 9–12s | Worth a closer look. | Original illustrative UK forecourt photograph and working Brookfield catalogue | Business photograph paired with large stock cards |
| 12–15s | One link. More places. | Branded Station Road share image downloaded through the actual sharing interface | Share card and short counter label |
| 15–18s | Your business. All together. | Taplo mark, action and the new UK example pages | Logo/action remain readable while pages enter |

The page UI is captured from the shared renderer. Photography is illustrative; every business and stock listing is fictional. No customer endorsement, payment, message delivery or public publishing claim is made. Share-card QR addresses use the reserved .example domain.

The composition uses explicit pixel dimensions as well as its HyperFrames data-width/data-height. The delivered local renderer captures that full canvas explicitly. A blank-strip defect in the local HyperFrames export wrapper was caught in decoded frames; the fallback renderer avoids the wrapper and finalization rejects blank strips. Phones preserve their real page proportions. Page cards may intentionally continue beyond the frame; all headings/action text stays within it.

Verification includes settled frames in every ratio, frames decoded from the delivered MP4s, browser playback/metadata, and FFprobe dimension/duration/audio validation. public/marketing/film/manifest.json records exact output and source hashes. Three isolated 3-second feature cuts are exported for booking, design and stock; these are feature beats, not full tutorials. The six-beat text alternative is available under Read the film. The homepage uses portrait on small screens and landscape on wider screens, starts only when asked, and loads no video before that click.
