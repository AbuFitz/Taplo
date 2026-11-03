import { capabilities } from "@/lib/capabilities";

/**
 * The boundary between setup and an account. No sign-up provider is connected in this build, so every call here says so plainly
 * rather than pretending. When a provider is added, only this file changes: `session()` reports an existing signed-in user (who then
 * skips sign-up) and `connect()` creates or signs in and persists the draft, resolving only once that has really happened.
 */
export type AccountResult = { ok: true } | { ok: false; reason: "not-configured" | "cancelled" | "failed" };

export const accountsConfigured = (): boolean => capabilities().accounts && Boolean(process.env.NEXT_PUBLIC_TAPLO_AUTH_PROVIDER);

export async function session(): Promise<{ signedIn: boolean }> {
  return { signedIn: false };
}

export async function connect(): Promise<AccountResult> {
  if (!accountsConfigured()) return { ok: false, reason: "not-configured" };
  return { ok: false, reason: "failed" };
}
