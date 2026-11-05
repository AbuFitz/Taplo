import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/server/foundation/database";
import { readJson } from "@/server/foundation/http";
import { verifyRequestPrincipal } from "@/server/auth/principal";
import { createOfferDraft } from "@/server/foundation/offers";
import {
  CommandError,
  errorResponse,
  unavailable,
} from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ business_id: string }> },
) {
  const requestId = randomUUID();
  try {
    if (process.env.TAPLO_SERVER_OFFERS !== "1") throw unavailable();
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
    const input = await readJson(request, 4096),
      { business_id } = await context.params;
    const db = database(),
      principal = await verifyRequestPrincipal(db, request);
    const result = await createOfferDraft(
      db,
      principal,
      business_id,
      input,
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
