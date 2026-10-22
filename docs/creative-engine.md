# Taplo creative engine: decision, responsibilities and limits

Status date: 22 October 2026. Supersedes the Studio SDK direction.

## Decision

Taplo owns its page-creation system. It is a **constrained, structured page editor on the existing renderer**, not a general web builder and not a Figma clone. No editor licence, metered editor session or commercial media service is required.

### Commercial dependency report

| Item | What happened | State |
| --- | --- | --- |
| GrapesJS Studio SDK (`@grapesjs/studio-sdk`, proprietary licence, licence key, metered sessions, branding on the free tier) | Installed for a spike; probed in a throwaway `/lab/studio` route; nothing built on it. | **Removed.** Packages, `overrides`, lab route and lockfile entries reverted (`git checkout` of `package.json`/`package-lock.json`, `npm ci`). `node_modules/@grapesjs` and `node_modules/grapesjs` no longer exist. Never committed or pushed. |
| Studio SDK React Renderer (`@grapesjs/studio-sdk-plugins`) | Installed in the same spike (paid-plan plugin). | **Removed** with the above. |
| Uploadcare | Never installed. Not adopted. | n/a |
| Tiptap | Not installed. The only multi-line text field (the Text widget) is plain paragraphs, which is all a business page needs; adding a rich-text engine would add undo-ownership and sanitising problems for no requirement. Reconsider only when an owner-facing requirement for bold/links/lists appears. | not used |
| GrapesJS core, Puck, Craft.js | Not installed. Neither is needed: selection, ordering, contextual controls and history are small once the document, registry and renderer exist (they already did). | not used |

Existing hosting, storage and payment-processing costs are separate and unchanged.

### Dependencies adopted (all verified on 22 Oct 2026)

| Package | Version | Licence | Role | React 19 |
| --- | --- | --- | --- | --- |
| `react-colorful` | 5.8.1 | MIT | Colour picker (saturation/hue) inside a popover; hex text field kept beside it | peer `>=16.8` |
| `react-easy-crop` | 6.2.4 | MIT | Frame logo (square/round) and cover (wide) before use | peer `>=16.4` |
| `simple-icons` | 16.35.0 | CC0-1.0 (collection); brand rights stay with each brand | Real marks for Instagram, Facebook, TikTok, YouTube, X; only those glyphs are imported | n/a |
| `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0 | already in repo | MIT | Widget ordering (pointer, touch long-press, keyboard) | works; **one API generation only** (did not mix with `@dnd-kit/react`) |
| `lucide-react`, shadcn/Radix/Tailwind, zod | already in repo | ISC/MIT | Interface icons, controls, document validation | existing |

LinkedIn is no longer in Simple Icons, so it keeps a neutral "in" lettermark instead of an imitation.

## Tool responsibilities

- **Taplo (own code):** page document (`PageDoc`, versioned, zod-validated, migrations), widget registry (fields, defaults, layouts, appearance options, data requirements, status, renderer), style resolver (`resolveStyle`: platform defaults → page style → widget override, with contrast repair), shared renderer (`PageRenderer`), editing state (`useEditor` over the demo store: undo/redo with coalescing, autosaved draft, deliberate publish snapshot), recommendations (`recommend.ts`, pure), business records (`BusinessContent`, separate from the page).
- **dnd-kit:** sortable arrangement in the structure list. Order is document order, never CSS coordinates.
- **shadcn/Radix/Tailwind:** every control, dialog, sheet, popover, tab.
- **react-colorful:** the picker surface only; Taplo owns validation, contrast and storage.
- **react-easy-crop:** crop UI only; `cropFile` (Taplo) renders the output.
- **Simple Icons / Lucide:** brand marks / interface icons.

## Architecture of the editor

```
Structure (left)          Preview (centre)                 Inspector (right)
Page style                real PageRenderer in a            controls for the selection only:
Header                    same-origin iframe                 page · header · widget · details · settings
Widgets (dnd-kit)         /demo/preview?edit=1               widget: Content | Appearance (+ reset)
Business details          click → select (postMessage)       move · duplicate · remove
Page settings             selection outline (editor-only CSS)
```

- One editor state; selection is **not** part of the saved document.
- The preview is a real iframe, so mobile/desktop widths trigger real media queries.
- `?edit=1` mounts `EditBridge`, which makes links and buttons inert and reports clicks. The published page never mounts it and never receives its CSS selectors' effects (`[data-tp-editing]` is absent).
- Below 1280px: Edit/Preview switch; selecting anything opens the inspector as a bottom sheet.
- No mandatory theme: the doc still needs a base look (industry-suggested, never asked), which only seeds defaults. "Start from a look (optional)" sits at the bottom of Page style. The 8 looks are starting points, not a catalogue the owner must pick from.

## Known limitations (concrete)

1. **Images are small JPEG data URLs in browser storage** in demo mode. That is a demo constraint: storage is ~5 MB, and large data URLs bloat the undo history snapshot. The connected path must store originals in object storage with derivatives and keep only asset references (the `ImageRef` shape already supports this). The crop result is applied destructively here; on a connected environment, store the original and the normalised crop for re-cropping. **Not built:** server image derivatives (Sharp), resumable upload (Uppy), asset library.
2. **Undo is document-level.** Colour drags and typing coalesce by key into one entry. Inputs keep their own native undo while focused (Ctrl/Cmd+Z is ignored inside inputs by design). There is no rich-text editor, so there is no rich-text undo ownership problem to solve.
3. **Selection in the preview is pointer/touch only.** Keyboard and screen-reader users select through the structure list, which is complete (every widget, hide, drag-handle with keyboard sensor, move up/down in the inspector).
4. **Autosave is local** (localStorage). There is no server draft, so out-of-order response sequencing is untested; it must be built with the server draft endpoint.
5. **dnd-kit on iOS Safari** is not tested here (no device available). Touch activation uses a 150 ms long-press so scrolling still works; the Chromium touch emulation test passes.
6. **Published output is a client-rendered snapshot in demo mode.** The connected public route renders the same `PageRenderer` on the server.
7. **Cal.diy / booking engine:** not evaluated; the existing booking flow is reused unchanged.
8. **No named font-pairing engine, Culori ramps or Color Thief palette extraction.** Colour contrast comes from the existing contrast helper. Logo-colour suggestions are a candidate recommendation, not built.
9. Studio SDK material findings (for the record, do not reconsider without a new reason): proprietary licence; licence key required on public domains; free tier shows branding and meters sessions (undefined "session"); the React Renderer is a separate plugin under a paid tier (docs list Startup, $200/month); the editor fetches grapesjs, plugins and Monaco from jsDelivr at runtime.

## Verification

See `docs/implementation-status.md` (Verification log) for the latest counts and the screenshots in `docs/screenshots/`.
