import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/server/foundation/database";
import { verifyRequestPrincipal } from "@/server/auth/principal";
import { readJson } from "@/server/foundation/http";
import { readBusinessWorkspace, saveBusinessWorkspace } from "@/server/foundation/workspaces";
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ business_id: string }> },
) {
  const requestId = randomUUID();
  try {
    if (process.env.TAPLO_SERVER_DRAFTS !== "1") throw unavailable();
    const site = request.headers.get("sec-fetch-site");
    if (
      request.headers.get("origin") !== new URL(request.url).origin ||
      (site && !["same-origin", "none"].includes(site))
    )
      throw new CommandError("FORBIDDEN", 403, "Please open Taplo to continue.");
    const raw = await readJson(request, 2 * 1024 * 1024 + 8192);
    const input = raw as { expected_version?: unknown } | null;
    if (
      !input ||
      !Number.isSafeInteger(input.expected_version) ||
      request.headers.get("if-match") !== `"${input.expected_version}"`
    )
      throw new CommandError(
        "VERSION_OR_AVAILABILITY_CONFLICT",
        409,
        "Your workspace changed elsewhere. Review the latest version before saving.",
      );
    const { business_id } = await context.params;
    const db = database();
    const principal = await verifyRequestPrincipal(db, request);
    const result = await saveBusinessWorkspace(
      db,
      principal,
      business_id,
      raw,
      request.headers.get("idempotency-key") ?? "",
      requestId,
    );
    return NextResponse.json(result.value, {
      headers: {
        "Cache-Control": "no-store",
        "X-Request-ID": requestId,
        ETag: `"${result.value.version}"`,
        "Idempotency-Replayed": String(result.replayed),
      },
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
