"use client"

import * as React from "react"
import { useEditor } from "@/features/page/editor/useEditor"
import { buildContext, type BookingContext } from "../../model"
import { readConfig, useBookingState, useSchedulingConfig, writeConfig } from "../../demo-adapter"
import type { SchedulingConfig } from "../../types"

/** Everything the owner's scheduling screens need: the business, its people and services, the live bookings and the rules. */
export function useOwner() {
  const ed = useEditor()
  const records = ed?.records ?? null
  const slug = records?.identity.slug || "demo"
  const base = React.useMemo<BookingContext | null>(() => (records ? buildContext(records) : null), [records])
  const config = useSchedulingConfig(slug, base?.config ?? (undefined as never))
  const { state, update } = useBookingState(slug)
  const setConfig = React.useCallback((fn: (c: SchedulingConfig) => SchedulingConfig) => writeConfig(slug, fn(readConfig(slug) ?? base!.config)), [slug, base])
  const ctx = React.useMemo<BookingContext | null>(() => (base ? { ...base, config, timezone: config.timezone } : null), [base, config])
  return { ed, records, ctx, config, setConfig, state, update, slug }
}
