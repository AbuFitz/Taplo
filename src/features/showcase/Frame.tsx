"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { SCENARIOS, type Scenario } from "./content"
import { initialConfig, toContent, toPage, type LabConfig, type LabMessage } from "./lab-state"

/**
 * The page exactly as a visitor sees it (the same PageRenderer the real public route uses),
 * driven by the appearance lab. It sits in its own frame so phone and desktop widths trigger
 * genuine media queries.
 */
export function Frame() {
  const q = useSearchParams()
  const sc = (q.get("scenario") as Scenario) in SCENARIOS ? (q.get("scenario") as Scenario) : "barber"
  const [cfg, setCfg] = React.useState<LabConfig>(() => initialConfig(sc, q.get("look") ?? undefined))

  React.useEffect(() => {
    const onMessage = (e: MessageEvent<LabMessage>) => {
      if (e.origin !== window.location.origin || e.data?.type !== "taplo:lab") return
      setCfg({ scenario: e.data.scenario, themeId: e.data.themeId, overrides: e.data.overrides })
    }
    window.addEventListener("message", onMessage)
    if (window.parent !== window) window.parent.postMessage({ type: "taplo:lab-ready" }, window.location.origin)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const vm = React.useMemo(() => buildPageViewModel(toContent(cfg), toPage(cfg), { plan: "business" }), [cfg])
  return <PageRenderer vm={vm} />
}
