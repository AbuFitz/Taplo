"use client";
import * as React from "react";
import { ShaderMount } from "@paper-design/shaders";
import { useMotionValue, useSpring } from "motion/react";
import { liquidLightShader } from "./liquid-light-shader";

export default function LiquidLightCanvas({ tone, phase, source, contentSafe }: { tone: "light" | "dark"; phase: number; source: HTMLElement; contentSafe:boolean }) {
  const shader = React.useRef<HTMLDivElement>(null);
  const mount = React.useRef<ShaderMount|null>(null);
  const px = useMotionValue(.5), py = useMotionValue(.4), activity = useMotionValue(0);
  const x = useSpring(px, { stiffness:110, damping:23 });
  const y = useSpring(py, { stiffness:110, damping:23 });
  const energy = useSpring(activity, { stiffness:85, damping:20 });
  const uniforms = React.useMemo(() => ({ u_pointer:[.5,.4], u_energy:0, u_light:tone === "light" ? 1 : 0, u_ceiling:contentSafe ? .22 : .97 }), [tone,contentSafe]);
  React.useEffect(() => {
    const el=shader.current;if(!el)return;
    const query=matchMedia("(max-width:1023px)");
    const budget=()=>mount.current?.setMaxPixelCount(query.matches?240000:650000);
    try {
      mount.current=new ShaderMount(el,liquidLightShader,uniforms,undefined,1,34000,1,query.matches ? 240000 : 650000);
      el.dataset.renderer="webgl";
    } catch {
      el.replaceChildren();el.dataset.renderer="fallback";
    }
    const lost=(event:Event)=>{event.preventDefault();mount.current?.dispose();mount.current=null;el.replaceChildren();el.dataset.renderer="fallback";};
    el.addEventListener("webglcontextlost",lost,true);query.addEventListener("change",budget);
    return ()=>{query.removeEventListener("change",budget);el.removeEventListener("webglcontextlost",lost,true);mount.current?.dispose();mount.current=null;};
  },[tone,uniforms]);
  React.useEffect(() => {
    const send = () => mount.current?.setUniforms({u_pointer:[x.get(),y.get()],u_energy:energy.get()});
    const off = [x.on("change",send),y.on("change",send),energy.on("change",send)];
    const locate = (clientX:number,clientY:number,power:number) => {
      const r=source.getBoundingClientRect();
      px.set(Math.max(0,Math.min(1,(clientX-r.left)/r.width)));
      py.set(Math.max(0,Math.min(1,(clientY-r.top)/r.height)));
      activity.set(power);
    };
    const move = (event:PointerEvent) => locate(event.clientX,event.clientY,event.pointerType === "mouse" ? .95 : .7);
    const leave = () => activity.set(0);
    const focus = (event:FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const r=event.target.getBoundingClientRect();locate(r.x+r.width/2,r.y+r.height/2,.75);
    };
    let typed=0;
    const input = () => { typed++;activity.set(typed%2 ? .95 : .5); };
    source.addEventListener("pointermove",move,{passive:true});source.addEventListener("pointerdown",move,{passive:true});
    source.addEventListener("pointerleave",leave);source.addEventListener("pointerup",leave);source.addEventListener("focusin",focus);source.addEventListener("focusout",leave);source.addEventListener("input",input);
    return () => { off.forEach(stop=>stop());source.removeEventListener("pointermove",move);source.removeEventListener("pointerdown",move);source.removeEventListener("pointerleave",leave);source.removeEventListener("pointerup",leave);source.removeEventListener("focusin",focus);source.removeEventListener("focusout",leave);source.removeEventListener("input",input); };
  }, [source,px,py,activity,x,y,energy]);
  React.useEffect(() => { px.set(.3+(phase%5)*.12);py.set(.25+(phase%3)*.16);activity.set(.55); },[phase,px,py,activity]);
  return <div ref={shader} className="size-full" data-testid="liquid-light-canvas" />;
}
