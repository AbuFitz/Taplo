"use client";
import * as React from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The setup background: one soft grey mesh of light, the same on a computer and a phone. On a computer it surrounds the white
 * card; on a phone it sits behind the handset at the top, with the form on a solid sheet below. It drifts slowly, stands still
 * for visitors who prefer less motion, and falls back to a plain CSS gradient where WebGL is unavailable.
 */
const Field = React.lazy(async () => {
  const { MeshGradient } = await import("@paper-design/shaders-react");
  return {
    default: ({ moving, light }: { moving: boolean; light: boolean }) => (
      <MeshGradient width="100%" height="100%" colors={light ? ["#ffffff", "#d4d4d4", "#9a9a9a", "#f0f0f0"] : ["#050505", "#f5f5f5", "#777777", "#161616"]} distortion={light ? 0.9 : 0.85} swirl={light ? 0.45 : 0.4} grainMixer={0.06} grainOverlay={0.04} speed={moving ? 0.38 : 0} minPixelRatio={1} maxPixelCount={light ? 220000 : 380000} />
    ),
  };
});


export function SetupBackdrop({ phase = 0 }: { phase?: number }) {
  const reduced = useReducedMotion();
  // One backdrop on every screen size: the phone layout shows the same moving field as the desktop one.
  const light = false;
  const [webgl, setWebgl] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    let ok = false;
    try { const c = document.createElement("canvas"); const gl = c.getContext("webgl2"); ok = Boolean(gl); gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch { /* the CSS gradient stays */ }
    const sync = () => setVisible(!document.hidden);
    const t = window.setTimeout(() => setWebgl(ok), 0);
    document.addEventListener("visibilitychange", sync);
    return () => { window.clearTimeout(t); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return (
    <div className="setup-backdrop" aria-hidden="true" data-testid="setup-backdrop" data-reduced-motion={reduced} data-phase={phase} data-tone={light ? "light" : "dark"}>
      {/* Where WebGL is missing (or before it starts) the same mood is made of slow drifting light, so the backdrop is never a flat card of grey. */}
      <span className="setup-aurora" data-moving={!reduced && visible} aria-hidden="true"><i /><i /><i /><i /></span>
      {webgl && !reduced ? <React.Suspense fallback={null}><Field moving={visible} light={light} /></React.Suspense> : null}
    </div>
  );
}
