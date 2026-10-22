"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";
import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content";
import { PLAN_IDS, type PlanId } from "@/features/subscriptions/plans";

/**
 * DEMO STORE. Everything lives in this browser's localStorage so the product can be
 * reviewed without auth or a backend. It is not a persistence layer and is never
 * used when demo mode is off.
 */

const KEY = "taplo.demo.v1";

export const ONBOARDING_STEPS = ["industry", "business", "contacts", "service", "review"] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const configSchema = z.object({
  layoutId: z.string(),
  layoutVersion: z.number(),
  tokenPresetId: z.string(),
  overrides: z.record(z.string(), z.string()).default({}),
});

export interface DemoState {
  v: 1;
  step: OnboardingStep;
  onboarded: boolean;
  plan: PlanId;
  /** Draft content. May be incomplete during onboarding (name can be empty). */
  content: BusinessContentInput;
  config: z.infer<typeof configSchema>;
  slugEdited: boolean;
  published: null | { at: string; version: number; content: BusinessContentInput; config: z.infer<typeof configSchema>; plan: PlanId };
}

const stateSchema = z.object({
  v: z.literal(1),
  step: z.enum(ONBOARDING_STEPS),
  onboarded: z.boolean(),
  plan: z.enum(PLAN_IDS),
  content: z.unknown(),
  config: configSchema,
  slugEdited: z.boolean(),
  published: z.unknown().nullable(),
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
    booking: { mode: "contact", onlineBookingReady: false },
  };
}

export function initialState(): DemoState {
  return {
    v: 1,
    step: "industry",
    onboarded: false,
    plan: "business", // the review default shows every capability; switch in Settings to see gating
    content: blankContent(),
    config: { layoutId: "general-v1", layoutVersion: 1, tokenPresetId: "general-balanced", overrides: {} },
    slugEdited: false,
    published: null,
  };
}

/** Preview/publish gate: only parseable content with a name can be rendered. */
export function parseContent(input: BusinessContentInput) {
  return businessContentSchema.safeParse(input);
}

// ---- external store plumbing (stable snapshots keyed by raw string) ----
let cachedRaw: string | null | undefined;
let cachedState: DemoState | null = null;
const listeners = new Set<() => void>();

function read(): DemoState | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cachedState;
  }
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) return (cachedState = null);
  try {
    const parsed = stateSchema.parse(JSON.parse(raw));
    cachedState = parsed as unknown as DemoState;
  } catch {
    cachedState = null; // corrupted or from an older shape: start fresh rather than crash
  }
  return cachedState;
}

function write(next: DemoState | null) {
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
  } catch {
    cachedRaw = undefined;
    cachedState = next; // storage blocked: keep working in-memory for this tab
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) cb(); // fires in OTHER documents, which is how the preview iframe updates live
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = () => undefined;

/** `state` is undefined before hydration, null when nothing is stored yet. */
export function useDemo() {
  const state = useSyncExternalStore<DemoState | null | undefined>(subscribe, read, serverSnapshot);
  const ready = state !== undefined;
  const current = state ?? null;
  const update = useCallback((fn: (s: DemoState) => DemoState) => {
    write(fn(read() ?? initialState()));
  }, []);
  const reset = useCallback(() => write(null), []);
  return { ready, state: current, update, reset };
}
