"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
const Mesh = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false },
);
const COLOURS = ["#ffffff", "#e6e7e9", "#9b9da2", "#33363c", "#f5f5f6"];
const subscribe = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
class ShaderFallback extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
/** Decorative only. The static CSS field remains underneath if WebGL cannot mount. */
export function SetupAtmosphere() {
  const reduced = useReducedMotion();
  const visible = React.useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => false,
  );
  return (
    <div className="setup-atmosphere" aria-hidden="true">
      <ShaderFallback>
        <Mesh
          colors={COLOURS}
          width="100%"
          height="100%"
          distortion={0.45}
          swirl={0.15}
          grainMixer={0}
          grainOverlay={0.035}
          speed={reduced || !visible ? 0 : 0.08}
          frame={28000}
          scale={0.85}
          minPixelRatio={1}
          maxPixelCount={900000}
        />
      </ShaderFallback>
    </div>
  );
}
