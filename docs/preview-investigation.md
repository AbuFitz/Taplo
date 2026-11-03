# Preview and mobile editing: investigation (before any fix)

Recorded 22 Oct 2026 against the production build, Chromium 1194 with touch emulation. Script: reproducible with `scratchpad/inv.mjs` pattern in this session (load `/dashboard`, choose the Barber sample, open `/dashboard/page`). Emulation is not a physical device; no physical iPhone/Safari has been used.

## Confirmed observations

| # | Where | Steps | Measured | Cause (verified in code) |
| --- | --- | --- | --- | --- |
| 1 | Phone 390×844, owner editor, Preview tab | Barber sample → `/dashboard/page` → Preview | Preview begins at y=374 of 844. Iframe CSS size 390×**700**, drawn at scale **0.877** → 342×614 px on screen; the page text is ~14px; only the top of the page is visible. | `PreviewFrame` draws a decorative handset bezel (9px) around a fixed 390×`height` (700) iframe, then scales the whole assembly to fit the container width. The demo banner, undo/publish row, Edit/Preview switch and Phone/Desktop switch stack above it. |
| 2 | Phone, tapping a widget in the preview | Preview → tap "Price menu" | Controls sheet opens at y=346, height 498 (59% of the screen). The page behind is not scrolled, so the tapped widget sits **under** the sheet. | The bottom `Sheet` is modal and covers the preview; nothing scrolls the selected widget into the visible region above the sheet. |
| 3 | Phone with keyboard open (simulated by resizing to 390×430) | Select widget → focus a field | Sheet top = **−68px**: the sheet title/back button is off-screen; sheet is taller (498px) than the visible viewport (430px). | The sheet height is fixed by content/`dvh`, not by the visual viewport; there is no keyboard or safe-area handling. |
| 4 | Desktop 1440×900, Desktop preview | Preview → Desktop | Iframe 1280×780 drawn at scale **0.54** → 696×424 px; effective body text **8.7px**. | `PreviewFrame` always scales a 1280px page into the column width. There is no readable-zoom or fit-to-height decision. |
| 5 | Desktop 1440, Phone preview | Preview → Phone | Iframe 390×780 at scale 1 (correct viewport), but a different presentation from the Appearance showcase (390×800, 10px bezel, different component). | `PreviewFrame` (owner) and `PhoneFrame`/`DesktopFrame` (showcase) are separate implementations. |
| 6 | Tablet 820×1180 | Open editor | Uses the phone layout (switch + sheet). The three-pane workspace needs ≥1280px. | `useWide()` breakpoint is 1280px. |

## Checked and not a problem

- **Update timing:** typing in the business-name field reaches the preview in ~130 ms; undo in ~25 ms (storage event into the same-origin frame). Reload restores the draft.
- **Responsive rules inside the frame:** the frame's own `innerWidth` is 390 (phone) or 1280 (desktop), so viewport media queries fire correctly. A narrow wrapper alone would not do this; the frame does.
- **Selection mapping:** clicks are handled inside the iframe in its own coordinates, so CSS scaling does not distort hit-testing.

## Not yet checked (listed so they are not assumed)

- Portals (booking dialog, product detail) in customer-preview mode inside the frame; edit mode makes actions inert by design.
- Font/image loading and flash of unstyled content in the frame after a reload.
- Landscape, text scaling, safe-area insets, nested scrolling inside the sheet, background scroll lock.

## Decisions these findings drive

1. One **preview controller** with three explicit modes: *edit on a phone* (frame fills the available width and height at the device's real viewport; no handset), *preview a phone from desktop* (device-sized viewport fitted by height), *desktop preview* (1280 viewport, readable zoom with a deliberate fit rule).
2. The sheet must size from the **visual viewport**, keep the selected widget visible above it, handle safe areas and the keyboard, lock background scroll and own its nested scroll.
3. Showcase and owner editor share the controller.
