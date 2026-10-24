# Taplo — One good page

Three separately composed 18-second, 30fps silent films: landscape 1920×1080, portrait 1080×1920, square 1080×1080. Portrait and square use their own layout, rather than cropping the landscape file. Original illustrative UK business photography accompanies actual captures from the shared page renderer. The businesses and stock are fictional.

The current six beats: local business → service detail/time picker → four looks on the same business → vehicle catalogue → branded sharing card → Taplo/action. Prices, content and interfaces come from the current Station Road and Brookfield scenarios. This film does not demonstrate message delivery or payment processing.

## Edit and render

`node scripts/marketing/build-film.mjs` regenerates all three HTML projects from the authored composition source. Run from the repository root. Assets are local, including pinned GSAP 3.14.2 and licensed fonts, so rendering needs no live CDN requests. Font licences are in assets/fonts. GSAP's licence notice is retained in the vendor file; see https://gsap.com/standard-license/.

Install FFmpeg and FFprobe locally. HyperFrames uses PATH or HYPERFRAMES_FFMPEG_PATH / HYPERFRAMES_FFPROBE_PATH. HYPERFRAMES_BROWSER_PATH can select an installed Chromium. No paid or hosted rendering service is required.

```sh
npx hyperframes@0.8.186 check marketing/film
npx hyperframes@0.8.186 check marketing/film/formats/portrait
npx hyperframes@0.8.186 check marketing/film/formats/square
node scripts/marketing/render-film.mjs
node scripts/marketing/finalize-film.mjs
```

The current delivery uses the local full-canvas renderer above. The local HyperFrames export wrapper left an 88px blank strip even though the source and its checks looked correct. The fallback uses Playwright to seek the same GSAP timeline frame by frame and captures the entire authored canvas. Set CHROME_PATH or HYPERFRAMES_BROWSER_PATH to the installed browser. It uses the same local assets, timing and FFmpeg delivery settings. HyperFrames remains available for editing, checks and previews. Finalization decodes settled frames and checks the bottom edge in every scene/ratio, so a clipped export cannot pass silently.

Finalization probes every file for dimensions/duration and absence of audio, creates the posters and three short feature cuts, and records SHA-256 hashes for the delivered files and HTML source in public/marketing/film/manifest.json. Short clips are isolated 3-second feature beats, not complete customer tutorials.

Refresh UI captures using scripts/marketing/capture-states.mjs and scripts/marketing/look-thumbs.mjs before copying them into assets and regenerating formats. Refresh the full example captures when the renderer or example changes. The capture tool exits unsuccessfully if any requested capture fails. Review settled frames and transitions in all three ratios before delivering; passing checks does not replace visual judgement.

Official workflow reference: https://github.com/heygen-com/hyperframes/blob/main/docs/guides/rendering.mdx . The pinned CLI's --help is authoritative for supported flags.
