import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { readJson } from "@/server/foundation/http";
import { database } from "@/server/foundation/database";
import { verifyPrincipal } from "@/server/foundation/identity";
import { getOperation } from "@/server/foundation/operations";
import { CommandError, errorResponse } from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest, context: { params: Promise<{ business_id: string }> }) {
 const requestId = randomUUID();
 try {
  const bearer = request.headers.get("authorization");
  // Only verified native/first-party bearer sessions here. No browser token storage or arbitrary identity header.
  if (!bearer?.startsWith("Bearer ")) throw new CommandError("VERIFICATION_REQUIRED",401,"Sign in to continue.");
  const input = await readJson(request, 2048);
  const db=database(), principal=await verifyPrincipal(db,bearer.slice(7));
  const operation=await getOperation(db,principal,(await context.params).business_id,input);
  return Response.json(operation,{headers:{"Cache-Control":"no-store","X-Request-ID":requestId}});
 } catch(e) { return errorResponse(e,requestId); }
}
