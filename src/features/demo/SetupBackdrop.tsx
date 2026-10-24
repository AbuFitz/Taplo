"use client"

import * as React from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { motion, useMotionValue, useSpring } from "motion/react"

// One bounded desktop shader. Mobile uses the lighter responsive CSS light field.
const Field = React.lazy(async () => {
  const { MeshGradient } = await import("@paper-design/shaders-react")
  return { default: ({ moving }: { moving: boolean }) => <MeshGradient width="100%" height="100%" colors={["#050505", "#f5f5f5", "#777777", "#161616"]} distortion={0.8} swirl={0.38} grainMixer={0.08} grainOverlay={0.055} speed={moving ? 0.4 : 0} minPixelRatio={1} maxPixelCount={650000} /> }
})

export function SetupBackdrop({ phase = 0 }: { phase?: number }) {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const px = useMotionValue(0), py = useMotionValue(0)
  const x = useSpring(px, { stiffness: 95, damping: 26 }), y = useSpring(py, { stiffness: 95, damping: 26 })
  React.useEffect(() => {
    const query = matchMedia("(min-width:1024px)")
    const sync = () => {
      let supported = false
      try { supported = Boolean(document.createElement("canvas").getContext("webgl2")) } catch { /* CSS field remains available. */ }
      setEnabled(query.matches && supported)
    }
    const visibility = () => setVisible(!document.hidden)
    sync(); query.addEventListener("change", sync); document.addEventListener("visibilitychange", visibility)
    return () => { query.removeEventListener("change", sync); document.removeEventListener("visibilitychange", visibility) }
  }, [])
  React.useEffect(() => {
    if (reduced || !enabled) return
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      px.set((event.clientX / innerWidth - 0.5) * 42)
      py.set((event.clientY / innerHeight - 0.5) * 42)
    }
    const reset = () => { px.set(0); py.set(0) }
    window.addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerleave", reset)
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", reset) }
  }, [enabled, reduced, px, py])
  return <div className="setup-backdrop" aria-hidden="true" data-testid="setup-backdrop" data-reduced-motion={reduced} data-moving={!reduced && visible} style={{ "--setup-phase": `${25 + phase * 9}%` } as React.CSSProperties}>
    <motion.div className="setup-backdrop-field" style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}>
      {enabled && !reduced && visible ? <React.Suspense fallback={null}><Field moving /></React.Suspense> : null}
    </motion.div>
  </div>
}
