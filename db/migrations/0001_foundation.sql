-- Additive 3.0 foundation. Does not change or delete the legacy public/Supabase schema.
BEGIN;
DO $$ BEGIN IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='taplo_app') THEN CREATE ROLE taplo_app NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF; END $$;
CREATE SCHEMA IF NOT EXISTS taplo;
CREATE TABLE taplo.schema_migration (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE taplo."user" (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1 CHECK(version>=1), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 display_name text NOT NULL, verified_contact_refs jsonb NOT NULL DEFAULT '[]', status text NOT NULL CHECK(status IN ('active','suspended','deletion_pending','deleted'))
);
CREATE TABLE taplo.auth_identity (provider text NOT NULL, subject text NOT NULL, user_id text NOT NULL REFERENCES taplo."user"(id), PRIMARY KEY(provider,subject));
CREATE TABLE taplo.business (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1 CHECK(version>=1), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 display_name text NOT NULL CHECK(length(display_name) BETWEEN 1 AND 160), legal_name text, handle text NOT NULL UNIQUE CHECK(handle ~ '^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$'),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','paused','closing','closed')), capabilities jsonb NOT NULL DEFAULT '[]', timezone text NOT NULL DEFAULT 'Europe/London', published_page_version bigint
);
CREATE TABLE taplo.membership (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1 CHECK(version>=1), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 business_id text NOT NULL REFERENCES taplo.business(id), user_id text NOT NULL REFERENCES taplo."user"(id), role text NOT NULL CHECK(role IN ('owner','manager','scheduler','practitioner','fulfilment','finance','support')),
 status text NOT NULL CHECK(status IN ('invited','active','revoked')), location_ids jsonb NOT NULL DEFAULT '[]', resource_ids jsonb NOT NULL DEFAULT '[]', grant_ids jsonb NOT NULL DEFAULT '[]', UNIQUE(business_id,user_id), UNIQUE(business_id,id)
);
CREATE TABLE taplo.onboarding_draft (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1 CHECK(version>=1), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 session_hash text NOT NULL, display_name text NOT NULL CHECK(length(display_name) BETWEEN 1 AND 200), category_query text NOT NULL DEFAULT '' CHECK(length(category_query)<=160),
 capabilities jsonb NOT NULL DEFAULT '[]', look_id text NOT NULL DEFAULT 'standard', introduction text NOT NULL DEFAULT '' CHECK(length(introduction)<=500), expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days', claimed_by text REFERENCES taplo."user"(id)
);
CREATE INDEX onboarding_draft_session ON taplo.onboarding_draft(session_hash,expires_at);
CREATE TABLE taplo.command_receipt (
 scope text PRIMARY KEY, business_id text REFERENCES taplo.business(id), actor_id text NOT NULL, command text NOT NULL, key text NOT NULL, payload_hash text NOT NULL,
 response jsonb NOT NULL, request_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '90 days'
);
CREATE TABLE taplo.audit_event (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), business_id text REFERENCES taplo.business(id),
 actor_id text NOT NULL, action text NOT NULL, target_id text NOT NULL, reason text NOT NULL DEFAULT 'owner_action', request_id text NOT NULL, changed_field_names jsonb NOT NULL
);
CREATE TABLE taplo.event_outbox (
 id text PRIMARY KEY, business_id text REFERENCES taplo.business(id), actor_id text NOT NULL, event_type text NOT NULL, subject_id text NOT NULL, source_version bigint NOT NULL,
 payload jsonb NOT NULL, status text NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','running','uncertain','succeeded','failed')), attempt_count integer NOT NULL DEFAULT 0,
 next_retry_at timestamptz NOT NULL DEFAULT now(), lease_until timestamptz, lease_token text, created_at timestamptz NOT NULL DEFAULT now(), last_error_code text, UNIQUE(event_type,subject_id,source_version)
);
CREATE INDEX outbox_pending ON taplo.event_outbox(next_retry_at) WHERE status='queued';
CREATE TABLE taplo.provider_operation (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), business_id text NOT NULL REFERENCES taplo.business(id),
 actor_id text NOT NULL, provider text NOT NULL, operation_kind text NOT NULL, subject_id text NOT NULL,
 status text NOT NULL CHECK(status IN ('queued','running','uncertain','succeeded','failed')), attempt_count integer NOT NULL DEFAULT 0 CHECK(attempt_count>=0),
 idempotency_ref text NOT NULL, next_retry_at timestamptz, provider_ref text, last_error_code text, UNIQUE(business_id,idempotency_ref)
);
CREATE TABLE taplo.rate_window (scope text NOT NULL,window_start timestamptz NOT NULL,count integer NOT NULL, PRIMARY KEY(scope,window_start));
-- Context is bound by authenticated server code on a transaction-local connection. No direct browser database grants.
ALTER TABLE taplo."user" ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo."user" FORCE ROW LEVEL SECURITY;
CREATE POLICY own_user ON taplo."user" USING(id=current_setting('app.actor_id',true));
ALTER TABLE taplo.business ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.business FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant ON taplo.business USING(id=current_setting('app.business_id',true));
ALTER TABLE taplo.membership ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.membership FORCE ROW LEVEL SECURITY;
CREATE POLICY own_membership ON taplo.membership USING(business_id=current_setting('app.business_id',true) AND user_id=current_setting('app.actor_id',true));
ALTER TABLE taplo.onboarding_draft ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.onboarding_draft FORCE ROW LEVEL SECURITY;
CREATE POLICY draft_credential ON taplo.onboarding_draft USING(session_hash=current_setting('app.draft_hash',true) AND expires_at>now() AND claimed_by IS NULL) WITH CHECK(session_hash=current_setting('app.draft_hash',true) AND expires_at>now() AND claimed_by IS NULL);
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['command_receipt','audit_event','event_outbox'] LOOP
 EXECUTE format('ALTER TABLE taplo.%I ENABLE ROW LEVEL SECURITY',t); EXECUTE format('ALTER TABLE taplo.%I FORCE ROW LEVEL SECURITY',t);
 EXECUTE format('CREATE POLICY actor_tenant ON taplo.%I USING(actor_id=current_setting(''app.actor_id'',true) AND coalesce(business_id,'''')=current_setting(''app.business_id'',true))',t);
END LOOP; END $$;
ALTER TABLE taplo.provider_operation ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.provider_operation FORCE ROW LEVEL SECURITY;
CREATE POLICY operation_scope ON taplo.provider_operation USING(business_id=current_setting('app.business_id',true) AND (actor_id=current_setting('app.actor_id',true) OR EXISTS(SELECT 1 FROM taplo.membership m WHERE m.business_id=provider_operation.business_id AND m.user_id=current_setting('app.actor_id',true) AND m.role='owner' AND m.status='active')));
ALTER TABLE taplo.rate_window ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.rate_window FORCE ROW LEVEL SECURITY;
CREATE POLICY own_rate ON taplo.rate_window USING(scope=current_setting('app.actor_id',true));
GRANT USAGE ON SCHEMA taplo TO taplo_app;
GRANT SELECT ON taplo."user",taplo.business,taplo.membership,taplo.provider_operation TO taplo_app;
GRANT SELECT,INSERT,UPDATE ON taplo.onboarding_draft,taplo.rate_window TO taplo_app;
GRANT SELECT,INSERT ON taplo.command_receipt,taplo.audit_event,taplo.event_outbox TO taplo_app;
-- No mutation or deletion grants for audit/history; no auth_identity access from tenant runtime role.
DO $$ BEGIN
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='taplo_identity') THEN CREATE ROLE taplo_identity NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF;
 IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='taplo_worker') THEN CREATE ROLE taplo_worker NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF;
END $$;
ALTER TABLE taplo.auth_identity ENABLE ROW LEVEL SECURITY; ALTER TABLE taplo.auth_identity FORCE ROW LEVEL SECURITY;
CREATE POLICY verified_binding ON taplo.auth_identity FOR SELECT TO taplo_identity USING(provider='supabase' AND subject=current_setting('app.provider_subject',true));
CREATE POLICY identity_status ON taplo."user" FOR SELECT TO taplo_identity USING(EXISTS(SELECT 1 FROM taplo.auth_identity i WHERE i.user_id="user".id));
CREATE POLICY worker_outbox ON taplo.event_outbox TO taplo_worker USING(true) WITH CHECK(true);
GRANT USAGE ON SCHEMA taplo TO taplo_identity,taplo_worker;
GRANT SELECT ON taplo.auth_identity,taplo."user" TO taplo_identity;
GRANT SELECT,UPDATE ON taplo.event_outbox TO taplo_worker;
INSERT INTO taplo.schema_migration(version) VALUES('0001_foundation');
COMMIT;
