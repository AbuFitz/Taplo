"use client"

import * as React from "react"
import { Check, Lock, RotateCcw, X } from "lucide-react"
import { ColorField, ImageField } from "@/features/page/editor/controls"
import { DECORATIONS, type StyleSpec } from "@/features/page/contracts/style"
import { FONT_LABELS } from "@/features/page/themes/fonts"
import { PALETTES } from "@/features/page/themes/looks"
import { FONT_KEYS, type FontKey } from "@/features/themes/contracts/tokens"
import { cn } from "@/lib/utils"
import { ChoiceGrid, Disclosure, Field, Segment, Slider, Toggle } from "./controls"
import { FONT_PAIRS, SHADER_DEFAULT_COLOURS, type AppearanceModel } from "./model"
import { LookThumb } from "@/components/taplo/look-thumb"
import type { BusinessContent } from "@/features/businesses/content"
import { ProfileMark } from "@/features/page/renderer/ProfileMark"
import { PagePreview } from "@/features/preview/PagePreview"
import { ButtonTile, FontTile, HeaderTile, PaletteTile, SurfaceTile, WallpaperTile, backgroundPreview } from "./previews"

import { SavedLookPicture } from "./SavedLookPicture"

type M = { m: AppearanceModel }

/* ------------------------------------------------------------------ starting look */
export function LookPicker({ m }: M) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <ChoiceGrid
        label="Look"
        value={m.look.id}
        columns={2}
        onChange={(id) => m.applyLook(id)}
        options={m.looks.map((l) => ({ value: l.id, label: l.name, disabled: !m.canSwitchLook && l.id !== m.look.id, preview: <LookThumb id={l.id} /> }))}
      />
      {!m.canSwitchLook ? <p className="flex items-center gap-1.5 text-xs text-neutral-600"><Lock className="size-3.5" aria-hidden="true" />Choosing a different theme is included from the Core plan.</p> : null}
      <p className="text-xs text-neutral-600">{m.look.description} Everything below stays editable.</p>
      {m.saved ? <SavedLooks m={m} /> : null}
    </div>
  )
}

/** Owner-created looks: save the current style under a name, apply it again later. */
function SavedLooks({ m }: M) {
  const [name, setName] = React.useState("")
  const saved = m.saved!
  const full = saved.limit !== undefined && saved.items.length >= saved.limit
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 rounded-2xl bg-black/[0.035] p-3" data-testid="saved-looks">
      <p className="text-xs font-semibold">My looks</p>
      {saved.items.length ? (
        <ul className="grid grid-cols-2 gap-3" aria-label="Saved looks">
          {saved.items.map((l) => (
            <li key={l.id} className={cn("relative min-w-0 rounded-xl bg-white p-1.5 ring-1", l.active ? "ring-neutral-900" : "ring-black/10")}>
              <button type="button" onClick={() => saved.apply(l.id)} aria-label={`Apply ${l.name}`} aria-pressed={Boolean(l.active)} className="grid w-full gap-2 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <SavedLookPicture name={l.name} src={l.previewSrc} themeId={l.themeId} overrides={l.overrides} />
                <span className="flex min-h-10 items-center gap-1.5 pl-1 pr-9 text-xs font-semibold"><span className="min-w-0 break-words">{l.name}</span>{l.active ? <Check aria-hidden="true" className="size-3.5 shrink-0" /> : null}</span>
              </button>
              <button type="button" onClick={() => saved.remove(l.id)} aria-label={`Delete ${l.name}`} className="absolute bottom-1.5 right-1.5 grid size-10 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-primary"><X aria-hidden="true" className="size-3.5" /></button>
            </li>
          ))}
        </ul>
      ) : <p className="text-xs text-neutral-600">Happy with how it looks? Save it, then try other things and come back.</p>}
      {full ? <p role="status" className="text-xs leading-relaxed text-neutral-600">You have {saved.limit} saved looks. Remove one to make room; your current page stays as it is.</p> : null}
      <form className="flex min-w-0 gap-2" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (!n || full) return; saved.save(n); setName("") }}>
        <input aria-label="Name this look" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Name this look" className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-white px-3 text-sm" />
        <button type="submit" disabled={!name.trim() || full} className="min-h-11 shrink-0 rounded-xl bg-neutral-900 px-3.5 text-xs font-medium text-white disabled:opacity-40">Save</button>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ colour */
export function ColourControls({ m }: M) {
  const { spec } = m
  const palette = PALETTES.find((p) => (Object.keys(p.colors) as (keyof typeof p.colors)[]).every((k) => p.colors[k] === spec.colors[k]))
  const page = m.resolved.cssVars["--tp-background"] ?? spec.colors.background
  return (
    <div className="grid gap-4">
      <ChoiceGrid label="Palette" value={palette?.id} columns={4}
        onChange={(id) => { const p = PALETTES.find((x) => x.id === id)!; m.apply((o) => ({ ...o, colors: { ...o.colors, ...p.colors }, ...(m.spec.background.kind === "solid" ? { background: { kind: "solid" as const, color: p.colors.background! } } : {}) })) }}
        options={PALETTES.map((p) => ({ value: p.id, label: p.name, preview: <PaletteTile colors={p.colors} /> }))} />
      <div className="grid gap-3">
        <ColorField label="Page" value={page} customised={m.has("colors", "background")} onReset={() => m.reset("colors", "background")} onChange={m.setPageColour} />
        <ColorField label="Text" value={spec.colors.text} against={page} customised={m.has("colors", "text")} onReset={() => m.reset("colors", "text")} onChange={(v) => m.patch("colors", "text", v)} />
        <ColorField label="Accent" value={spec.colors.accent} customised={m.has("colors", "accent")} onReset={() => m.reset("colors", "accent")} onChange={(v) => m.patch("colors", "accent", v)} />
        <ColorField label="Cards" value={spec.colors.surface} customised={m.has("colors", "surface")} onReset={() => m.reset("colors", "surface")} onChange={(v) => m.patch("colors", "surface", v)} />
      </div>
      <details className="group/more">
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center text-xs font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline [&::-webkit-details-marker]:hidden">More colours</summary>
        <div className="mt-3 grid gap-3">
          <ColorField label="Secondary text" value={spec.colors.muted} against={page} customised={m.has("colors", "muted")} onReset={() => m.reset("colors", "muted")} onChange={(v) => m.patch("colors", "muted", v)} />
          <ColorField label="Text on accent" value={spec.colors.accentText} against={spec.colors.accent} customised={m.has("colors", "accentText")} onReset={() => m.reset("colors", "accentText")} onChange={(v) => m.patch("colors", "accentText", v)} />
          <ColorField label="Borders" value={spec.colors.border} customised={m.has("colors", "border")} onReset={() => m.reset("colors", "border")} onChange={(v) => m.patch("colors", "border", v)} />
        </div>
      </details>
    </div>
  )
}

/* ------------------------------------------------------------------ type */
export function TypeControls({ m }: M) {
  const { spec } = m
  const pair = FONT_PAIRS.find((p) => p.heading === spec.text.headingFont && p.body === spec.text.bodyFont)
  const fontSelect = (label: string, key: "headingFont" | "bodyFont") => (
    <Field label={label} dirty={m.has("text", key)} onReset={() => m.reset("text", key)}>
      <select aria-label={label} value={spec.text[key]} onChange={(e) => m.patch("text", key, e.target.value as FontKey)} className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm">
        {FONT_KEYS.map((f) => <option key={f} value={f}>{FONT_LABELS[f]}</option>)}
      </select>
    </Field>
  )
  return (
    <div className="grid gap-4">
      <ChoiceGrid label="Font pair" value={pair?.id} columns={3}
        onChange={(id) => { const p = FONT_PAIRS.find((x) => x.id === id)!; m.apply((o) => ({ ...o, text: { ...o.text, headingFont: p.heading, bodyFont: p.body } }), "text.pair") }}
        options={FONT_PAIRS.map((p) => ({ value: p.id, label: p.label, preview: <FontTile heading={p.heading} body={p.body} /> }))} />
      <div className="grid gap-3">
        <Field label="Text size" dirty={m.has("text", "size")} onReset={() => m.reset("text", "size")}><Segment label="Text size" value={spec.text.size} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} onChange={(v) => m.patch("text", "size", v)} /></Field>
      </div>
      <details>
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center text-xs font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline [&::-webkit-details-marker]:hidden">More type options</summary>
        <div className="mt-3 grid gap-3">
        <Field label="Headings" dirty={m.has("text", "headingWeight")} onReset={() => m.reset("text", "headingWeight")}><Segment label="Heading weight" value={spec.text.headingWeight} options={[{ value: "regular", label: "Regular" }, { value: "bold", label: "Bold" }]} onChange={(v) => m.patch("text", "headingWeight", v)} /></Field>
        <Field label="Heading case" dirty={m.has("text", "headingCase")} onReset={() => m.reset("text", "headingCase")}><Segment label="Heading case" value={spec.text.headingCase} options={[{ value: "normal", label: "Normal" }, { value: "upper", label: "Capitals" }]} onChange={(v) => m.patch("text", "headingCase", v)} /></Field>
        <Field label="Alignment" dirty={m.has("text", "align")} onReset={() => m.reset("text", "align")}><Segment label="Text alignment" value={spec.text.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => m.patch("text", "align", v)} /></Field>
          {fontSelect("Headings font", "headingFont")}{fontSelect("Body font", "bodyFont")}
        </div>
      </details>
    </div>
  )
}

/* ------------------------------------------------------------------ header */
const HEADER_OPTIONS: [StyleSpec["header"]["layout"], string][] = [["side", "Compact"], ["cover", "Cover"], ["feature", "Wide feature"], ["poster", "Image hero"], ["centered", "Text-led"]]
export function HeaderControls({ m, identity, livePreviews = false }: M & { identity?: BusinessContent["identity"]; livePreviews?: boolean }) {
  const { spec } = m
  return (
    <div className="grid gap-4">
      <ChoiceGrid label="Header arrangement" value={spec.header.layout} columns={livePreviews ? 2 : 3} onChange={(v) => m.patch("header", "layout", v)}
        options={(spec.header.layout === "minimal" ? [...HEADER_OPTIONS, ["minimal", "Text only (earlier)"] as [StyleSpec["header"]["layout"], string]] : HEADER_OPTIONS).map(([v, l]) => ({ value: v, label: l, preview: livePreviews ?
          <span className="pointer-events-none relative block aspect-[390/550] overflow-hidden" aria-hidden="true"><PagePreview src={`/demo/preview?header=${v}`} title={`${l} header preview`} mode="device" device={{ w: 390, h: 550 }} interactive={false} /></span> : <HeaderTile layout={v} /> }))} />
      {spec.header.layout === "poster" || spec.header.layout === "cover" ? <Field label="Photo fade" dirty={m.has("header", "scrim")} onReset={() => m.reset("header", "scrim")} hint="How far the photograph fades into the page. Text always sits on the page colour."><Segment label="Photo fade" value={spec.header.scrim ?? "medium"} options={[{ value: "soft", label: "Soft" }, { value: "medium", label: "Medium" }, { value: "strong", label: "Strong" }]} onChange={(v) => m.patch("header", "scrim", v)} /></Field> : null}
      <div className="grid gap-3">
        <Field label="Your picture" dirty={m.has("header", "avatarShape")} onReset={() => m.reset("header", "avatarShape")}>
          <ChoiceGrid label="Picture style" value={spec.header.avatarShape} columns={2} onChange={(v) => m.patch("header", "avatarShape", v)}
            options={([
              ["logo", "Keep whole"], ["circle", "Circle"], ["rounded", "Soft square"], ["none", "Name only"],
              ...(spec.header.avatarShape === "arch" || spec.header.avatarShape === "square" ? [[spec.header.avatarShape, "Current style"]] : []),
            ] as [StyleSpec["header"]["avatarShape"], string][]).map(([value, label]) => ({ value, label, preview:
              <span aria-hidden="true" className="flex h-24 items-center justify-center overflow-hidden px-3" style={{ ...m.resolved.cssVars, background: m.resolved.cssVars["--tp-background"] } as React.CSSProperties}>
                {value === "none" ? <span className="text-sm font-semibold" style={{ color: spec.colors.text }}>{identity?.name || "Your business"}</span> :
                  <span className="flex max-w-full scale-75 items-center justify-center [&_.tp-logo]:max-h-20 [&_.tp-logo]:max-w-full"><ProfileMark image={identity?.logo} name={identity?.name || "Your business"} shape={value} /></span>}
              </span>
            }))} />
        </Field>
        <details>
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium">Adjust layout</summary>
          <div className="mt-3 grid gap-3">
        <Field label="Logo size" dirty={m.has("header", "avatarSize")} onReset={() => m.reset("header", "avatarSize")}><Segment label="Logo size" value={spec.header.avatarSize} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} onChange={(v) => m.patch("header", "avatarSize", v)} /></Field>
        <Field label="Alignment" dirty={m.has("header", "align")} onReset={() => m.reset("header", "align")}><Segment label="Header alignment" value={spec.header.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Centre" }]} onChange={(v) => m.patch("header", "align", v)} /></Field>
        <Field label="Contact actions" dirty={m.has("header", "actions")} onReset={() => m.reset("header", "actions")} hint="Call, WhatsApp and Email you’ve added. If you add one as a widget, it isn’t repeated here."><Segment label="Contact actions" value={spec.header.actions} options={[{ value: "primary", label: "Main + icons" }, { value: "buttons", label: "Buttons" }, { value: "icons", label: "Icons" }, { value: "none", label: "Hidden" }]} onChange={(v) => m.patch("header", "actions", v)} /></Field>
        <Toggle label="Show location under the name" checked={spec.header.showLocation} onChange={(v) => m.patch("header", "showLocation", v)} />
          </div>
        </details>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ buttons */
export function ButtonControls({ m }: M) {
  const { spec, resolved } = m
  const v = resolved.cssVars
  return (
    <div className="grid gap-4">
      <Field label="Style" dirty={m.has("buttons", "fill")} onReset={() => m.reset("buttons", "fill")}>
        <ChoiceGrid label="Button style" value={spec.buttons.fill} columns={3} onChange={(x) => m.patch("buttons", "fill", x)}
          options={(["solid", "outline", "soft"] as const).map((f) => ({ value: f, label: { solid: "Filled", outline: "Outline", soft: "Soft" }[f], preview: <ButtonTile fill={f} shape={spec.buttons.shape} accent={spec.colors.accent} on={spec.colors.accentText} /> }))} />
      </Field>
      <Field label="Shape" dirty={m.has("buttons", "shape")} onReset={() => m.reset("buttons", "shape")}>
        <ChoiceGrid label="Button shape" value={spec.buttons.shape} columns={3} onChange={(x) => m.patch("buttons", "shape", x)}
          options={(["square", "rounded", "pill"] as const).map((s) => ({ value: s, label: { square: "Square", rounded: "Rounded", pill: "Pill" }[s], preview: <ButtonTile fill={spec.buttons.fill} shape={s} accent={spec.colors.accent} on={spec.colors.accentText} /> }))} />
      </Field>
      <Field label="Shadow" dirty={m.has("buttons", "shadow")} onReset={() => m.reset("buttons", "shadow")}><Segment label="Button shadow" value={spec.buttons.shadow} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} onChange={(x) => m.patch("buttons", "shadow", x)} /></Field>
      <Toggle label="Icons on buttons" checked={spec.buttons.showIcons} onChange={(x) => m.patch("buttons", "showIcons", x)} />
      <details>
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center text-xs font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline [&::-webkit-details-marker]:hidden">Button colours</summary>
        <div className="mt-3 grid gap-3">
          <ColorField label="Button colour" value={v["--tp-btn-bg"] === "transparent" ? spec.colors.accent : v["--tp-btn-bg"]!} customised={m.has("buttons", "background")} onReset={() => m.reset("buttons", "background")} onChange={(x) => m.patch("buttons", "background", x)} />
          <ColorField label="Button text" value={v["--tp-btn-text"]!} against={v["--tp-btn-bg"] === "transparent" ? undefined : v["--tp-btn-bg"]} customised={m.has("buttons", "text")} onReset={() => m.reset("buttons", "text")} onChange={(x) => m.patch("buttons", "text", x)} hint="Adjusted automatically if it would be hard to read." />
          <ColorField label="Button outline" value={v["--tp-btn-border"]!} customised={m.has("buttons", "border")} onReset={() => m.reset("buttons", "border")} onChange={(x) => m.patch("buttons", "border", x)} />
        </div>
      </details>
    </div>
  )
}

/* ------------------------------------------------------------------ surfaces */
export function SurfaceControls({ m }: M) {
  const { spec } = m
  return (
    <div className="grid gap-4">
      <Field label="Card surface" dirty={m.has("cards", "surface")} onReset={() => m.reset("cards", "surface")}>
        <ChoiceGrid label="Card surface" value={spec.cards.surface} columns={4} onChange={(x) => m.patch("cards", "surface", x)}
          options={(["solid", "soft", "glass", "transparent"] as const).map((k) => ({ value: k, label: { solid: "Solid", soft: "Soft", glass: "Frosted", transparent: "Outline" }[k], preview: <SurfaceTile kind={k} accent={spec.colors.accent} /> }))} />
      </Field>
      {spec.cards.surface === "glass" ? <Slider label="Frosting" value={spec.cards.opacity} min={10} max={100} step={2} unit="%" onChange={(x) => m.patch("cards", "opacity", x)} /> : null}
      <Field label="Corners" dirty={m.has("cards", "radius")} onReset={() => m.reset("cards", "radius")}><Segment label="Corners" value={spec.cards.radius} options={[{ value: "none", label: "Square" }, { value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }]} onChange={(x) => m.patch("cards", "radius", x)} /></Field>
      <details>
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center text-xs font-medium text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline [&::-webkit-details-marker]:hidden">More card options</summary>
        <div className="mt-3 grid gap-4">
      <Field label="Border" dirty={m.has("cards", "border")} onReset={() => m.reset("cards", "border")}><Segment label="Border" value={spec.cards.border} options={[{ value: "none", label: "None" }, { value: "thin", label: "Thin" }, { value: "thick", label: "Thick" }]} onChange={(x) => m.patch("cards", "border", x)} /></Field>
      <Field label="Shadow" dirty={m.has("cards", "shadow")} onReset={() => m.reset("cards", "shadow")}><Segment label="Card shadow" value={spec.cards.shadow} options={[{ value: "none", label: "None" }, { value: "soft", label: "Soft" }, { value: "hard", label: "Hard" }]} onChange={(x) => m.patch("cards", "shadow", x)} /></Field>
      <Field label="Space inside" dirty={m.has("cards", "padding")} onReset={() => m.reset("cards", "padding")}><Segment label="Spacing inside" value={spec.cards.padding} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "roomy", label: "Roomy" }]} onChange={(x) => m.patch("cards", "padding", x)} /></Field>
        </div>
      </details>
      <p className="text-xs text-neutral-600">To make just one widget stand out, select it and use its Appearance tab.</p>
    </div>
  )
}

/* ------------------------------------------------------------------ wallpaper */
type Wall = "solid" | "gradient" | "aurora" | "silk" | "grain" | "image"
export function WallpaperControls({ m }: M) {
  const { spec } = m
  const bg = spec.background
  const base = m.resolved.cssVars["--tp-background"] ?? spec.colors.background
  const kind: Wall = bg.kind === "shader" ? bg.style : bg.kind === "gradient" ? "gradient" : bg.kind === "image" ? "image" : "solid"
  const shaderColours = bg.kind === "shader" ? bg.colors : SHADER_DEFAULT_COLOURS
  const choose = (k: Wall) => {
    if (k === "solid") m.setBackground({ kind: "solid", color: base })
    else if (k === "gradient") m.setBackground({ kind: "gradient", from: base, to: spec.colors.accent, angle: 160, motion: false })
    else if (k === "image") m.setBackground({ kind: "image", image: bg.kind === "image" ? bg.image : { src: "/fixtures/img-2.svg", alt: "Background picture", focal: { x: 50, y: 50 } }, overlay: 55, overlayColor: base, fallback: base })
    else m.setBackground({ kind: "shader", style: k, colors: shaderColours, base })
  }
  const tile = (css: string) => <WallpaperTile css={css} />
  return (
    <div className="grid gap-4">
      <ChoiceGrid label="Wallpaper" value={kind} columns={3} onChange={choose} options={[
        { value: "solid", label: "Plain", preview: tile(base) },
        { value: "gradient", label: "Gradient", preview: tile(`linear-gradient(160deg, ${base}, ${spec.colors.accent})`) },
        { value: "aurora", label: "Aurora", preview: tile(backgroundPreview({ kind: "shader", style: "aurora", colors: shaderColours, base }, base)) },
        { value: "silk", label: "Silk", preview: tile(backgroundPreview({ kind: "shader", style: "silk", colors: shaderColours, base }, base)) },
        { value: "grain", label: "Grain", preview: tile(backgroundPreview({ kind: "shader", style: "grain", colors: shaderColours, base }, base)) },
        { value: "image", label: "Photo", preview: tile("linear-gradient(135deg, #8a8f98, #2b2f36)") },
      ]} />
      {bg.kind === "shader" ? <>
        <div className="grid grid-cols-2 gap-3">{bg.colors.map((c, i) => <ColorField key={i} label={`Colour ${i + 1}`} value={c} onChange={(v) => m.setBackground({ ...bg, colors: bg.colors.map((x, j) => (j === i ? v : x)) }, `wall.${i}`)} />)}</div>
        <p className="text-xs text-neutral-600">Animated wallpapers freeze, and fall back to the same colours, when motion is reduced.</p>
      </> : null}
      {bg.kind === "gradient" ? <>
        <div className="grid grid-cols-2 gap-3"><ColorField label="From" value={bg.from} onChange={(v) => m.setBackground({ ...bg, from: v }, "wall.from")} /><ColorField label="To" value={bg.to} onChange={(v) => m.setBackground({ ...bg, to: v }, "wall.to")} /></div>
        <Slider label="Angle" value={bg.angle} min={0} max={360} step={5} unit="°" onChange={(v) => m.setBackground({ ...bg, angle: v }, "wall.angle")} />
        <Toggle label="Slowly drifting colours" checked={bg.motion} onChange={(v) => m.setBackground({ ...bg, motion: v })} hint="Pauses for visitors who ask their device to reduce motion." />
      </> : null}
      {bg.kind === "image" ? <>
        <ImageField label="Background photo" value={bg.image} defaultAlt="Background picture" maxEdge={1600} onChange={(v) => v && m.setBackground({ ...bg, image: v })} focalHint="Choose the part of the photo that should stay in view on phones and computers." />
        <Slider label="Overlay strength" value={bg.overlay} min={0} max={90} step={5} unit="%" onChange={(v) => m.setBackground({ ...bg, overlay: v }, "wall.overlay")} />
        <ColorField label="Overlay colour" value={bg.overlayColor} onChange={(v) => m.setBackground({ ...bg, overlayColor: v, fallback: v }, "wall.overlayColor")} hint="A stronger overlay keeps text readable over any photo. Taplo raises it automatically if it is too weak." />
      </> : null}
      <Field label="Pattern on top" dirty={m.count("decoration") > 0} onReset={() => m.resetGroup("decoration")}>
        <Segment label="Pattern" value={spec.decoration} options={DECORATIONS.map((d) => ({ value: d, label: { none: "None", grain: "Grain", dots: "Dots", grid: "Grid", stripes: "Stripes", glow: "Glow" }[d] }))} onChange={(v) => m.apply((o) => ({ ...o, decoration: v }), "decoration")} />
      </Field>
    </div>
  )
}

/* ------------------------------------------------------------------ layout + motion */
export function LayoutControls({ m }: M) {
  const { spec } = m
  return (
    <div className="grid gap-4">
      <Field label="Content width" dirty={m.has("layout", "width")} onReset={() => m.reset("layout", "width")}><Segment label="Content width" value={spec.layout.width} options={[{ value: "narrow", label: "Narrow" }, { value: "regular", label: "Standard" }, { value: "wide", label: "Wide" }]} onChange={(v) => m.patch("layout", "width", v)} /></Field>
      <Field label="On a computer" dirty={m.has("layout", "desktop")} onReset={() => m.reset("layout", "desktop")} hint="Phones always show a single column."><Segment label="On a computer" value={spec.layout.desktop} options={[{ value: "centered", label: "Centred" }, { value: "split", label: "Split" }, { value: "columns", label: "Columns" }]} onChange={(v) => m.patch("layout", "desktop", v)} /></Field>
      <Field label="Spacing" dirty={m.has("layout", "density")} onReset={() => m.reset("layout", "density")}><Segment label="Spacing" value={spec.layout.density} options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }]} onChange={(v) => m.patch("layout", "density", v)} /></Field>
      <Field label="Motion" dirty={m.count("motion") > 0} onReset={() => m.resetGroup("motion")} hint="Always off for visitors who prefer reduced motion."><Segment label="Motion" value={spec.motion ?? "subtle"} options={[{ value: "none", label: "Still" }, { value: "subtle", label: "Subtle" }, { value: "lively", label: "Lively" }]} onChange={(v) => m.apply((o) => ({ ...o, motion: v }), "motion")} /></Field>
    </div>
  )
}

/* ------------------------------------------------------------------ readability */
export function Readability({ m }: M) {
  const { contrast, notices } = m.resolved
  return (
    <div className="grid gap-3" data-testid="readability">
      <ul className="grid gap-1.5 text-sm" aria-label="Contrast checks">
        {contrast.map((k) => (
          <li key={k.label} className="flex items-center justify-between gap-2"><span>{k.label}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", k.ok ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900")}>{k.ok ? "Good" : "Low"} · {k.ratio}:1</span></li>
        ))}
      </ul>
      {notices.length ? <ul aria-label="Readability notes" className="grid gap-1 rounded-xl bg-amber-50 p-3 text-xs text-amber-950">{notices.map((n) => <li key={n.code}>{n.message}</li>)}</ul>
        : <p className="text-xs text-neutral-600">Text needs at least 4.5:1 contrast to be comfortable to read. Taplo adjusts colours automatically if a choice would fall short, and tells you here.</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ whole panel */
/**
 * Everything about the page's appearance, in the order people reach for it. The first groups
 * are open; the rest are one tap away. The same panel runs in the owner editor, in guided
 * setup and in the showcase.
 */
export function AppearancePanel({ m, header = false }: { m: AppearanceModel; header?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5" data-testid="appearance-panel">
      <Disclosure title="Look" defaultOpen id="look" hint="A starting point, not a template. Change anything afterwards."><LookPicker m={m} /></Disclosure>
      <Disclosure title="Colour" defaultOpen id="colour" count={m.count("colors")} onReset={() => m.resetGroup("colors")}><ColourControls m={m} /></Disclosure>
      <Disclosure title="Type" id="type" count={m.count("text")} onReset={() => m.resetGroup("text")}><TypeControls m={m} /></Disclosure>
      {header ? <Disclosure title="Header" defaultOpen id="header" count={m.count("header")} onReset={() => m.resetGroup("header")}><HeaderControls m={m} /></Disclosure> : null}
      <Disclosure title="Buttons" id="buttons" count={m.count("buttons")} onReset={() => m.resetGroup("buttons")}><ButtonControls m={m} /></Disclosure>
      <Disclosure title="Cards" id="cards" count={m.count("cards")} onReset={() => m.resetGroup("cards")}><SurfaceControls m={m} /></Disclosure>
      <Disclosure title="Wallpaper" id="wallpaper" count={m.count("background", "decoration")} onReset={() => m.resetGroup("background", "decoration")}><WallpaperControls m={m} /></Disclosure>
      <Disclosure title="Layout and motion" id="layout" count={m.count("layout", "motion")} onReset={() => m.resetGroup("layout", "motion")}><LayoutControls m={m} /></Disclosure>
      <Disclosure title="Readability" id="readability"><Readability m={m} /></Disclosure>
      <button type="button" disabled={m.totalChanges === 0} onClick={m.resetAll} className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-40" data-testid="reset-appearance">
        <RotateCcw className="size-4" aria-hidden="true" /> Reset all style changes
      </button>
    </div>
  )
}
