"use client";
import type { ReactNode } from "react";
import { LiquidLight } from "@/features/motion/LiquidLight";

/** Shared procedural light. The shader owns motion, pointer response and visibility scheduling. */
export function MonoField({ children,className="" }: { children:ReactNode;className?:string }) {
  const dark=/hero-stage|design-library|home-widget|booking-demo/.test(className);
  return <div className={`mono-field ${className}`} data-testid="mono-field"><LiquidLight tone={dark?"dark":"light"}/>{children}</div>;
}
