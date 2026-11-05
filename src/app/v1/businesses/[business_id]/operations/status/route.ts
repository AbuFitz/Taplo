import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { readJson } from "@/server/foundation/http";
import { database } from "@/server/foundation/database";
import { verifyRequestPrincipal } from "@/server/auth/principal";
import { getOperation } from "@/server/foundation/operations";
import { CommandError, errorResponse } from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ business_id: string }> },
) {
  const requestId = randomUUID();
  try {
    if (
      process.env.TAPLO_AUTH_PROVIDER === "better-auth" &&
      request.headers.get("origin") !== new URL(request.url).origin
    )
      throw new CommandError(
        "FORBIDDEN",
        403,
        "Please open Taplo to continue.",
      );
    const input = await readJson(request, 2048);
    const db = database(),
      principal = await verifyRequestPrincipal(db, request);
    const operation = await getOperation(
      db,
      principal,
      (await context.params).business_id,
      input,
    );
    return Response.json(operation, {
      headers: { "Cache-Control": "no-store", "X-Request-ID": requestId },
    });
  } catch (e) {
    return errorResponse(e, requestId);
  }
}
