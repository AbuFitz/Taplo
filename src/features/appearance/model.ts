"use client"

import * as React from "react"
import type { StyleOverrides, StyleSpec } from "@/features/page/contracts/style"
import { CURRENT_LOOKS } from "@/features/page/themes/looks"
import { getTheme, THEMES, type ThemeDefinition } from "@/features/page/themes/catalogue"
import { resolveStyle, type ResolvedStyle } from "@/features/page/themes/resolve"
import type { FontKey } from "@/features/themes/contracts/tokens"

/**
 * The one appearance model. An appearance is a starting look (`themeId`, a complete
 * configuration of the engine) plus the owner's own changes on top (`overrides`).
 * The owner editor, guided setup and the public showcase all edit exactly this shape through
 * exactly these helpers; they differ only in where the values are stored and how history works.
 */
export interface AppearanceHost {
  themeId: string
  overrides: StyleOverrides
  /** Entitlement: whether the starting look may be switched on this plan. */
  canSwitchLook: boolean
  /** Apply a change to the overrides. Edits that share a `coalesce` key collapse into one history step. */
  apply: (fn: (o: StyleOverrides) => StyleOverrides, coalesce?: string) => void
  /** Replace the starting look and the overrides together as one history step. */
  setAppearance: (themeId: string, overrides: StyleOverrides) => void
  notify?: (message: string, undoable?: boolean) => void
  /** Owner-created reusable looks, when the host can store them. */
  saved?: { items: { id: string; name: string; themeId?: string; overrides?: StyleOverrides; previewSrc?: string; active?: boolean }[]; limit?: number; save: (name: string) => void; apply: (id: string) => void; remove: (id: string) => void }
}

export type Group = "colors" | "text" | "header" | "buttons" | "cards" | "layout"

export interface AppearanceModel extends AppearanceHost {
  resolved: ResolvedStyle
  spec: StyleSpec
  look: ThemeDefinition
  looks: ThemeDefinition[]
  has: (g: Group, k: string) => boolean
  /** How many individual choices in these groups differ from the starting look. */
  count: (...parts: (Group | "background" | "decoration" | "motion")[]) => number
  reset: (g: Group, k: string) => void
  resetGroup: (...parts: (Group | "background" | "decoration" | "motion")[]) => void
  patch: (g: Group, k: string, v: unknown, coalesce?: string) => void
  setBackground: (b: StyleSpec["background"] | undefined, coalesce?: string) => void
  /** Changing the page colour also recolours a plain-colour wallpaper, so the two never disagree. */
  setPageColour: (hex: string) => void
  applyLook: (id: string) => void
  resetAll: () => void
  totalChanges: number
}

const keysOf = (o: StyleOverrides, g: Group) => Object.keys((o as Record<string, Record<string, unknown> | undefined>)[g] ?? {}).filter((k) => (o as Record<string, Record<string, unknown>>)[g]![k] !== undefined)

export function useAppearanceModel(host: AppearanceHost): AppearanceModel {
  const { themeId, overrides, apply, setAppearance, notify } = host
  const resolved = React.useMemo(() => resolveStyle(themeId, overrides), [themeId, overrides])
  const look = getTheme(resolved.theme.id) ?? THEMES[0]!

  return React.useMemo<AppearanceModel>(() => {
    const has: AppearanceModel["has"] = (g, k) => (overrides as Record<string, Record<string, unknown> | undefined>)[g]?.[k] !== undefined
    const count: AppearanceModel["count"] = (...parts) =>
      parts.reduce((n, p) => n + (p === "background" || p === "decoration" || p === "motion" ? (overrides[p] !== undefined ? 1 : 0) : keysOf(overrides, p).length), 0)
    const reset: AppearanceModel["reset"] = (g, k) =>
      apply((o) => {
        const grp = { ...((o as Record<string, Record<string, unknown>>)[g] ?? {}) }
        delete grp[k]
        const next = { ...o } as Record<string, unknown>
        if (Object.keys(grp).length) next[g] = grp
        else delete next[g]
        return next as StyleOverrides
      })
    const resetGroup: AppearanceModel["resetGroup"] = (...parts) =>
      apply((o) => {
        const next = { ...o } as Record<string, unknown>
        for (const p of parts) delete next[p]
        return next as StyleOverrides
      })
    const patch: AppearanceModel["patch"] = (g, k, v, coalesce) =>
      apply((o) => ({ ...o, [g]: { ...((o as Record<string, object>)[g] ?? {}), [k]: v } }) as StyleOverrides, coalesce ?? `${g}.${k}`)
    const setBackground: AppearanceModel["setBackground"] = (b, coalesce) =>
      apply((o) => {
        const n = { ...o }
        if (b) n.background = b
        else delete n.background
        return n
      }, coalesce ?? "background")
    const setPageColour: AppearanceModel["setPageColour"] = (hex) =>
      apply((o) => {
        const bg = o.background ?? (resolved.spec.background.kind === "solid" ? resolved.spec.background : undefined)
        return { ...o, colors: { ...o.colors, background: hex }, ...(bg?.kind === "solid" ? { background: { kind: "solid" as const, color: hex } } : {}) }
      }, "colors.background")
    const applyLook: AppearanceModel["applyLook"] = (id) => {
      const next = getTheme(id)
      if (!next) return
      const replaced = Object.keys(overrides).length > 0
      setAppearance(id, {})
      notify?.(replaced ? `${next.name} applied. Your earlier style changes were replaced.` : `${next.name} applied.`, true)
    }
    const totalChanges = (["colors", "text", "header", "buttons", "cards", "layout"] as Group[]).reduce((n, g) => n + keysOf(overrides, g).length, 0) + count("background", "decoration", "motion")
    return {
      ...host, resolved, spec: resolved.spec, look, looks: THEMES.filter(t => CURRENT_LOOKS.some(l => l.id === t.id) || t.id === look.id), has, count, reset, resetGroup, patch, setBackground, setPageColour, applyLook,
      resetAll: () => setAppearance(themeId, {}), totalChanges,
    }
  }, [host, resolved, look, overrides, themeId, apply, setAppearance, notify])
}

/** Curated pairings of the fonts owners can choose from. */
export const FONT_PAIRS: { id: string; label: string; heading: FontKey; body: FontKey }[] = [
  { id: "neutral", label: "Neutral", heading: "geist", body: "geist" },
  { id: "friendly", label: "Friendly", heading: "bricolage", body: "manrope" },
  { id: "technical", label: "Technical", heading: "spaceGrotesk", body: "geist" },
  { id: "strong", label: "Strong", heading: "barlowCondensed", body: "inter" },
  { id: "editorial", label: "Editorial", heading: "instrumentSerif", body: "geist" },
  { id: "warm", label: "Warm serif", heading: "fraunces", body: "inter" },
]

export const SHADER_DEFAULT_COLOURS = ["#4f3bd9", "#a02fb8", "#c92a63", "#17709f"]
