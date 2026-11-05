import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";
import { TEST_DB_URL, createCleanDatabase, applyFoundationMigrations } from "./db";
import { readDraft, upsertDraft } from "../../src/server/foundation/drafts";
import { createOfferDraft } from "../../src/server/foundation/offers";
import { claimDraft } from "../../src/server/foundation/claim";
import { transaction } from "../../src/server/foundation/database";
import { verifyPrincipal } from "../../src/server/foundation/identity";
// Explicit provider test adapter: these checks establish DB binding behaviour, not live Supabase evidence.
const { getUser } = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getUser } }) }));
const owner = { id: "usr_claimowner123", audience: "merchant" as const, assurance: "aal1" as const };
const stranger = { ...owner, id: "usr_claimother123" };
const token = "d".repeat(64);

describe.skipIf(!TEST_DB_URL)("onboarding claim on isolated PostgreSQL", () => {
  let db: Pool, drop: () => Promise<void>, draftId: string, businessId: string;
  beforeAll(async () => {
    const setup = await createCleanDatabase(); db = setup.pool; drop = setup.drop;
    await applyFoundationMigrations(db);
    await db.query("INSERT INTO taplo.\"user\"(id,display_name,status) VALUES($1,'Owner','active'),($2,'Other','active')", [owner.id, stranger.id]);
    const draft = await upsertDraft(db, token, { expected_version: 0, display_name: "Form Workshop", category_query: "ceramics" }, "setup-claim-123", "req_setup123");
    draftId = draft.value.id;
  }, 30000);
  afterAll(async () => { await drop?.(); vi.unstubAllEnvs(); });
  const input = () => ({ draft_id: draftId, expected_draft_version: 1 });
  it("provisions a verified subject once and never links different subjects by a shared email", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://auth.taplo.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-only");
    const jwt = (subject: string) => `header.${Buffer.from(JSON.stringify({ iss: "https://auth.taplo.test/auth/v1", sub: subject, aud: "authenticated", aal: "aal1" })).toString("base64url")}.test-signature`;
    getUser.mockImplementation(async (token: string) => {
      const { sub } = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
      return { data: { user: { id: sub, email: "same@example.test", user_metadata: { display_name: "Maker" } } }, error: null };
    });
    const results = await Promise.all([1, 2].map(() => verifyPrincipal(db, jwt("provider-maker"), { provision: true })));
    expect(results[0].id).toBe(results[1].id);
    const other = await verifyPrincipal(db, jwt("provider-other"), { provision: true });
    expect(other.id).not.toBe(results[0].id);
    expect((await db.query("SELECT count(*) FROM taplo.auth_identity WHERE subject='provider-maker'")).rows[0].count).toBe("1");
    expect((await db.query("SELECT count(*) FROM taplo.audit_event WHERE action='identity_bound.v1'")).rows[0].count).toBe("2");
    expect((await db.query("SELECT count(*) FROM taplo.event_outbox WHERE event_type='identity_bound.v1'")).rows[0].count).toBe("2");
    await db.query("UPDATE taplo.\"user\" SET status='suspended' WHERE id=$1", [results[0].id]);
    await expect(verifyPrincipal(db, jwt("provider-maker"), { provision: true })).rejects.toMatchObject({ status: 404 });
    await expect(verifyPrincipal(db, jwt("provider-unregistered"))).rejects.toMatchObject({ status: 404 });
  });
  it("never provisions an identity when provider verification fails", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "anonymous-provider-user", is_anonymous: true } }, error: null });
    await expect(verifyPrincipal(db, "anonymous", { provision: true })).rejects.toMatchObject({ status: 401 });
    getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error("invalid token") });
    await expect(verifyPrincipal(db, "invalid", { provision: true })).rejects.toMatchObject({ status: 401 });
    expect((await db.query("SELECT count(*) FROM taplo.auth_identity")).rows[0].count).toBe("2");
  });
  it("rejects a foreign cookie, stale version and non-merchant audience without creating records", async () => {
    await expect(claimDraft(db, owner, "e".repeat(64), input(), "claim-foreign123", "req_foreign123")).rejects.toMatchObject({ status: 404 });
    await expect(claimDraft(db, owner, token, { ...input(), expected_draft_version: 0 }, "claim-stale123", "req_stale123")).rejects.toMatchObject({ code: "VERSION_OR_AVAILABILITY_CONFLICT" });
    await expect(claimDraft(db, { ...owner, audience: "customer" }, token, input(), "claim-customer123", "req_customer123")).rejects.toMatchObject({ status: 404 });
    expect((await db.query("SELECT count(*) FROM taplo.business")).rows[0].count).toBe("0");
  });
  it("creates one private business, owner membership and claim event under concurrent retries", async () => {
    const results = await Promise.all([1, 2].map(n => claimDraft(db, owner, token, input(), "claim-once-123", `req_claim${n}123`)));
    expect(results[0].value).toEqual(results[1].value);
    expect(results.map(r => r.replayed).sort()).toEqual([false, true]);
    const business = results[0].value;
    businessId = business.id;
    expect(business).toMatchObject({ display_name: "Form Workshop", status: "draft", timezone: "Europe/London", capabilities: [] });
    expect(business).not.toHaveProperty("published_page_version");
    expect((await db.query("SELECT role,status,user_id FROM taplo.membership WHERE business_id=$1", [business.id])).rows).toEqual([{ role: "owner", status: "active", user_id: owner.id }]);
    expect((await db.query("SELECT count(*) FROM taplo.business")).rows[0].count).toBe("1");
    expect((await db.query("SELECT count(*) FROM taplo.event_outbox WHERE event_type='claim_onboarding_draft.v1' AND business_id=$1", [business.id])).rows[0].count).toBe("1");
    expect((await db.query("SELECT count(*) FROM taplo.audit_event WHERE action='claim_onboarding_draft.v1' AND business_id=$1", [business.id])).rows[0].count).toBe("1");
    expect(await readDraft(db, token)).toBeNull();
    await expect(upsertDraft(db, token, { expected_version: 0, display_name: "Form Workshop", category_query: "ceramics" }, "setup-claim-123", "req_oldsave123")).rejects.toMatchObject({ status: 404 });
  });
  it("does not let another principal claim, replay or duplicate a claimed draft", async () => {
    await expect(claimDraft(db, stranger, token, input(), "claim-once-123", "req_other123")).rejects.toMatchObject({ status: 404 });
    await expect(claimDraft(db, owner, "e".repeat(64), input(), "claim-once-123", "req_wrongcookie123")).rejects.toMatchObject({ status: 404 });
    await expect(claimDraft(db, owner, token, input(), "claim-newkey123", "req_newkey123")).rejects.toMatchObject({ code: "VERSION_OR_AVAILABILITY_CONFLICT" });
    expect((await db.query("SELECT count(*) FROM taplo.business")).rows[0].count).toBe("1");
  });
  it("rechecks current user state before returning an idempotent result", async () => {
    await db.query("UPDATE taplo.\"user\" SET status='suspended' WHERE id=$1", [owner.id]);
    await expect(claimDraft(db, owner, token, input(), "claim-once-123", "req_suspended123")).rejects.toMatchObject({ status: 404 });
    await db.query("UPDATE taplo.\"user\" SET status='active' WHERE id=$1", [owner.id]);
  });
  it("retains ordinary runtime's prohibition on creating businesses and owners", async () => {
    await expect(transaction(db, { actorId: owner.id, businessId: "biz_forbidden123" }, c => c.query("INSERT INTO taplo.business(id,display_name,handle) VALUES('biz_forbidden123','No','not-allowed')"))).rejects.toThrow(/permission denied/);
    await expect(transaction(db, { actorId: owner.id }, c => c.query("DELETE FROM taplo.audit_event"))).rejects.toThrow(/permission denied/);
  });
  it("connects the claimed business to a deliberate first-offer draft without publishing it", async () => {
    const offer = { kind: "appointment", title: "Pottery consultation", price_mode: "fixed", price: { minor: 2500, currency: "GBP" } };
    const results = await Promise.all([1, 2].map(n => createOfferDraft(db, owner, businessId, offer, "first-offer-123", `req_offer${n}123`)));
    expect(results[0].value).toEqual(results[1].value);
    expect(results.map(r => r.replayed).sort()).toEqual([false, true]);
    expect(results[0].value).toMatchObject({ business_id: businessId, title: offer.title, price: offer.price, visibility: "draft", delivery_modes: [] });
    expect(results[0].value).not.toHaveProperty("policy_version_id");
    expect(results[0].value).not.toHaveProperty("configuration_ref");
    expect((await db.query("SELECT count(*) FROM taplo.offer")).rows[0].count).toBe("1");
    expect((await db.query("SELECT count(*) FROM taplo.event_outbox WHERE event_type='create_offer_draft.v1'")).rows[0].count).toBe("1");
    await expect(createOfferDraft(db, owner, businessId, { ...offer, title: "Changed" }, "first-offer-123", "req_changed123")).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
  });
  it("blocks foreign tenants, customer audiences and revoked members before offer receipts replay", async () => {
    const offer = { kind: "appointment", title: "Pottery consultation", price_mode: "fixed", price: { minor: 2500, currency: "GBP" } };
    await expect(createOfferDraft(db, stranger, businessId, offer, "stranger-offer123", "req_stranger123")).rejects.toMatchObject({ status: 404 });
    await expect(createOfferDraft(db, { ...owner, audience: "customer" }, businessId, offer, "customer-offer123", "req_customer123")).rejects.toMatchObject({ status: 403 });
    await db.query("UPDATE taplo.membership SET status='revoked' WHERE business_id=$1 AND user_id=$2", [businessId, owner.id]);
    await expect(createOfferDraft(db, owner, businessId, offer, "first-offer-123", "req_revoked123")).rejects.toMatchObject({ status: 404 });
    await db.query("UPDATE taplo.membership SET status='active' WHERE business_id=$1 AND user_id=$2", [businessId, owner.id]);
  });
  it("allows an incomplete draft price but rejects contradictory free pricing and cannot directly publish", async () => {
    const draft = await createOfferDraft(db, owner, businessId, { kind: "goods", title: "Hand-thrown cup", price_mode: "fixed" }, "incomplete-offer123", "req_incomplete123");
    expect(draft.value).not.toHaveProperty("price");
    await expect(createOfferDraft(db, owner, businessId, { kind: "goods", title: "Cup", price_mode: "free", price: { minor: 100, currency: "GBP" } }, "invalid-price123", "req_invalid123")).rejects.toMatchObject({ status: 422 });
    await expect(createOfferDraft(db, owner, businessId, { kind: "goods", title: "Cup", price_mode: "fixed", price: { minor: 100, currency: "USD" } }, "foreign-price123", "req_currency123")).rejects.toMatchObject({ status: 422 });
    await expect(transaction(db, { actorId: owner.id, businessId }, c => c.query("UPDATE taplo.offer SET visibility='published' WHERE id=$1", [draft.value.id]))).rejects.toThrow(/permission denied/);
  });
  it("hides expired credentials even when a matching claim receipt exists", async () => {
    await db.query("UPDATE taplo.onboarding_draft SET expires_at=now()-interval '1 second' WHERE id=$1", [draftId]);
    await expect(claimDraft(db, owner, token, input(), "claim-once-123", "req_expired123")).rejects.toMatchObject({ status: 404 });
  });
});
