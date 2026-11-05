-- Separate from tenant migrations. Review and apply with the migration owner only.
-- Provider tables are generated from the pinned SDK by db:generate:auth.
BEGIN;
CREATE SCHEMA taplo_auth;
REVOKE ALL ON SCHEMA taplo_auth FROM PUBLIC;
COMMIT;
