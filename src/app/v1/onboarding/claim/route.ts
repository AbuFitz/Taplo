import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { readJson } from "@/server/foundation/http";
import { database } from "@/server/foundation/database";
import { claimDraft } from "@/server/foundation/claim";
import { verifyRequestPrincipal } from "@/server/auth/principal";
import {
  CommandError,
  errorResponse,
  unavailable,
} from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  try {
    if (process.env.TAPLO_SERVER_CLAIM !== "1") throw unavailable();
    const site = request.headers.get("sec-fetch-site");
    if (
      request.headers.get("origin") !== new URL(request.url).origin ||
      (site && !["same-origin", "none"].includes(site))
    )
      throw new CommandError(
        "FORBIDDEN",
        403,
        "Please open Taplo to continue.",
      );
    const cookie =
      process.env.NODE_ENV === "production"
        ? "__Host-taplo-draft"
        : "taplo-draft";
    const token = request.cookies.get(cookie)?.value;
    if (!token)
      throw new CommandError(
        "VERIFICATION_REQUIRED",
        401,
        "Sign in to continue your setup.",
      );
    const input = await readJson(request, 4096);
    const db = database();
    const principal = await verifyRequestPrincipal(db, request, {
      provision: true,
    });
    const result = await claimDraft(
      db,
      principal,
      token,
      input,
      request.headers.get("idempotency-key") ?? "",
      requestId,
    );
    return NextResponse.json(result.value, {
      headers: {
        "Cache-Control": "no-store",
        "X-Request-ID": requestId,
        "Idempotency-Replayed": String(result.replayed),
      },
    });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
