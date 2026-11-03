"use client"
import "./design-thumb.css"
import "./setup.css"
import * as React from "react"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { businessContentSchema, type BusinessContentInput } from "@/features/businesses/content"
import { widgetsFor } from "@/features/showcase/lab-state"
import { applyRecipe, type Design } from "@/features/page/themes/designs"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { sampleContent, sampleScenario } from "./sample"

/**
 * A small, real render of a design: the same renderer as the page itself, scaled down, frozen, and fed a worked example of this kind
 * of business wearing the owner's own name and logo. It mounts only near the screen so a long shelf of designs stays light.
 */
export function DesignThumb({ design, industryKey, own, overrides, height = 560, real }: { design: Pick<Design, "id" | "recipe" | "overrides">; industryKey: string; own: BusinessContentInput; overrides?: StyleOverrides; height?: number; /** Show the owner's own content and sections instead of a worked example. */ real?: { widgets: import("@/features/page/contracts/page").PageDoc["widgets"] } }) {
  const host = React.useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const el = host.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) setVisible(true) }, { rootMargin: "240px" })
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])
  const vm = React.useMemo(() => {
    if (!visible) return null
    const parsed = businessContentSchema.safeParse(real ? own : sampleContent(industryKey, own))
    if (!parsed.success) return null
    const page = { schemaVersion: 2 as const, themeId: design.id, appearance: overrides ?? design.overrides, meta: { searchVisible: false, primaryAction: "auto" as const }, widgets: real ? applyRecipe(real.widgets, design.recipe) : applyRecipe(widgetsFor(sampleScenario(industryKey)), design.recipe), savedLooks: [], savedStyles: [] }
    return { ...buildPageViewModel(parsed.data, page, { plan: "business" }), showBranding: false }
  }, [visible, design, industryKey, own, overrides, real])
  const scale = width ? width / 390 : 0
  return (
    <span ref={host} className="sf-thumb" aria-hidden="true" style={{ height: scale ? Math.round(height * scale) : undefined, aspectRatio: scale ? undefined : `390 / ${height}` }}>
      {vm && scale ? (
        <span className="sf-thumb-inner" style={{ width: 390, height, transform: `scale(${scale})` }} inert>
          <PageRenderer vm={vm} still />
        </span>
      ) : null}
    </span>
  )
}
