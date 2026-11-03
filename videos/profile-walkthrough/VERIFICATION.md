# Profile walkthrough verification

Original illustrative interface, not live product footage. Explicit user-triggered playback only.

- Rendered with HyperFrames 0.8.223, screenshot capture/software GPU.
- H.264 yuv420p, 720 × 900, 30fps, exactly 9.000 seconds, no audio.
- Export size: 272,932 bytes.
- Check passed: runtime/layout/motion/contrast/craft all have zero errors and zero warnings. 25 contrast checks passed; motion assertions swept 181 timeline samples.
- Three non-blocking lint warnings recommend sub-compositions for caption groups. They remain recorded rather than marked resolved.
- Actual exported MP4 frames at 1.6, 4.6 and 7.6 seconds were decoded and individually inspected. Readable captions, complete identity/rows, no clipped actions.
- MP4, JPEG poster and WebVTT descriptions are under public/guides.

Usage remains unknown/no subscription login; local render needs no account or paid provider. Workflow refresh failed because its GitHub manifest was unreachable; exact bundled contracts were read directly. The earlier booking project established that background Studio preview fails in this environment; it was not retried. Local check/snapshot/render succeeded.

The source retains the local Geist font (included licence) and GSAP vendored by HyperFrames with its original header. Runtime artifacts, duplicate renders, logs and proof frames are ignored by this project's .gitignore.
