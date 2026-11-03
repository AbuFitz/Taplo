# Proposed engineering artifacts

Edition 1.0. These are reviewable core contracts, not deployed APIs or a complete physical schema.

- record-schemas.json: typed records, required fields, enums; use spec 63 for relational/transaction invariants.
- command-inputs.json: exact initial command field schemas. Header idempotency/version and server authority remain mandatory.
- command-contracts.json: routes, permission intent, response/error protocol and guarded transaction boundary.
- state-machines.json: proposed guarded lifecycle graphs; provider attempts and compensation remain explicit.
- permissions.json: coarse legacy conceptual groups plus granular action/scope templates in spec 72; the latter govern the proposed detailed design.
- commercial-model.json: formulas and illustrative cost inputs only; unknown supplier costs are null, not approved prices.

Implementations must add referenced contact/address/asset/offer-configuration and other specialist definitions before enabling those capabilities. Runtime checks enforce tenant/relationship ownership, value/time/capacity/financial invariants, expiry and version. Passing JSON shape validation does not establish these behaviours. Provider API/version/account compatibility, professional policy review, migration and device/user evidence remain separate.

PolicyVersion, PolicyAcceptance, ConsentEvidence, TeamInvitation and BusinessSubscription are included. SaaS billing is separate from merchant-customer memberships.


## Existing website and import continuation · 3 November 2026

StartImport and ApplyImportDraft create/review draft changes only. Google source policy is checked independently of a user confirmation. ImportJob/ImportCandidate preserve source restrictions and cannot silently publish or enable transactions.

## Blueprint handoff manifest · 1.4

blueprint-handoff.json is a proposed process manifest for agent task preparation and safe Console documentation use. It is not a JSON Schema, executable engine, complete dependency graph or runtime authorisation source. Its explicit gaps must be closed before treating proposed guidance/payment extensions as exact API contracts. New specifications retain their evidence labels.

## Category/team presets · 1.8

category-team-presets.json maps five categories to existing scope_templates and named specialist obligations. It is not a JSON Schema/runtime ACL or complete action/field contract. Validate base_template references and bind the remaining field masks/actions before implementation. Included member pricing never relaxes authority/privacy checks.

## Proposed packages · 1.9

proposed-packages.json is a modelling/UX allocation record, not active billing rules or a JSON Schema. Prices include the proposed headline tax policy; actual supply/tax treatment must be resolved. Null count allowances mean no routine count cap proposed, not unlimited infrastructure. Group/compound commitment metering and extras still need exact contracts. No trial or plan is sold by this file.

## Economics calculator · 2.1

Edit economics-assumptions.json and run python3 contracts/calculate-economics.py from any directory. It resolves files relative to its own path and regenerates economics-results.json plus ECONOMICS-RESULTS.md. No external packages/network required. It models approximate cash/unit contribution under explicit tax/FX/usage assumptions, not audited accounts or future demand. Proposed top-ups are service units, not a financial wallet implementation.

## Current package defaults · 2.2

PRICING-DECISION is canonical. calculate-package-bills.py generates initial cash purchase fixtures using the two SMS pack sizes; it is not a billing engine or a monthly spend guarantee. calculate-economics.py now selects balanced/no included SMS, with previous bundle alternatives retained. Runtime entitlements/credit permissions still require exact supported contracts.

## Growth and trust construction · 2.4

growth-trust-records.json contains seven typed proposed record extensions plus ID/time definitions. growth-trust-permissions.json defines fifteen granular actions/guards and role boundaries. growth-trust-scenarios.json contains fourteen specified connected expectations, not passed runtime tests. Existing ConsentEvidence/Notification/etc definitions must be deliberately reconciled/migrated; the new file does not silently change deployed authority or complete every HTTP command. legal-publication-register.json lists draft documents and actual unresolved placeholders, not fictitious legal approval.

validate-growth-trust-shapes.py checks selected valid/rejected record shapes, including legal publication, sender scope, consent withdrawal and review verification evidence. Passing it proves those schema examples only; it does not prove live authorisation, moderation quality, safety compliance or legal suitability.

## Database and communications construction · 2.5

calculate-database-options.py reproduces assumed cost scenarios and DATABASE-CHOICE-AND-COSTS. communication-template-catalogue.json records 18 proposed template responsibilities, protected facts, edit regions and readiness guards. compliance-controls.json records 28 workstreams without fabricated approval/implementation evidence. These are blueprint inputs, not runtime authority, provider configuration or compliance certification.

## Access, rewards and release decisions · 2.6

access-and-delivery-decisions.json and reward-preset-decisions.json are proposed decision inputs, not executable auth/reward policy. access-wallet-release-scenarios.json specifies 13 important connected cases without claiming actual runtime evidence. calculate-launch-budget.py reproduces initial cash/reserve/runway scenarios; it does not price the full build or prove profit. Exact auth/provider/pass/redemption/widget schemas/commands/migrations and live evidence remain required.

Edition 2.7: package-feature-map.json maps all current display rows, not backend grants. native-device-test-cases.json contains 22 blocked real-device expectations, not test results. blueprint-review-inventory.json records document inventory/hash/link-check evidence only. The regenerated launch budget includes an explicit media reserve; do not add it twice to provider/model cost pools.

Edition 2.8: availability-v2.schema.json, working-hours-commands-v2.json and fixtures/validator define a proposed simple working-hours input/impact/apply boundary. jsonschema is a selected dev dependency for local validation, not vendored. Actual ACL/transaction/migration proof remains. visual-screen-closure-register.json is 67 specified screen families, not finished screens. Map/fee calculator returns original assumptions, not invoices/profit or activated commission.
