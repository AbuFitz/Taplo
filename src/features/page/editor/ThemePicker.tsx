"use client"

import * as React from "react"
import { initialsOf } from "@/lib/validation"
import { cn } from "@/lib/utils"
import { THEMES, type ThemeDefinition } from "../themes/catalogue"
import { FONT_STACKS } from "../themes/fonts"

/** A miniature of the theme: its real background, avatar shape, type and button construction. */
export function ThemeThumb({ theme }: { theme: ThemeDefinition }) {
  const s = theme.style
  const bg = s.background.kind === "gradient" ? `linear-gradient(${s.background.angle}deg, ${s.background.from}, ${s.background.to})` : s.background.kind === "solid" ? s.background.color : s.colors.background
  const radius = { none: 0, sm: 4, md: 8, lg: 12, xl: 16 }[s.cards.radius]
  const btnR = { square: 0, rounded: 8, pill: 999 }[s.buttons.shape]
  const btnBg = s.buttons.fill === "solid" ? s.colors.accent : s.buttons.fill === "soft" ? `color-mix(in srgb, ${s.colors.accent} 18%, ${s.colors.surface})` : "transparent"
  const btnColor = s.buttons.fill === "solid" ? s.colors.accentText : s.buttons.fill === "soft" ? s.colors.accent : s.colors.text
  const av = { circle: "999px", rounded: "10px", square: "2px", arch: "999px 999px 4px 4px", none: "0" }[s.header.avatarShape]
  const align = s.header.align === "center" ? "center" : "flex-start"
  const hard = s.buttons.shadow === "hard" ? `2px 2px 0 ${s.colors.text}` : s.buttons.shadow === "soft" ? "0 4px 8px -3px rgb(0 0 0 / .35)" : "none"
  return (
    <div aria-hidden="true" className="flex h-36 w-full flex-col gap-1.5 overflow-hidden rounded-lg p-2.5" style={{ background: bg, color: s.colors.text, alignItems: align, fontFamily: FONT_STACKS[s.text.bodyFont] }}>
      <div className="flex w-full flex-col gap-1" style={{ alignItems: align }}>
        {s.header.layout === "poster" || s.header.layout === "cover" ? <div className="h-6 w-full rounded-sm" style={{ background: `linear-gradient(135deg, ${s.colors.accent}, ${s.colors.surface})`, borderRadius: radius / 2 }} /> : null}
        <div className="flex items-center gap-1.5" style={{ flexDirection: s.header.layout === "side" ? "row" : "column", width: s.header.layout === "side" ? "100%" : undefined }}>
          {s.header.avatarShape !== "none" ? <div className="grid size-7 place-items-center text-[8px] font-bold" style={{ background: s.colors.surface, borderRadius: av, border: `1px solid ${s.colors.border}`, height: s.header.avatarShape === "arch" ? 34 : undefined, fontFamily: FONT_STACKS[s.text.headingFont] }}>{initialsOf("Your Name")}</div> : null}
          <div className="text-[11px] leading-tight" style={{ fontFamily: FONT_STACKS[s.text.headingFont], fontWeight: s.text.headingWeight === "bold" ? 700 : 500, textTransform: s.text.headingCase === "upper" ? "uppercase" : "none" }}>Your Business</div>
        </div>
      </div>
      <div className="mt-auto grid w-full gap-1">
        {[0, 1].map((i) => (
          <div key={i} className="h-4 w-full" style={{ background: i === 0 ? btnBg : s.cards.surface === "transparent" ? "transparent" : s.colors.surface, color: btnColor, borderRadius: i === 0 ? btnR : radius / 1.5, border: `${s.cards.border === "thick" || s.buttons.fill === "outline" ? 1.5 : 1}px solid ${i === 0 ? (s.buttons.fill === "outline" ? s.colors.accent : s.colors.accent) : s.colors.border}`, boxShadow: i === 0 ? hard : "none", opacity: s.cards.surface === "glass" && i === 1 ? 0.8 : 1 }} />
        ))}
      </div>
    </div>
  )
}


/** Visual theme gallery. Used in onboarding and in the Design tab. */
export function ThemePicker({ themeId, canSwitch, onPick, columns = "grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3" }: { themeId: string; canSwitch: boolean; onPick: (id: string) => void; columns?: string }) {
  return (
    <ul className={cn("grid", columns)} aria-label="Themes" data-testid="theme-gallery">
      {THEMES.map((t) => {
        const active = t.id === themeId
        const locked = !canSwitch && !active
        return (
          <li key={t.id}>
            <button type="button" disabled={locked} aria-pressed={active} data-theme-id={t.id} onClick={() => onPick(t.id)} className={cn("grid w-full gap-1.5 rounded-xl border p-1.5 text-left transition-colors enabled:hover:bg-muted disabled:opacity-50", active && "border-primary ring-2 ring-primary/40")}>
              <ThemeThumb theme={t} />
              <span className="px-1 pb-1"><span className="block text-sm font-semibold">{t.name}{active ? <span className="ml-1.5 text-[10px] font-medium uppercase text-primary">Current</span> : null}</span><span className="block text-[11px] leading-snug text-muted-foreground">{t.description}</span></span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
