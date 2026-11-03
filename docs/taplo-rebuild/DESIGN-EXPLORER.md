# Working design explorer

24 October 2026. Full frontend work remains active on the shared Claude branch.

The gallery now leads with page previews and puts filters behind an explicit control. Industry deep links still open their active filters. The detail page is about choosing a design: look name, short explanation, one start/apply action and one working preview. Phone and Desktop switch the actual renderer viewport; full-page opening stays available. Related designs have pictures. Font/density implementation labels no longer lead the customer experience.

The shared PagePreview keeps its iframe on one DOM path across fill/device/desktop changes. A booking name typed before switching sizes remains present afterward. View changes remeasure before paint, so the desktop scene uses the available width immediately. Decorative preview chrome stays off in fill mode; loading pulse honours reduced motion.

A reproduced interaction failure: the embedded frame was614px high but started396px down an844px parent viewport. The booking action was inside the iframe but below the visible parent screen; scrolling inside its sheet could not reveal it. Overlay now posts a type-only same-origin open event. The shared preview accepts it only from its own iframe and scrolls the whole preview into view. Both phone and desktop customer paths now reach the details form without forced clicks. No business data is sent in that event.

BookingFlow leaves its body mounted for Radix's closing presence transition, preventing a blank sheet body during exit. The overlay still unmounts it when closed. Existing details, pending/confirmed outcomes and browser-only persistence stay unchanged.

Verification: production build/typecheck and targeted lint pass. Full unit run177passed/39database-dependent skipped. The affected browser run (booking, editor, marketing, connected editing, new explorer and automated accessibility) passed64checks. After the final synchronous-size refinement, all5new explorer/accessibility checks passed again. Axe covers the gallery and two UK detail pages at390and1440px: no serious/critical findings in its enabled WCAG2.1/best-practice rules, not a full accessibility certification. Actual phone/desktop screenshots were inspected; a premature close-animation capture was replaced with settled captures.

Three existing editor checks needed proper browser synchronization: wait for the iframe's actual new theme colour/order, and open the collapsed Logo and cover section before testing upload feedback. They retain the same substantive assertions and now pass. A social-selection visibility guard also passes at both widths; the earlier suspected drift was not reproduced in this exact edit sequence, so no speculative EditBridge change was shipped.

Prepared three coherent original illustrative forecourt images for the next Brookfield Motors example (grey hatchback, red SUV, white compact). Provenance is in public/taplo-demo/assets.json. They are not yet runtime-bound and do not prove real stock, trim, condition or availability. Remaining UK examples, responsive stock presentation, the rest of marketing/setup/engine contracts and films remain open.
