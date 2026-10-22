"use client"

import * as React from "react"

type Props = { style: "aurora" | "silk" | "grain"; colors: string[]; base: string }

/**
 * Optional animated wallpaper (Paper Shaders, Apache-2.0, pinned). The static colour fields in
 * the parent are always rendered underneath, so the page is complete before this mounts, with
 * reduced motion (the shader is frozen on its first frame), without WebGL, and in print.
 * The shader code is only downloaded for pages that choose a shader wallpaper.
 */
const Shader = React.lazy(async () => {
  const m = await import("@paper-design/shaders-react")
  return {
    default: function Inner({ style, colors, base, speed }: Props & { speed: number }) {
      if (style === "grain") return <m.GrainGradient style={{ width: "100%", height: "100%" }} colorBack={base} colors={colors} softness={0.9} intensity={0.45} noise={0.35} shape="wave" speed={speed} />
      const silk = style === "silk"
      return <m.MeshGradient style={{ width: "100%", height: "100%" }} colors={colors} distortion={silk ? 0.55 : 0.9} swirl={silk ? 0.5 : 0.18} grainMixer={silk ? 0 : 0.08} grainOverlay={0.04} speed={speed} />
    },
  }
})

function webglAvailable() {
  try {
    const c = document.createElement("canvas")
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"))
  } catch {
    return false
  }
}

export function ShaderWallpaper(props: Props) {
  const [on, setOn] = React.useState(false)
  const [reduced, setReduced] = React.useState(true)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    setOn(webglAvailable())
    return () => mq.removeEventListener("change", sync)
  }, [])
  if (!on) return null
  return (
    <div className="tp-shader" aria-hidden="true">
      <React.Suspense fallback={null}>
        <Shader {...props} speed={reduced ? 0 : 0.35} />
      </React.Suspense>
    </div>
  )
}
