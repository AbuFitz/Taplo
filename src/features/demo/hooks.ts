"use client"

import { useCallback } from "react"
import type { BusinessContentInput } from "@/features/businesses/content"
import { resolveEntitlements } from "@/features/subscriptions/entitlements"
import { useDemo, type DemoState } from "./store"

/** Draft access for dashboard pages. Only call where the shell has guaranteed a business exists. */
export function useDraft() {
  const { ready, state, update } = useDemo()
  const setContent = useCallback(
    (fn: (c: BusinessContentInput) => BusinessContentInput) => update((x) => ({ ...x, content: fn(x.content) })),
    [update],
  )
  const patch = useCallback((fn: (s: DemoState) => DemoState) => update(fn), [update])
  const ent = state ? resolveEntitlements(state.plan, "active") : null
  return { ready, state, c: state?.content ?? null, ent, setContent, patch }
}
