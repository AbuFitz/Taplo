"use client";
import * as React from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LiquidLight } from "@/features/motion/LiquidLight";

export function SetupBackdrop({ phase=0 }: { phase?:number }) {
  const reduced=useReducedMotion();
  const [mobile,setMobile]=React.useState(false);
  React.useEffect(()=>{const query=matchMedia("(max-width:1023px)");const sync=()=>setMobile(query.matches);sync();query.addEventListener("change",sync);return()=>query.removeEventListener("change",sync);},[]);
  return <div className="setup-backdrop setup-reactive-backdrop" data-testid="setup-backdrop" data-reduced-motion={reduced} data-phase={phase} data-tone={mobile?"light":"dark"}>
    <LiquidLight tone={mobile?"light":"dark"} phase={phase} contrast="ambient" sourceSelector=".setup-scene" />
  </div>;
}
