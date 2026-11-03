# Reliable actions and an evolving platform

Status: engineering design requirements, not a claim of implementation.

Every consequential command checks permission, tenant, current version, validation and idempotency where retries are possible. Use transactional writes or a documented compensation strategy for related changes. Maintain reconciliation jobs for payments/reservations and observable failure queues for notifications or other external work.

A webhook is untrusted until authenticated according to the provider. Deduplicate events, tolerate delayed/out-of-order delivery and record processing outcomes. Retry bounded transient failures; surface persistent failures to an owner. Do not hide faults behind an endlessly spinning status.

Model evolution is expected. Version contracts, migrate data with explicit validation, backfill carefully and retain transaction snapshots. Use staged rollout, rollback strategy and recoverable deployment practices. A design preference is not sufficient reason to destructively replace historic commitments.

Define measurable service objectives for key journeys: availability, successful command latency, payment reconciliation delay and notification timeliness. Choose targets after architecture/cost analysis; do not invent marketing uptime promises. Backups need tested restoration, not just a scheduled export.

Acceptance: retries after timeout create one order/booking. An unavailable messaging provider does not lose the transaction. A migration can be tested against realistic mixed business data and reconciled by record counts and financial totals. A rollback does not corrupt records created under the newer version. Support can see whether an issue is isolated or part of a service incident without needing database-admin access.
