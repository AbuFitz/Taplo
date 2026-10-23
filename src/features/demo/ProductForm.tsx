"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { Segment } from "@/features/appearance/controls"
import { ImageField } from "@/features/page/editor/controls"
import type { ProductContent } from "@/features/businesses/content"
import { UrlField } from "./ui"

export const VEHICLE_FACTS = ["Year", "Mileage", "Fuel", "Gearbox"]
export const AVAILABILITY_LABEL: Record<ProductContent["availability"], string> = { available: "Available", reserved: "Reserved", sold: "Sold", unavailable: "Not available" }

export function productErrors(p: ProductContent): { name?: string; link?: string } {
  const e: { name?: string; link?: string } = {}
  if (!p.name.trim()) e.name = p.kind === "vehicle" ? "Give the vehicle a name, such as “Volvo XC40”." : "Give the item a name."
  if (p.mode === "link" && !p.linkUrl) e.link = "Add the web address this should open."
  return e
}

const toPounds = (m?: number) => (m === undefined ? "" : (m / 100).toFixed(m % 100 === 0 ? 0 : 2))

/**
 * One form for products, vehicles and items you recommend. The dashboard and the page builder's
 * inline "add" both use it, so a record looks and behaves the same wherever it is created.
 */
export function ProductForm({ product, onChange, showErrors }: { product: ProductContent; onChange: (p: ProductContent) => void; showErrors?: boolean }) {
  const [price, setPrice] = React.useState(toPounds(product.priceMinor))
  const errors = showErrors ? productErrors(product) : {}
  const set = (patch: Partial<ProductContent>) => onChange({ ...product, ...patch })
  const vehicle = product.kind === "vehicle"
  const kindLabel = vehicle ? "vehicle" : "item"

  const setKind = (kind: ProductContent["kind"]) => {
    const facts = kind === "vehicle" && product.facts.length === 0 ? VEHICLE_FACTS.map((label) => ({ label, value: "" })) : product.facts
    set({ kind, facts })
  }
  const facts = product.facts
  const setFact = (i: number, patch: Partial<{ label: string; value: string }>) => set({ facts: facts.map((f, n) => (n === i ? { ...f, ...patch } : f)) })

  return (
    <div className="grid gap-5">
      <Segment label="What is it?" value={product.kind} options={[{ value: "product", label: "Product or item" }, { value: "vehicle", label: "Vehicle" }]} onChange={setKind} />
      <TaploInput label="Name" value={product.name} maxLength={120} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
      <TaploInput label="Price (£, optional)" inputMode="decimal" value={price} hint="Leave empty to show no price." onChange={(e) => {
        const r = e.target.value
        if (!/^\d{0,7}(\.\d{0,2})?$/.test(r)) return
        setPrice(r)
        set({ priceMinor: r === "" ? undefined : Math.round(Number(r) * 100) })
      }} />
      <div className="grid gap-1.5"><Label htmlFor={`${product.id}-desc`}>Description (optional)</Label><Textarea id={`${product.id}-desc`} rows={3} maxLength={800} value={product.description ?? ""} onChange={(e) => set({ description: e.target.value || undefined })} /></div>
      <ImageField label="Main picture" value={product.image ?? null} defaultAlt={product.name || "Picture"} maxEdge={1100} onChange={(v) => set({ image: v ?? undefined })} />

      <fieldset className="grid gap-3">
        <legend className="mb-1 text-sm font-medium">Key facts</legend>
        <p className="-mt-2 text-xs text-muted-foreground">{vehicle ? "Year, mileage, fuel and gearbox are the facts buyers ask about first. Empty rows are not shown." : "Size, material, scent: anything that helps someone decide. Empty rows are not shown."}</p>
        {facts.map((f, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_2.75rem] items-end gap-2">
            <TaploInput label="Label" className={i === 0 ? undefined : "[&_label]:sr-only"} value={f.label} maxLength={30} onChange={(e) => setFact(i, { label: e.target.value })} />
            <TaploInput label="Value" className={i === 0 ? undefined : "[&_label]:sr-only"} value={f.value} maxLength={60} onChange={(e) => setFact(i, { value: e.target.value })} />
            <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Remove fact ${f.label || i + 1}`} onClick={() => set({ facts: facts.filter((_, n) => n !== i) })}><Trash2 /></Button>
          </div>
        ))}
        {facts.length < 8 ? <Button type="button" variant="outline" className="justify-self-start" onClick={() => set({ facts: [...facts, { label: "", value: "" }] })}><Plus /> Add a fact</Button> : null}
      </fieldset>

      <div className="grid gap-2">
        <span className="text-sm font-medium">More pictures (optional)</span>
        {product.images.map((img, i) => (
          <ImageField key={i} label={`Picture ${i + 2}`} value={img} defaultAlt={product.name || "Picture"} maxEdge={1100} onChange={(v) => set({ images: v ? product.images.map((x, n) => (n === i ? v : x)) : product.images.filter((_, n) => n !== i) })} />
        ))}
        {product.images.length < 8 ? <ImageField key={`more-${product.images.length}`} label="Add a picture" value={null} defaultAlt={product.name || "Picture"} maxEdge={1100} onChange={(v) => v && set({ images: [...product.images, v] })} /> : null}
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">Availability</span>
        <Segment label="Availability" value={product.availability} options={(Object.keys(AVAILABILITY_LABEL) as ProductContent["availability"][]).map((v) => ({ value: v, label: AVAILABILITY_LABEL[v] }))} onChange={(v) => set({ availability: v })} />
        <p className="text-xs text-muted-foreground">{product.availability === "sold" ? `Marked sold: the ${kindLabel} stays on your page with a Sold label and no enquiry button. Nothing is deleted.` : product.availability === "reserved" ? `Reserved: shown with a Reserved label. Visitors can still ask about it.` : product.availability === "unavailable" ? `Not available: shown without a buy or enquiry button until you change it.` : "Available: visitors can ask about it or follow its link."}</p>
      </div>
      <TaploInput label="Badge (optional)" value={product.badge ?? ""} maxLength={24} hint="A short label like “Just arrived” or “New in”." onChange={(e) => set({ badge: e.target.value || undefined })} />
      <TaploInput label="Group (optional)" value={product.collection ?? ""} maxLength={40} hint={vehicle ? "For example “SUVs” or “Under £10,000”. Items with the same group are shown together." : "For example “Oils”. Items with the same group are shown together."} onChange={(e) => set({ collection: e.target.value || undefined })} />

      <fieldset className="grid gap-3 rounded-2xl bg-black/[0.035] p-4">
        <legend className="sr-only">What happens when someone taps it</legend>
        <span className="text-sm font-medium">What happens when someone taps it?</span>
        <Segment label="Tap action" value={product.mode} options={[{ value: "enquire", label: "They enquire" }, { value: "link", label: "Opens a link" }]} onChange={(v) => set({ mode: v })} />
        {product.mode === "enquire" ? <p className="text-xs text-muted-foreground">They choose to call, WhatsApp or email you about it. This is an enquiry, not a purchase: nothing is paid on Taplo.</p> : (
          <>
            <UrlField label="Web address to open" value={product.linkUrl} onCommit={(v) => set({ linkUrl: v })} help={errors.link} />
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={`${product.id}-aff`} className="text-sm font-normal">This is an affiliate or referral link<span className="block text-xs text-muted-foreground">Visitors are told it is one before they follow it.</span></Label>
              <Switch id={`${product.id}-aff`} checked={product.affiliate} onCheckedChange={(v) => set({ affiliate: v })} />
            </div>
            <p className="text-xs text-muted-foreground">The link opens in a new tab on the other site. Taplo does not take payment or see the order.</p>
          </>
        )}
      </fieldset>
    </div>
  )
}
