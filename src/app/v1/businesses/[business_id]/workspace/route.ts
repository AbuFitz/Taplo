import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/server/foundation/database";
import { verifyRequestPrincipal } from "@/server/auth/principal";
import { readBusinessWorkspace } from "@/server/foundation/workspaces";
import {
  CommandError,
  errorResponse,
  unavailable,
} from "@/server/foundation/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ business_id: string }> },
) {
  const requestId = randomUUID();
  try {
    if (process.env.TAPLO_SERVER_DRAFTS !== "1") throw unavailable();
    const site = request.headers.get("sec-fetch-site");
    if (site && !["same-origin", "none"].includes(site))
      throw new CommandError(
        "FORBIDDEN",
        403,
        "Please open Taplo to continue.",
      );
    const db = database();
    const principal = await verifyRequestPrincipal(db, request);
    const { business_id } = await context.params;
    const workspace = await readBusinessWorkspace(db, principal, business_id);
    return NextResponse.json(workspace, {
      headers: {
        "Cache-Control": "no-store",
        "X-Request-ID": requestId,
        ETag: `"${workspace.version}"`,
      },
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
