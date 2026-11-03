# Profile arrangements: review and decisions

Evidence: a matrix of every arrangement against logo type (none, square, wide, tall, tiny), cover (none, landscape, portrait), mark size and shape, and short/long names, light and dark (`tests/e2e/arrangement-matrix.spec.ts`, run with `TAPLO_SHEET=1`). Reviewed at 390 px.

## Findings and decisions
| Finding | Cause | Decision |
|---|---|---|
| Mark size choice did nothing in framed, duo, lifted, masthead | the arrangements forced size `sm` for logos and capped logo height per layout | Use the owner's size everywhere; one height step per size token (2.5 / 3.5 / 5 rem), width capped by the column; duo steps down in a narrow column |
| Open blend: name hard to read on mid-tone photos | text sat on a translucent fade | Fade the photo into the page background before the text begins |
| Long names filled three or four lines | one fixed display size per layout | `data-len` on the name steps size down for names over 22 and 34 characters |
| Editorial Poster ignored the logo | markup omitted it | Show the logo above the kicker at the chosen size |
| Centred identity: name touched the cover with no logo | padding removed whenever a cover existed | Only remove it when a mark overlaps the cover |
| Suggestion picked one layout from three rules | no ranking, no reasons | `rankArrangements` scores every available arrangement from logo, cover, wide mark and name length; the picker lists them best first and tags the top one |
| Layouts built on a photo offered without one | no availability rule | Hidden or disabled until a cover exists (`needs: photo`) |

## Not verified
Real phones and browsers other than Chromium. Wide-logo plates on dark designs were checked in the matrix only for the barber content.
