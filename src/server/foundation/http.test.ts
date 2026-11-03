import { describe, expect, it } from "vitest";
import { readJson } from "./http";
import { CommandError, errorResponse } from "./errors";

describe("command transport boundary", () => {
  it("bounds streamed request bytes rather than trusting Content-Length", async () => {
    const request = new Request("https://taplo.test/v1/onboarding/drafts", {
      method: "POST", headers: { "Content-Type": "application/json", "Content-Length": "2" },
      body: JSON.stringify({ display_name: "x".repeat(100) }),
    });
    await expect(readJson(request, 32)).rejects.toMatchObject({ status: 413, code: "INVALID_INPUT" });
  });
  it("rejects malformed JSON and unsupported request bodies", async () => {
    const make = (body: string, type: string) => new Request("https://taplo.test/", { method: "POST", headers: { "Content-Type": type }, body });
    await expect(readJson(make("{", "application/json"), 32)).rejects.toMatchObject({ status: 400 });
    await expect(readJson(make("{}", "text/plain"), 32)).rejects.toMatchObject({ status: 400 });
    expect(await readJson(make('{"expected_version":0}', "application/json; charset=utf-8"), 32)).toEqual({ expected_version: 0 });
  });
  it("does not disclose database errors and preserves request correlation", async () => {
    const response = errorResponse(new Error("postgres://secret@private-host/table"), "req_redaction123");
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("X-Request-ID")).toBe("req_redaction123");
    expect(await response.json()).toEqual({ code: "TEMPORARILY_UNAVAILABLE", message_key: "Please try again shortly.", field_errors: [], request_id: "req_redaction123", retryable: true });
  });
  it("uses the canonical field-error projection", async () => {
    const response = errorResponse(new CommandError("INVALID_INPUT", 400, "validation.input", false, [{ path: "/display_name", message_key: "validation.required" }]), "req_fields123");
    expect((await response.json()).field_errors).toEqual([{ path: "/display_name", message_key: "validation.required" }]);
  });
});
