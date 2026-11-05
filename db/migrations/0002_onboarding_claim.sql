-- Narrow server-only role for claiming a bound draft. The ordinary app role gains no business/membership write grants.
BEGIN;
DO $$ BEGIN IF NOT EXISTS(SELECT FROM pg_roles WHERE rolname='taplo_onboarding') THEN CREATE ROLE taplo_onboarding NOLOGIN NOSUPERUSER NOBYPASSRLS; END IF; END $$;
ALTER TABLE taplo.onboarding_draft ADD COLUMN claimed_business_id text UNIQUE REFERENCES taplo.business(id);
ALTER TABLE taplo.onboarding_draft ADD CONSTRAINT draft_claim_pair CHECK((claimed_by IS NULL)=(claimed_business_id IS NULL));
CREATE POLICY onboarding_draft_claim ON taplo.onboarding_draft TO taplo_onboarding
 USING(session_hash=current_setting('app.draft_hash',true) AND expires_at>now() AND (claimed_by IS NULL OR claimed_by=current_setting('app.actor_id',true)))
 WITH CHECK(session_hash=current_setting('app.draft_hash',true) AND expires_at>now() AND claimed_by=current_setting('app.actor_id',true));
GRANT USAGE ON SCHEMA taplo TO taplo_onboarding;
GRANT SELECT ON taplo."user" TO taplo_onboarding;
GRANT SELECT,INSERT ON taplo.business,taplo.membership,taplo.command_receipt,taplo.audit_event,taplo.event_outbox TO taplo_onboarding;
GRANT SELECT,UPDATE ON taplo.onboarding_draft TO taplo_onboarding;
-- Identity provisioning only follows provider verification in server code; never link by email.
CREATE POLICY provision_user ON taplo."user" FOR INSERT TO taplo_identity
 WITH CHECK(id=current_setting('app.provisioned_user_id',true) AND status='active' AND verified_contact_refs='[]'::jsonb);
CREATE POLICY provision_binding ON taplo.auth_identity FOR INSERT TO taplo_identity
 WITH CHECK(provider='supabase' AND subject=current_setting('app.provider_subject',true) AND user_id=current_setting('app.provisioned_user_id',true));
GRANT INSERT ON taplo."user",taplo.auth_identity,taplo.audit_event,taplo.event_outbox TO taplo_identity;
INSERT INTO taplo.schema_migration(version) VALUES('0002_onboarding_claim');
COMMIT;
