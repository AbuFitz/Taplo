# Booking walkthrough

Rendered locally with HyperFrames 0.8.223. The exported file is `public/guides/booking-walkthrough.mp4`; poster and WebVTT description are beside it. The film is an original interface illustration, not a recording of the live application. It is silent and should play only after a visitor chooses Play.

## Verified output

- H.264, yuv420p, 720 × 900, 30 fps.
- Exactly 9.000 seconds; 483,468 bytes; no audio stream.
- Decoded MP4 frames at 1.6, 4.6 and 7.6 seconds were inspected individually. They show the service, selected slot and pending request respectively, with readable captions and no clipping.
- `hyperframes check --at 1.6,4.6,7.6 --json`: passed. Runtime/layout/motion/contrast/craft had zero errors. All 42 contrast checks passed. Motion assertions swept 181 timeline samples. Craft/type-floor warning was fixed by increasing secondary text to at least 19 px.
- Six remaining non-blocking lint warnings: three about repeated `fromTo` baselines and three recommending sub-compositions for nested caption elements. Proof snapshots and all seek assertions passed; these warnings were not hidden or labelled resolved.
- Render: screenshot capture, software GPU (ANGLE/SwiftShader); completed in 12.6 seconds.

## Limits

Usage reporting remains unknown (`no_subscription_login`). The workflow freshness check failed because its GitHub manifest was unreachable; exact bundled skill documents were read directly. The local render required no subscription, account or external provider.

The background Studio preview process failed with `fatal library error, lookup self`. The independent check/snapshot/render backend succeeded; no live Studio preview URL is claimed. Actual exported frames were decoded and reviewed.

## Re-render

From this directory: `npm run check`, `npm run render -- --quality looks --output renders/booking-walkthrough.mp4`.

Geist is supplied under the included font licence. GSAP is the vendored file supplied by HyperFrames 0.8.223; its original licence header is preserved. No generated imagery, photography, audio or third-party customer records are used.
