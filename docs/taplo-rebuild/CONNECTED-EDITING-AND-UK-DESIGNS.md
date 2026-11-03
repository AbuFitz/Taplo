# Connected editing and UK designs — implementation record

24 October 2026. Full frontend work remains active on `claude/modest-cerf-4tont1`.

## Delivered in this pass

- Commit `13b529f`, pushed to the shared branch: header and section layout tiles render the owner’s actual draft through the same page renderer; decorative frames cannot take focus. Inline social profile editing includes validation, add/remove, Undo and live preview updates. Booking inspection links directly to hours and rules.
- Fixed direct-service booking to offer eligible people first; solo Back returns to services. Vehicle/product enquiries preserve item ID, kind and subject into local storage and the owner enquiry list. Local confirmation copy states the actual demo result.
- New High Street and Workbay starting looks use normal theme contracts. Two authored UK examples, Station Road Barbers and Parkside Valeting, combine prepared content with actual PageDocs and isolated browser scheduling. Haircuts confirm; valet appointments remain requests. No contact handles, testimonials or credentials were invented for these examples.
- Gallery now starts with phone previews. Both new pages have real phone and desktop captures. Every look thumbnail now shows the same Station Road content. The homepage has a new business/actual-page composition and visual thumbnail chooser; the original illustrative barber photograph is served through Next Image optimization.
- Empty team portraits use initials instead of silhouettes. Existing saved themes, documents, legacy routes and business records are retained.

## Evidence and limits

Production build and typecheck pass. Latest full unit run: 177 passed, 39 database-dependent skipped. Connected editing/widgets: 23 browser tests passed. Marketing routes: 34 passed. Four new UK example checks pass, including full stored confirmation/request journeys and phone/desktop image loading. The targeted repeat (new UK examples plus connected editing) passed all 10. The final affected marketing/widgets/UK browser run passed all 55. No full browser suite or physical-phone/WebKit claim is made.

QR export investigation: whole share artwork decodes at native resolution and 512px with jsQR; jsQR misses an intermediate 700px resample. Apple Vision independently decoded both the original and that 700px image to the exact local demo destination. The test now checks native plus canonical camera size and retains its exported artwork artifact. No QR renderer change was justified by this decoder-specific failure.

Visual review caught an oversized headline and a photograph hidden by its page overlay; both were corrected before final screenshots. Local screenshots are in the handoff review folder. A resize-only screenshot duplicated sticky navigation; use a fresh phone page for the final proof rather than presenting that artifact as the product.

## Still open

The full overhaul is NOT complete. Other examples still need their new UK content, purposeful layouts and coherent media. The whole homepage beyond its opening/chooser, feature pages, navigation/footer, setup, remaining editor/widget contracts and films/ad formats need further authored work. Resolve the selected-section preview staying in view after content updates, inspect effective contrast across image/gradient/shader extremes, and run the acceptance matrix. Backend remains a later project.
