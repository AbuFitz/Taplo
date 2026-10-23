# Taplo, 18 seconds

Editable source of the marketing film. 1920×1080, 30 fps, silent, 18 s. Storyboard: `docs/film-storyboard.md`.

| Scene | File | What it shows |
| --- | --- | --- |
| 0–3 s | `compositions/s1.html` | Customers see prices first (a real service detail) |
| 3–6 s | `compositions/s2.html` | Then pick a time (the real booking journey) |
| 6–9 s | `compositions/s3.html` | Add a service and the page fills in (the real setup) |
| 9–12 s | `compositions/s4.html` | Start from a design, change anything (one business, four designs) |
| 12–15 s | `compositions/s5.html` | A code, a card and a link (the real QR options and share card) |
| 15–18 s | `compositions/s6.html` | End card with the Taplo logo and the action |

Every image in `assets/` is a real capture of the page renderer, made by `scripts/marketing/capture-states.mjs` and copied here. Business names are fictional. Nothing in the film claims email, payments or public links.

```sh
cd marketing/film
npx hyperframes@0.8.186 check                 # lint + contract
npx hyperframes@0.8.186 preview               # edit in the HyperFrames desktop app / Studio
npx hyperframes@0.8.186 render -q delivery -o ../../public/marketing/film/taplo-intro.mp4
```

The poster (`public/marketing/film/poster.webp`) is the settled frame of scene 3 (7.9 s): `ffmpeg -ss 7.9 -i taplo-intro.mp4 -frames:v 1 poster.png`.
