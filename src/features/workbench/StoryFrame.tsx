"use client"

import * as React from "react"
import { PageRenderer } from "@/features/page/renderer"
import { getWidget } from "@/features/page/widgets/registry"
import { storyById } from "./stories"
import { buildStoryViewModel } from "./model"

/** One story at its true size. Reports its height to the index so frames fit without scrolling. */
export function StoryFrame({ id, origin }: { id: string; origin: string }) {
  // Only the id crosses from the server: a story carries functions, which cannot be serialised into a client component.
  const story = storyById(id)!
  const vm = React.useMemo(() => buildStoryViewModel(story, origin), [story, origin])
  const unavailable = vm.widgets.filter(w => w.status.state !== "ready")

  React.useEffect(() => {
    if (window.parent === window) return
    const send = () => window.parent.postMessage({ type: "wb-height", id: story.id, h: document.documentElement.scrollHeight }, window.location.origin)
    send()
    const ro = new ResizeObserver(send)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [story.id])

  return <div data-story={story.id}>
    {unavailable.length ? <aside aria-label="Actual section availability" className="m-4 rounded-xl border bg-neutral-50 p-4 text-sm text-neutral-900"><h2 className="font-semibold">Not shown on the public page</h2>{unavailable.map(w => <div key={w.id} data-testid="workbench-status" data-status={w.status.state} className="mt-3"><p className="font-medium">{getWidget(w.type)?.label}: {w.status.state}</p><p className="mt-1 leading-relaxed">{w.status.state !== "ready" ? w.status.reason : null}</p></div>)}</aside> : null}
    <PageRenderer vm={vm} bare={!story.header} />
  </div>
}
