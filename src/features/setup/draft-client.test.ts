import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIXTURES } from "@/features/themes/fixtures";
import { captureWorkspace } from "./workspace";
import { DraftWorkspaceClient, saveSetupWorkspace } from "./draft-client";

const input = () => ({
  content: structuredClone(FIXTURES[0].content),
  page: structuredClone(FIXTURES[0].page),
  step: "finish",
  slugEdited: true,
});
const draft = (version = 1) => ({
  id: "draft_private123",
  version,
  display_name: FIXTURES[0].content.identity.name,
  workspace_snapshot: captureWorkspace(input()),
});
let request: ReturnType<typeof vi.fn>;
beforeEach(() => {
  request = vi.fn();
  vi.stubGlobal("fetch", request);
  const storage = new Map<string, string>();
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("complete draft browser transport", () => {
  it("keeps open review portals available without enabling backup or authentication", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAPLO_SERVER_DRAFTS", "");
    expect(await saveSetupWorkspace(input())).toEqual({ ok: true });
    expect(request).not.toHaveBeenCalled();
  });
  it("sends full content and appearance with HttpOnly credentials and accepts only a matching acknowledgement", async () => {
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockResolvedValueOnce(Response.json(draft()));
    expect(
      await new DraftWorkspaceClient().save(captureWorkspace(input())),
    ).toEqual({ ok: true });
    const call = request.mock.calls[1][1];
    expect(call.credentials).toBe("same-origin");
    expect(call.headers["Idempotency-Key"]).toMatch(/^[a-f0-9-]{36}$/);
    expect(JSON.parse(call.body).workspace_snapshot).toEqual(
      draft().workspace_snapshot,
    );
    expect(JSON.parse(call.body)).not.toHaveProperty("plan");
  });
  it("recovers a committed response that was lost without creating a duplicate", async () => {
    const client = new DraftWorkspaceClient();
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockRejectedValueOnce(new Error("Response lost"));
    expect(await client.save(captureWorkspace(input()))).toMatchObject({
      ok: false,
    });
    request.mockResolvedValueOnce(Response.json({ draft: draft() }));
    expect(await client.save(captureWorkspace(input()))).toEqual({ ok: true });
    expect(
      request.mock.calls.filter(([, options]) => options.method === "POST"),
    ).toHaveLength(1);
  });
  it("reuses the exact idempotency key for a failed request that did not commit", async () => {
    const client = new DraftWorkspaceClient();
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockRejectedValueOnce(new Error("Offline"));
    await client.save(captureWorkspace(input()));
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockResolvedValueOnce(Response.json(draft()));
    expect(await client.save(captureWorkspace(input()))).toEqual({ ok: true });
    const posts = request.mock.calls.filter(
      ([, options]) => options.method === "POST",
    );
    expect(posts[0][1].headers["Idempotency-Key"]).toBe(
      posts[1][1].headers["Idempotency-Key"],
    );
  });
  it("does not overwrite another version merely by fetching its latest ETag", async () => {
    request.mockResolvedValueOnce(Response.json({ draft: draft() }));
    const current = captureWorkspace(input());
    current.content.identity.name = "Changed locally";
    expect(await new DraftWorkspaceClient().save(current)).toMatchObject({
      ok: false,
      reason: "conflict",
      draft: { version: 1 },
    });
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("requires the exact version the owner chose to replace, even if it changed during that choice", async () => {
    request.mockResolvedValueOnce(Response.json({ draft: draft(2) }));
    const current = captureWorkspace(input());
    current.content.identity.name = "Changed locally";
    expect(
      await new DraftWorkspaceClient().save(current, {
        id: draft().id,
        version: 1,
      }),
    ).toMatchObject({ ok: false, reason: "conflict", draft: { version: 2 } });
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("saves an explicit replacement under If-Match and returns later conflicts for review", async () => {
    const client = new DraftWorkspaceClient();
    const current = captureWorkspace(input());
    current.content.identity.name = "New name";
    request
      .mockResolvedValueOnce(Response.json({ draft: draft() }))
      .mockResolvedValueOnce(Response.json({}, { status: 409 }))
      .mockResolvedValueOnce(Response.json({ draft: draft(2) }));
    expect(
      await client.save(current, { id: draft().id, version: 1 }),
    ).toMatchObject({ ok: false, reason: "conflict", draft: { version: 2 } });
    expect(request.mock.calls[1][1].headers["If-Match"]).toBe('"1"');
  });
  it("never accepts a generic 200 or a response for different content as a save", async () => {
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    expect(
      await new DraftWorkspaceClient().save(captureWorkspace(input())),
    ).toMatchObject({ ok: false });
    const other = draft();
    other.workspace_snapshot.content.identity.name = "Wrong business";
    request
      .mockResolvedValueOnce(Response.json({ draft: null }))
      .mockResolvedValueOnce(Response.json(other));
    expect(
      await new DraftWorkspaceClient().save(captureWorkspace(input())),
    ).toMatchObject({ ok: false });
  });
  it("does not recreate an expired or claimed draft behind the owner's back", async () => {
    const client = new DraftWorkspaceClient();
    client.acceptVersion(draft());
    request.mockResolvedValueOnce(Response.json({ draft: null }));
    expect(await client.save(captureWorkspace(input()))).toMatchObject({
      ok: false,
    });
    expect(request).toHaveBeenCalledTimes(1);
  });
});
