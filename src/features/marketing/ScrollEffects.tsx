"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import "./scroll-effects.css"

/**
 * One plan for motion on the marketing site, so every page moves the same way:
 *
 *  - Content rises into place the first time it scrolls into view. Siblings follow one another (a short stagger), so a
 *    list or a row of cards arrives as one gesture rather than all at once.
 *  - Headings arrive a little slower and cleaner than body text; pictures settle from a slightly smaller size.
 *  - Distances, delays and durations scale with the screen (see scroll-effects.css): small on a phone, wider on a desktop.
 *  - Anything that already carries its own transform only fades, so rotated or layered compositions are never disturbed.
 *  - The navigation gains a shadow once the page has moved.
 *  - Nothing is hidden for visitors who ask for less motion, or when scripting fails: the content is only hidden after this
 *    runs, and it removes the hiding if it is torn down.
 *
 * Opt a region out with `data-no-fx`, add `data-fx` to anything else that should join in.
 */
const TARGETS = "main section :is(h2,h3), main section p, main section li, main section figure, main [data-fx]"
const SKIP = "[data-no-fx], nav, header, footer, iframe, .phone-shell, .hero-phone, [data-reveal]"

export function ScrollEffects() {
  const path = usePathname()
  React.useEffect(() => {
    const root = document.documentElement
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    let scrollRaf = 0
    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        if (window.scrollY > 24) root.setAttribute("data-scrolled", "")
        else root.removeAttribute("data-scrolled")
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    let io: IntersectionObserver | null = null
    let frame = 0
    if (!calm.matches && typeof IntersectionObserver !== "undefined") {
      frame = requestAnimationFrame(() => {
        const items: HTMLElement[] = []
        document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
          if (el.closest(SKIP) || el.parentElement?.closest("[data-reveal]")) return
          el.setAttribute("data-reveal", el.matches("h2,h3") ? "heading" : el.matches("figure") ? "figure" : getComputedStyle(el).transform !== "none" ? "fade" : "up")
          items.push(el)
        })
        // Stagger siblings that arrive together.
        const seen = new Map<Element, number>()
        items.forEach((el) => {
          const parent = el.parentElement!
          const i = seen.get(parent) ?? 0
          seen.set(parent, i + 1)
          el.style.setProperty("--fx-i", String(Math.min(i, 6)))
        })
        root.setAttribute("data-fx", "on")
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue
              ;(e.target as HTMLElement).setAttribute("data-in", "")
              io?.unobserve(e.target)
            }
          },
          { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
        )
        items.forEach((el) => io!.observe(el))
      })
    }
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(scrollRaf)
      window.removeEventListener("scroll", onScroll)
      io?.disconnect()
      root.removeAttribute("data-fx")
      root.removeAttribute("data-scrolled")
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.removeAttribute("data-reveal")
        el.removeAttribute("data-in")
        ;(el as HTMLElement).style.removeProperty("--fx-i")
      })
    }
  }, [path])
  return null
}
