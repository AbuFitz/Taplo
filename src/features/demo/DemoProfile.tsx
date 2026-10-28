"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { EditBridge } from "@/features/page/editor/EditBridge"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { parseContent, useDemo } from "./store"
import type { StyleSpec } from "@/features/page/contracts/style"
import { getWidget } from "@/features/page/widgets/registry"
import { withExamples } from "./examples"
import { previewAppearance, previewWidgetStyle, previewSectionTreatment } from "@/features/page/preview-appearance"

/**
 * Renders the draft ("preview") or the frozen published copy through the SAME
 * PageRenderer/view-model the real public route and fixture routes use.
 */
export function DemoProfile({ mode, slug, editing = false, headerLayout, widgetId, variant, lookId, savedLookId, savedStyleId, treatmentId }: { mode: "draft" | "published"; slug?: string; editing?: boolean; headerLayout?: StyleSpec["header"]["layout"]; widgetId?: string; variant?: string; lookId?: string; savedLookId?: string; savedStyleId?: string; treatmentId?: string }) {
  const { ready, state } = useDemo()
  const source = useMemo(() => {
    if (!state) return null
    if (mode === "draft") return { content: state.content, page: state.page, plan: state.plan }
    const p = state.published
    return p && p.content.identity.slug === slug ? { content: p.content, page: p.page, plan: p.plan } : null
  }, [state, mode, slug])

  const vm = useMemo(() => {
    if (!source) return null
    // A draft in progress may not have every required field yet; the preview fills gaps with neutral placeholders (publishing still requires the real values).
    const id = source.content.identity
    const content = mode === "draft" ? { ...source.content, identity: { ...id, name: id.name || "Your business name", industryKey: id.industryKey || "other", industryLabel: id.industryLabel || "Your business", slug: id.slug || "your-page" } } : source.content
    const parsed = parseContent(mode === "draft" && state?.showExamples !== false ? withExamples(content) : content)
    if (!parsed.success || !parsed.data.identity.name) return null
    let page = mode === "draft" ? previewAppearance(source.page, { lookId, savedLookId }) : source.page
    if (mode === "draft" && treatmentId) page = previewSectionTreatment(page, widgetId, treatmentId)
    if (mode === "draft" && savedStyleId) page = previewWidgetStyle(page, widgetId, savedStyleId)
    if (mode === "draft" && (headerLayout || widgetId)) {
      page = { ...page, appearance: { ...page.appearance, ...(headerLayout ? { header: { ...page.appearance.header, layout: headerLayout } } : {}), motion: "none" } }
      if (widgetId && variant) page = { ...page, widgets: page.widgets.map((w) => {
        const field = getWidget(w.type)?.fields.find((f) => f.kind === "select" && f.key === "variant")
        return w.id === widgetId && field?.kind === "select" && field.options.some((o) => o.value === variant) ? { ...w, settings: { ...w.settings, variant } } : w
      }) }
    }
    return buildPageViewModel(parsed.data, page, { plan: source.plan, draftAction: mode === "draft" && !state?.published })
  }, [source, mode, headerLayout, widgetId, variant, lookId, savedLookId, savedStyleId, treatmentId, state?.showExamples])

  if (!ready) return <Message title="Loading…" />
  if (!vm) {
    return mode === "draft" ? (
      <Message title="Your page appears here" body="Add a business name and it will start taking shape." />
    ) : (
      <Message
        title="Nothing published at this address"
        body="Pages you publish here live only in the browser that created them. For an example anyone can open, see the sample profiles."
        action={<span className="flex gap-4"><Link className="underline" href="/dashboard/page">My page</Link><Link className="underline" href="/demo/profiles">Sample profiles</Link></span>}
      />
    )
  }
  return (
    <>
      {mode === "published" ? (
        <div role="note" className="relative z-10 bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Your published page. It opens in this browser only; a public address needs publishing, which is not connected yet.
        </div>
      ) : null}
      <PageRenderer vm={vm} fragment={mode !== "draft" ? undefined : headerLayout ? { kind: "header" } : widgetId ? { kind: "widget", id: widgetId } : undefined} />
      {mode === "draft" ? <FocusBridge /> : null}
      {editing && !headerLayout && !widgetId && !lookId && !savedLookId ? <EditBridge /> : null}
    </>
  )
}

const FOCUS_TARGETS: Record<string, string> = {
  header: ".tp-header",
  actions: ".tp-primary-slot, .tp-actions",
  offer: '[data-widget="serviceList"], [data-widget="priceMenu"], [data-widget="products"], [data-widget="featuredService"], [data-widget="gallery"]',
  social: '[data-widget="social"]',
  booking: '[data-widget="booking"], .tp-primary-slot',
  gallery: '[data-widget="gallery"]',
  team: '[data-widget="team"]',
  hours: '[data-widget="hours"]',
}
/** Lets the setup flow ask the page to scroll a part of itself into view, smoothly, so the preview follows what is being edited. */
function FocusBridge() {
  useEffect(() => {
    if (window.parent === window) return
    const onMessage = (event: MessageEvent<{ type?: string; target?: string }>) => {
      if (event.origin !== window.location.origin || event.data?.type !== "taplo:focus") return
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const selector = event.data.target ? FOCUS_TARGETS[event.data.target] : undefined
      const el = selector ? document.querySelector<HTMLElement>(selector) : null
      const top = el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - 56) : 0
      window.scrollTo({ top, behavior: calm ? "auto" : "smooth" })
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])
  return null
}

function Message({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      {body ? <p className="mt-2 text-sm text-neutral-600">{body}</p> : null}
      {action ? <div className="mt-4 text-sm">{action}</div> : null}
    </main>
  )
}
