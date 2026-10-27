import { describe, it, expect, beforeEach } from "vitest";

function install(opts: { quota: boolean }) {
  const data = new Map<string, string>();
  const listeners = new Map<string, Set<() => void>>();
  const win = {
    localStorage: {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => { if (opts.quota && data.has(k)) throw new Error("QuotaExceededError"); data.set(k, v); },
      removeItem: (k: string) => { data.delete(k); },
    },
    addEventListener: (t: string, f: () => void) => { (listeners.get(t) ?? listeners.set(t, new Set()).get(t)!).add(f); },
    removeEventListener: () => {},
  };
  Object.assign(globalThis, { window: win });
  return { data };
}

describe("demo store when the browser refuses a write", () => {
  beforeEach(() => { delete (globalThis as { window?: unknown }).window; });

  it("keeps showing the newest edit instead of falling back to the last stored one", async () => {
    const env = install({ quota: false });
    const { initialState, readDemoState, writeDemoState, storageHasFailed } = await import("./store");
    const first = initialState();
    writeDemoState(first);
    expect(readDemoState()?.content.identity.name).toBe(first.content.identity.name);
    // From now on the browser rejects updates (storage full).
    const store = (globalThis as unknown as { window: { localStorage: { setItem: (k: string, v: string) => void } } }).window.localStorage;
    store.setItem = () => { throw new Error("QuotaExceededError"); };
    const next = structuredClone(first);
    next.content.identity.name = "Newest name";
    writeDemoState(next);
    expect(storageHasFailed()).toBe(true);
    expect(env.data.size).toBe(1); // the old copy is still what is stored
    expect(readDemoState()?.content.identity.name).toBe("Newest name");
  });
});
