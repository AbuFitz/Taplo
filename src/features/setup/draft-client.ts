import {
  captureWorkspace,
  parseWorkspace,
  type WorkspaceSnapshot,
} from "./workspace";

export interface SavedDraft {
  id: string;
  version: number;
  display_name: string;
  workspace_snapshot?: WorkspaceSnapshot;
}
export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "conflict"; draft: SavedDraft }
  | { ok: false; reason: "failed" | "invalid" | "too-large" | "rate-limited" };
export const serverDraftsConfigured = () =>
  process.env.NEXT_PUBLIC_TAPLO_SERVER_DRAFTS === "1";
const ENDPOINT = "/v1/onboarding/drafts";
const BINDING = "taplo.draft-binding.v1";

function decode(value: unknown): SavedDraft {
  const v = value as Partial<SavedDraft> | null;
  if (
    !v ||
    !/^draft_[a-zA-Z0-9_-]+$/.test(v.id ?? "") ||
    !Number.isSafeInteger(v.version) ||
    v.version! < 1 ||
    typeof v.display_name !== "string"
  )
    throw new Error("Invalid saved draft");
  return {
    id: v.id!,
    version: v.version!,
    display_name: v.display_name,
    ...(v.workspace_snapshot
      ? { workspace_snapshot: parseWorkspace(v.workspace_snapshot) }
      : {}),
  };
}
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, stable(v)]),
    );
  return value;
}
export const sameWorkspace = (a: WorkspaceSnapshot, b: WorkspaceSnapshot) =>
  JSON.stringify(stable(a)) === JSON.stringify(stable(b));

/** One writer per tab. HttpOnly credentials are never exposed or copied to storage. */
export class DraftWorkspaceClient {
  private binding: { id: string; version: number } | null = null;
  private pending: { body: string; key: string } | null = null;
  private busy = false;
  private remember(draft: SavedDraft) {
    this.binding = { id: draft.id, version: draft.version };
    try {
      sessionStorage.setItem(BINDING, JSON.stringify(this.binding));
    } catch {
      /* Keep the in-memory binding. */
    }
  }
  /** Explicitly adopting the shown remote version does not grant server permissions. */
  acceptVersion(draft: SavedDraft) {
    this.remember(draft);
  }
  private baseline() {
    if (this.binding) return this.binding;
    try {
      const value = JSON.parse(sessionStorage.getItem(BINDING) ?? "null");
      if (
        typeof value?.id === "string" &&
        Number.isSafeInteger(value.version) &&
        value.version > 0
      )
        this.binding = value;
    } catch {
      /* A missing binding requires comparing the actual saved workspace. */
    }
    return this.binding;
  }
  private async read(): Promise<SavedDraft | null> {
    const response = await fetch(ENDPOINT, {
      credentials: "same-origin",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Read failed");
    const result = await response.json();
    if (result?.draft === null) return null;
    return decode(result?.draft);
  }
  async save(
    snapshot: WorkspaceSnapshot,
    replace?: { id: string; version: number },
  ): Promise<SaveResult> {
    if (this.busy) return { ok: false, reason: "failed" };
    this.busy = true;
    try {
      const workspace = parseWorkspace(snapshot);
      const remote = await this.read();
      // A read confirms an uncertain previous write without inventing another draft.
      if (
        remote?.workspace_snapshot &&
        sameWorkspace(remote.workspace_snapshot, workspace)
      ) {
        this.remember(remote);
        this.pending = null;
        return { ok: true };
      }
      const baseline = this.baseline();
      const replacing =
        remote &&
        replace?.id === remote.id &&
        replace.version === remote.version;
      if (
        remote &&
        !replacing &&
        (baseline?.id !== remote.id || baseline.version !== remote.version)
      )
        return { ok: false, reason: "conflict", draft: remote };
      // Expiry/claim must not silently turn an old binding into a new anonymous business.
      if (!remote && baseline) return { ok: false, reason: "failed" };
      const expected = remote?.version ?? 0;
      const body = JSON.stringify({
        ...(remote ? { draft_id: remote.id } : {}),
        expected_version: expected,
        display_name: workspace.content.identity.name,
        category_query: workspace.content.identity.industryLabel ?? "",
        look_id: workspace.page.themeId,
        introduction: (workspace.content.identity.tagline ?? "").slice(0, 500),
        workspace_snapshot: workspace,
      });
      if (this.pending?.body !== body)
        this.pending = { body, key: crypto.randomUUID() };
      const response = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        signal: AbortSignal.timeout(15000),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": this.pending.key,
          ...(remote ? { "If-Match": `"${expected}"` } : {}),
        },
        body,
      });
      if (response.status === 409) {
        const latest = await this.read();
        return latest
          ? { ok: false, reason: "conflict", draft: latest }
          : { ok: false, reason: "failed" };
      }
      if (!response.ok)
        return {
          ok: false,
          reason:
            response.status === 413
              ? "too-large"
              : response.status === 422
                ? "invalid"
                : response.status === 429
                  ? "rate-limited"
                  : "failed",
        };
      const saved = decode(await response.json());
      if (
        (remote && saved.id !== remote.id) ||
        saved.version !== expected + 1 ||
        !saved.workspace_snapshot ||
        !sameWorkspace(saved.workspace_snapshot, workspace)
      )
        return { ok: false, reason: "failed" };
      this.remember(saved);
      this.pending = null;
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        reason:
          error instanceof Error && error.message === "workspace.too_large"
            ? "too-large"
            : error instanceof Error && error.message.startsWith("workspace.")
              ? "invalid"
              : "failed",
      };
    } finally {
      this.busy = false;
    }
  }
}

export const draftWorkspaceClient = new DraftWorkspaceClient();
/** Preview editing remains available; enabling server backup does not enable live sign-in. */
export async function saveSetupWorkspace(
  state: Parameters<typeof captureWorkspace>[0],
  replace?: { id: string; version: number },
): Promise<SaveResult> {
  if (!serverDraftsConfigured()) return { ok: true };
  try {
    return await draftWorkspaceClient.save(captureWorkspace(state), replace);
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error && error.message === "workspace.too_large"
          ? "too-large"
          : "invalid",
    };
  }
}
