# Taplo design specification (round three)

The product philosophy is Linktree's: a strong result quickly, one obvious next action, visual choices before settings, depth only when asked for. The identity is Taplo's own: white and cool neutral surfaces, near-black type, one cobalt signal, flat and precise.

## What the audit found (baseline in `docs/screens/r3-before/`)

| Area | Problem seen in the running site | Direction |
| --- | --- | --- |
| Editor shell | Two stacked bars (app header with "Managing…", plan and sandbox badges, then a second toolbar). The panel is a fixed 26 rem; the main action row ("Book or enquire" + star + status line) wraps into three lines. | One bar. Name and save state left, undo/redo, Preview, Publish right. Wider panel. Rows are one line of title, one line of meta. |
| Setup | Five steps that open with a large heading and an empty phone ("Your page appears here"). The final page can be a name and a booking button. First content is hidden inside a collapsed "optional" box next to a checkbox inventory. | Preview is a real, populated skeleton from the first keystroke. Steps: identity, what you do and first action, design, first content, review. First content is the main task of step four, not an option inside a box. Only actions with a valid destination appear. |
| Widgets | Team without photographs renders large grey squares with a silhouette; the page looks unfinished. | No portrait slot without a portrait: a compact row with a small avatar. Large portrait cards only when pictures exist. |
| Homepage | Whole phones and tablets shrunk into device outlines; a row of clipped fragments; copy that explains the implementation ("Each one says what it is"). | Compositions are close crops of real product components at readable size, one idea per section, one format per idea. Copy follows audience → need → capability → benefit. |
| Gallery | Cards crop the page at a fixed ratio, so what is shown depends on page height; no detail view. | Cards show the top of the page at the real aspect ratio of a phone or a desktop. |
| QR | One output type. | Two outputs: a standalone QR (Taplo mark by default, business logo optional, transparent or solid) and a designed share card. |

## Platform tokens

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `oklch(1 0 0)` | Pages, working panels |
| `--muted` / `--secondary` | `oklch(0.968 0.004 264)` | Page wash, inset fields, segmented controls |
| `--foreground` | `oklch(0.145 0.012 264)` | Text, primary buttons use `--primary` (0.17) |
| `--muted-foreground` | `oklch(0.46 0.014 264)` | Secondary text, 7:1 on white |
| `--border` | `oklch(0.925 0.006 264)` | Hairlines only. A surface is bordered or shadowed, never both |
| `--signal` | `oklch(0.55 0.21 262)` | Selection, focus ring, links in running text, one accent per view |
| Radii | 0.5 rem fields, 0.75 rem panels, 1 rem media | Pills only for toggles and filter chips |
| Shadow | `0 1px 2px rgb(0 0 0 / .05)` resting, `0 12px 32px -12px rgb(0 0 0 / .25)` raised | Overlays and live previews only |

Warm cream/orange, gradients and decorative shapes are not part of the platform.

## Typography

Inter Variable. Display (opsz 32, 700, tracking −0.034 em) for headings; text size for everything else; tabular numerals for prices and times (`docs/platform-typography.md`, tested against the logo and Taplo copy). Scale: 12 / 14 / 16 / 18 / 24 / 36 / 56. Headings above 36 are only for the hero and one closing statement; section headings are 24 to 36. Body line length 60 to 70 characters. No uppercase tracking labels.

## Logo

Wordmark for navigation and the app; horizontal lockup only large (footer, share card); symbol only as an app icon or the QR mark (`docs/brand/logo-decision.md`). Never recoloured, never in a circle.

## Spacing and density

4 px base. Platform: 8 / 12 / 16 / 24 / 40 / 64. Working panels use 16 padding and 12 between rows; marketing sections use 64 to 96 vertical. Touch targets 44 px. A list row is one line of title and one of meta, 56 px tall, with the action on the right.

## Surface hierarchy

Three levels: page wash (muted), working surface (white), raised (shadow). A card never contains a card; groups inside a surface are separated by space and hairlines. Selection is a 2 px signal outline; focus is a 3 px signal ring at 40% alpha; hover is a one-step neutral fill.

## Responsive layout

| Width | Editor | Marketing |
| --- | --- | --- |
| ≥ 1100 | Panel (30 rem) beside a large live preview | Two-column compositions, 1200 max |
| 960–1099 | Panel (26 rem) beside preview | Two columns, tighter |
| < 960 | Full-screen editing: the page fills the screen, a four-tab bar sits at the bottom, each tab opens a sheet; Preview is the page itself | One column; compositions re-crop rather than shrink |

No decorative phone frame inside a real phone screen.

## Motion

150 to 250 ms ease-out for state changes; one rise-in for headings; crossfade for look switching; sheets slide 250 ms. Nothing loops except the film. `prefers-reduced-motion` removes translation and keeps opacity.

## Copy conventions

Audience → need → capability → benefit. Say what the owner or customer gets, not how the product is built. No "preview", "demo" or backend commentary in marketing; unavailable actions explain themselves at the point of use, from `src/lib/capabilities.ts`. No uppercase eyebrow labels. Sentence case, UK spelling, no exclamation marks, numbers as digits. Do not invent testimonials, prices, clients or integrations; example businesses are labelled as examples where they appear.
