-- Validate the web login on the intended app database; no customer data is read.
DO $verify$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='taplo_runtime' AND rolcanlogin AND NOT rolsuper AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb AND NOT rolinherit) THEN
  RAISE EXCEPTION 'Web login is missing or overprivileged';
 END IF;
 IF NOT pg_has_role('taplo_runtime','taplo_app','SET') OR NOT pg_has_role('taplo_runtime','taplo_identity','SET') OR NOT pg_has_role('taplo_runtime','taplo_onboarding','SET') THEN
  RAISE EXCEPTION 'Web login cannot enter a required restricted role';
 END IF;
 IF pg_has_role('taplo_runtime','taplo_owner','SET') OR pg_has_role('taplo_runtime','taplo_worker','SET') THEN
  RAISE EXCEPTION 'Web login can enter a privileged owner or worker role';
 END IF;
END
$verify$;
