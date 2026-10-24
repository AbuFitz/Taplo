"use client";
import * as React from "react";
import "./liquid-light.css";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const Canvas = React.lazy(() => import("./LiquidLightCanvas"));
class ShaderBoundary extends React.Component<{ children:React.ReactNode },{ failed:boolean }> {
  state={failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A single shader/controller for setup and marketing. Input never waits on its decorative canvas. */
export function LiquidLight({ tone="dark", phase=0, sourceSelector,contrast="content" }: { tone?:"light"|"dark";phase?:number;sourceSelector?:string;contrast?:"content"|"ambient" }) {
  const host=React.useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const [source,setSource]=React.useState<HTMLElement|null>(null);
  const [available,setAvailable]=React.useState(false);
  const [active,setActive]=React.useState(false);
  React.useEffect(() => {
    const el=host.current;if(!el)return;
    setSource((sourceSelector ? el.closest<HTMLElement>(sourceSelector) : el.parentElement) ?? el);
    let supported=false;
    try { const probe=document.createElement("canvas");const gl=probe.getContext("webgl2");supported=Boolean(gl);gl?.getExtension("WEBGL_lose_context")?.loseContext(); } catch { /* The CSS field remains. */ }
    setAvailable(supported);
    let visible=false;
    const sync=()=>setActive(visible&&!document.hidden);
    const io=new IntersectionObserver(([entry])=>{visible=Boolean(entry?.isIntersecting);sync();},{threshold:.01});
    io.observe(el);document.addEventListener("visibilitychange",sync);
    return ()=>{io.disconnect();document.removeEventListener("visibilitychange",sync);};
  },[sourceSelector]);
  return <div ref={host} className="liquid-light" data-tone={tone} data-contrast={contrast} data-reduced-motion={reduced} data-active={active&&!reduced} aria-hidden="true">
    {available&&active&&!reduced&&source ? <ShaderBoundary><React.Suspense fallback={null}><Canvas tone={tone} phase={phase} source={source} contentSafe={contrast === "content"}/></React.Suspense></ShaderBoundary> : null}
  </div>;
}
