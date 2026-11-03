# Taplo · Fresh onboarding and Studio review

3 November 2026 · Browser-assisted public-site walkthrough. Current deployment is context, not specification; every part remains changeable. No account was created, no payment made and no page published. A fictional draft named Taplo Research Example, handle tre-ex-2026, was used. No screenshots are included as deliverables.

## Observed route and limits

The browser report reached /onboarding, /dashboard and /dashboard/page. It reported the sequence: business category, name/link, optional profile assets/bio, colours, primary action, service cards, plan and draft completion. Colour controls were skipped rather than deeply inspected. The draft continued into Studio without a newly created account despite completion wording asking for account creation; therefore an actual authentication wall or vulnerability was not established.

Studio overview showed a page hub, next-step prompt, getting-started tracker, business links and another setup checklist. Page Builder exposed Content/Profile/Design/Settings tabs, Undo/Redo, Preview/Publish, device/fit controls and a reorder list. This confirms an existing editor, not an empty dashboard. Only Content received substantive inspection; the other tabs were visible, not audited.

Bookings, Reviews, Team, Products, Analytics, Settings and Help appeared as navigation links but their full functionality was not inspected. Inspiration was not reached; it must not be described as absent. Narrow-screen viewport, keyboard behaviour, pixel-level contrast, exact theme variants and all designs were not verified by this pass. This is not a finished visual/a11y/security audit.

## Findings converted into blueprint work

| Reported observation | Interpretation and uncertainty | Proposed direction |
| --- | --- | --- |
| taplo-research-example rejected as reserved | Brand-containing reserved name may be intentional, not a defect | Explain restriction; suggest valid alternatives without publishing automatically |
| Repeated slug entry showed concatenation | Could be input behaviour or automation entry technique; requires manual reproduction | Separate suggested handle from manual edit; predictable selection/replace; preserve user edits |
| Back/Skip not visible at every stage | Controls may be absent or outside the observed viewport; needs targeted check | Consistent navigation contract, labelled optional steps and safe resume |
| Service price entered during onboarding | Existing sequence only; no evidence it must remain | Follow spec 79: deliberate first-offer configuration in Studio |
| Multiple setup summaries/checklists | Possible competition for attention; usability hypothesis | One primary next task with contextual readiness and expandable checklist |
| Several blocks say not on page/finish elsewhere | Unclear distinction between draft, hidden, incomplete and published | Explicit independent states with direct Edit/Fix action; optional blocks do not look like errors |
| Completion copy asks for account, Studio opens | Copy/access transition requires investigation; not proof of exposed customer data | Explicit guest draft/account handover; define protection and draft retention |

The browser report's suggestion that no Products block exists is not established: an unconfigured Content list does not prove unavailable block types. Its statements about discoverability/privacy are hypotheses rather than observed user/security evidence. Do not turn them into confirmed defects in an implementation brief.

## Targeted next inspection

Walk Design/Profile/Settings on mobile and desktop; open add-content and all popup families; inspect Inspiration direct-to-design path; reproduce handle edits manually; keyboard/Back/Skip/refresh/long-name/no-assets tests; verify account/draft/publish semantics. Record viewport, route, initial state, action and observed outcome. These remaining inspections should deepen the blueprint without anchoring its direction to the prototype.
