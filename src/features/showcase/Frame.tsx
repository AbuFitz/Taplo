"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { styleOverridesSchema } from "@/features/page/contracts/style"
import { previewSectionTreatment } from "@/features/page/preview-appearance"
import { getWidget } from "@/features/page/widgets/registry"
import { SCENARIOS, type Scenario } from "./content"
import { initialConfig, toContent, toPage, type LabConfig, type LabMessage } from "./lab-state"

/**
 * The page exactly as a visitor sees it (the same PageRenderer the real public route uses),
 * driven by the appearance lab. It sits in its own frame so phone and desktop widths trigger
 * genuine media queries.
 */
export function Frame() {
  const q = useSearchParams()
  const sc = Object.hasOwn(SCENARIOS, q.get("scenario") ?? "") ? (q.get("scenario") as Scenario) : "barber"
  const [cfg, setCfg] = React.useState<LabConfig>(() => {
    const base = initialConfig(sc, q.get("look") ?? undefined)
    // `o` carries a URL-encoded JSON StyleOverrides, so marketing captures and shared links can pose any configuration of the engine.
    try { const raw = q.get("o"); if (raw) return { ...base, overrides: styleOverridesSchema.parse(JSON.parse(raw)) } } catch { /* an invalid pose falls back to the plain look */ }
    return q.get("logo") === "0" ? { ...base, overrides: { ...base.overrides, header: { ...base.overrides.header, avatarShape: "none" as const } } } : base
  })

  React.useEffect(() => {
    const onMessage = (e: MessageEvent<LabMessage>) => {
      if (e.origin !== window.location.origin || e.data?.type !== "taplo:lab") return
      setCfg({ scenario: e.data.scenario, themeId: e.data.themeId, overrides: e.data.overrides })
    }
    window.addEventListener("message", onMessage)
    if (window.parent !== window) window.parent.postMessage({ type: "taplo:lab-ready" }, window.location.origin)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const widgetType = q.get("widget")
  const variant = q.get("variant")
  const vm = React.useMemo(() => {
    let page = toPage(cfg)
    const poseId = page.widgets.find(w => w.type === widgetType)?.id
    page = previewSectionTreatment(page, poseId, q.get("treatment") ?? undefined)
    // Read-only variant poses use the same validated options as the editor, never owner storage or CSS imitation.
    const widgets = widgetType && variant ? page.widgets.map(w => {
      const field = getWidget(w.type)?.fields.find(f => f.kind === "select" && f.key === "variant")
      return w.type === widgetType && field?.kind === "select" && field.options.some(o => o.value === variant) ? { ...w, settings: { ...w.settings, variant } } : w
    }) : page.widgets
    const content = toContent(cfg)
    if (q.get("logo") === "0") content.identity = { ...content.identity, logo: undefined }
    return { ...buildPageViewModel(content, { ...page, widgets }, { plan: "business" }), showBranding: true }
  }, [cfg, widgetType, variant, q])
  const isolated = widgetType ? vm.widgets.find(w => w.type === widgetType) : undefined
  return <PageRenderer vm={vm} fragment={q.get("profile") ? {kind:"header"} : isolated ? { kind: "widget", id: isolated.id } : undefined} />
}
