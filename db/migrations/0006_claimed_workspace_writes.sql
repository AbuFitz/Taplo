-- Only the current owner/manager may update the private authoring document.
-- This does not publish a page or mutate canonical offers, payments or bookings.
BEGIN;
CREATE POLICY workspace_edit ON taplo.business_workspace FOR UPDATE TO taplo_app
 USING(business_id=current_setting('app.business_id',true) AND EXISTS(
 SELECT 1 FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
 WHERE m.business_id=business_workspace.business_id AND m.user_id=current_setting('app.actor_id',true)
 AND m.status='active' AND m.role IN ('owner','manager') AND u.status='active'))
 WITH CHECK(business_id=current_setting('app.business_id',true) AND EXISTS(
 SELECT 1 FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
 WHERE m.business_id=business_workspace.business_id AND m.user_id=current_setting('app.actor_id',true)
 AND m.status='active' AND m.role IN ('owner','manager') AND u.status='active'));
GRANT UPDATE(snapshot,version,updated_at) ON taplo.business_workspace TO taplo_app;
INSERT INTO taplo.schema_migration(version) VALUES('0006_claimed_workspace_writes');
COMMIT;
