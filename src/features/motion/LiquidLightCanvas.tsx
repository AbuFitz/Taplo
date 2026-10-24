"use client";
import * as React from "react";
import { ShaderMount } from "@paper-design/shaders";
import { liquidLightShader } from "./liquid-light-shader";

export default function LiquidLightCanvas({
  tone,
  contentSafe,
}: {
  tone: "light" | "dark";
  contentSafe: boolean;
}) {
  const shader = React.useRef<HTMLDivElement>(null);
  const mount = React.useRef<ShaderMount | null>(null);
  const uniforms = React.useMemo(
    () => ({
      u_pointer: [0.5, 0.4],
      u_energy: 0.35,
      u_light: tone === "light" ? 1 : 0,
      u_ceiling: contentSafe ? 0.22 : 0.97,
    }),
    [tone, contentSafe],
  );
  React.useEffect(() => {
    const el = shader.current;
    if (!el) return;
    const query = matchMedia("(max-width:1023px)");
    const budget = () =>
      mount.current?.setMaxPixelCount(query.matches ? 240000 : 650000);
    try {
      mount.current = new ShaderMount(
        el,
        liquidLightShader,
        uniforms,
        undefined,
        1,
        34000,
        1,
        query.matches ? 240000 : 650000,
      );
      el.dataset.renderer = "webgl";
    } catch {
      el.replaceChildren();
      el.dataset.renderer = "fallback";
    }
    const lost = (event: Event) => {
      event.preventDefault();
      mount.current?.dispose();
      mount.current = null;
      el.replaceChildren();
      el.dataset.renderer = "fallback";
    };
    el.addEventListener("webglcontextlost", lost, true);
    query.addEventListener("change", budget);
    return () => {
      query.removeEventListener("change", budget);
      el.removeEventListener("webglcontextlost", lost, true);
      mount.current?.dispose();
      mount.current = null;
    };
  }, [tone, uniforms]);
  return (
    <div ref={shader} className="size-full" data-testid="liquid-light-canvas" />
  );
}
