# Taplo, 15 seconds

Editable source of the marketing film. 1920×1080, 30 fps, silent, 15 s.

| Scene | File | What it shows |
| --- | --- | --- |
| 0–3 s | `compositions/s1.html` | Prices, up front (a real service detail) |
| 3–6 s | `compositions/s2.html` | Pick a time (the real booking journey) |
| 6–9 s | `compositions/s3.html` | Share it three ways: the real share panel and share image |
| 9–12 s | `compositions/s4.html` | Nine looks, every one changeable (one business, six looks) |
| 12–15 s | `compositions/s5.html` | End card with the Taplo logo and the action |

Every image in `assets/` is a real capture of the page renderer, made by `scripts/marketing/capture-states.mjs` and copied here. Business names are fictional. Nothing in the film claims email, payments or public links.

```sh
cd marketing/film
npx hyperframes@0.8.186 check                 # lint + contract
npx hyperframes@0.8.186 preview               # edit in the HyperFrames desktop app / Studio
npx hyperframes@0.8.186 render -q delivery -o ../../public/marketing/film/taplo-intro.mp4
```

The poster (`public/marketing/film/poster.webp`) is frame 8.4 s: `ffmpeg -ss 8.4 -i taplo-intro.mp4 -frames:v 1 poster.png`.
