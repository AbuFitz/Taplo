# Neon development foundation

Taplo now has a dedicated Neon Free-plan project in London, running PostgreSQL 17. No pre-existing unrelated project was reused. The new default database branch is `development`; `foundation-validation` is an isolated test branch, not a Git branch. All application code remains on `claude/modest-cerf-4tont1`.

The three additive migrations were applied first on the empty validation branch, then on the empty development branch. Existing unrelated Neon projects were not changed. Restricted-role SQL verification passed on the validation branch, including user/business/membership/offer/draft isolation, foreign draft-write denial, direct-publication denial and audit-deletion denial. Verification fixtures were rolled back; a subsequent count confirmed zero fixture businesses persisted.

A real managed-Postgres difference was found: the creating owner had role ADMIN membership but not SET membership. Superuser-backed local CI had hidden that distinction. A separate `taplo_runtime` login is now configured with NOINHERIT, NOSUPERUSER, NOBYPASSRLS, NOCREATEDB and NOCREATEROLE. It can SET only the required app/identity/onboarding roles, and cannot SET the owner or outbox-worker roles. The migration owner is not supplied to the application.

`scripts/provision-runtime.mjs` provides an explicit, guarded provisioning command for reviewed direct migration connections and a new private `.env.*.local` output. It refuses existing roles and existing files instead of rotating credentials. In this workspace direct endpoint DNS resolution failed, so the actual setup and role verification used the connected Neon SQL API; no successful local application connection is claimed.

## Deployment boundary

Vercel team access was approved. The project had no existing environment variables. Automatic approval review rejected configuring one development database across Production, Preview and Development. The materially safer setup is Preview only: `TAPLO_DATABASE_URL` and `TAPLO_HEALTH_PROBE_SECRET` are encrypted Preview variables. Production was not changed. Vercel disallows Preview-variable scoping to its Production Git branch, so the Preview settings have no Git-branch filter; an explicit Preview deployment is used while retaining the canonical Git branch.

The new private `GET /v1/health/database` requires its server-only header credential, checks that the actual login lacks owner/bypass/role-admin/database-admin power, and verifies real table grants through the existing transaction-local role boundary. It returns no customer rows or database identity. Four transport tests pass, and local checks report 443 unit tests passed, 61 database tests skipped, plus type checking, lint and build. Actual deployed connection verification remains pending at this source checkpoint.

Anonymous-draft activation, claim activation, offer activation and live auth are not automatically enabled by adding a database connection. Existing cleanup/abuse/provider/readiness prerequisites remain. The frontend account adapter and first-offer/publish journey still need connecting; this is P01 infrastructure progress, not P03–P12 completion.


## Deployed connection evidence · 5 November 2026

Source `3508ea0c9e307666d2718acdbd063ce55b647c71`, Vercel deployment `dpl_2LCnUCSymvghqwVD7ZM1QJws8LWQ`, explicit non-Production target `staging`, reached READY. Exact host: `taplo-xgp7z837b-abufitz-49f3a2e4.vercel.app`. Vercel's documented API accepts `staging`; `preview` is not accepted as an explicit target. This resolves the earlier ambiguous-target blocker without changing Production's database configuration.

A direct request to `/v1/health/database` returned 404 `{status:not_found}` without the application probe secret, then 200 `{status:ok}` with the private header. The secret was read from ignored local configuration, sent only to that owned deployment, and never included in a URL or output. Cross-origin redirects were forbidden. This proves deployed application → restricted runtime login → Neon access and the schema/grant checks performed by that route; it is not booking/auth/publication release evidence.

Automatic review rejected creation of a temporary share URL. No share URL was created or used; the normal application-authenticated request worked. Do not retry the rejected sharing operation for this verification.

Only migrations 0001–0003 are applied in the live development database at this point. New identity migration 0004 remains source/isolated-test work; no auth schema, email service or auth activation flags were provisioned live here.
