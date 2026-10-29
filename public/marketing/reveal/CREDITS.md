# Taplo continuous product reveal

Authored and rendered by Taplo, 24 October2026. Real captured frontend surfaces, licensed business photography and Taplo/Jay’s example identities. No model-generated UI or fabricated booking result.

The vehicle imagery in these films is the project's own generated illustration (public/taplo-demo/assets.json); it is not photography of real stock. Individual photographs and font/logo assets retain their existing licences and rights; see /credits and /marketing/film/CREDITS.md. Application code is not relicensed.

- portrait.mp4 / landscape.mp4: ordinary silent H.264 exports for review.
- *-packed.mp4: internal playback assets. Left half is colour; right half is its alpha matte. A small browser GPU compositor provides the genuine transparent background using one H.264 decode. Do not use these internal files as ordinary downloadable films.
- *-poster.png: actual transparent frame from the same rendered sequence.

Three.js0.186.1 is a production/render tool, under MIT, and is not loaded by the website. Browser playback adds no new runtime dependency. Sources: marketing/film/reveal and scripts/marketing/prepare-reveal.mjs / render-reveal.mjs.
