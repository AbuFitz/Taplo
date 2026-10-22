"use client"

import * as React from "react"
import { Lock, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FONT_KEYS } from "@/features/themes/contracts/tokens"
import type { StyleOverrides, StyleSpec } from "../contracts/style"
import { DECORATIONS } from "../contracts/style"
import { FONT_LABELS } from "../themes/fonts"
import { ThemePicker } from "./ThemePicker"
import { ColorField, ImageField, RangeField, Segmented, SelectField, SwitchField } from "./controls"
import type { Editor } from "./useEditor"
import { cn } from "@/lib/utils"

type Group = "colors" | "text" | "header" | "buttons" | "cards" | "layout"

/** Reads/writes one appearance override, and knows whether it is customised. */
function useAppearance(ed: Editor) {
  const ov = ed.state.page.appearance as Record<string, Record<string, unknown> | undefined>
  const has = (g: Group, k: string) => ov[g]?.[k] !== undefined
  const set = <T,>(g: Group, k: string, v: T) => ed.setAppearance((a) => ({ ...a, [g]: { ...((a as Record<string, object>)[g] ?? {}), [k]: v } }) as StyleOverrides, `ap:${g}.${k}`)
  const reset = (g: Group, k: string) => ed.setAppearance((a) => {
    const grp = { ...((a as Record<string, Record<string, unknown>>)[g] ?? {}) }
    delete grp[k]
    const next = { ...a } as Record<string, unknown>
    if (Object.keys(grp).length) next[g] = grp
    else delete next[g]
    return next as StyleOverrides
  })
  const resetGroup = (g: Group) => ed.setAppearance((a) => { const n = { ...a } as Record<string, unknown>; delete n[g]; return n as StyleOverrides })
  const groupCount = (g: Group) => Object.keys(ov[g] ?? {}).length
  return { has, set, reset, resetGroup, groupCount }
}

function Section({ title, count, onReset, children, defaultOpen, id }: { title: string; count?: number; onReset?: () => void; children: React.ReactNode; defaultOpen?: boolean; id?: string }) {
  return (
    <details id={id} open={defaultOpen} className="group rounded-xl border bg-card">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span>{title}{count ? <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{count} customised</span> : null}</span>
        <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-90">›</span>
      </summary>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 border-t p-4">
        {children}
        {onReset && count ? <button type="button" onClick={onReset} className="inline-flex items-center gap-1 justify-self-start text-xs font-medium text-primary underline-offset-4 hover:underline"><RotateCcw className="size-3" aria-hidden="true" />Reset this section to theme</button> : null}
      </div>
    </details>
  )
}

export function DesignTab({ ed }: { ed: Editor }) {
  const A = useAppearance(ed)
  const vm = ed.vm
  const spec = vm?.style.spec
  const c = ed.state.content
  if (!vm || !spec) return <p className="text-sm text-muted-foreground">Add your business name in the Content tab and the design options will appear.</p>
  const canSwitch = vm.ent.themeSwitching
  const themeId = vm.style.theme.id
  const total = vm.style.overrideCount
  const bg = spec.background
  const setBg = (b: StyleSpec["background"] | undefined) => ed.setAppearance((a) => { const n = { ...a }; if (b) n.background = b; else delete n.background; return n }, "ap:bg")
  const bgKind = (ed.state.page.appearance.background?.kind ?? "theme") as "theme" | "solid" | "gradient" | "image"
  const mid = vm.style.cssVars["--tp-background"] ?? "#ffffff"

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2">
      <Section title="Theme" defaultOpen id="theme">
        <p className="text-xs text-muted-foreground">A theme sets the whole feel at once. Switching keeps your content and your widgets exactly as they are. Any colours or fonts you’ve customised stay on top.</p>
        {!canSwitch ? <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" aria-hidden="true" />Choosing a different theme is included from the Core plan.</p> : null}
        <ThemePicker themeId={themeId} canSwitch={canSwitch} onPick={(id) => ed.setTheme(id)} />
        {total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
            <span>{total} custom setting{total === 1 ? "" : "s"} applied on top of this theme.</span>
            <button type="button" className="font-medium text-primary underline underline-offset-4" onClick={() => ed.setPage((p) => ({ ...p, appearance: {} }))}>Reset everything to the theme</button>
          </div>
        ) : null}
      </Section>

      <Section title="Header" count={A.groupCount("header")} onReset={() => A.resetGroup("header")} id="header">
        <Segmented label="Arrangement" value={spec.header.layout} customised={A.has("header", "layout")} onReset={() => A.reset("header", "layout")} onChange={(v) => A.set("header", "layout", v)} columns={2}
          options={[{ value: "centered", label: "Centred", hint: "Picture, name, buttons" }, { value: "cover", label: "Cover banner", hint: "Wide photo on top" }, { value: "side", label: "Side by side", hint: "Picture beside name" }, { value: "poster", label: "Poster", hint: "Text over a photo" }, { value: "minimal", label: "Text only", hint: "Just the name" }]} />
        <Segmented label="Picture shape" value={spec.header.avatarShape} customised={A.has("header", "avatarShape")} onReset={() => A.reset("header", "avatarShape")} onChange={(v) => A.set("header", "avatarShape", v)} columns={3}
          options={[{ value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }, { value: "square", label: "Square" }, { value: "arch", label: "Arch" }, { value: "none", label: "No picture" }]} />
        <div className="grid grid-cols-2 gap-3">
          <Segmented label="Picture size" value={spec.header.avatarSize} customised={A.has("header", "avatarSize")} onReset={() => A.reset("header", "avatarSize")} onChange={(v) => A.set("header", "avatarSize", v)} columns={3} options={[{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }]} />
          <Segmented label="Text alignment" value={spec.header.align} customised={A.has("header", "align")} onReset={() => A.reset("header", "align")} onChange={(v) => A.set("header", "align", v)} columns={2} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} />
        </div>
        <Segmented label="Contact buttons" value={spec.header.actions} customised={A.has("header", "actions")} onReset={() => A.reset("header", "actions")} onChange={(v) => A.set("header", "actions", v)} columns={3} options={[{ value: "buttons", label: "Buttons" }, { value: "icons", label: "Icons" }, { value: "none", label: "Hidden" }]} hint="Call, WhatsApp and Email you’ve added. If you add one as a widget, it isn’t repeated here." />
        <SwitchField label="Show location under the name" checked={spec.header.showLocation} onChange={(v) => A.set("header", "showLocation", v)} />
        <ImageField label="Logo or profile picture" value={c.identity.logo ?? null} defaultAlt={`${c.identity.name || "Business"} logo`} maxEdge={640} onChange={(v) => ed.setContent((x) => ({ ...x, identity: { ...x.identity, logo: v ?? undefined } }))} focalHint="Choose the part that should stay in view when the picture is cropped to a circle or arch." />
        {spec.header.avatarShape === "none" && c.identity.logo ? <p role="note" className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">Your picture is saved, but this look shows no picture. Choose a picture shape above to show it.</p> : null}
        <ImageField label="Cover picture" value={c.identity.heroImage ?? null} defaultAlt={`${c.identity.name || "Business"} cover photo`} maxEdge={1400} onChange={(v) => ed.setContent((x) => ({ ...x, identity: { ...x.identity, heroImage: v ?? undefined } }))} focalHint="Used by Cover banner and Poster headers. Choose the part that must always stay visible." />
      </Section>

      <Section title="Background" count={(ed.state.page.appearance.background ? 1 : 0) + (ed.state.page.appearance.decoration ? 1 : 0)} onReset={() => { setBg(undefined); ed.setAppearance((a) => { const n = { ...a }; delete n.decoration; return n }) }} id="background">
        <Segmented label="Type" value={bgKind} columns={2} onChange={(k) => {
          if (k === "theme") setBg(undefined)
          else if (k === "solid") setBg({ kind: "solid", color: bg.kind === "solid" ? bg.color : mid })
          else if (k === "gradient") setBg({ kind: "gradient", from: bg.kind === "gradient" ? bg.from : mid, to: bg.kind === "gradient" ? bg.to : spec.colors.accent, angle: 160, motion: false })
          else setBg({ kind: "image", image: bg.kind === "image" ? bg.image : { src: "/fixtures/img-2.svg", alt: "Background picture", focal: { x: 50, y: 50 } }, overlay: 55, overlayColor: spec.colors.background, fallback: spec.colors.background })
        }} options={[{ value: "theme", label: "Theme default" }, { value: "solid", label: "Solid colour" }, { value: "gradient", label: "Gradient" }, { value: "image", label: "Photo" }]} />
        {bg.kind === "solid" && bgKind === "solid" ? <ColorField label="Colour" value={bg.color} onChange={(v) => setBg({ kind: "solid", color: v })} /> : null}
        {bg.kind === "gradient" && bgKind === "gradient" ? (
          <>
            <div className="grid grid-cols-2 gap-3"><ColorField label="From" value={bg.from} onChange={(v) => setBg({ ...bg, from: v })} /><ColorField label="To" value={bg.to} onChange={(v) => setBg({ ...bg, to: v })} /></div>
            <RangeField label="Angle" value={bg.angle} min={0} max={360} step={5} unit="°" onChange={(v) => setBg({ ...bg, angle: v })} />
            <SwitchField label="Slowly drifting colours" checked={bg.motion} onChange={(v) => setBg({ ...bg, motion: v })} hint="Pauses automatically for visitors who ask their device to reduce motion." />
          </>
        ) : null}
        {bg.kind === "image" && bgKind === "image" ? (
          <>
            <ImageField label="Background photo" value={bg.image} defaultAlt="Background picture" maxEdge={1600} onChange={(v) => v && setBg({ ...bg, image: v })} focalHint="Choose the part of the photo that should stay in view on phones and wide screens." />
            <RangeField label="Overlay strength" value={bg.overlay} min={0} max={90} step={5} onChange={(v) => setBg({ ...bg, overlay: v })} />
            <ColorField label="Overlay colour" value={bg.overlayColor} onChange={(v) => setBg({ ...bg, overlayColor: v, fallback: v })} hint="A stronger overlay keeps text readable over any photo. Taplo raises it automatically if it’s too weak." />
          </>
        ) : null}
        <SelectField label="Pattern on top" value={ed.state.page.appearance.decoration} inheritLabel="Theme default" options={DECORATIONS.map((d) => ({ value: d, label: { none: "None", grain: "Paper grain", dots: "Dots", grid: "Grid", stripes: "Diagonal stripes", glow: "Soft glow" }[d] }))} customised={ed.state.page.appearance.decoration !== undefined} onReset={() => ed.setAppearance((a) => { const n = { ...a }; delete n.decoration; return n })} onChange={(v) => ed.setAppearance((a) => { const n = { ...a }; if (v) n.decoration = v; else delete n.decoration; return n })} />
      </Section>

      <Section title="Text" count={A.groupCount("text") + (["text", "muted", "accent", "accentText"].filter((k) => A.has("colors", k)).length)} onReset={() => { A.resetGroup("text"); ;["text", "muted"].forEach((k) => A.reset("colors", k)) }} id="typography">
        <SelectField label="Headings font" value={spec.text.headingFont} options={FONT_KEYS.map((f) => ({ value: f, label: FONT_LABELS[f] }))} customised={A.has("text", "headingFont")} onReset={() => A.reset("text", "headingFont")} onChange={(v) => v && A.set("text", "headingFont", v)} />
        <SelectField label="Body font" value={spec.text.bodyFont} options={FONT_KEYS.map((f) => ({ value: f, label: FONT_LABELS[f] }))} customised={A.has("text", "bodyFont")} onReset={() => A.reset("text", "bodyFont")} onChange={(v) => v && A.set("text", "bodyFont", v)} />
        <Segmented label="Text size" value={spec.text.size} customised={A.has("text", "size")} onReset={() => A.reset("text", "size")} onChange={(v) => A.set("text", "size", v)} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
        <div className="grid grid-cols-2 gap-3">
          <Segmented label="Headings" value={spec.text.headingCase} customised={A.has("text", "headingCase")} onReset={() => A.reset("text", "headingCase")} onChange={(v) => A.set("text", "headingCase", v)} columns={1} options={[{ value: "normal", label: "Normal" }, { value: "upper", label: "UPPERCASE" }]} />
          <Segmented label="Heading weight" value={spec.text.headingWeight} customised={A.has("text", "headingWeight")} onReset={() => A.reset("text", "headingWeight")} onChange={(v) => A.set("text", "headingWeight", v)} columns={1} options={[{ value: "regular", label: "Light" }, { value: "bold", label: "Bold" }]} />
        </div>
        <Segmented label="Heading alignment" value={spec.text.align} customised={A.has("text", "align")} onReset={() => A.reset("text", "align")} onChange={(v) => A.set("text", "align", v)} columns={2} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} />
        <ColorField label="Text colour" value={spec.colors.text} customised={A.has("colors", "text")} onReset={() => A.reset("colors", "text")} onChange={(v) => A.set("colors", "text", v)} />
        <ColorField label="Accent colour" value={spec.colors.accent} customised={A.has("colors", "accent")} onReset={() => A.reset("colors", "accent")} onChange={(v) => A.set("colors", "accent", v)} />
        <ColorField label="Page colour" value={vm.style.cssVars["--tp-background"] ?? spec.colors.background} customised={A.has("colors", "background")} onReset={() => A.reset("colors", "background")} onChange={(v) => A.set("colors", "background", v)} hint="Behind your content when the background is a plain colour." />
      </Section>

      <Section title="Buttons" count={A.groupCount("buttons")} onReset={() => A.resetGroup("buttons")} id="buttons">
        <Segmented label="Shape" value={spec.buttons.shape} customised={A.has("buttons", "shape")} onReset={() => A.reset("buttons", "shape")} onChange={(v) => A.set("buttons", "shape", v)} options={[{ value: "square", label: "Square" }, { value: "rounded", label: "Rounded" }, { value: "pill", label: "Pill" }]} />
        <Segmented label="Style" value={spec.buttons.fill} customised={A.has("buttons", "fill")} onReset={() => A.reset("buttons", "fill")} onChange={(v) => A.set("buttons", "fill", v)} options={[{ value: "solid", label: "Filled" }, { value: "outline", label: "Outline" }, { value: "soft", label: "Soft" }]} />
        <Segmented label="Shadow" value={spec.buttons.shadow} customised={A.has("buttons", "shadow")} onReset={() => A.reset("buttons", "shadow")} onChange={(v) => A.set("buttons", "shadow", v)} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard offset" }]} />
        <SwitchField label="Show icons on buttons" checked={spec.buttons.showIcons} onChange={(v) => A.set("buttons", "showIcons", v)} />
        <ColorField label="Button colour" value={vm.style.cssVars["--tp-btn-bg"] === "transparent" ? spec.colors.accent : vm.style.cssVars["--tp-btn-bg"]!} customised={A.has("buttons", "background")} onReset={() => A.reset("buttons", "background")} onChange={(v) => A.set("buttons", "background", v)} />
        <ColorField label="Button text colour" value={vm.style.cssVars["--tp-btn-text"]!} customised={A.has("buttons", "text")} onReset={() => A.reset("buttons", "text")} onChange={(v) => A.set("buttons", "text", v)} hint="Adjusted automatically if it would be hard to read on the button." />
        <ColorField label="Button outline colour" value={vm.style.cssVars["--tp-btn-border"]!} customised={A.has("buttons", "border")} onReset={() => A.reset("buttons", "border")} onChange={(v) => A.set("buttons", "border", v)} />
      </Section>

      <Section title="Cards and widgets" count={A.groupCount("cards")} onReset={() => A.resetGroup("cards")} id="cards">
        <Segmented label="Background" value={spec.cards.surface} customised={A.has("cards", "surface")} onReset={() => A.reset("cards", "surface")} onChange={(v) => A.set("cards", "surface", v)} options={[{ value: "solid", label: "Solid" }, { value: "glass", label: "Frosted" }, { value: "transparent", label: "None" }]} />
        {spec.cards.surface === "glass" ? <RangeField label="Opacity" value={spec.cards.opacity} min={20} max={100} step={5} customised={A.has("cards", "opacity")} onReset={() => A.reset("cards", "opacity")} onChange={(v) => A.set("cards", "opacity", v)} /> : null}
        <Segmented label="Corners" value={spec.cards.radius} customised={A.has("cards", "radius")} onReset={() => A.reset("cards", "radius")} onChange={(v) => A.set("cards", "radius", v)} columns={3} options={[{ value: "none", label: "Square" }, { value: "sm", label: "Slight" }, { value: "md", label: "Medium" }, { value: "lg", label: "Round" }, { value: "xl", label: "Rounder" }]} />
        <div className="grid grid-cols-2 gap-3">
          <Segmented label="Border" value={spec.cards.border} customised={A.has("cards", "border")} onReset={() => A.reset("cards", "border")} onChange={(v) => A.set("cards", "border", v)} columns={1} options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "thick", label: "Thick" }]} />
          <Segmented label="Shadow" value={spec.cards.shadow} customised={A.has("cards", "shadow")} onReset={() => A.reset("cards", "shadow")} onChange={(v) => A.set("cards", "shadow", v)} columns={1} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} />
        </div>
        <Segmented label="Space inside" value={spec.cards.padding} customised={A.has("cards", "padding")} onReset={() => A.reset("cards", "padding")} onChange={(v) => A.set("cards", "padding", v)} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "roomy", label: "Roomy" }]} />
        <ColorField label="Card colour" value={spec.colors.surface} customised={A.has("colors", "surface")} onReset={() => A.reset("colors", "surface")} onChange={(v) => A.set("colors", "surface", v)} />
        <p className="text-xs text-muted-foreground">Want one widget to stand out? Open it in Content → Appearance to override just that widget.</p>
      </Section>

      <Section title="Layout and spacing" count={A.groupCount("layout")} onReset={() => A.resetGroup("layout")} id="layout">
        <Segmented label="Content width" value={spec.layout.width} customised={A.has("layout", "width")} onReset={() => A.reset("layout", "width")} onChange={(v) => A.set("layout", "width", v)} options={[{ value: "narrow", label: "Narrow" }, { value: "regular", label: "Standard" }, { value: "wide", label: "Wide" }]} />
        <Segmented label="Spacing" value={spec.layout.density} customised={A.has("layout", "density")} onReset={() => A.reset("layout", "density")} onChange={(v) => A.set("layout", "density", v)} columns={2} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }]} />
        <Segmented label="On a computer" value={spec.layout.desktop} customised={A.has("layout", "desktop")} onReset={() => A.reset("layout", "desktop")} onChange={(v) => A.set("layout", "desktop", v)} columns={1}
          options={[{ value: "centered", label: "One centred column", hint: "Like on a phone, with room around it" }, { value: "split", label: "Name on the left, widgets on the right", hint: "Your header stays in view" }, { value: "columns", label: "Header on top, two columns of widgets", hint: "Good with many widgets" }]} hint="Phones always show a single column." />
      </Section>

      <Section title="Readability check" id="readability">
        <ul className="grid gap-1.5 text-sm" aria-label="Contrast checks">
          {vm.style.contrast.map((k) => (
            <li key={k.label} className="flex items-center justify-between gap-2"><span>{k.label}</span><span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", k.ok ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900")}>{k.ok ? "Good" : "Low"} · {k.ratio}:1</span></li>
          ))}
        </ul>
        {vm.style.notices.length ? <ul className="grid gap-1 text-xs text-amber-900">{vm.style.notices.map((n) => <li key={n.code}>• {n.message}</li>)}</ul> : <p className="text-xs text-muted-foreground">Text needs at least 4.5:1 contrast to be comfortable to read. Taplo adjusts colours automatically if a choice would fall short, and tells you here.</p>}
      </Section>

      <div className="pt-1"><Button variant="outline" size="sm" disabled={total === 0} onClick={() => ed.setPage((p) => ({ ...p, appearance: {} }))}><RotateCcw /> Reset all design changes to the theme</Button></div>
    </div>
  )
}
