import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { TEST_DB_URL, createCleanDatabase } from "./db";
import { bindVerifiedIdentity } from "../../src/server/foundation/identity";
describe.skipIf(!TEST_DB_URL)(
  "provider-scoped canonical identity binding",
  () => {
    let db: Pool, drop: () => Promise<void>;
    beforeAll(async () => {
      const setup = await createCleanDatabase();
      db = setup.pool;
      drop = setup.drop;
      for (const name of [
        "0001_foundation",
        "0002_onboarding_claim",
        "0003_offer_drafts",
        "0004_identity_providers",
      ])
        await db.query(readFileSync(`db/migrations/${name}.sql`, "utf8"));
    }, 30000);
    afterAll(async () => {
      await drop?.();
    });
    it("binds concurrent verified cookie subjects once without merging providers or granting memberships", async () => {
      const identity = {
        provider: "better-auth" as const,
        subject: "same-subject",
        displayName: "Maker",
      };
      const results = await Promise.all(
        [1, 2].map(() =>
          bindVerifiedIdentity(db, identity, { provision: true }),
        ),
      );
      expect(results[0].id).toBe(results[1].id);
      expect(results[0].assurance).toBe("aal1");
      const other = await bindVerifiedIdentity(
        db,
        { ...identity, provider: "supabase" },
        { provision: true },
      );
      expect(other.id).not.toBe(results[0].id);
      expect(
        (await db.query("SELECT count(*) FROM taplo.membership")).rows[0].count,
      ).toBe("0");
      expect(
        (await db.query("SELECT count(*) FROM taplo.auth_identity")).rows[0]
          .count,
      ).toBe("2");
    });
    it("rechecks suspension and does not provision unknown subjects during ordinary reads", async () => {
      const identity = {
        provider: "better-auth" as const,
        subject: "same-subject",
      };
      const found = await bindVerifiedIdentity(db, identity);
      await db.query(
        "UPDATE taplo.\"user\" SET status='suspended' WHERE id=$1",
        [found.id],
      );
      await expect(bindVerifiedIdentity(db, identity)).rejects.toMatchObject({
        status: 404,
      });
      await expect(
        bindVerifiedIdentity(db, { ...identity, subject: "unknown" }),
      ).rejects.toMatchObject({ status: 404 });
    });
  },
);
