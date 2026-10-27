"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";
import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content";
import type { PageDoc } from "@/features/page/contracts/page";
import { fromLegacyConfig, migratePage } from "@/features/page/migrate";
import { newPage } from "@/features/page/starter";
import { PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";

/**
 * DEMO STORE. Everything lives in this browser's localStorage so the product can be
 * reviewed without auth or a backend. It is not a persistence layer for real data.
 * Undo/redo history is in memory (per tab) and resets on reload; the draft itself persists.
 */

const KEY = "taplo.demo.v2";
const LEGACY_KEY = "taplo.demo.v1";

export const ONBOARDING_STEPS = ["business", "industry", "goal", "reach", "contacts", "widgets", "plan", "publish"] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export interface DemoState {
  v: 2;
  step: OnboardingStep;
  onboarded: boolean;
  plan: PlanId;
  /** Business records. May be incomplete during onboarding (name can be empty). */
  content: BusinessContentInput;
  /** How the page looks and is arranged. Separate from the records above. */
  page: PageDoc;
  slugEdited: boolean;
  published: null | { at: string; version: number; content: BusinessContentInput; page: PageDoc; plan: PlanId };
  /** Plain-language notes for the owner (e.g. after an automatic upgrade). Dismissible. */
  notes?: string[];
  /** Incomplete form text survives back/reload, but never enters the public renderer until valid. */
  setupDrafts?: { reviewEdit?:boolean; goals?: ("book"|"call"|"message"|"browse"|"buy")[]; connections?: {email:string;phone:string;whatsapp:string;website:string;instagram:string;socials?:Record<string,string>}; planIntent?:PlanId; backgroundEdited?:boolean; services?: { id:string; name:string; price:string; minutes:string; priceMode?: "fixed"|"from"|"quote"|"free" }[]; record?: { kind:"vehicle"|"photo"|"product"; value:unknown } };
}

const stateSchema = z.object({
  v: z.literal(2),
  step: z.enum(ONBOARDING_STEPS),
  onboarded: z.boolean(),
  plan: z.enum(PLAN_IDS),
  content: z.unknown(),
  page: z.unknown(),
  slugEdited: z.boolean(),
  published: z.unknown().nullable(),
  notes: z.array(z.string()).optional(),
  setupDrafts: z.object({reviewEdit:z.boolean().optional(),goals:z.array(z.enum(["book","call","message","browse","buy"])).optional(),connections:z.object({email:z.string(),phone:z.string(),whatsapp:z.string(),website:z.string(),instagram:z.string(),socials:z.record(z.string(),z.string()).optional()}).optional(),planIntent:z.enum(PLAN_IDS).optional(),backgroundEdited:z.boolean().optional(),services:z.array(z.object({id:z.string(),name:z.string(),price:z.string(),minutes:z.string(),priceMode:z.enum(["fixed","from","quote","free"]).optional()})).optional(),record:z.object({kind:z.enum(["vehicle","photo","product"]),value:z.unknown()}).optional()}).optional(),
});

export function blankContent(): BusinessContentInput {
  return {
    identity: { name: "", slug: "", industryKey: "other", industryLabel: "" },
    location: { mode: "premises", timezone: "Europe/London" },
    contacts: { social: [] },
    credentials: [],
    hours: [],
    services: [],
    staff: [],
    gallery: [],
    testimonials: [],
    reviewLinks: [],
    faqs: [],
    caseStudies: [],
    products: [],
    offers: [],
    booking: { mode: "contact", onlineBookingReady: false },
  };
}

export function initialState(): DemoState {
  return {
    v: 2,
    step: "business",
    onboarded: false,
    plan: "business", // the review default shows every capability; switch in Settings to see gating
    content: blankContent(),
    // A name alone already reads as a designed page: type leads and nothing waits for a logo or photo.
    page: (() => { const p = newPage("other"); return { ...p, appearance: { ...p.appearance, header: { layout: "masthead" as const, align: "left" as const } } }; })(),
    slugEdited: false,
    published: null,
  };
}

export function parseContent(input: BusinessContentInput) {
  return businessContentSchema.safeParse(input);
}

// ---------------------------------------------------------------- external store plumbing
let cachedRaw: string | null | undefined;
let cachedState: DemoState | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function hydrate(parsed: z.infer<typeof stateSchema>): DemoState {
  const industry = (parsed.content as BusinessContentInput | undefined)?.identity?.industryKey ?? "other";
  const page = migratePage(parsed.page, industry).page;
  const pub = parsed.published as DemoState["published"];
  return {
    ...(parsed as unknown as DemoState),
    page,
    published: pub ? { ...pub, page: migratePage(pub.page, industry).page } : null,
  };
}

/** One-time upgrade from the first demo format: keep the owner's business records and choices. */
function migrateLegacy(): DemoState | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const old = JSON.parse(raw) as { step?: string; onboarded?: boolean; plan?: PlanId; content?: BusinessContentInput; config?: Record<string, unknown>; slugEdited?: boolean; published?: { at: string; version: number; content: BusinessContentInput; config: Record<string, unknown>; plan: PlanId } | null };
    if (!old.content) return null;
    const industry = old.content.identity?.industryKey ?? "other";
    const state: DemoState = {
      v: 2,
      step: "publish",
      onboarded: Boolean(old.onboarded),
      plan: old.plan ?? "business",
      content: old.content,
      page: fromLegacyConfig((old.config ?? {}) as never, industry),
      slugEdited: Boolean(old.slugEdited),
      notes: ["Your page was updated to the latest design system. Your content is unchanged and your colour and font choices were kept. Please check how it looks."],
      published: old.published ? { at: old.published.at, version: old.published.version, content: old.published.content, page: fromLegacyConfig((old.published.config ?? {}) as never, industry), plan: old.published.plan } : null,
    };
    window.localStorage.setItem(KEY, JSON.stringify(state));
    window.localStorage.removeItem(LEGACY_KEY);
    return state;
  } catch {
    return null;
  }
}

function read(): DemoState | null {
  // Storage refused the latest write (full/blocked) but may still hold the previous state: the
  // in-memory copy is newer and must win, otherwise the edit vanishes from every view.
  if (storageFailed && memoryNewer) return cachedState;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
    if (raw === null && cachedRaw === undefined) {
      const migrated = migrateLegacy();
      if (migrated) raw = window.localStorage.getItem(KEY);
    }
  } catch {
    return cachedState;
  }
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) return (cachedState = null);
  try {
    cachedState = hydrate(stateSchema.parse(JSON.parse(raw)));
  } catch {
    cachedState = null; // corrupted or unknown shape: start fresh rather than crash
  }
  return cachedState;
}

/** True when the browser refused to save (quota/blocked). The tab keeps working in memory. */
let storageFailed = false;
let memoryNewer = false;
export const storageHasFailed = () => storageFailed;

/**
 * When storage is blocked or full the other documents (the live preview iframe) cannot see a change
 * through the `storage` event, so the new state is also handed over directly. Without this the editor
 * and its preview silently diverge until the next reload.
 */
const CHANNEL = "taplo.demo.sync";
let channel: BroadcastChannel | null | undefined;
function bus() {
  if (channel !== undefined) return channel;
  try {
    channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL);
    channel?.addEventListener("message", (e: MessageEvent) => {
      if (!storageFailed && !e.data?.failed) return; // healthy storage: the storage event already covers this
      try {
        const next = e.data?.state ? hydrate(stateSchema.parse(e.data.state)) : null;
        cachedRaw = undefined;
        cachedState = next;
        storageFailed = true;
        memoryNewer = true;
        emit();
      } catch { /* ignore malformed message */ }
    });
  } catch { channel = null; }
  return channel;
}

function write(next: DemoState | null) {
  let failed = false;
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
    storageFailed = false;
    memoryNewer = false;
  } catch {
    failed = true;
    memoryNewer = true;
    storageFailed = true;
    cachedRaw = undefined;
    cachedState = next; // storage blocked or full: keep working in-memory for this tab
  }
  if (failed) { try { bus()?.postMessage({ failed: true, state: next }); } catch { /* too large to clone: nothing more to do */ } }
  emit();
}

// ---------------------------------------------------------------- undo / redo (in memory)
interface Snapshot { content: BusinessContentInput; page: PageDoc }
const MAX_HISTORY = 100;
let past: Snapshot[] = [];
let future: Snapshot[] = [];
let lastCoalesce: { key: string; at: number } | null = null;
let historyVersion = 0;
const snap = (s: DemoState): Snapshot => ({ content: structuredClone(s.content), page: structuredClone(s.page) });
const same = (a: Snapshot, b: Snapshot) => JSON.stringify(a) === JSON.stringify(b);

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb(); // fires in OTHER documents: how the preview iframe updates live
  };
  // A tab restored from the back/forward cache or woken from sleep may hold a stale render.
  const onWake = () => { if (document.visibilityState !== "hidden") cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", onWake);
  document.addEventListener("visibilitychange", onWake);
  bus();
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", onWake);
    document.removeEventListener("visibilitychange", onWake);
  };
}

const serverSnapshot = () => undefined;
const historySnapshot = () => historyVersion;

export interface UpdateOptions {
  /** Rapid edits with the same key (e.g. typing in one field) collapse into one undo step. */
  coalesce?: string;
  /** Wipe undo history first: used when a whole new document is loaded, which must not be undoable into a blank page. */
  resetHistory?: boolean;
}

/** `state` is undefined before hydration, null when nothing is stored yet. */
export function useDemo() {
  const state = useSyncExternalStore<DemoState | null | undefined>(subscribe, read, serverSnapshot);
  useSyncExternalStore(subscribe, historySnapshot, () => 0);
  const ready = state !== undefined;
  const update = useCallback((fn: (s: DemoState) => DemoState, opts: UpdateOptions = {}) => {
    const before = read() ?? initialState();
    const after = fn(before);
    if (opts.resetHistory) {
      past = [];
      future = [];
      lastCoalesce = null;
      historyVersion += 1;
      write(after);
      return;
    }
    const a = snap(before);
    const b = snap(after);
    if (!same(a, b)) {
      const now = Date.now();
      const merge = opts.coalesce && lastCoalesce && lastCoalesce.key === opts.coalesce && now - lastCoalesce.at < 1200;
      if (!merge) {
        past.push(a);
        if (past.length > MAX_HISTORY) past.shift();
      }
      lastCoalesce = opts.coalesce ? { key: opts.coalesce, at: now } : null;
      future = [];
      historyVersion += 1;
    }
    write(after);
  }, []);
  const undo = useCallback(() => {
    const cur = read();
    const prev = past.pop();
    if (!cur || !prev) return;
    future.push(snap(cur));
    lastCoalesce = null;
    historyVersion += 1;
    write({ ...cur, content: prev.content, page: prev.page });
  }, []);
  const redo = useCallback(() => {
    const cur = read();
    const next = future.pop();
    if (!cur || !next) return;
    past.push(snap(cur));
    lastCoalesce = null;
    historyVersion += 1;
    write({ ...cur, content: next.content, page: next.page });
  }, []);
  const reset = useCallback(() => {
    past = [];
    future = [];
    lastCoalesce = null;
    historyVersion += 1;
    write(null);
  }, []);
  return { ready, state: state ?? null, storageFailed: storageHasFailed(), update, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0, reset };
}

/** Non-React access to the same store (used by tests and by code outside components). */
export const readDemoState = () => read();
export const writeDemoState = (next: DemoState | null) => write(next);
