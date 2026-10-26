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
      <MeshGradient width="100%" height="100%" colors={light ? ["#ffffff", "#d4d4d4", "#9a9a9a", "#f0f0f0"] : ["#050505", "#f5f5f5", "#777777", "#161616"]} distortion={light ? 0.75 : 0.65} swirl={light ? 0.3 : 0.18} grainMixer={0.08} grainOverlay={0.05} speed={moving ? 0.12 : 0} minPixelRatio={1} maxPixelCount={light ? 420000 : 650000} />
    ),
  };
});

const subscribe = (cb: () => void) => { const q = matchMedia("(max-width:1023px)"); q.addEventListener("change", cb); return () => q.removeEventListener("change", cb); };

export function SetupBackdrop({ phase = 0 }: { phase?: number }) {
  const reduced = useReducedMotion();
  const light = React.useSyncExternalStore(subscribe, () => matchMedia("(max-width:1023px)").matches, () => false);
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
      {webgl && !reduced ? <React.Suspense fallback={null}><Field moving={visible} light={light} /></React.Suspense> : null}
    </div>
  );
}
