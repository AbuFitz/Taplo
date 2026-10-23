"use client"

import * as React from "react"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { newWidget } from "@/features/page/starter"
import { base } from "./data"
import { SURFACE_LOOK, storyById } from "./stories"

/** One story at its true size. Reports its height to the index so frames fit without scrolling. */
export function StoryFrame({ id }: { id: string }) {
  // Only the id crosses from the server: a story carries functions, which cannot be serialised into a client component.
  const story = storyById(id)!
  const vm = React.useMemo(() => {
    const content = (story.content ?? ((c) => c))(base(story.scenario))
    const page = {
      schemaVersion: 2 as const, themeId: SURFACE_LOOK[story.surface], appearance: story.appearance ?? {}, meta: { searchVisible: false, primaryAction: story.header ? ("auto" as const) : ("none" as const) },
      widgets: story.widgets.map((w, i) => ({ ...newWidget(w.type, w.settings ?? {}), id: `wb-${i}` })), savedLooks: [], savedStyles: [],
    }
    return buildPageViewModel(content, page, { plan: story.plan ?? "business" })
  }, [story])

  React.useEffect(() => {
    if (window.parent === window) return
    const send = () => window.parent.postMessage({ type: "wb-height", id: story.id, h: document.documentElement.scrollHeight }, window.location.origin)
    send()
    const ro = new ResizeObserver(send)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [story.id])

  return <div data-story={story.id}><PageRenderer vm={vm} bare={!story.header} /></div>
}
