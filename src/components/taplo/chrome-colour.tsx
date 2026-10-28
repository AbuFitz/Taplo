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
      if (owner || document.querySelector(".setup-flow")) return
      let colour = ""
      for (const el of document.elementsFromPoint(Math.round(innerWidth / 2), 2)) {
        const bg = getComputedStyle(el).backgroundColor
        if (opaque(bg)) { colour = bg; break }
      }
      if (!colour) colour = getComputedStyle(document.body).backgroundColor
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
