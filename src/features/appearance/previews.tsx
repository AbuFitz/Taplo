"use client"

import * as React from "react"
import type { StyleOverrides, StyleSpec } from "@/features/page/contracts/style"
import { FONT_STACKS } from "@/features/page/themes/fonts"
import { shaderFallbackCss } from "@/features/page/themes/resolve"
import type { FontKey } from "@/features/themes/contracts/tokens"

type Colors = NonNullable<StyleOverrides["colors"]>
const box = "grid h-14 w-full place-items-center"

export function backgroundPreview(bg: StyleSpec["background"] | undefined, fallback: string): string {
  if (!bg) return fallback
  if (bg.kind === "solid") return bg.color
  if (bg.kind === "gradient") return `linear-gradient(${bg.angle}deg, ${bg.from}, ${bg.to})`
  if (bg.kind === "shader") return shaderFallbackCss(bg)
  return bg.fallback
}

export function LookTile({ o }: { o: StyleOverrides }) {
  const c = o.colors!
  const heading = FONT_STACKS[(o.text?.headingFont ?? "inter") as FontKey]
  const pill = o.buttons?.shape === "square" ? 2 : o.buttons?.shape === "pill" ? 99 : 6
  return (
    <span className="relative block h-[4.75rem] w-full overflow-hidden" style={{ background: backgroundPreview(o.background, c.background ?? "#fff") }}>
      <span className="absolute left-2.5 top-2 text-[1.125rem] leading-none" style={{ fontFamily: heading, color: c.text, fontWeight: o.text?.headingWeight === "bold" ? 700 : 400 }}>Aa</span>
      <span className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1.5 rounded-md px-1.5 py-1" style={{ background: o.cards?.surface === "glass" ? "rgb(255 255 255 / 0.16)" : c.surface, boxShadow: "0 1px 2px rgb(0 0 0 / 0.12)", borderRadius: o.cards?.radius === "xl" ? 10 : 6 }}>
        <span className="h-1 flex-1 rounded-full" style={{ background: c.muted, opacity: 0.6 }} />
        <span className="h-2.5 w-7" style={{ background: c.accent, borderRadius: pill }} />
      </span>
    </span>
  )
}

export function PaletteTile({ colors }: { colors: Colors }) {
  return (
    <span className="flex h-12 w-full overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]">
      {[colors.background, colors.surface, colors.text, colors.accent, colors.border].map((c, i) => <span key={i} className="flex-1" style={{ background: c }} />)}
    </span>
  )
}

export function FontTile({ heading, body, ink = "#171717" }: { heading: FontKey; body: FontKey; ink?: string }) {
  return (
    <span className={cn2(box, "h-[3.75rem] bg-[#f4f2ee] px-2")}>
      <span className="text-[1.375rem] leading-none" style={{ fontFamily: FONT_STACKS[heading], color: ink }}>Aa</span>
      <span className="mt-0.5 text-[0.625rem] leading-none text-neutral-500" style={{ fontFamily: FONT_STACKS[body] }}>Good hair days</span>
    </span>
  )
}

export function HeaderTile({ layout }: { layout: StyleSpec["header"]["layout"] }) {
  const ink = "#171717"
  const soft = "#c9c5bd"
  const body = (x: number, y: number, w = 28, center = false) => (
    <g>
      <rect x={center ? 32 - w / 2 : x} y={y} width={w} height="4" rx="2" fill={ink} />
      <rect x={center ? 32 - (w - 6) / 2 : x} y={y + 7} width={w - 6} height="2.5" rx="1.25" fill={soft} />
      <rect x={center ? 32 - 13 : x} y={y + 14} width="12" height="5" rx="2.5" fill={ink} />
      <rect x={center ? 32 + 1 : x + 14} y={y + 14} width="12" height="5" rx="2.5" fill={soft} />
    </g>
  )
  return (
    <svg viewBox="0 0 64 56" className="h-14 w-full bg-[#f4f2ee]" aria-hidden="true">
      {layout === "centered" ? <><circle cx="32" cy="12" r="7" fill={ink} />{body(0, 24, 30, true)}</> : null}
      {layout === "cover" ? <><rect x="6" y="5" width="52" height="20" rx="3" fill={soft} /><circle cx="16" cy="25" r="6" fill={ink} stroke="#f4f2ee" strokeWidth="2" />{body(8, 34, 26)}</> : null}
      {layout === "side" ? <><circle cx="15" cy="16" r="7" fill={ink} /><rect x="26" y="11" width="28" height="4" rx="2" fill={ink} /><rect x="26" y="18" width="22" height="2.5" rx="1.25" fill={soft} /><rect x="9" y="32" width="12" height="5" rx="2.5" fill={ink} /><rect x="24" y="32" width="12" height="5" rx="2.5" fill={soft} /></> : null}
      {layout === "poster" ? <><defs><linearGradient id="hf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#f4f2ee" /><stop offset="0.55" stopColor="#f4f2ee" stopOpacity="0.2" /><stop offset="1" stopColor="#f4f2ee" stopOpacity="0" /></linearGradient></defs><rect x="0" y="0" width="64" height="40" fill="#8f8a80" /><rect x="0" y="0" width="64" height="40" fill="url(#hf)" /><rect x="8" y="30" width="30" height="5" rx="2.5" fill={ink} /><rect x="8" y="39" width="14" height="5" rx="2.5" fill={ink} /><rect x="24" y="39" width="14" height="5" rx="2.5" fill={soft} /></> : null}
      {layout === "feature" ? <><rect x="5" y="8" width="26" height="33" rx="3" fill="#8f8a80" /><rect x="36" y="13" width="23" height="5" rx="2" fill={ink} /><rect x="36" y="23" width="20" height="3" rx="1" fill={soft} /><rect x="36" y="32" width="22" height="6" rx="2" fill={ink} /></> : null}
      {layout === "editorial" ? <>{body(7, 7, 45)}<rect x="7" y="32" width="50" height="19" rx="4" fill={soft} /></> : null}
      {layout === "banner" ? <><rect x="0" y="0" width="64" height="29" fill={soft} /><rect x="5" y="24" width="54" height="32" rx="6" fill="#f4f2ee" />{body(10, 30, 42)}</> : null}
      {layout === "minimal" ? <><rect x="9" y="14" width="40" height="7" rx="2" fill={ink} /><rect x="9" y="26" width="30" height="2.5" rx="1.25" fill={soft} /><rect x="9" y="34" width="46" height="1" fill={soft} /></> : null}
    </svg>
  )
}

export function ButtonTile({ fill, shape, accent = "#171717", on = "#ffffff" }: { fill: StyleSpec["buttons"]["fill"]; shape: StyleSpec["buttons"]["shape"]; accent?: string; on?: string }) {
  const radius = shape === "square" ? 2 : shape === "pill" ? 99 : 8
  const s: React.CSSProperties = fill === "solid" ? { background: accent, color: on } : fill === "outline" ? { border: `1.5px solid ${accent}`, color: accent } : { background: `color-mix(in srgb, ${accent} 16%, #fff)`, color: accent }
  return (
    <span className={cn2(box, "bg-[#f4f2ee]")}>
      <span className="grid h-7 w-[4.5rem] place-items-center text-[0.625rem] font-semibold" style={{ ...s, borderRadius: radius }}>Book</span>
    </span>
  )
}

export function SurfaceTile({ kind, accent }: { kind: StyleSpec["cards"]["surface"]; accent: string }) {
  const bg: React.CSSProperties =
    kind === "solid" ? { background: "#fff", boxShadow: "0 1px 2px rgb(0 0 0 / 0.1), 0 6px 14px -6px rgb(0 0 0 / 0.2)" }
    : kind === "glass" ? { background: "rgb(255 255 255 / 0.28)", border: "1px solid rgb(255 255 255 / 0.55)", backdropFilter: "blur(8px)" }
    : kind === "soft" ? { background: "rgb(0 0 0 / 0.055)" }
    : { border: "1px dashed rgb(0 0 0 / 0.25)" }
  return (
    <span className={cn2(box, "h-[3.75rem]")} style={{ background: kind === "glass" ? `linear-gradient(135deg, ${accent}, #7a5cff 60%, #1a7fb3)` : "#e8ecff" }}>
      <span className="grid h-9 w-[4.5rem] gap-1 rounded-lg p-1.5" style={bg}><span className="h-1 rounded-full bg-neutral-700/60" /><span className="h-1 w-2/3 rounded-full bg-neutral-500/40" /></span>
    </span>
  )
}

export function WallpaperTile({ css }: { css: string }) {
  return <span className="block h-12 w-full" style={{ background: css }} />
}

function cn2(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ")
}
