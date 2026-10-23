# Design control matrix

Every design control the owner editor exposes is operated through the real editor by `tests/e2e/controls.spec.ts`. For each one the test asserts that it **changes what the page renders** (read from the preview iframe: a CSS token, a data attribute the stylesheet keys off, or a computed style), that **undo** restores the previous value, that **redo** re-applies it, and that it **survives a reload** of the editor (draft persistence).

Result of the last run against the dev server: **39 of 39 pass** (Chromium).

| Control | Where | Operation | Rendered effect read by the test |
|---|---|---|---|
| `look` | Design | radio "Look", "colour" | cv "--tp-background" |
| `palette` | Design › Colour | radio "Palette", "sand-amber" | cv "--tp-background" |
| `colour-page` | Design › Colour | hex "Page", "#102030" | cv "--tp-background" |
| `colour-text` | Design › Colour | hex "Text", "#fafafa" | cv "--tp-foreground" |
| `colour-secondary` | Design › Colour | hex "Secondary text", "#c0c4cc" | cv "--tp-muted" |
| `colour-accent` | Design › Colour | hex "Accent", "#0057ff" | cv "--tp-accent" |
| `colour-on-accent` | Design › Colour | hex "Text on accent", "#000000" | cv "--tp-accent-foreground" |
| `colour-cards` | Design › Colour | hex "Cards", "#202530" | cv "--tp-surface" |
| `colour-borders` | Design › Colour | hex "Borders", "#445566" | cv "--tp-border" |
| `type-pair` | Design › Type | radio "Font pair", "warm" | cv "--tp-font-heading" |
| `type-size` | Design › Type | radio "Text size", "lg" | cv "--tp-scale" |
| `type-case` | Design › Type | radio "Heading case", "upper" | cv "--tp-heading-case" |
| `type-weight` | Design › Type | radio "Heading weight", "regular" | cv "--tp-heading-weight" |
| `type-align` | Design › Type | radio "Text alignment", "center" | cv "--tp-text-align" |
| `wallpaper-gradient` | Design › Wallpaper | radio "Wallpaper", "gradient" | at "data-bg" |
| `wallpaper-shader` | Design › Wallpaper | radio "Wallpaper", "aurora" | at "data-bg" |
| `wallpaper-drift` | Design › Wallpaper | toggle "Slowly drifting colours" | at "data-motion" |
| `wallpaper-angle` | Design › Wallpaper | slider "Angle", 90 | css ".tp-bg-gradient", "background-image" |
| `pattern` | Design › Wallpaper | radio "Pattern", "dots" | at "data-decoration" |
| `header-layout` | Header | radio "Header arrangement", "poster" | at "data-header" |
| `header-shape` | Header | radio "Logo shape", "circle" | sub ".tp-avatar", "data-shape" |
| `header-size` | Header | radio "Logo size", "lg" | sub ".tp-avatar", "data-size" |
| `header-align` | Header | radio "Header alignment", "center" | sub ".tp-header", "data-align" |
| `header-actions` | Header | radio "Contact actions", "icons" | count ".tp-header .tp-actions-primary, .tp-header .tp-quick" |
| `header-location` | Header | toggle "Show location under the name" | count ".tp-meta svg" |
| `header-fade` | Header | radio "Photo fade", "strong" | cv "--tp-fade" |
| `button-style` | Design › Buttons | radio "Button style", "outline" | at "data-btn-fill" |
| `button-shape` | Design › Buttons | radio "Button shape", "square" | cv "--tp-btn-radius" |
| `button-shadow` | Design › Buttons | radio "Button shadow", "hard" | cv "--tp-btn-shadow" |
| `button-icons` | Design › Buttons | toggle "Icons on buttons" | at "data-btn-icons" |
| `card-surface` | Design › Cards | radio "Card surface", "glass" | at "data-card-surface" |
| `card-corners` | Design › Cards | radio "Corners", "none" | cv "--tp-card-radius" |
| `card-border` | Design › Cards | radio "Border", "thick" | cv "--tp-card-border-w" |
| `card-shadow` | Design › Cards | radio "Card shadow", "hard" | cv "--tp-card-shadow" |
| `card-padding` | Design › Cards | radio "Spacing inside", "roomy" | cv "--tp-card-pad" |
| `layout-width` | Design › Layout and motion | radio "Content width", "wide" | cv "--tp-width" |
| `layout-desktop` | Design › Layout and motion | radio "On a computer", "split" | at "data-desktop" |
| `layout-spacing` | Design › Layout and motion | radio "Spacing", "compact" | cv "--tp-gap" |
| `layout-motion` | Design › Layout and motion | radio "Motion", "lively" | at "data-motion-level" |

## Findings and decisions

- Design values live in one appearance model (look + overrides). Controls write overrides; `resolveStyle` turns them into `--tp-*` tokens and `data-*` attributes; the renderer and stylesheet read only those. There is no control that writes a field the resolver ignores.
- Choosing a look replaces earlier overrides and says so in a toast, so a look change never silently loses edits; undo restores them.
- Rarely useful colour roles (secondary text, text on accent, borders) sit under **More colours** rather than in the main list.
- Saved drafts written before the header arrangement and photo-fade options existed load unchanged: the missing fields resolve to the defaults (`side` layout, `medium` fade). Legacy `minimal` header layouts still render.
- Test-only corrections made while building the matrix (not product bugs): radios are driven through their label, undo/redo is checked before reload because a reload starts a fresh history, and thick card borders are 2.5px by design.
- Wallpaper angle, drifting colours and photo fade are conditional on the wallpaper/arrangement they apply to; their tests select that first.
