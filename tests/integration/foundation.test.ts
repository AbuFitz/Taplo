import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { TEST_DB_URL, as, createCleanDatabase } from "./db";

const U1 = "00000000-0000-4000-8000-000000000001";
const U2 = "00000000-0000-4000-8000-000000000002";
const U3 = "00000000-0000-4000-8000-000000000003";

const content = (name: string) => ({ identity: { name, slug: "x", industryKey: "mechanic", industryLabel: "Mechanic" } });

describe.skipIf(!TEST_DB_URL)("foundation schema (real Postgres)", () => {
  let pool: Pool;
  let drop: () => Promise<void>;
  let biz1: string;
  let biz2: string;

  const create = (sub: string, slug: string, name = "Biz") =>
    as(pool, { sub }, async (q) => (await q("select public.create_business($1,$2,'mechanic','Mechanic') as id", [name, slug])).rows[0].id as string);

  beforeAll(async () => {
    ({ pool, drop } = await createCleanDatabase());
    for (const u of [U1, U2, U3]) await pool.query("insert into auth.users (id, email) values ($1, $2)", [u, `${u}@example.com`]);
    biz1 = await create(U1, "north-garage", "North Garage");
    biz2 = await create(U2, "olive-barbers", "Olive Barbers");
  });
  afterAll(async () => drop?.());

  describe("tenant isolation (RLS)", () => {
    it("users only see their own business, draft, subscription and audit trail", async () => {
      for (const [sub, own, other] of [[U1, biz1, biz2], [U2, biz2, biz1]] as const) {
        await as(pool, { sub }, async (q) => {
          expect((await q("select id from public.businesses")).rows.map((r) => r.id)).toEqual([own]);
          expect((await q("select business_id from public.profile_drafts")).rows.map((r) => r.business_id)).toEqual([own]);
          expect((await q("select business_id from public.subscriptions")).rows.map((r) => r.business_id)).toEqual([own]);
          expect((await q("select 1 from public.audit_events where business_id = $1", [other])).rowCount).toBe(0);
          expect((await q("select 1 from public.business_memberships where business_id = $1", [other])).rowCount).toBe(0);
        });
      }
    });
    it("cannot write another tenant's draft or call their functions", async () => {
      const r = await as(pool, { sub: U1 }, (q) => q("update public.profile_drafts set content = '{\"hacked\":true}' where business_id = $1", [biz2]));
      expect(r.rowCount).toBe(0);
      await expect(as(pool, { sub: U1 }, (q) => q("select public.publish_profile($1)", [biz2]))).rejects.toThrow(/forbidden/);
      await expect(as(pool, { sub: U1 }, (q) => q("select public.rename_business_slug($1, 'stolen-name')", [biz2]))).rejects.toThrow(/forbidden/);
    });
    it("clients cannot mutate billing state, businesses, memberships or audit rows directly", async () => {
      await expect(as(pool, { sub: U1 }, (q) => q("update public.subscriptions set plan = 'business' where business_id = $1", [biz1]))).rejects.toThrow(/permission denied/);
      await expect(as(pool, { sub: U1 }, (q) => q("update public.businesses set status = 'published' where id = $1", [biz1]))).rejects.toThrow(/permission denied/);
      await expect(as(pool, { sub: U1 }, (q) => q("insert into public.business_memberships (business_id,user_id,role) values ($1,$2,'owner')", [biz2, U1]))).rejects.toThrow(/permission denied/);
      await expect(as(pool, { sub: U1 }, (q) => q("delete from public.audit_events"))).rejects.toThrow(/permission denied/);
    });
    it("anonymous clients have no direct table access", async () => {
      for (const t of ["businesses", "profile_drafts", "profile_versions", "subscriptions", "business_memberships", "business_slugs"]) {
        await expect(as(pool, "anon", (q) => q(`select * from public.${t}`)), t).rejects.toThrow(/permission denied/);
      }
    });
    it("staff members cannot read drafts or edit the profile", async () => {
      await pool.query("insert into public.profiles (id) values ($1) on conflict do nothing", [U3]);
      await pool.query("insert into public.business_memberships (business_id,user_id,role) values ($1,$2,'staff')", [biz1, U3]);
      await as(pool, { sub: U3 }, async (q) => {
        expect((await q("select id from public.businesses")).rowCount).toBe(1);
        expect((await q("select 1 from public.profile_drafts")).rowCount).toBe(0);
        expect((await q("update public.profile_drafts set content = '{}'")).rowCount).toBe(0);
      });
      await expect(as(pool, { sub: U3 }, (q) => q("select public.publish_profile($1)", [biz1]))).rejects.toThrow(/forbidden/);
    });
  });

  describe("slugs", () => {
    it("rejects reserved, invalid and taken slugs", async () => {
      for (const s of ["dashboard", "book", "api", "taplo-official"]) await expect(create(U1, s), s).rejects.toThrow(/slug_reserved/);
      for (const s of ["ab", "Has-Caps", "double--hyphen", "-lead", "12345", "x".repeat(41)]) await expect(create(U1, s), s).rejects.toThrow(/slug_invalid/);
      await expect(create(U2, "north-garage")).rejects.toThrow(/slug_taken/);
    });
    it("concurrent claims of one slug: exactly one wins, no orphan rows", async () => {
      await pool.query("insert into auth.users (id) select gen_random_uuid() from generate_series(1,12)");
      const users = (await pool.query("select id from auth.users where id not in ($1,$2,$3)", [U1, U2, U3])).rows.map((r) => r.id as string);
      const results = await Promise.allSettled(users.map((u) => create(u, "race-winner", "Racer")));
      expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      for (const r of results.filter((r): r is PromiseRejectedResult => r.status === "rejected")) expect(String(r.reason)).toMatch(/slug_taken/);
      const rows = await pool.query("select count(*)::int as n from public.businesses where slug = 'race-winner'");
      expect(rows.rows[0].n).toBe(1);
      const slugs = await pool.query("select count(*)::int as n from public.business_slugs where slug = 'race-winner'");
      expect(slugs.rows[0].n).toBe(1);
      // A loser must not have leaked a business, membership or subscription.
      const orphans = await pool.query(
        "select (select count(*) from public.businesses b where not exists (select 1 from public.business_slugs s where s.business_id=b.id))::int as a",
      );
      expect(orphans.rows[0].a).toBe(0);
    });
  });

  describe("publishing and public projection", () => {
    it("serves nothing publicly before publish, and never the draft", async () => {
      await as(pool, { sub: U1 }, (q) => q("update public.profile_drafts set content = $1 where business_id = $2", [JSON.stringify(content("North Garage")), biz1]));
      const r = await as(pool, "anon", (q) => q("select public.get_public_profile('north-garage') as p"));
      expect(r.rows[0].p).toEqual({ status: "none" });
    });
    it("publish creates an immutable versioned snapshot; later draft edits stay private", async () => {
      const v1 = await as(pool, { sub: U1 }, async (q) => (await q("select public.publish_profile($1) as v", [biz1])).rows[0].v);
      expect(v1).toBe(1);
      await as(pool, { sub: U1 }, (q) => q("update public.profile_drafts set content = $1 where business_id = $2", [JSON.stringify(content("DRAFT ONLY EDIT")), biz1]));
      const pub = await as(pool, "anon", async (q) => (await q("select public.get_public_profile('north-garage') as p")).rows[0].p);
      expect(pub.status).toBe("found");
      expect(pub.snapshot.content.identity.name).toBe("North Garage");
      expect(pub.plan).toBe("free");
      expect(JSON.stringify(pub)).not.toMatch(/owner_id|stripe|email/);
      const v2 = await as(pool, { sub: U1 }, async (q) => (await q("select public.publish_profile($1) as v", [biz1])).rows[0].v);
      expect(v2).toBe(2);
    });
    it("concurrent publishes get distinct consecutive versions", async () => {
      const out = await Promise.all([1, 2, 3, 4].map(() => as(pool, { sub: U1 }, async (q) => (await q("select public.publish_profile($1) as v", [biz1])).rows[0].v as number)));
      expect([...out].sort()).toEqual([3, 4, 5, 6]);
    });
    it("refuses to publish an incomplete draft", async () => {
      await expect(as(pool, { sub: U2 }, (q) => q("select public.publish_profile($1)", [biz2]))).rejects.toThrow(/draft_incomplete/);
    });
    it("restore copies a version into the draft only; the live page is unchanged", async () => {
      await as(pool, { sub: U1 }, (q) => q("select public.restore_profile_version($1, 1)", [biz1]));
      const d = await as(pool, { sub: U1 }, async (q) => (await q("select content from public.profile_drafts where business_id=$1", [biz1])).rows[0].content);
      expect(d.identity.name).toBe("North Garage");
      await expect(as(pool, { sub: U1 }, (q) => q("select public.restore_profile_version($1, 99)", [biz1]))).rejects.toThrow(/version_not_found/);
    });
    it("rename keeps the old address as a redirect and blocks others from claiming it", async () => {
      await as(pool, { sub: U1 }, (q) => q("select public.rename_business_slug($1, 'northgate-garage')", [biz1]));
      const old = await as(pool, "anon", async (q) => (await q("select public.get_public_profile('north-garage') as p")).rows[0].p);
      expect(old).toEqual({ status: "redirect", slug: "northgate-garage" });
      const cur = await as(pool, "anon", async (q) => (await q("select public.get_public_profile('northgate-garage') as p")).rows[0].p);
      expect(cur.status).toBe("found");
      await expect(create(U2, "north-garage")).rejects.toThrow(/slug_taken/);
      await expect(as(pool, { sub: U2 }, (q) => q("select public.rename_business_slug($1, 'north-garage')", [biz2]))).rejects.toThrow(/slug_taken/);
      // The owner may take the old name back.
      await as(pool, { sub: U1 }, (q) => q("select public.rename_business_slug($1, 'north-garage')", [biz1]));
      const back = await as(pool, "anon", async (q) => (await q("select public.get_public_profile('north-garage') as p")).rows[0].p);
      expect(back.status).toBe("found");
    });
    it("unpublish removes the page from the public read path, including old addresses", async () => {
      await as(pool, { sub: U1 }, (q) => q("select public.unpublish_profile($1)", [biz1]));
      for (const s of ["north-garage", "northgate-garage"]) {
        const p = await as(pool, "anon", async (q) => (await q("select public.get_public_profile($1) as p", [s])).rows[0].p);
        expect(p).toEqual({ status: "none" });
      }
    });
    it("records an audit trail for sensitive changes", async () => {
      const actions = await as(pool, { sub: U1 }, async (q) => (await q("select action from public.audit_events where business_id=$1", [biz1])).rows.map((r) => r.action));
      expect(actions).toEqual(expect.arrayContaining(["business.created", "profile.published", "business.slug_renamed", "profile.unpublished", "profile.restored_to_draft"]));
    });
  });
});
