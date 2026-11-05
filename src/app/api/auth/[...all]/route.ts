import { randomUUID } from "node:crypto";
import { readJson } from "@/server/foundation/http";
import { authentication } from "@/server/auth/runtime";
import { CommandError, errorResponse } from "@/server/foundation/errors";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const paths = new Map([
  ["GET", new Set(["/get-session"])],
  [
    "POST",
    new Set([
      "/email-otp/send-verification-otp",
      "/sign-in/email-otp",
      "/sign-out",
    ]),
  ],
]);
async function handle(request: Request) {
  const id = randomUUID();
  try {
    const url = new URL(request.url);
    if (
      !paths.get(request.method)?.has(url.pathname.replace(/^\/api\/auth/, ""))
    )
      return new Response(null, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    if (
      request.method === "POST" &&
      request.headers.get("origin") !== url.origin
    )
      throw new CommandError(
        "FORBIDDEN",
        403,
        "Please open Taplo to continue.",
      );
    let forwarded = request;
    if (request.method === "POST") {
      const body = await readJson(request, 4096);
      if (
        url.pathname.endsWith("/send-verification-otp") &&
        (!body ||
          typeof body !== "object" ||
          !("type" in body) ||
          body.type !== "sign-in")
      )
        throw new CommandError(
          "INVALID_INPUT",
          400,
          "Check the details and try again.",
        );
      const headers = new Headers(request.headers);
      headers.delete("content-length");
      forwarded = new Request(request.url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }
    const result = await (await authentication()).handler(forwarded);
    result.headers.set("Cache-Control", "no-store");
    result.headers.set("X-Request-ID", id);
    return result;
  } catch (error) {
    return errorResponse(error, id);
  }
}
export { handle as GET, handle as POST };
