import { randomBytes, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { WORKSPACE_MAX_BYTES } from "@/features/setup/workspace";
import { readJson } from "@/server/foundation/http";
import { database } from "@/server/foundation/database";
import { readDraft, upsertDraft } from "@/server/foundation/drafts";
import {
  CommandError,
  errorResponse,
  unavailable,
} from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieName = () =>
  process.env.NODE_ENV === "production" ? "__Host-taplo-draft" : "taplo-draft";
function enabled() {
  if (process.env.TAPLO_SERVER_DRAFTS !== "1") throw unavailable();
}
function safeOrigin(request: NextRequest, write: boolean) {
  const origin = request.headers.get("origin"),
    site = request.headers.get("sec-fetch-site");
  if (
    (write && origin !== new URL(request.url).origin) ||
    (site && !["same-origin", "none"].includes(site))
  )
    throw new CommandError("FORBIDDEN", 403, "Please open Taplo to continue.");
}
function tokenFor(request: NextRequest) {
  const token = request.cookies.get(cookieName())?.value;
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}
/** Establish an opaque HttpOnly credential and resume only its unclaimed, unexpired draft. */
export async function GET(request: NextRequest) {
  const requestId = randomUUID();
  try {
    enabled();
    safeOrigin(request, false);
    const token = tokenFor(request) ?? randomBytes(32).toString("hex");
    const draft = await readDraft(database(), token);
    const response = NextResponse.json(
      { draft },
      { headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } },
    );
    response.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 604800,
    });
    return response;
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  try {
    enabled();
    safeOrigin(request, true);
    const token = tokenFor(request);
    if (!token)
      throw new CommandError(
        "VERIFICATION_REQUIRED",
        403,
        "Reload your draft to continue.",
      );
    const input = await readJson(request, WORKSPACE_MAX_BYTES + 16384);
    const result = await upsertDraft(
      database(),
      token,
      input,
      request.headers.get("idempotency-key") ?? "",
      requestId,
      request.headers.get("if-match"),
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
