# Complete setup and booking walkthroughs

Two real interaction recordings now accompany the five-step still guide on /how-it-works. The viewer chooses Make a page or Book a haircut and presses Play. No video request happens before that action. Choosing another walkthrough stops and removes the previous video. Native controls support pause, seeking and fullscreen. A keyboard-operable written transcript carries the same instructions. No audio or automatic page playback.

The setup recording (25.92 seconds) starts from the Station Road design, enters a new fictional business name and phone, checks its starting look, adds a £22/30-minute haircut, reviews the draft and opens the editor/customer preview. A source-state assertion verifies the new owner's own service record. This recording caught and fixed the sample share-button label leaking into a new owner's page. New starts now use Share this page; public fictional examples keep their own wording. No existing owner button is rewritten.

The booking recording (29.08 seconds) follows a Haircut service detail through provider, time, customer details, review and confirmed browser-only outcome. The recorder asserts the actual stored booking rather than stopping at a simulated success title. This example is an instant-booking business; request businesses continue to finish pending.

## Reproduce

Run a compiled Taplo frontend locally. Set BASE_URL, CHROME_PATH, HYPERFRAMES_FFMPEG_PATH and HYPERFRAMES_FFPROBE_PATH to your local server/browser/FFmpeg/FFprobe. Run node scripts/marketing/record-walkthroughs.mjs, optionally selecting setup or booking. The same script is included alongside the delivered videos; it belongs in the repository's scripts/marketing directory when used. It uses existing Playwright and sharp dependencies. No accounts, model calls, payment service or remote recording tool.

Fresh browser contexts isolate each journey. A caption bar outside the real product iframe explains each actual interaction; no product fields or overlays are mocked. Recorded at native 390×964 (390×844 product viewport plus 120px caption bar), delivered at 780×1928/25fps with H.264, 8-bit 4:2:0 and fast-start metadata. The twofold resize improves delivery consistency, not captured detail. Initial loading is trimmed using measured recording offsets. First encoded frames were visually inspected.

MP4 dimensions, codec, duration, no-audio stream and full-frame decode are verified during generation. manifest.json includes exact durations, chapters, source routes, byte counts, SHA-256 and asserted outcomes. Browser checks cover lazy loading, transcript keyboard behaviour, responsive overflow, switching away from playback and full native playback through both complete recordings. Final build/browser release results are in VALIDATION.md.

## Remaining scope

These complete setup/booking recordings are distinct from the existing short advertisements. Design-editing and stock-enquiry walkthroughs remain open, along with the wider engine/widget/journey matrix. Backend integration is a later project. The broader rebuild remains active.
