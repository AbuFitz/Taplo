"use client"

import * as React from "react"
import { PortalContainerProvider } from "@/components/ui/portal-container"
import { cn } from "@/lib/utils"

/**
 * The scoped profile surface. Sets the --tp-* tokens as inline custom
 * properties (values are enum/hex validated upstream) and publishes its own
 * element so Radix portals render inside it and keep the theme.
 */
export function ThemeRoot({
  family,
  cssVars,
  className,
  attrs,
  children,
}: {
  family: string
  cssVars: Record<string, string>
  className?: string
  /** Finite data-* attributes used by CSS attribute selectors. */
  attrs?: Record<string, string>
  children: React.ReactNode
}) {
  const [el, setEl] = React.useState<HTMLElement | null>(null)
  // Safari paints the status/overscroll areas from the document, outside this
  // scoped surface. Keep them on the page colour, including after live edits.
  React.useEffect(() => {
    if (!el || family !== "page") return
    const doc = document
    const color = cssVars["--tp-background"]
    if (!color) return
    const html = doc.documentElement
    const before = { html: html.style.backgroundColor, body: doc.body.style.backgroundColor, scheme: html.style.colorScheme }
    let meta = doc.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const created = !meta
    if (!meta) { meta = doc.createElement("meta"); meta.name = "theme-color"; doc.head.append(meta) }
    const content = meta.content
    html.style.backgroundColor = color
    doc.body.style.backgroundColor = color
    html.style.colorScheme = attrs?.["data-tone"] === "dark" ? "dark" : "light"
    meta.setAttribute("content", color)
    el.setAttribute("data-taplo-ready", "true")
    return () => {
      html.style.backgroundColor = before.html
      doc.body.style.backgroundColor = before.body
      html.style.colorScheme = before.scheme
      if (created) meta.remove()
      else meta.setAttribute("content", content)
    }
  }, [el, family, cssVars, attrs])
  return (
    <PortalContainerProvider value={el}>
      <div
        ref={setEl}
        data-taplo-theme=""
        data-taplo-page=""
        {...attrs}
        data-family={family}
        style={{ ...cssVars, backgroundColor: "var(--tp-background)" } as React.CSSProperties}
        className={cn("relative min-h-screen", className)}
      >
        {children}
      </div>
    </PortalContainerProvider>
  )
}
