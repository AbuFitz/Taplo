# Taplo project instructions

Read and follow `AGENTS.md` before making changes. Its customer-facing wording convention applies to all Claude work as well as Codex work.

## Taplo customer-facing wording (project convention)

Taplo is intentionally frontend-first. Write customer-facing copy as the finished product should read in production, throughout marketing, onboarding, Studio, forms, booking/payment flows, empty states, notifications and email templates. Use direct wording for agreed scope, such as “Accept bookings”, “Send reminders”, “Manage customer enquiries” and “Take deposits”.

Do not add development-status copy (“planned”, “intended capability”, “once the backend is connected”, “stored in this browser”, “nothing is sent or charged”, provider requirements or implementation explanations). Keep unfinished integrations, backend requirements and engineering limitations in internal development documentation. Include them when reporting engineering progress or launch readiness, not repeatedly when reviewing design or describing offerings.

Necessary preview-only notices must use the central `NEXT_PUBLIC_TAPLO_PREVIEW_NOTICES=1` presentation setting. This setting must never change capability checks, integrations or transaction behaviour. Preserve meaningful example-content labels, required customer information and accurate transaction states: do not claim delivery, payment, publication or account creation succeeded without the corresponding result. Production copy does not establish implementation, expand scope, authorise guarantees or decide pricing.

User follow-ups are additive unless explicitly replacing or cancelling a requirement. Track all active requirements and report any incomplete work clearly.
