import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database, transaction } from "@/server/foundation/database";
import { errorResponse, unavailable } from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const digest = (value: string) => createHash("sha256").update(value).digest();
/** Private, read-only deployment probe. Never reports identity, credentials or customer rows. */
export async function GET(request: NextRequest) {
 const requestId = randomUUID();
 const secret = process.env.TAPLO_HEALTH_PROBE_SECRET;
 const supplied = request.headers.get("x-taplo-health-probe") ?? "";
 if (!secret || !supplied || !timingSafeEqual(digest(secret), digest(supplied))) {
  return NextResponse.json({ status: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
 }
 try {
  await transaction(database(), { actorId: "health_probe" }, async client => {
   const login = (await client.query("SELECT rolsuper,rolbypassrls,rolcreaterole,rolcreatedb FROM pg_roles WHERE rolname=session_user")).rows[0];
   if (!login || login.rolsuper || login.rolbypassrls || login.rolcreaterole || login.rolcreatedb) throw unavailable();
   // Compiles/checks the real grants and tables without returning or scanning private rows.
   await client.query("SELECT id FROM taplo.business WHERE false");
   await client.query("SELECT id FROM taplo.onboarding_draft WHERE false");
   await client.query("SELECT id FROM taplo.offer WHERE false");
  });
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } });
 } catch (error) { return errorResponse(error, requestId); }
}
