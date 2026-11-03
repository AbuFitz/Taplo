# Editor engine decision: no Puck spike

**Decision.** The editor stays on Taplo's own renderer, content list and four-tab panel. No Puck (or other page-builder) spike was run.

**Why a spike was not needed.** The brief allowed an isolated Puck spike only if the current architecture blocked a required behaviour. It did not:

| Required behaviour | How it is met today |
| --- | --- |
| One renderer for editor, preview, public page and share output | `PageRenderer` + `buildPageViewModel`, rendered in an iframe in the editor |
| Select a thing in the preview and edit it | `EditBridge` posts selections; `Selection` kinds `content`, `page`, `header`, `details`, `settings`, `widget` |
| Reorder without dragging | Move up / move down buttons and an Organise mode, besides pointer drag |
| Mobile editing | Four-tab bottom sheets with the preview above (`MobileEditor`) |
| Draft compatibility and undo | One draft document, history stack, reload restores the draft |
| Entitlements and plan limits | Enforced in the same view-model the renderer reads |

A general page builder would add a second document model and a second renderer to keep in step with the first, and would still need the same widget schemas, entitlements and booking logic. The risk is larger than any behaviour it would unlock.

**What would change this.** A required behaviour that the iframe-plus-selection model cannot deliver (for example free-form 2D layout, which Taplo's product deliberately does not offer). If that happens, the spike would live on its own branch behind a route that is not linked, with its own draft format and an adapter to and from Taplo's document, and would not touch the production editor.
