"use client"

import * as React from "react"
import { PagePreview } from "./PagePreview"

/** Read-only editor choices mount the real renderer only while near the visible control shelf. */
export function ChoicePreview({ src, title, height = 420 }: { src: string; title: string; height?: number }) {
  const host = React.useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const el = host.current
    if (!el) return
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { rootMargin: "80px" })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <span ref={host} aria-hidden="true" className="pointer-events-none relative block overflow-hidden bg-neutral-100" style={{ aspectRatio: `390 / ${height}` }}>
    {visible ? <PagePreview src={src} title={title} mode="device" device={{ w: 390, h: height }} interactive={false} /> : null}
  </span>
}
