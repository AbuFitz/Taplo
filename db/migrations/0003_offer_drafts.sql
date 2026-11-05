BEGIN;
CREATE TABLE taplo.offer (
 id text PRIMARY KEY, version bigint NOT NULL DEFAULT 1 CHECK(version>=1),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 business_id text NOT NULL REFERENCES taplo.business(id),
 kind text NOT NULL CHECK(kind IN ('goods','appointment','class','quote')),
 title text NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 160), description text,
 visibility text NOT NULL DEFAULT 'draft' CHECK(visibility IN ('draft','published','paused','archived')),
 price_mode text NOT NULL CHECK(price_mode IN ('fixed','from','quote','free')),
 price jsonb, policy_version_id text, delivery_modes jsonb NOT NULL DEFAULT '[]', configuration_ref text,
 CHECK(jsonb_typeof(delivery_modes)='array'),
 CHECK(visibility NOT IN ('published','paused') OR (policy_version_id IS NOT NULL AND configuration_ref IS NOT NULL AND jsonb_array_length(delivery_modes)>0)),
 UNIQUE(business_id,id)
);
ALTER TABLE taplo.offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.offer FORCE ROW LEVEL SECURITY;
CREATE POLICY offer_read ON taplo.offer FOR SELECT TO taplo_app
 USING(business_id=current_setting('app.business_id',true) AND EXISTS(
  SELECT 1 FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
  WHERE m.business_id=offer.business_id AND m.user_id=current_setting('app.actor_id',true) AND m.status='active' AND u.status='active'
 ));
CREATE POLICY offer_create_draft ON taplo.offer FOR INSERT TO taplo_app
 WITH CHECK(business_id=current_setting('app.business_id',true) AND visibility='draft' AND EXISTS(
  SELECT 1 FROM taplo.membership m JOIN taplo."user" u ON u.id=m.user_id
  WHERE m.business_id=offer.business_id AND m.user_id=current_setting('app.actor_id',true) AND m.status='active' AND m.role IN ('owner','manager') AND u.status='active'
 ));
GRANT SELECT,INSERT ON taplo.offer TO taplo_app;
-- No UPDATE/DELETE permission, especially no direct publication mutation.
INSERT INTO taplo.schema_migration(version) VALUES('0003_offer_drafts');
COMMIT;
