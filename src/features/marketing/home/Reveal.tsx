"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** A one-time rise-and-fade when something scrolls into view. Skipped for reduced motion and when scripting is slow. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: "0px 0px -12% 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn("transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none", seen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100", className)}>{children}</div>
}
