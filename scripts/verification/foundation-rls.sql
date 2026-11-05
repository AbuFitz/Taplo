-- Run only on the isolated foundation-validation branch. Fixtures always roll back.
-- Checks actual restricted-role behaviour, independently of the database-owner bypass.
DO $test$
DECLARE denied boolean;
BEGIN
 BEGIN
  INSERT INTO taplo."user"(id,display_name,status) VALUES('usr_neonowner123','Synthetic owner','active'),('usr_neonother123','Synthetic other','active');
  INSERT INTO taplo.business(id,display_name,handle) VALUES('biz_neonfirst123','Synthetic workshop','neon-validation-one'),('biz_neonother123','Synthetic other','neon-validation-two');
  INSERT INTO taplo.membership(id,business_id,user_id,role,status) VALUES('mem_neonfirst123','biz_neonfirst123','usr_neonowner123','owner','active'),('mem_neonother123','biz_neonother123','usr_neonother123','owner','active');
  INSERT INTO taplo.onboarding_draft(id,session_hash,display_name) VALUES('draft_neonfirst123',repeat('a',64),'Synthetic draft'),('draft_neonother123',repeat('b',64),'Other synthetic draft');
  INSERT INTO taplo.offer(id,business_id,kind,title,price_mode) VALUES('offer_neonfirst123','biz_neonfirst123','appointment','Synthetic consultation','fixed'),('offer_neonother123','biz_neonother123','goods','Synthetic cup','fixed');
  SET LOCAL ROLE taplo_app;
  PERFORM set_config('app.actor_id','usr_neonowner123',true),set_config('app.business_id','biz_neonfirst123',true),set_config('app.draft_hash',repeat('a',64),true);
  IF (SELECT rolsuper OR rolbypassrls FROM pg_roles WHERE rolname=current_user) THEN RAISE EXCEPTION 'Restricted role bypasses RLS'; END IF;
  IF (SELECT count(*) FROM taplo."user")<>1 THEN RAISE EXCEPTION 'User projection not isolated'; END IF;
  IF (SELECT count(*) FROM taplo.business)<>1 THEN RAISE EXCEPTION 'Business scope not isolated'; END IF;
  IF (SELECT count(*) FROM taplo.membership)<>1 THEN RAISE EXCEPTION 'Membership scope not isolated'; END IF;
  IF (SELECT count(*) FROM taplo.offer)<>1 THEN RAISE EXCEPTION 'Offer scope not isolated'; END IF;
  IF (SELECT count(*) FROM taplo.onboarding_draft)<>1 THEN RAISE EXCEPTION 'Draft credential not isolated'; END IF;
  IF EXISTS(SELECT 1 FROM taplo.offer WHERE id='offer_neonother123') THEN RAISE EXCEPTION 'Foreign offer is visible'; END IF;
  denied:=false;
  BEGIN
   INSERT INTO taplo.onboarding_draft(id,session_hash,display_name) VALUES('draft_neondenied123',repeat('b',64),'Must be denied');
  EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Foreign draft write was allowed'; END IF;
  denied:=false;
  BEGIN UPDATE taplo.offer SET visibility='published' WHERE id='offer_neonfirst123';
  EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Direct publication was allowed'; END IF;
  denied:=false;
  BEGIN DELETE FROM taplo.audit_event;
  EXCEPTION WHEN insufficient_privilege THEN denied:=true; END;
  IF NOT denied THEN RAISE EXCEPTION 'Audit deletion was allowed'; END IF;
  RESET ROLE;
  -- Roll back all fixture writes, including on success. Other exceptions propagate and fail the verification.
  RAISE EXCEPTION 'Rollback successful verification fixtures' USING ERRCODE='ZX001';
 EXCEPTION WHEN SQLSTATE 'ZX001' THEN NULL; END;
END
$test$;
