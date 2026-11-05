import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import {
  TEST_DB_URL,
  createCleanDatabase,
  applyFoundationMigrations,
} from "./db";
import { FIXTURES } from "../../src/features/themes/fixtures";
import { captureWorkspace } from "../../src/features/setup/workspace";
import { upsertDraft, readDraft } from "../../src/server/foundation/drafts";
import { claimDraft } from "../../src/server/foundation/claim";
import { readBusinessWorkspace } from "../../src/server/foundation/workspaces";
import { transaction } from "../../src/server/foundation/database";

const owner = {
  id: "usr_workspaceowner123",
  audience: "merchant" as const,
  assurance: "aal1" as const,
};
const other = { ...owner, id: "usr_workspaceother123" };
const input = () => {
  const fixture = FIXTURES[0];
  return {
    expected_version: 0,
    display_name: fixture.content.identity.name,
    look_id: fixture.page.themeId,
    workspace_snapshot: captureWorkspace({
      content: structuredClone(fixture.content),
      page: structuredClone(fixture.page),
      step: "finish",
      slugEdited: true,
      setupDrafts: {
        services: [
          {
            id: "next-offer",
            name: "My next service",
            price: "12.",
            minutes: "",
          },
        ],
      },
    }),
  };
};

describe.skipIf(!TEST_DB_URL)(
  "complete draft workspaces on isolated PostgreSQL",
  () => {
    let db: Pool, drop: () => Promise<void>;
    beforeAll(async () => {
      const setup = await createCleanDatabase();
      db = setup.pool;
      drop = setup.drop;
      await applyFoundationMigrations(db);
      await db.query(
        `INSERT INTO taplo."user"(id,display_name,status) VALUES($1,'Owner','active'),($2,'Other','active')`,
        [owner.id, other.id],
      );
    }, 30000);
    afterAll(async () => {
      await drop?.();
    });

    it("keeps legacy summary saves and claims working before the optional workspace migration", async () => {
      const legacy = await createCleanDatabase();
      try {
        for (const migration of [
          "0001_foundation",
          "0002_onboarding_claim",
          "0003_offer_drafts",
          "0004_identity_providers",
        ])
          await legacy.pool.query(
            readFileSync(`db/migrations/${migration}.sql`, "utf8"),
          );
        await legacy.pool.query(
          `INSERT INTO taplo."user"(id,display_name,status) VALUES($1,'Owner','active')`,
          [owner.id],
        );
        const token = randomBytes(32).toString("hex");
        const draft = (
          await upsertDraft(
            legacy.pool,
            token,
            { display_name: "Legacy Workshop", expected_version: 0 },
            "legacy-workspace123",
            "req_legacy",
          )
        ).value;
        const changed = (
          await upsertDraft(
            legacy.pool,
            token,
            {
              display_name: "Legacy Workshop 2",
              draft_id: draft.id,
              expected_version: 1,
            },
            "legacy-workspace-edit123",
            "req_legacyedit",
            '"1"',
          )
        ).value;
        const claimed = await claimDraft(
          legacy.pool,
          owner,
          token,
          { draft_id: draft.id, expected_draft_version: changed.version },
          "legacy-workspace-claim123",
          "req_legacyclaim",
        );
        expect(claimed.value.display_name).toBe("Legacy Workshop 2");
      } finally {
        await legacy.drop();
      }
    });

    it("persists full records, widget order, image references, styles and incomplete input rather than four summary fields", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      raw.workspace_snapshot.page.widgets.reverse();
      const results = await Promise.all(
        [1, 2].map((n) =>
          upsertDraft(db, token, raw, "workspace-save123", `req_save${n}`),
        ),
      );
      expect(results.map((r) => r.replayed).sort()).toEqual([false, true]);
      expect((await readDraft(db, token))?.workspace_snapshot).toEqual(
        raw.workspace_snapshot,
      );
      expect(await readDraft(db, randomBytes(32).toString("hex"))).toBeNull();
      const audit = (
        await db.query(
          "SELECT changed_field_names FROM taplo.audit_event WHERE target_id=$1",
          [results[0].value.id],
        )
      ).rows;
      expect(audit).toHaveLength(1);
      expect(audit[0].changed_field_names).toContain("workspace_snapshot");
      const receipt = (
        await db.query(
          "SELECT response FROM taplo.command_receipt WHERE key='workspace-save123'",
        )
      ).rows[0].response;
      expect(receipt).not.toHaveProperty("workspace_snapshot");
      expect(
        (await db.query("SELECT count(*) FROM taplo.offer")).rows[0].count,
      ).toBe("0");
    });
    it("rejects stale competing changes and metadata-only writes without dropping the saved document", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      const first = (
        await upsertDraft(db, token, raw, "workspace-first123", "req_first")
      ).value;
      const edit = (name: string) => {
        const next = input();
        next.workspace_snapshot.page.meta.shareTitle = name;
        return upsertDraft(
          db,
          token,
          { ...next, draft_id: first.id, expected_version: 1 },
          `workspace-${name}`,
          `req_${name}`,
          '"1"',
        );
      };
      const competing = await Promise.allSettled([
        edit("first-edit"),
        edit("second-edit"),
      ]);
      expect(competing.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(
        competing
          .filter((r) => r.status === "rejected")
          .map((r) => r.status === "rejected" && r.reason.code),
      ).toEqual(["VERSION_OR_AVAILABILITY_CONFLICT"]);
      await expect(
        upsertDraft(
          db,
          token,
          {
            draft_id: first.id,
            expected_version: 2,
            display_name: "Different",
          },
          "workspace-summary123",
          "req_summary",
          '"2"',
        ),
      ).rejects.toMatchObject({ status: 422 });
      expect(
        (await readDraft(db, token))?.workspace_snapshot?.page.meta.shareTitle,
      ).toMatch(/-edit$/);
    });
    it("refuses to replay an obsolete full-workspace response over a newer edit", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      const first = (
        await upsertDraft(db, token, raw, "workspace-replay123", "req_first")
      ).value;
      const next = input();
      next.workspace_snapshot.page.meta.shareTitle = "Newer owner choice";
      await upsertDraft(
        db,
        token,
        { ...next, draft_id: first.id, expected_version: 1 },
        "workspace-newer123",
        "req_newer",
        '\"1\"',
      );
      await expect(
        upsertDraft(db, token, raw, "workspace-replay123", "req_replay"),
      ).rejects.toMatchObject({ code: "VERSION_OR_AVAILABILITY_CONFLICT" });
      expect(
        (await readDraft(db, token))?.workspace_snapshot?.page.meta.shareTitle,
      ).toBe("Newer owner choice");
    });

    it("rejects unsupported fields and forged authority without creating a draft or receipt", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      await expect(
        upsertDraft(
          db,
          token,
          {
            ...raw,
            workspace_snapshot: { ...raw.workspace_snapshot, plan: "business" },
          },
          "workspace-forged123",
          "req_forged",
        ),
      ).rejects.toMatchObject({ status: 400 });
      await expect(
        upsertDraft(
          db,
          token,
          {
            ...raw,
            workspace_snapshot: {
              ...raw.workspace_snapshot,
              page: { ...raw.workspace_snapshot.page, unknownAppearance: true },
            },
          },
          "workspace-unknown123",
          "req_unknown",
        ),
      ).rejects.toMatchObject({ status: 422 });
      expect(await readDraft(db, token)).toBeNull();
      expect(
        (
          await db.query(
            "SELECT count(*) FROM taplo.command_receipt WHERE key IN ('workspace-forged123','workspace-unknown123')",
          )
        ).rows[0].count,
      ).toBe("0");
    });
    it("claims the exact document once and restricts reads to active merchants with profile permission", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      const draft = (
        await upsertDraft(db, token, raw, "workspace-to-claim123", "req_setup")
      ).value;
      const command = {
        draft_id: draft.id,
        expected_draft_version: draft.version,
      };
      const claims = await Promise.all(
        [1, 2].map((n) =>
          claimDraft(
            db,
            owner,
            token,
            command,
            "workspace-claim123",
            `req_claim${n}`,
          ),
        ),
      );
      expect(claims.map((c) => c.replayed).sort()).toEqual([false, true]);
      const id = claims[0].value.id;
      expect(
        (await readBusinessWorkspace(db, owner, id)).workspace_snapshot,
      ).toEqual(raw.workspace_snapshot);
      expect(
        (
          await db.query(
            "SELECT count(*) FROM taplo.business_workspace WHERE business_id=$1",
            [id],
          )
        ).rows[0].count,
      ).toBe("1");
      expect(
        (
          await db.query(
            "SELECT workspace_snapshot FROM taplo.onboarding_draft WHERE id=$1",
            [draft.id],
          )
        ).rows[0].workspace_snapshot,
      ).toBeNull();
      expect(await readDraft(db, token)).toBeNull();
      await expect(readBusinessWorkspace(db, other, id)).rejects.toMatchObject({
        status: 404,
      });
      await expect(
        readBusinessWorkspace(db, { ...owner, audience: "customer" }, id),
      ).rejects.toMatchObject({ status: 403 });
      await db.query(
        "UPDATE taplo.membership SET status='revoked' WHERE business_id=$1",
        [id],
      );
      await expect(readBusinessWorkspace(db, owner, id)).rejects.toMatchObject({
        status: 404,
      });
      const denied = await transaction(
        db,
        { actorId: owner.id, businessId: id },
        (c) => c.query("SELECT * FROM taplo.business_workspace"),
      );
      expect(denied.rows).toEqual([]);
      await db.query(
        "UPDATE taplo.membership SET status='active',role='practitioner' WHERE business_id=$1",
        [id],
      );
      await expect(readBusinessWorkspace(db, owner, id)).rejects.toMatchObject({
        status: 403,
      });
      await db.query(
        "UPDATE taplo.membership SET role='manager' WHERE business_id=$1",
        [id],
      );
      expect((await readBusinessWorkspace(db, owner, id)).business_id).toBe(id);
      await db.query(
        "UPDATE taplo.\"user\" SET status='suspended' WHERE id=$1",
        [owner.id],
      );
      await expect(readBusinessWorkspace(db, owner, id)).rejects.toMatchObject({
        status: 404,
      });
      await db.query("UPDATE taplo.\"user\" SET status='active' WHERE id=$1", [
        owner.id,
      ]);
      // Anonymous expiry cleanup can remove the source without erasing the owned workspace.
      await db.query("DELETE FROM taplo.onboarding_draft WHERE id=$1", [
        draft.id,
      ]);
      expect(
        (await readBusinessWorkspace(db, owner, id)).workspace_snapshot,
      ).toEqual(raw.workspace_snapshot);
    });
    it("rolls back owner creation and claim when workspace storage fails, then retries safely", async () => {
      const token = randomBytes(32).toString("hex");
      const raw = input();
      const draft = (
        await upsertDraft(db, token, raw, "workspace-rollback123", "req_setup")
      ).value;
      const before = (await db.query("SELECT count(*) FROM taplo.business"))
        .rows[0].count;
      await db.query(`CREATE FUNCTION taplo.reject_test_workspace() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test storage failure'; END $$;
      CREATE TRIGGER reject_workspace BEFORE INSERT ON taplo.business_workspace FOR EACH ROW EXECUTE FUNCTION taplo.reject_test_workspace()`);
      const command = { draft_id: draft.id, expected_draft_version: 1 };
      await expect(
        claimDraft(
          db,
          owner,
          token,
          command,
          "workspace-retryclaim123",
          "req_attempt",
        ),
      ).rejects.toThrow("test storage failure");
      expect(
        (await db.query("SELECT count(*) FROM taplo.business")).rows[0].count,
      ).toBe(before);
      expect((await readDraft(db, token))?.workspace_snapshot).toEqual(
        raw.workspace_snapshot,
      );
      await db.query(
        "DROP TRIGGER reject_workspace ON taplo.business_workspace; DROP FUNCTION taplo.reject_test_workspace()",
      );
      const claimed = await claimDraft(
        db,
        owner,
        token,
        command,
        "workspace-retryclaim123",
        "req_retry",
      );
      expect(
        (await readBusinessWorkspace(db, owner, claimed.value.id))
          .workspace_snapshot,
      ).toEqual(raw.workspace_snapshot);
    });
  },
);
