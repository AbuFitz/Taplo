"use client"

import * as React from "react"
import Link from "next/link"
import { Shot } from "@/features/marketing/Shot"
import type { StyleOverrides } from "@/features/page/contracts/style"
import { UseDesign } from "./UseDesign"
import { cn } from "@/lib/utils"
import { CAPABILITY_TAGS, STYLE_TAGS, type CapabilityTag, type StyleTag } from "./facets"

export interface GalleryItem {
  slug: string; name: string; hook: string; industry: string; industryLabel: string
  lookId: string; lookName: string; overrides: StyleOverrides; heading: string; header: string
  style: StyleTag[]; capabilities: CapabilityTag[]
}
export interface GalleryProps { items: GalleryItem[]; industries: { id: string; label: string }[]; initialIndustry?: string }

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

/**
 * The one place to explore designs. Every card is a composed page captured from the real renderer; the filters read the
 * design's own configuration. The example business is only the content a design is shown with: any design suits any business.
 */
export function Gallery({ items, industries, initialIndustry }: GalleryProps) {
  const [view, setView] = React.useState<"desktop" | "phone">("phone")
  const [style, setStyle] = React.useState<StyleTag[]>([])
  const [caps, setCaps] = React.useState<CapabilityTag[]>([])
  const [filtersOpen, setFiltersOpen] = React.useState(Boolean(initialIndustry))
  const filterId = React.useId()
  const [biz, setBiz] = React.useState<string | null>(initialIndustry ?? null)
  const shown = items.filter((i) => style.every((s) => i.style.includes(s)) && caps.every((c) => i.capabilities.includes(c)) && (!biz || i.industry === biz))
  const filtering = style.length + caps.length > 0 || biz !== null
  return (
    <div>
      <div className="mb-5 border-b border-foreground/10 pb-5" data-testid="gallery-filters">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" aria-expanded={filtersOpen} aria-controls={filterId} onClick={() => setFiltersOpen((v) => !v)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/20 px-4 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/60">Filters{filtering ? <span className="grid size-5 place-items-center rounded-full bg-foreground text-xs text-background">{style.length + caps.length + (biz ? 1 : 0)}</span> : <span aria-hidden="true" className={cn("text-lg leading-none", filtersOpen && "rotate-45")}>+</span>}</button>
          <div role="radiogroup" aria-label="Preview on" className="inline-flex rounded-full bg-foreground/[0.06] p-1">
            {(["phone", "desktop"] as const).map((v) => (
              <label key={v} className={cn("min-h-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", view === v ? "bg-background shadow-sm" : "text-foreground/65")}>
                <input type="radio" name="view" value={v} checked={view === v} onChange={() => setView(v)} className="sr-only" />{v === "desktop" ? "Desktop" : "Phone"}
              </label>
            ))}
          </div>
        </div>
        <div id={filterId} hidden={!filtersOpen}>
          <div className="mt-4 grid gap-5 rounded-2xl bg-muted p-5">
            <Group label="Style" tags={[...STYLE_TAGS]} active={style} onToggle={(t) => setStyle((a) => toggle(a, t as StyleTag))} />
            <Group label="Page has" tags={[...CAPABILITY_TAGS]} active={caps} onToggle={(t) => setCaps((a) => toggle(a, t as CapabilityTag))} />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/70">Shown with
                <select value={biz ?? ""} onChange={(e) => setBiz(e.target.value || null)} className="min-h-11 max-w-full rounded-full border border-foreground/20 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/60" aria-describedby="biz-note">
                  <option value="">Any business</option>
                  {industries.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
                </select>
              </label>
              {filtering ? <button type="button" onClick={() => { setStyle([]); setCaps([]); setBiz(null) }} className="min-h-11 text-sm font-medium underline underline-offset-4">Clear filters</button> : null}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/60"><p id="biz-note">Every design works for any business.</p><p aria-live="polite" data-testid="gallery-count">{shown.length} of {items.length} designs</p></div>
      </div>

      {shown.length === 0 ? <p className="py-20 text-lg text-foreground/70">No design has all of those. Take one filter off.</p> : (
        <ul className={cn("mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-16", view === "desktop" ? "lg:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4")} data-testid="gallery-list" data-view={view}>
          {shown.map((d, n) => (
            <li key={d.slug} className={cn(view === "phone" && n % 2 === 1 && "xl:mt-8")} data-testid="design-card">
              <Link href={`/inspiration/${d.slug}`} aria-label={`${d.name}: open this design`} className="group block outline-none">
                {view === "desktop"
                  ? <Shot id={`ex-${d.slug}-desk` as never} alt={`${d.name}'s page on a desktop screen`} width={720} frame="browser" priority={n < 2} className="w-full transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none" />
                  : <Shot id={`ex-${d.slug}-phone` as never} alt={`${d.name}'s page on a phone`} width={300} cropTo={560} priority={n < 4} className="mx-auto transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none" />}
              </Link>
              <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="min-w-0">
                  <h2 className="font-display font-display-tight text-[clamp(1.5rem,2.4vw,2rem)]"><Link href={`/inspiration/${d.slug}`} className="hover:underline underline-offset-4">{d.lookName}</Link></h2>
                  <p className="mt-1 text-foreground/70">{d.hook}</p>
                  <p className="mt-2 text-sm text-foreground/60">Shown with {d.name}</p>
                </div>
                <UseDesign slug={d.slug} lookId={d.lookId} lookName={d.lookName} overrides={d.overrides} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Group({ label, tags, active, onToggle }: { label: string; tags: string[]; active: string[]; onToggle: (t: string) => void }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span className="mr-1 text-sm font-medium text-foreground/70" aria-hidden="true">{label}</span>
      {tags.map((t) => <Chip key={t} on={active.includes(t)} onClick={() => onToggle(t)}>{t}</Chip>)}
    </fieldset>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={cn("inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60", on ? "border-foreground bg-foreground text-background" : "border-foreground/20 hover:border-foreground/50")}>{children}</button>
}
