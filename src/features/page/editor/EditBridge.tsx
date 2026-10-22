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

    const mark = (sel: Selection) => {
      doc.querySelectorAll("[data-tp-selected]").forEach((el) => el.removeAttribute("data-tp-selected"))
      const target =
        sel.kind === "widget" ? doc.querySelector(`[data-widget-id="${CSS.escape(sel.id)}"]`)
        : sel.kind === "header" ? doc.querySelector(".tp-header")
        : null
      if (target) {
        target.setAttribute("data-tp-selected", "")
        const r = target.getBoundingClientRect()
        if (r.top < 0 || r.bottom > window.innerHeight) target.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
      }
    }

    const pick = (e: Event): Selection | null => {
      const el = e.target as Element | null
      const widget = el?.closest("[data-widget-id]")
      if (widget) return { kind: "widget", id: widget.getAttribute("data-widget-id")! }
      if (el?.closest(".tp-header")) return { kind: "header" }
      return null
    }
    const onClick = (e: MouseEvent) => {
      // The editor owns every click in the page while editing.
      e.preventDefault()
      e.stopPropagation()
      send({ type: "taplo:select", selection: pick(e) ?? { kind: "page" } })
    }
    const onMessage = (e: MessageEvent<ToPreview>) => {
      if (e.origin !== window.location.origin || e.data?.type !== "taplo:selected") return
      mark(e.data.selection)
    }

    doc.documentElement.setAttribute("data-tp-editing", "")
    doc.addEventListener("click", onClick, true)
    window.addEventListener("message", onMessage)
    send({ type: "taplo:ready" })
    return () => {
      doc.documentElement.removeAttribute("data-tp-editing")
      doc.removeEventListener("click", onClick, true)
      window.removeEventListener("message", onMessage)
    }
  }, [])

  return null
}
