"use client"

import * as React from "react"

type Props = { style: "aurora" | "silk" | "grain" | "warp" | "orbs" | "rays" | "swirl" | "smoke"; colors: string[]; base: string; animate?: boolean; pace?: "slow" | "steady" | "expressive" }

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
      const fill = { style: { width: "100%", height: "100%" } }
      if (style === "warp") return <m.Warp {...fill} colors={colors} proportion={0.45} softness={1} distortion={0.25} swirl={0.8} swirlIterations={10} shape="checks" shapeScale={0.1} speed={speed} />
      if (style === "orbs") return <m.Metaballs {...fill} colorBack={base} colors={colors} count={6} size={0.8} speed={speed} />
      if (style === "rays") return <m.GodRays {...fill} colorBack={base} colorBloom={colors[0] ?? base} colors={colors} intensity={0.7} density={0.35} spotty={0.4} midSize={0.2} midIntensity={0.3} bloom={0.4} speed={speed} />
      if (style === "swirl") return <m.Swirl {...fill} colorBack={base} colors={colors} bandCount={4} twist={0.3} center={0.2} proportion={0.5} softness={0.8} noise={0.2} speed={speed} />
      if (style === "smoke") return <m.SmokeRing {...fill} colorBack={base} colors={colors} noiseScale={1.4} thickness={0.5} radius={0.45} innerShape={0.7} noiseIterations={6} speed={speed} />
      const silk = style === "silk"
      return <m.MeshGradient style={{ width: "100%", height: "100%" }} colors={colors} distortion={silk ? 0.55 : 0.9} swirl={silk ? 0.5 : 0.18} grainMixer={silk ? 0 : 0.08} grainOverlay={0.04} speed={speed} />
    },
  }
})

let supported: boolean | undefined;
function webglAvailable() {
  if (supported !== undefined) return supported;
  try {
    const c = document.createElement("canvas")
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    supported = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return supported;
  } catch {
    return false
  }
}

const noopSubscribe = () => () => {}
const reducedQuery = "(prefers-reduced-motion: reduce)"

export function ShaderWallpaper(props: Props) {
  // Both values only exist in the browser, so the server (and first hydration pass) renders nothing here.
  const on = React.useSyncExternalStore(noopSubscribe, webglAvailable, () => false)
  const reduced = React.useSyncExternalStore(
    (cb) => { const mq = window.matchMedia(reducedQuery); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb) },
    () => window.matchMedia(reducedQuery).matches,
    () => true,
  )
  const host = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); if (visible) setSeen(true); sync(); });
    observer.observe(el); document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return (
    <div ref={host} className="tp-shader" aria-hidden="true" data-active={active && !reduced && props.animate !== false}>
      <React.Suspense fallback={null}>
        {on && seen ? <Shader {...props} speed={reduced || !active || props.animate === false ? 0 : ({slow:0.35,steady:0.75,expressive:1.25}[props.pace??"steady"])} /> : null}
      </React.Suspense>
    </div>
  )
}
