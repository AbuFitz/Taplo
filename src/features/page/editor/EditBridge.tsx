"use client"

import * as React from "react"
import type { FromPreview, Selection, ToPreview } from "./selection"

/**
 * Runs inside the preview frame when it is opened for editing (`?edit=1`). Keyboard users select through the structure list instead. It never changes
 * what is rendered; it only reports clicks on the header or a widget to the editor and
 * highlights whatever the editor says is selected. Links and buttons are inert while editing
 * so a tap selects instead of navigating.
 */
export function EditBridge() {
  React.useEffect(() => {
    const doc = document
    const send = (m: FromPreview) => window.parent !== window && window.parent.postMessage(m, window.location.origin)

    const mark = (sel: Selection, inset = 0) => {
      doc.querySelectorAll("[data-tp-selected]").forEach((el) => el.removeAttribute("data-tp-selected"))
      const target =
        sel.kind === "widget" ? doc.querySelector(`[data-widget-id="${CSS.escape(sel.id)}"]`)
        : sel.kind === "header" ? doc.querySelector(".tp-header")
        : null
      if (target) {
        target.setAttribute("data-tp-selected", "")
        // Keep the selection inside the part of the screen a sheet leaves visible.
        const r = target.getBoundingClientRect()
        const visible = Math.max(120, window.innerHeight - inset)
        const margin = 16
        if (r.top < margin || r.bottom > visible - margin) {
          const wanted = r.height + margin * 2 > visible ? r.top - margin : r.top - (visible - r.height) / 2
          window.scrollBy({ top: wanted, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
        }
      }
    }

    const pick = (e: Event): Selection | null => {
      const el = e.target as Element | null
      const widget = el?.closest("[data-widget-id]")
      if (widget) return { kind: "widget", id: widget.getAttribute("data-widget-id")! }
      if (el?.closest(".tp-header")) return { kind: "header" }
      return null
    }
    let touchSelectAt = -1e9
    const choose = (e: Event) => {
      send({ type: "taplo:select", selection: pick(e) ?? { kind: "content" } })
    }
    const onClick = (e: MouseEvent) => {
      // The editor owns every click in the page while editing.
      e.preventDefault()
      e.stopPropagation()
      if (performance.now() - touchSelectAt < 400) return // the touch path below already handled this tap
      choose(e)
    }
    // iOS Safari does not always synthesise a click for a tap on content that is not itself interactive, so a still touch
    // is treated as a selection too; the click that may follow is ignored above.
    let down: { x: number; y: number; t: number } | null = null
    const onPointerDown = (e: PointerEvent) => { down = e.pointerType === "touch" ? { x: e.clientX, y: e.clientY, t: performance.now() } : null }
    const onPointerUp = (e: PointerEvent) => {
      const d = down; down = null
      if (!d || e.pointerType !== "touch") return
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10 || performance.now() - d.t > 600) return
      touchSelectAt = performance.now()
      choose(e)
    }
    const onMessage = (e: MessageEvent<ToPreview>) => {
      if (e.origin !== window.location.origin || e.data?.type !== "taplo:selected") return
      mark(e.data.selection, e.data.bottomInset ?? 0)
    }

    doc.documentElement.setAttribute("data-tp-editing", "")
    doc.addEventListener("click", onClick, true)
    doc.addEventListener("pointerdown", onPointerDown, true)
    doc.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("message", onMessage)
    send({ type: "taplo:ready" })
    return () => {
      doc.documentElement.removeAttribute("data-tp-editing")
      doc.removeEventListener("click", onClick, true)
      doc.removeEventListener("pointerdown", onPointerDown, true)
      doc.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("message", onMessage)
    }
  }, [])

  return null
}
