# 4:5 feed advertisement — 24 October 2026

The missing 4:5 delivery is now a separately authored 1080×1350, 20-second, 30fps silent film. It is not a crop of the landscape or square video. Its five four-second beats show the current UK business page, a readable service-detail and booking action, two editable looks on the same business, vehicle stock and the invitation to start. Photography, names, prices and UI come from the current fictional Station Road, Parkside and Brookfield examples.

The composition uses larger supporting text and a focused service sheet rather than two miniature phone screens. Intentional reading holds preserve the offer long enough to inspect. It uses the current local fonts, original illustrative photography, real shared-renderer captures and pinned local GSAP. No Claude run, paid renderer or new generation call is needed to rebuild it.

Authoring source: `scripts/marketing/build-feed-film.mjs`, emitted to `marketing/film/formats/feed/`. `build-film.mjs` now builds all four formats. `film-formats.mjs` is the delivery registry shared by rendering and finalization. The renderer supports explicit format names, including `taplo-feed`, so one change does not require rendering every film. Finalization probes dimensions/duration, decodes every delivered frame, checks scene canvas coverage, creates posters/cuts and records source/output SHA-256 hashes. Existing 16:9, 9:16 and square deliveries remain available.

The pinned HyperFrames authoring check passes: no lint, runtime, layout or motion errors; 22/22 text contrast checks pass. Its one remaining craft warning is the deliberate lack of sound. The movie is designed to communicate silently. Native Chromium playback to the end and the existing optional homepage film control are verified in two affected browser checks. This is not a claim of platform ad approval, campaign conversion or physical-device playback testing.

The selected 4:5 format fulfils the brief. The [Meta feed guide](https://www.facebook.com/business/ads-guide/update/video/facebook-feed) required login when checked on 24 October, so a universal current placement recommendation was not established. Confirm the chosen placement in the actual ad account before publication. No advertisement has been posted or campaign spend committed.

The creative principle is early practical value and fewer competing messages. NN/G’s [page dwell-time research summary](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) describes variable behaviour and the value of a clear early proposition. This older web-page research is not evidence for a universal attention span or a four-second ad timing rule; scene timing here is an authored legibility choice.

Full owner/customer walkthrough clips and the remaining UK business examples still need completing. This advertisement is creative marketing, not a substitute for those demonstrations or for the full engine/journey audit.
