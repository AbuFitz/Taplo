import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { TEST_DB_URL, createCleanDatabase } from "./db";
import { readDraft, upsertDraft } from "../../src/server/foundation/drafts";
import { transaction } from "../../src/server/foundation/database";
import { emit, idempotent } from "../../src/server/foundation/commands";
import { getOperation } from "../../src/server/foundation/operations";
import { processOne, UnknownOutcome } from "../../src/server/foundation/outbox";
const token = "a".repeat(64), other = "b".repeat(64);

describe.skipIf(!TEST_DB_URL)("canonical foundation on isolated PostgreSQL", () => {
 let db: Pool, drop: () => Promise<void>;
 beforeAll(async () => { const setup=await createCleanDatabase(); db=setup.pool; drop=setup.drop; await db.query(readFileSync("db/migrations/0001_foundation.sql","utf8")); },30000);
 afterAll(async () => { await drop?.(); });
 it("concurrent identical requests write one draft, audit event and outbox record", async () => {
  const input={expected_version:0,display_name:"Form Workshop",category_query:"ceramics"};
  const result=await Promise.all([upsertDraft(db,token,input,"same-key-123","req_12345678"),upsertDraft(db,token,input,"same-key-123","req_12345679")]);
  expect(result[0].value.id).toBe(result[1].value.id); expect(result.map(r=>r.replayed).sort()).toEqual([false,true]);
  expect((await db.query("SELECT count(*) FROM taplo.onboarding_draft")).rows[0].count).toBe("1");
  expect((await db.query("SELECT count(*) FROM taplo.audit_event")).rows[0].count).toBe("1");
  expect((await db.query("SELECT count(*) FROM taplo.event_outbox")).rows[0].count).toBe("1");
 });
 it("rejects changed payload on the same scoped key", async () => { await expect(upsertDraft(db,token,{expected_version:0,display_name:"Changed"},"same-key-123","req_12345680")).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"}); });
 it("does not reveal a draft to another credential", async () => {
  const draft=(await readDraft(db,token))!; expect(await readDraft(db,other)).toBeNull();
  await expect(upsertDraft(db,other,{draft_id:draft.id,expected_version:1,display_name:"Stolen"},"other-key-123","req_12345681",'"1"')).rejects.toMatchObject({status:404});
 });
 it("rejects stale writers and applies exactly one concurrent version update", async () => {
  const draft=(await readDraft(db,token))!;
  const write=(name:string)=>upsertDraft(db,token,{draft_id:draft.id,expected_version:1,display_name:name},`key-${name}-123`,`req_${name}12345678`,'"1"');
  const results=await Promise.allSettled([write("first"),write("second")]);
  expect(results.filter(r=>r.status==="fulfilled")).toHaveLength(1);
  expect((results.find(r=>r.status==="rejected") as PromiseRejectedResult).reason.code).toBe("VERSION_OR_AVAILABILITY_CONFLICT");
  expect((await readDraft(db,token))?.version).toBe(2);
 });
 it("rolls back receipt, audit and outbox together on a failed transaction", async () => {
  await expect(transaction(db,{actorId:"usr_failure123"},c=>idempotent(c,{actorId:"usr_failure123",command:"test",key:"rollback-123",requestId:"req_rollback123",input:{}},async()=>{await emit(c,{actorId:"usr_failure123",action:"rollback.v1",subjectId:"draft_fail123",version:1,requestId:"req_rollback123",fields:[]});throw new Error("stop");}))).rejects.toThrow("stop");
  expect((await db.query("SELECT count(*) FROM taplo.audit_event WHERE actor_id='usr_failure123'")).rows[0].count).toBe("0");
  expect((await db.query("SELECT count(*) FROM taplo.command_receipt WHERE actor_id='usr_failure123'")).rows[0].count).toBe("0");
 });
 it("uses a non-owner, non-bypass role and clears transaction context after reuse", async () => {
  const role=await transaction(db,{actorId:"usr_test123"},async c=>(await c.query("SELECT current_user,rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user")).rows[0]);
  expect(role).toMatchObject({current_user:"taplo_app",rolsuper:false,rolbypassrls:false});
  await expect(transaction(db,{actorId:"usr_test123"},c=>c.query("DELETE FROM taplo.audit_event"))).rejects.toThrow(/permission denied/);
  expect(await readDraft(db,other)).toBeNull();
 });
 it("does not expose expired drafts", async () => {
  await upsertDraft(db,"c".repeat(64),{expected_version:0,display_name:"Expired"},"expired-key-123","req_expired123");
  await db.query("UPDATE taplo.onboarding_draft SET expires_at=now()-interval '1 second' WHERE display_name='Expired'");
  expect(await readDraft(db,"c".repeat(64))).toBeNull();
 });
 it("separates two concurrent worker claims", async () => {
  const ids:string[]=[]; await Promise.all([processOne(db,async e=>{ids.push(e.id);}),processOne(db,async e=>{ids.push(e.id);})]);
  expect(ids).toHaveLength(2); expect(new Set(ids).size).toBe(2);
 });
 it("does not repeat a dispatch with unknown outcome", async () => {
  await db.query("UPDATE taplo.event_outbox SET status='succeeded'");
  await db.query("INSERT INTO taplo.event_outbox(id,actor_id,event_type,subject_id,source_version,payload) VALUES('evt_unknown123','usr_worker123','unknown.v1','work_unknown123',1,'{}')");
  let calls=0; expect(await processOne(db,async()=>{calls++;throw new UnknownOutcome();})).toBe("uncertain");
  expect(await processOne(db,async()=>{calls++;})).toBe("idle"); expect(calls).toBe(1);
 });
 it("projects operations only to current tenant authority and never returns internal references", async () => {
  await db.query("INSERT INTO taplo.\"user\"(id,display_name,status) VALUES('usr_owner123','Owner','active'),('usr_other123','Other','active')");
  await db.query("INSERT INTO taplo.business(id,display_name,handle) VALUES('biz_first123','Form','form-workshop'),('biz_other123','Other','other-workshop')");
  await db.query("INSERT INTO taplo.membership(id,business_id,user_id,role,status) VALUES('mem_owner123','biz_first123','usr_owner123','owner','active')");
  await db.query("INSERT INTO taplo.provider_operation(id,business_id,actor_id,provider,operation_kind,subject_id,status,idempotency_ref,provider_ref) VALUES('op_first123','biz_first123','usr_owner123','test','receipt','work_first123','uncertain','receipt_first123','internal_reference')");
  const principal={id:"usr_owner123",audience:"merchant" as const,assurance:"aal1" as const};
  const operation=await getOperation(db,principal,"biz_first123",{operation_id:"op_first123"}); expect(operation.status).toBe("uncertain"); expect(operation).not.toHaveProperty("actor_id"); expect(operation).not.toHaveProperty("provider_ref");
  await expect(getOperation(db,principal,"biz_other123",{operation_id:"op_first123"})).rejects.toMatchObject({status:404});
  await db.query("UPDATE taplo.membership SET status='revoked' WHERE id='mem_owner123'");
  await expect(getOperation(db,principal,"biz_first123",{operation_id:"op_first123"})).rejects.toMatchObject({status:404});
 });
});
