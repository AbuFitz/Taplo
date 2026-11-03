# Customer-facing wording convention

See AGENTS.md and CLAUDE.md. Production product copy describes agreed scope; engineering capability flags and action results remain independent.

## Presentation setting

`NEXT_PUBLIC_TAPLO_PREVIEW_NOTICES=1` enables the central sandbox information badge and optional marketing integration-state explanations. Omit it for the finished-product presentation. This build-time public setting never enables capabilities, delivery, charging, authentication or publication. Meaningful example labels and real action errors remain visible regardless of the setting.

## Engineering status retained from the audit

This task changes copy and presentation, not backend implementation. The demo store persists browser-local data; onboarding account adapters can return not-configured. Capability flags still disable payments and messaging. Demo publication is a local document version, not a public deployment. Booking state can be stored locally without customer notification; notification failure remains explicit in action results. The payment widget cannot complete checkout. Enquiry persistence does not imply email delivery. Report submission uses NEXT_PUBLIC_REPORT_ENDPOINT; without it, copy/download remain available without a submitted-state claim. Analytics must remain empty without a data source. Public sharing and QR codes still require a real public destination for customers. Domain verification, Google review imports and billing require their actual integrations.

No legal terms were invented or replaced: incomplete legal documents remain a launch-readiness blocker. No unbuilt stock feeds or finance checks are newly advertised. No prices, plan decisions or guarantees were introduced.

## Audit areas

Marketing product stories and pricing notes; onboarding and account errors; dashboard settings, analytics and booking empty states; editor notifications and settings; booking/enquiry forms and owner actions; payment and share overlays; support-report fallback; first-use journeys. No standalone outgoing email templates were found under src.

Previous development briefs that request repeated browser/provider disclaimers are superseded by the wording convention in AGENTS.md. Their integration-status facts remain engineering documentation.
