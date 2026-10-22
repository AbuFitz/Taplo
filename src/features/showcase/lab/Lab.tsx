"use client"

import * as React from "react"
import { Redo2, RotateCcw, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColorField } from "@/features/page/editor/controls"
import type { StyleOverrides, StyleSpec } from "@/features/page/contracts/style"
import "@/features/page/themes/fonts"
import { resolveStyle } from "@/features/page/themes/resolve"
import { FONT_KEYS, type FontKey } from "@/features/themes/contracts/tokens"
import { SCENARIOS, type Scenario } from "../content"
import { BASE_THEME, lookById } from "../lab-state"
import { LOOKS, PALETTES } from "../looks"
import { ChoiceGrid, Section, Segment } from "./controls"
import { DesktopFrame, PhoneFrame, useFrames } from "./DeviceFrames"
import { ButtonTile, FontTile, HeaderTile, LookTile, PaletteTile, SurfaceTile, WallpaperTile, backgroundPreview } from "./previews"
import { useHistory } from "./useHistory"

type Group = "colors" | "text" | "header" | "buttons" | "cards" | "layout"
const PAIRS: { id: string; label: string; heading: FontKey; body: FontKey }[] = [
  { id: "editorial", label: "Editorial", heading: "instrumentSerif", body: "geist" },
  { id: "warm", label: "Warm serif", heading: "fraunces", body: "inter" },
  { id: "expressive", label: "Expressive", heading: "bricolage", body: "bricolage" },
  { id: "technical", label: "Technical", heading: "spaceGrotesk", body: "geist" },
  { id: "strong", label: "Strong", heading: "barlowCondensed", body: "inter" },
  { id: "neutral", label: "Neutral", heading: "geist", body: "geist" },
]
void FONT_KEYS

const SHADER_DEFAULT = ["#4f3bd9", "#a02fb8", "#c92a63", "#17709f"]

export function Lab() {
  const [scenario, setScenario] = React.useState<Scenario>("barber")
  const [lookId, setLookId] = React.useState("noir")
  const h = useHistory<StyleOverrides>(() => structuredClone(lookById("noir").overrides))
  const o = h.value
  const register = useFrames(scenario, o)
  const [device, setDevice] = React.useState<"phone" | "desktop">("phone")

  const resolved = React.useMemo(() => resolveStyle(BASE_THEME, o), [o])
  const spec = resolved.spec

  const patch = (g: Group, k: string, v: unknown, coalesce?: string) =>
    h.set((cur) => ({ ...cur, [g]: { ...((cur as Record<string, object>)[g] ?? {}), [k]: v } }) as StyleOverrides, coalesce ?? `${g}.${k}`)
  const setBackground = (b: StyleSpec["background"], coalesce?: string) => h.set((cur) => ({ ...cur, background: b }), coalesce ?? "bg")

  const applyLook = (id: string) => { setLookId(id); h.set(structuredClone(lookById(id).overrides)) }
  const look = lookById(lookId)
  const pristine = JSON.stringify(o) === JSON.stringify(look.overrides)

  // Colour edits keep a plain page colour and the colour role in step.
  const setPageColour = (hex: string) => h.set((cur) => ({ ...cur, colors: { ...cur.colors, background: hex }, background: cur.background?.kind === "solid" ? { kind: "solid", color: hex } : cur.background }), "colors.background")

  const bg = spec.background
  const palette = PALETTES.find((p) => (Object.keys(p.colors) as (keyof typeof p.colors)[]).every((k) => p.colors[k] === spec.colors[k]))
  const wallKind: "solid" | "gradient" | "aurora" | "silk" | "grain" = bg.kind === "shader" ? bg.style : bg.kind === "gradient" ? "gradient" : "solid"
  const shaderColours = bg.kind === "shader" ? bg.colors : SHADER_DEFAULT
  const base = spec.colors.background
  const wallpaper = (k: typeof wallKind) => {
    if (k === "solid") setBackground({ kind: "solid", color: base })
    else if (k === "gradient") setBackground({ kind: "gradient", from: base, to: spec.colors.accent, angle: 160, motion: false })
    else setBackground({ kind: "shader", style: k, colors: shaderColours, base })
  }

  const frameSrc = (s: Scenario) => `/appearance/frame?scenario=${s}&look=${lookId}`
  const url = `taplo.co/${SCENARIOS[scenario].content.identity.slug}`
  const phone = <PhoneFrame register={register} src={frameSrc(scenario)} title="Mobile preview" />
  const desktop = <DesktopFrame register={register} src={frameSrc(scenario)} title="Desktop preview" url={url} />

  return (
    <div className="min-h-dvh bg-[#f4f2ee] text-neutral-900 antialiased" data-testid="appearance-lab">
      <header className="sticky top-0 z-30 border-b border-black/[0.08] bg-[#f4f2ee]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          <span className="text-[1.0625rem] font-semibold tracking-[-0.03em]">Taplo</span>
          <span className="hidden text-sm text-neutral-400 sm:inline">/</span>
          <h1 className="hidden text-sm font-medium sm:block">Appearance</h1>
          <div className="order-last w-full sm:order-none sm:ml-6 sm:mr-auto sm:w-52"><Segment label="Business" value={scenario} options={(Object.keys(SCENARIOS) as Scenario[]).map((s) => ({ value: s, label: SCENARIOS[s].label }))} onChange={setScenario} /></div>
          <div className="ml-auto flex items-center gap-1 sm:ml-0" role="toolbar" aria-label="History">
            <Button variant="ghost" size="icon" className="size-10" onClick={h.undo} disabled={!h.canUndo} aria-label="Undo" data-testid="lab-undo"><Undo2 /></Button>
            <Button variant="ghost" size="icon" className="size-10" onClick={h.redo} disabled={!h.canRedo} aria-label="Redo" data-testid="lab-redo"><Redo2 /></Button>
            <Button variant="outline" className="ml-1 h-10 rounded-full bg-white/70" onClick={() => h.set(structuredClone(look.overrides))} disabled={pristine} aria-label={`Reset to ${look.name}`} data-testid="lab-reset"><RotateCcw /><span className="hidden sm:inline">Reset to {look.name}</span></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[96rem] grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-[4.75rem]">
          <div className="mb-4 flex justify-center xl:hidden"><div className="w-56"><Segment label="Preview" value={device} options={[{ value: "phone", label: "Phone" }, { value: "desktop", label: "Desktop" }]} onChange={setDevice} /></div></div>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className={device === "phone" ? "block" : "hidden xl:block"}>{phone}</div>
            <div className={device === "desktop" ? "block" : "hidden xl:block"}>{desktop}</div>
          </div>
        </div>

        <aside aria-label="Appearance controls" className="rounded-[1.5rem] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(0_0_0/0.25)] lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto" data-testid="lab-controls">
          <Section title="Look" hint="A starting point. Everything below stays editable.">
            <ChoiceGrid label="Look" value={lookId} columns={2} onChange={applyLook} options={LOOKS.map((l) => ({ value: l.id, label: l.name, preview: <LookTile o={l.overrides} /> }))} />
          </Section>

          <Section title="Colour" hint="Palettes are coordinated sets (Radix Colors). Pick any colour to refine.">
            <ChoiceGrid label="Palette" value={palette?.id} columns={4} onChange={(id) => h.set((cur) => { const p = PALETTES.find((x) => x.id === id)!; return { ...cur, colors: { ...cur.colors, ...p.colors }, background: cur.background?.kind === "solid" ? { kind: "solid", color: p.colors.background ?? spec.colors.background } : cur.background } })} options={PALETTES.map((p) => ({ value: p.id, label: p.name, preview: <PaletteTile colors={p.colors} /> }))} />
            <div className="grid gap-3">
              <ColorField label="Page" value={spec.colors.background} onChange={setPageColour} />
              <ColorField label="Text" value={spec.colors.text} against={spec.colors.background} onChange={(v) => patch("colors", "text", v)} />
              <ColorField label="Accent" value={spec.colors.accent} onChange={(v) => patch("colors", "accent", v)} />
              <ColorField label="Cards" value={spec.colors.surface} onChange={(v) => patch("colors", "surface", v)} />
            </div>
            {resolved.notices.length ? <ul className="grid gap-1 rounded-xl bg-amber-50 p-3 text-xs text-amber-950" aria-label="Readability notes">{resolved.notices.map((n) => <li key={n.code}>{n.message}</li>)}</ul> : null}
          </Section>

          <Section title="Type">
            <ChoiceGrid label="Font pair" value={PAIRS.find((p) => p.heading === spec.text.headingFont && p.body === spec.text.bodyFont)?.id} columns={3} onChange={(id) => { const p = PAIRS.find((x) => x.id === id)!; h.set((cur) => ({ ...cur, text: { ...cur.text, headingFont: p.heading, bodyFont: p.body } })) }} options={PAIRS.map((p) => ({ value: p.id, label: p.label, preview: <FontTile heading={p.heading} body={p.body} /> }))} />
            <div className="grid gap-2">
              <Segment label="Text size" value={spec.text.size} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} onChange={(v) => patch("text", "size", v)} />
              <Segment label="Headings" value={spec.text.headingWeight} options={[{ value: "regular", label: "Regular" }, { value: "bold", label: "Bold" }]} onChange={(v) => patch("text", "headingWeight", v)} />
              <Segment label="Heading case" value={spec.text.headingCase} options={[{ value: "normal", label: "Normal" }, { value: "upper", label: "Capitals" }]} onChange={(v) => patch("text", "headingCase", v)} />
              <Segment label="Alignment" value={spec.text.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => patch("text", "align", v)} />
            </div>
          </Section>

          <Section title="Header">
            <ChoiceGrid label="Header arrangement" value={spec.header.layout} columns={3} onChange={(v) => patch("header", "layout", v)} options={[["poster", "Poster"], ["cover", "Cover"], ["centered", "Centred"], ["side", "Side by side"], ["minimal", "Text only"]].map(([v, l]) => ({ value: v as StyleSpec["header"]["layout"], label: l!, preview: <HeaderTile layout={v as StyleSpec["header"]["layout"]} /> }))} />
            <div className="grid gap-2">
              <Segment label="Logo shape" value={spec.header.avatarShape} options={[{ value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }, { value: "arch", label: "Arch" }, { value: "none", label: "None" }]} onChange={(v) => patch("header", "avatarShape", v)} />
              <Segment label="Logo size" value={spec.header.avatarSize} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} onChange={(v) => patch("header", "avatarSize", v)} />
              <Segment label="Header alignment" value={spec.header.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => patch("header", "align", v)} />
              <Segment label="Contact actions" value={spec.header.actions} options={[{ value: "buttons", label: "Buttons" }, { value: "icons", label: "Icons" }, { value: "none", label: "Hidden" }]} onChange={(v) => patch("header", "actions", v)} />
            </div>
          </Section>

          <Section title="Buttons">
            <ChoiceGrid label="Button style" value={spec.buttons.fill} columns={3} onChange={(v) => patch("buttons", "fill", v)} options={(["solid", "outline", "soft"] as const).map((f) => ({ value: f, label: { solid: "Filled", outline: "Outline", soft: "Soft" }[f], preview: <ButtonTile fill={f} shape={spec.buttons.shape} accent={spec.colors.accent} on={spec.colors.accentText} /> }))} />
            <ChoiceGrid label="Button shape" value={spec.buttons.shape} columns={3} onChange={(v) => patch("buttons", "shape", v)} options={(["square", "rounded", "pill"] as const).map((s) => ({ value: s, label: { square: "Square", rounded: "Rounded", pill: "Pill" }[s], preview: <ButtonTile fill={spec.buttons.fill} shape={s} accent={spec.colors.accent} on={spec.colors.accentText} /> }))} />
            <div className="grid gap-2">
              <Segment label="Button shadow" value={spec.buttons.shadow} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} onChange={(v) => patch("buttons", "shadow", v)} />
              <Segment label="Button icons" value={spec.buttons.showIcons ? "on" : "off"} options={[{ value: "on", label: "Icons" }, { value: "off", label: "No icons" }]} onChange={(v) => patch("buttons", "showIcons", v === "on")} />
            </div>
          </Section>

          <Section title="Surfaces">
            <ChoiceGrid label="Card surface" value={spec.cards.surface} columns={4} onChange={(v) => patch("cards", "surface", v)} options={(["solid", "soft", "glass", "transparent"] as const).map((k) => ({ value: k, label: { solid: "Solid", soft: "Soft", glass: "Frosted", transparent: "Outline" }[k], preview: <SurfaceTile kind={k} accent={spec.colors.accent} /> }))} />
            <div className="grid gap-2">
              <Segment label="Corners" value={spec.cards.radius} options={[{ value: "none", label: "Square" }, { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }]} onChange={(v) => patch("cards", "radius", v)} />
              <Segment label="Border" value={spec.cards.border} options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "thick", label: "Thick" }]} onChange={(v) => patch("cards", "border", v)} />
              <Segment label="Shadow" value={spec.cards.shadow} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} onChange={(v) => patch("cards", "shadow", v)} />
              <Segment label="Spacing inside" value={spec.cards.padding} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "roomy", label: "Roomy" }]} onChange={(v) => patch("cards", "padding", v)} />
            </div>
          </Section>

          <Section title="Wallpaper" hint="Animated wallpapers freeze, and fall back to the same colours, when motion is reduced.">
            <ChoiceGrid label="Wallpaper" value={wallKind} columns={3} onChange={wallpaper} options={[
              { value: "solid", label: "Plain", preview: <WallpaperTile css={base} /> },
              { value: "gradient", label: "Gradient", preview: <WallpaperTile css={`linear-gradient(160deg, ${base}, ${spec.colors.accent})`} /> },
              { value: "aurora", label: "Aurora", preview: <WallpaperTile css={backgroundPreview({ kind: "shader", style: "aurora", colors: shaderColours, base }, base)} /> },
              { value: "silk", label: "Silk", preview: <WallpaperTile css={backgroundPreview({ kind: "shader", style: "silk", colors: shaderColours, base }, base)} /> },
              { value: "grain", label: "Grain", preview: <WallpaperTile css={backgroundPreview({ kind: "shader", style: "grain", colors: shaderColours, base }, base)} /> },
            ]} />
            {bg.kind === "shader" ? (
              <div className="grid grid-cols-2 gap-3">{bg.colors.map((c, i) => <ColorField key={i} label={`Colour ${i + 1}`} value={c} onChange={(v) => setBackground({ ...bg, colors: bg.colors.map((x, j) => (j === i ? v : x)) }, `wall.${i}`)} />)}</div>
            ) : null}
            {bg.kind === "gradient" ? (
              <div className="grid grid-cols-2 gap-3"><ColorField label="From" value={bg.from} onChange={(v) => setBackground({ ...bg, from: v }, "wall.from")} /><ColorField label="To" value={bg.to} onChange={(v) => setBackground({ ...bg, to: v }, "wall.to")} /></div>
            ) : null}
          </Section>

          <Section title="Layout and motion">
            <div className="grid gap-2">
              <Segment label="Content width" value={spec.layout.width} options={[{ value: "narrow", label: "Narrow" }, { value: "regular", label: "Standard" }, { value: "wide", label: "Wide" }]} onChange={(v) => patch("layout", "width", v)} />
              <Segment label="On a computer" value={spec.layout.desktop} options={[{ value: "centered", label: "Centred" }, { value: "split", label: "Split" }, { value: "columns", label: "Columns" }]} onChange={(v) => patch("layout", "desktop", v)} />
              <Segment label="Spacing" value={spec.layout.density} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }]} onChange={(v) => patch("layout", "density", v)} />
              <Segment label="Motion" value={spec.motion ?? "subtle"} options={[{ value: "none", label: "Still" }, { value: "subtle", label: "Subtle" }, { value: "lively", label: "Lively" }]} onChange={(v) => h.set((cur) => ({ ...cur, motion: v }), "motion")} />
              <Segment label="Texture" value={spec.decoration} options={[{ value: "none", label: "None" }, { value: "grain", label: "Grain" }, { value: "glow", label: "Glow" }]} onChange={(v) => h.set((cur) => ({ ...cur, decoration: v }), "decoration")} />
            </div>
          </Section>
        </aside>
      </main>
    </div>
  )
}
