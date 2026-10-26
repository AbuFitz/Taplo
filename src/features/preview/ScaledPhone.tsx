"use client"

import * as React from "react"
import { PHONE, PhoneChrome } from "./PhoneChrome"

/**
 * The one handset, at any size. It is always the same 390 × 844 screen in the same hardware (the live preview, the setup
 * stage and every card in the gallery use it), scaled to the width it is given so type, fades and spacing match everywhere.
 */
export function ScaledPhone({ children, glow, className }: { children: React.ReactNode; glow?: string; className?: string }) {
  const host = React.useRef<HTMLSpanElement>(null)
  const [w, setW] = React.useState(0)
  const outerW = PHONE.width + PHONE.bezel * 2
  const outerH = PHONE.height + PHONE.bezel * 2
  React.useEffect(() => {
    const el = host.current
    if (!el) return
    const measure = () => setW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <span ref={host} className={`scaled-phone ${className ?? ""}`} style={{ aspectRatio: `${outerW} / ${outerH}`, ...(glow ? ({ "--glow": glow } as React.CSSProperties) : {}) }}>
      <span className="phone-shell scaled-phone-shell" style={{ width: outerW, height: outerH, padding: PHONE.bezel, transform: w ? `scale(${w / outerW})` : undefined, visibility: w ? "visible" : "hidden" }}>
        <span className="phone-screen scaled-phone-screen" style={{ width: PHONE.width, height: PHONE.height }}>{children}</span>
        <PhoneChrome />
      </span>
    </span>
  )
}
