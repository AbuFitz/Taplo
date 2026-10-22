# Data model (Phase 1 implemented; later tables planned)

Implemented in `supabase/migrations/20261022000001_foundation.sql`, verified on a clean Postgres 16 in `tests/integration/foundation.test.ts`.

| Table | Notes |
|---|---|
| profiles | 1:1 with `auth.users` |
| businesses | owner, slug (unique, format-checked), industry key + owner's label, status, `published_version` (composite FK to `profile_versions`) |
| business_slugs | **PK = global uniqueness**; every slug ever used; `is_current` partial unique index; retired slugs redirect and stay owned |
| business_memberships | owner/admin/staff, active/invited |
| business_locations | modes premises/service_area/online; `unique(id, business_id)` is the target for same-tenant composite FKs from later tables |
| profile_drafts / profile_versions | draft is mutable; versions are immutable snapshots; publish is atomic and serialised per business |
| subscriptions | plan/status; **service-role writes only** |
| audit_events | written by functions only |

## Access model
- `anon`: **no table access**. Only `get_public_profile(slug)` (published snapshot, redirect, or none) and `is_reserved_slug`.
- `authenticated`: RLS-scoped reads by membership; drafts readable/writable by owner/admin only (staff cannot read drafts); no direct writes to businesses, memberships, subscriptions or audit.
- Mutations go through `SECURITY DEFINER` functions with `search_path = ''`: `create_business`, `rename_business_slug`, `publish_profile`, `unpublish_profile`, `restore_profile_version`.
- Concurrency: slug claims race on the `business_slugs` PK / `businesses.slug` unique index (12-way race tested: exactly one winner, no orphan rows). Publishes lock the business row (`FOR UPDATE`) so concurrent publishes get consecutive versions.

## Not yet implemented
assets + Storage policies, services/groups/questions, staff, availability, holds, bookings, customers, payments/refunds, entitlements cache, testimonials/review_links tables (currently inside the content JSON), case_studies/faqs tables (same), analytics, notification_outbox, domains, NFC. Content currently lives in the draft/published JSON validated by `businessContentSchema`; Phase 3 normalises services into tables.
