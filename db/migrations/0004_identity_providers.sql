BEGIN;
-- Exact server-verified provider+subject, never an email match. Existing Supabase bindings remain intact.
ALTER POLICY verified_binding ON taplo.auth_identity USING (
 provider IN ('supabase','better-auth') AND
 provider=coalesce(nullif(current_setting('app.identity_provider',true),''),'supabase') AND
 subject=current_setting('app.provider_subject',true)
);
ALTER POLICY provision_binding ON taplo.auth_identity WITH CHECK (
 provider IN ('supabase','better-auth') AND
 provider=coalesce(nullif(current_setting('app.identity_provider',true),''),'supabase') AND
 subject=current_setting('app.provider_subject',true) AND
 user_id=current_setting('app.provisioned_user_id',true)
);
INSERT INTO taplo.schema_migration(version) VALUES('0004_identity_providers');
COMMIT;
