"use client"

import { useCallback, useMemo } from "react"
import type { BusinessContent, BusinessContentInput } from "@/features/businesses/content"
import { newId } from "@/features/demo/actions"
import { parseContent, useDemo, type DemoState } from "@/features/demo/store"
import type { PageDoc } from "../contracts/page"
import type { WidgetType } from "../contracts/widgets"
import type { WidgetAppearance, StyleOverrides } from "../contracts/style"
import { buildPageViewModel, type PageViewModel } from "../renderer"
import { newWidget, newWidgetId, type StoredWidget } from "../starter"
import { getWidget } from "../widgets/registry"

export interface Editor {
  state: DemoState
  /** Entitlement-aware view of the draft (what the preview shows). Null until the business has a name. */
  vm: PageViewModel | null
  /** All business records, unfiltered by plan: what pickers offer. */
  records: BusinessContent | null
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  storageFailed: boolean
  setPage: (fn: (p: PageDoc) => PageDoc, coalesce?: string) => void
  setContent: (fn: (c: BusinessContentInput) => BusinessContentInput, coalesce?: string) => void
  setAppearance: (fn: (a: StyleOverrides) => StyleOverrides, coalesce?: string) => void
  setTheme: (id: string) => void
  addWidget: (type: WidgetType) => string
  updateWidget: (id: string, patch: { settings?: Record<string, unknown>; appearance?: WidgetAppearance | null; hidden?: boolean }) => void
  moveWidget: (id: string, dir: -1 | 1) => void
  reorderWidgets: (ids: string[]) => void
  duplicateWidget: (id: string) => string | null
  removeWidget: (id: string) => StoredWidget | null
  update: ReturnType<typeof useDemo>["update"]
}

export function useEditor(): Editor | null {
  const demo = useDemo()
  const { state, update } = demo

  const parsed = useMemo(() => (state ? parseContent(state.content) : null), [state])
  const records = parsed?.success ? parsed.data : null
  const vm = useMemo(() => {
    if (!state) return null
    // The editor works before a name exists: statuses are computed against a placeholder name.
    const base = parseContent(state.content).success ? state.content : { ...state.content, identity: { ...state.content.identity, name: state.content.identity.name || "Your business", slug: state.content.identity.slug || "your-page" } }
    const p = parseContent(base)
    return p.success ? buildPageViewModel(p.data, state.page, { plan: state.plan, themeOverride: state.page.themeId }) : null
  }, [state])

  const setPage = useCallback((fn: (p: PageDoc) => PageDoc, coalesce?: string) => update((s) => ({ ...s, page: fn(s.page) }), { coalesce }), [update])
  const setContent = useCallback((fn: (c: BusinessContentInput) => BusinessContentInput, coalesce?: string) => update((s) => ({ ...s, content: fn(s.content) }), { coalesce }), [update])
  const setAppearance = useCallback((fn: (a: StyleOverrides) => StyleOverrides, coalesce?: string) => setPage((p) => ({ ...p, appearance: fn(p.appearance) }), coalesce), [setPage])
  const setTheme = useCallback((id: string) => setPage((p) => ({ ...p, themeId: id })), [setPage])

  const addWidget = useCallback((type: WidgetType) => {
    const w = newWidget(type)
    setPage((p) => ({ ...p, widgets: [...p.widgets, w] }))
    return w.id
  }, [setPage])

  const updateWidget: Editor["updateWidget"] = useCallback((id, patch) => {
    setPage((p) => ({
      ...p,
      widgets: p.widgets.map((w) => (w.id !== id ? w : {
        ...w,
        hidden: patch.hidden ?? w.hidden,
        settings: patch.settings ? { ...w.settings, ...patch.settings } : w.settings,
        appearance: patch.appearance === null ? {} : patch.appearance ?? w.appearance,
      })),
    }), `w:${id}:${patch.settings ? Object.keys(patch.settings).join(",") : patch.appearance !== undefined ? "a" : "h"}`)
  }, [setPage])

  const moveWidget = useCallback((id: string, dir: -1 | 1) => setPage((p) => {
    const i = p.widgets.findIndex((w) => w.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= p.widgets.length) return p
    const next = [...p.widgets]
    ;[next[i], next[j]] = [next[j]!, next[i]!]
    return { ...p, widgets: next }
  }), [setPage])

  const reorderWidgets = useCallback((ids: string[]) => setPage((p) => {
    const by = new Map(p.widgets.map((w) => [w.id, w]))
    const next = ids.map((id) => by.get(id)).filter((w): w is StoredWidget => Boolean(w))
    return next.length === p.widgets.length ? { ...p, widgets: next } : p
  }), [setPage])

  const duplicateWidget = useCallback((id: string) => {
    let newId_: string | null = null
    setPage((p) => {
      const i = p.widgets.findIndex((w) => w.id === id)
      const src = p.widgets[i]
      if (!src || !getWidget(src.type)?.multiple) return p
      const copy: StoredWidget = { ...structuredClone(src), id: newWidgetId(src.type) }
      newId_ = copy.id
      const next = [...p.widgets]
      next.splice(i + 1, 0, copy)
      return { ...p, widgets: next }
    })
    return newId_
  }, [setPage])

  const removeWidget = useCallback((id: string) => {
    let removed: StoredWidget | null = null
    setPage((p) => {
      removed = p.widgets.find((w) => w.id === id) ?? null
      return { ...p, widgets: p.widgets.filter((w) => w.id !== id) }
    })
    return removed
  }, [setPage])

  if (!state) return null
  return {
    state, vm, records, canUndo: demo.canUndo, canRedo: demo.canRedo, undo: demo.undo, redo: demo.redo, storageFailed: demo.storageFailed,
    setPage, setContent, setAppearance, setTheme, addWidget, updateWidget, moveWidget, reorderWidgets, duplicateWidget, removeWidget, update,
  }
}

export { newId }
