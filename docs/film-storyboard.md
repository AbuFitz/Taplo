# Film storyboard: "Taplo in eighteen seconds"

Audience: a small-business owner deciding whether this is for them. Need: a page customers can use without calling. Capability → benefit → evidence → action, one per scene. Silent, 1920×1080, 30 fps. Every image is a real capture of the product (`scripts/marketing/capture-states.mjs`), none is drawn for the film. Business names are fictional. Nothing claims email, payments or public links.

| # | Time | Line on screen | What is shown | Motion | Why it is here |
| --- | --- | --- | --- | --- | --- |
| 1 | 0–3 s | **Customers see prices first.** | A real service detail: price, length, who does it. | Heading rises; the detail card follows 0.3 s later. | The concrete thing customers want, at once. |
| 2 | 3–6 s | **Then pick a time.** | The real booking journey at the time step. | Blue wipe, heading, card. | Proof that booking is a few taps. |
| 3 | 6–9 s | **Add a service and the page fills in.** | Setup, step 4: a service typed on the left, the page appearing on the right. | The setup capture rises and eases in 4% so the right-hand page is the last thing the eye lands on. | Ease of setup is the promise; this is where it is felt. |
| 4 | 9–12 s | **Start from a design. Change anything.** | The same barber in four designs. | Iris wipe; four pages rise in a stagger. | Visual choice, same content. |
| 5 | 12–15 s | **A code, a card and a link.** | The QR options panel and the share card. | Wipe, panel, card. | Sharing is how the page reaches customers. |
| 6 | 15–18 s | **One page for your business.** | Logo, one line, the action. | Fill wipe, logo, line, button. | The call to act. |

## Keyframes checked before rendering

`docs/screens/film/` holds a still from each scene at its settled frame (0.9 s into the scene for 1, 2, 4, 5 and 6; 1.4 s for 3) at full size. Checked for: heading fully inside the 80% title-safe area, no image cropped by the frame, no text under 28 px at 1080p, and nothing overlapping the wipe at the settled frame.

## Static alternative

`public/marketing/film/poster.webp` is the settled frame of scene 3. The same story is written out in HTML beside the film (`Film.tsx`), so nothing depends on watching it.
