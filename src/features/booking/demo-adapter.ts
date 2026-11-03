"use client"

import * as React from "react"
import { emptyState, expirePending, type BookingState } from "./engine"
import { schedulingConfig, type SchedulingConfig } from "./types"

/**
 * The demo booking adapter: the same engine, backed by the browser's localStorage (per business slug) so a
 * booking made on a page preview shows up in that owner's calendar. It is clearly a demo: nothing is sent to a
 * server, no email or SMS goes out, and the connected path (Supabase RPCs, see supabase/migrations) is separate.
 */

const KEY = (slug: string) => `taplo.demo.bookings.v1:${slug}`
const CFG = (slug: string) => `taplo.demo.scheduling.v1:${slug}`
const EVENT = "taplo:booking-change"

const cache = new Map<string, { raw: string | null; state: BookingState }>()

export function readState(slug: string): BookingState {
  if (typeof window === "undefined") return emptyState()
  let raw: string | null = null
  try { raw = window.localStorage.getItem(KEY(slug)) } catch { return emptyState() }
  const hit = cache.get(slug)
  if (hit && hit.raw === raw) return hit.state
  let state = emptyState()
  try { if (raw) { const p = JSON.parse(raw) as Partial<BookingState>; state = { bookings: p.bookings ?? [], holds: p.holds ?? [], enquiries: p.enquiries ?? [] } } } catch { /* corrupt: start clean */ }
  cache.set(slug, { raw, state })
  return state
}

export function writeState(slug: string, state: BookingState): boolean {
  try {
    const raw = JSON.stringify(state)
    window.localStorage.setItem(KEY(slug), raw)
    cache.set(slug, { raw, state })
    window.dispatchEvent(new Event(EVENT))
    return true
  } catch { return false }
}

export function readConfig(slug: string): SchedulingConfig | null {
  if (typeof window === "undefined") return null
  try { const raw = window.localStorage.getItem(CFG(slug)); return raw ? schedulingConfig.parse(JSON.parse(raw)) : null } catch { return null }
}
export function writeConfig(slug: string, config: SchedulingConfig) {
  try { window.localStorage.setItem(CFG(slug), JSON.stringify(config)); window.dispatchEvent(new Event(EVENT)) } catch { /* storage full or blocked */ }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb)
  window.addEventListener(EVENT, cb)
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(EVENT, cb) }
}

/** Live booking state for a business. Expired holds and unanswered requests are swept on read. */
export function useBookingState(slug: string): { state: BookingState; update: (fn: (s: BookingState) => BookingState) => boolean } {
  const state = React.useSyncExternalStore(subscribe, () => readState(slug), () => EMPTY)
  const update = React.useCallback((fn: (s: BookingState) => BookingState) => {
    const next = expirePending(fn(readState(slug)), Date.now())
    return writeState(slug, next)
  }, [slug])
  return { state, update }
}
const EMPTY = emptyState()

export function useSchedulingConfig(slug: string, fallback: SchedulingConfig): SchedulingConfig {
  const raw = React.useSyncExternalStore(subscribe, () => { try { return window.localStorage.getItem(CFG(slug)) } catch { return null } }, () => null)
  return React.useMemo(() => { try { return raw ? schedulingConfig.parse(JSON.parse(raw)) : fallback } catch { return fallback } }, [raw, fallback])
}

export const newId = (p = "bk") => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
export const newKey = () => `idem_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
export const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("")
