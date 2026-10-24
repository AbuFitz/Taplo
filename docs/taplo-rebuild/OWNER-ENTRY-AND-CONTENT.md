# Owner entry and content — 24 October 2026

The empty dashboard now leads with an actual visual setup entry and three current UK examples: Station Road Barbers, Parkside Valeting and Brookfield Motors. Selecting a sample loads the same content, arrangement and look as its public demonstration into an editable browser draft. Earlier sample industries remain reachable under More sample businesses. Existing drafts do not enter this flow, and the loading action rechecks for a draft before replacing anything, including when another tab has started setup.

The Add content chooser shows the owner's service names and prices, team photographs, product/vehicle pictures, gallery photographs and questions when those exist. It reuses the existing business content, never imports example records into an owner's page. Cards have stable accessible names. Vehicles now start with the actual catalogue layout, and dealer suggestions favour vehicles while every content type remains available to every industry.

Creating a first item and adding its section is one history transaction. Undo removes both; redo restores both. Removing a section continues to preserve its business records. Browser picture preparation reduces dimensions as well as JPEG quality until it meets its 380,000-character data URL budget, and throws rather than silently returning an oversized result. This is a per-picture limit, not a claim that local browser storage is unlimited.

Terracotta no longer starts with an arch avatar. Explicit saved arch choices remain compatible with the renderer and schema. Its actual rendered thumbnail was regenerated and its catalogue hash updated.

The dashboard's Upcoming bookings panel reads the same browser-backed booking state as the owner calendar. It shows confirmed and unexpired pending future appointments, excludes cancelled/declined/expired entries, links to the calendar and accurately explains that no email or SMS is sent. The previous fixed statement that online booking was a future phase has been removed.

## Verification

Production build, TypeScript, targeted ESLint and whitespace checks pass. Unit suite: 188 passed, 39 database-dependent skipped. Browser checks cover the three current UK samples at 390 and 1440 pixels, reload persistence, actual-content chooser previews and upcoming appointments; the content suite covers creation, atomic undo/redo, record preservation, mouse/keyboard/touch ordering. Existing editor, connected editing and marketing checks were also run. See outputs VALIDATION.md for final counts and scope.

No backend service, paid model generation, account connection or Claude session was invoked by this owner pass. Browser-only publishing, messages and scheduling are still demonstrations rather than a production backend.
