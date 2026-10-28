"use client"
import * as React from "react"
import { usePathname } from "next/navigation"

/**
 * The browser paints a phone's status bar and overscroll from `theme-color`. Keep it on whatever the page itself paints at its top
 * edge, so a dark screen never has a white strip above it (and the reverse). Pages that own their colour (a business page, the setup
 * flow) set it themselves and are left alone.
 */
const opaque = (bg: string) => {
  const m = bg.match(/[\d.]+/g)
  return Boolean(m) && (m!.length === 3 || Number(m![3]) >= 0.98)
}

export function ChromeColour() {
  const pathname = usePathname()
  React.useEffect(() => {
    const html = document.documentElement
    let frame = 0
    const paint = () => {
      frame = 0
      const owner = [...document.querySelectorAll<HTMLElement>("[data-taplo-page]")].some((el) => el.getBoundingClientRect().width >= innerWidth * 0.95 && !el.closest(".phone-shell, .scaled-phone, [data-preview-mode]"))
      if (owner || document.querySelector(".setup-flow")) { document.getElementById("taplo-chrome-strip")?.remove(); return }
      let colour = "", image = "", box: DOMRect | null = null
      for (const el of document.elementsFromPoint(Math.round(innerWidth / 2), 2)) {
        const cs = getComputedStyle(el)
        if (cs.backgroundImage !== "none" && /gradient/.test(cs.backgroundImage) && !image) {
          image = cs.backgroundImage; box = el.getBoundingClientRect()
          const stop = image.match(/rgba?\([^)]*\)/)
          if (stop && !colour && opaque(stop[0])) colour = stop[0]
        }
        if (opaque(cs.backgroundColor)) { if (!colour) colour = cs.backgroundColor; break }
      }
      if (!colour) colour = getComputedStyle(document.body).backgroundColor
      // iOS tints its top bar from what is painted at the top edge, so a slim fixed strip carries the same colour or gradient.
      let strip = document.getElementById("taplo-chrome-strip")
      if (!strip) {
        strip = document.createElement("div"); strip.id = "taplo-chrome-strip"; strip.setAttribute("aria-hidden", "true")
        strip.style.cssText = "position:fixed;top:0;left:0;right:0;height:env(safe-area-inset-top,0px);pointer-events:none;z-index:2147483000"
        document.body.prepend(strip)
      }
      strip.style.backgroundColor = colour
      strip.style.backgroundImage = image || "none"
      if (image && box) { strip.style.backgroundSize = `${box.width}px ${box.height}px`; strip.style.backgroundPosition = `${box.left}px ${box.top}px`; strip.style.backgroundRepeat = "no-repeat" }
      document.body.style.backgroundColor = colour
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.append(meta) }
      if (meta.content !== colour) meta.setAttribute("content", colour)
      if (html.style.backgroundColor !== colour) html.style.backgroundColor = colour
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(paint) }
    const settle = window.setTimeout(queue, 120)
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    queue()
    return () => { window.clearTimeout(settle); if (frame) cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue) }
  }, [pathname])
  return null
}
