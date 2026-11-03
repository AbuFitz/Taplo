# Taplo — One good page

Four separately composed 30fps silent films: landscape 1920×1080, portrait 1080×1920 and square 1080×1080 run for 18 seconds; the 1080×1350 (4:5) feed advertisement runs for 20 seconds. Each uses its own layout, rather than cropping the landscape file. Original illustrative UK business photography accompanies actual captures from the shared page renderer. The businesses and stock are fictional.

The current six beats: local business → service detail/time picker → four looks on the same business → vehicle catalogue → branded sharing card → Taplo/action. Prices, content and interfaces come from the current Station Road and Brookfield scenarios. This film does not demonstrate message delivery or payment processing.

## Edit and render

`node scripts/marketing/build-film.mjs` regenerates all four HTML projects from the authored composition source. Run from the repository root. Assets are local, including pinned GSAP 3.14.2 and licensed fonts, so rendering needs no live CDN requests. Font licences are in assets/fonts. GSAP's licence notice is retained in the vendor file; see https://gsap.com/standard-license/.

Install FFmpeg and FFprobe locally. HyperFrames uses PATH or HYPERFRAMES_FFMPEG_PATH / HYPERFRAMES_FFPROBE_PATH. HYPERFRAMES_BROWSER_PATH can select an installed Chromium. No paid or hosted rendering service is required.

```sh
npx hyperframes@0.8.186 check marketing/film
npx hyperframes@0.8.186 check marketing/film/formats/portrait
npx hyperframes@0.8.186 check marketing/film/formats/square
npx hyperframes@0.8.186 check marketing/film/formats/feed
node scripts/marketing/render-film.mjs
node scripts/marketing/finalize-film.mjs
```

The current delivery uses the local full-canvas renderer above. The local HyperFrames export wrapper left an 88px blank strip even though the source and its checks looked correct. The fallback uses Playwright to seek the same GSAP timeline frame by frame and captures the entire authored canvas. Set CHROME_PATH or HYPERFRAMES_BROWSER_PATH to the installed browser. It uses the same local assets, timing and FFmpeg delivery settings. HyperFrames remains available for editing, checks and previews. Finalization decodes settled frames and checks the bottom edge in every scene/ratio, so a clipped export cannot pass silently.

Finalization probes every file for dimensions/duration and absence of audio, creates the posters and three short feature cuts, and records SHA-256 hashes for the delivered files and HTML source in public/marketing/film/manifest.json. Short clips are isolated 3-second feature beats, not complete customer tutorials.

Refresh UI captures using scripts/marketing/capture-states.mjs and scripts/marketing/look-thumbs.mjs before copying them into assets and regenerating formats. Refresh the full example captures when the renderer or example changes. The capture tool exits unsuccessfully if any requested capture fails. Review settled frames and transitions in all four ratios before delivering; passing checks does not replace visual judgement.

Official workflow reference: https://github.com/heygen-com/hyperframes/blob/main/docs/guides/rendering.mdx . The pinned CLI's --help is authoritative for supported flags.

## Feed advertisement

The feed source is authored in scripts/marketing/build-feed-film.mjs and emitted under formats/feed/. Its five four-second beats differ from the six three-second beats in the other films: business page, focused service detail, editable looks, vehicle stock and start action. The service sheet is enlarged instead of squeezing two whole phones side by side. The selected 4:5 deliverable comes from the project brief; do not describe it as a verified universal platform recommendation. Meta’s current feed guide required login when checked on 24 October, so placement eligibility must be checked in the actual ad account before publishing.

To render just this file after authoring changes: `node scripts/marketing/render-film.mjs taplo-feed`. The renderer accepts the exact names in film-formats.mjs and rejects unknown names; leaving names out renders all formats. Run finalize-film.mjs afterwards to validate dimensions, duration, silent audio policy, every decoded frame and full-canvas scene coverage, regenerate posters and update hashes.

The attention principle is to state the practical value early and limit competing information. NN/G’s [page dwell-time research summary](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) describes variable visitor behaviour and the importance of a clear early value proposition. This older web-page study does not establish a universal attention span or prove four-second ad scene timing. Timing here is a creative decision for legibility; conversion/retention would require a real campaign measurement.
