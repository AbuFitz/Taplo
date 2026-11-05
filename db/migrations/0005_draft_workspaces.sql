-- Preserve the complete private authoring workspace through the existing claim transaction.
-- No publication, live offer, billing entitlement or browser database grant is added.
BEGIN;
ALTER TABLE taplo.onboarding_draft ADD COLUMN workspace_snapshot jsonb;
ALTER TABLE taplo.onboarding_draft ADD CONSTRAINT onboarding_workspace_shape CHECK (
 workspace_snapshot IS NULL OR ((jsonb_typeof(workspace_snapshot)='object'
 AND workspace_snapshot->>'schema_version'='1'
 AND jsonb_typeof(workspace_snapshot->'content')='object'
 AND jsonb_typeof(workspace_snapshot->'page')='object'
 AND jsonb_typeof(workspace_snapshot->'progress')='object'
 AND octet_length(workspace_snapshot::text)<=4194304) IS TRUE)
);
CREATE TABLE taplo.business_workspace (
 business_id text PRIMARY KEY REFERENCES taplo.business(id),
 source_draft_id text UNIQUE REFERENCES taplo.onboarding_draft(id) ON DELETE SET NULL,
 version bigint NOT NULL DEFAULT 1 CHECK(version>=1),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 snapshot jsonb NOT NULL CHECK ((jsonb_typeof(snapshot)='object'
 AND snapshot->>'schema_version'='1'
 AND jsonb_typeof(snapshot->'content')='object'
 AND jsonb_typeof(snapshot->'page')='object'
 AND jsonb_typeof(snapshot->'progress')='object'
 AND octet_length(snapshot::text)<=4194304) IS TRUE)
);
ALTER TABLE taplo.business_workspace ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.business_workspace FORCE ROW LEVEL SECURITY;
CREATE POLICY workspace_read ON taplo.business_workspace FOR SELECT TO taplo_app
 USING(business_id=current_setting('app.business_id',true) AND EXISTS(
 SELECT 1 FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
 WHERE m.business_id=business_workspace.business_id AND m.user_id=current_setting('app.actor_id',true)
 AND m.status='active' AND m.role IN ('owner','manager') AND u.status='active'));
CREATE POLICY workspace_claim ON taplo.business_workspace FOR INSERT TO taplo_onboarding
 WITH CHECK(business_id=current_setting('app.business_id',true) AND EXISTS(
 SELECT 1 FROM taplo.onboarding_draft d WHERE d.id=source_draft_id
 AND d.session_hash=current_setting('app.draft_hash',true) AND d.claimed_by IS NULL AND d.expires_at>now()
 AND d.workspace_snapshot=business_workspace.snapshot)
 AND EXISTS(SELECT 1 FROM taplo.membership m WHERE m.business_id=business_workspace.business_id
 AND m.user_id=current_setting('app.actor_id',true) AND m.role='owner' AND m.status='active'));
GRANT SELECT ON taplo.business_workspace TO taplo_app;
GRANT INSERT ON taplo.business_workspace TO taplo_onboarding;
INSERT INTO taplo.schema_migration(version) VALUES('0005_draft_workspaces');
COMMIT;
