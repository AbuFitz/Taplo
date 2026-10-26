"use client"
import { PagePreview } from "@/features/preview/PagePreview"
import type { StageView } from "./steps"

/** The live page in a handset. The camera glides between a close-up and the whole phone, and the page scrolls to what is being edited. */
export function Stage({ view, focus, caption }: { view: StageView; focus: string; caption?: string }) {
  return (
    <aside className="sf-stage" data-view={view} aria-label="Your page, live">
      <div className="sf-stage-inner">
        <PagePreview src="/demo/preview" title="Your page, live" mode="device" chrome cropDevice={view === "close"} maxScale={1.14} smooth focus={focus} resizeKey={view} testId="setup-live-page" />
      </div>
      {caption ? <p className="sf-stage-caption" key={caption} aria-live="polite">{caption}</p> : null}
    </aside>
  )
}
