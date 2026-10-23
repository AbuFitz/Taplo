"use client"

import * as React from "react"
import { Archive, ArchiveRestore, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatMoney } from "@/features/services/format"
import type { ProductContent } from "@/features/businesses/content"
import { newId, normProduct } from "../actions"
import { ProductForm, VEHICLE_FACTS, productErrors, AVAILABILITY_LABEL } from "../ProductForm"
import { useDraft } from "../hooks"
import { NotBuilt, PageHeader } from "./Panel"

export const blankProduct = (kind: ProductContent["kind"] = "product"): ProductContent => ({ id: newId("prod"), name: "", currency: "GBP", mode: "enquire", archived: false, facts: kind === "vehicle" ? VEHICLE_FACTS.map((label) => ({ label, value: "" })) : [], kind, availability: "available", images: [], affiliate: false })

/** Products are business records. Product widgets reference them; nothing is copied onto the page. */
export function Products() {
  const { c, setContent } = useDraft()
  const [editing, setEditing] = React.useState<{ p: ProductContent; isNew: boolean } | null>(null)
  const [showErr, setShowErr] = React.useState(false)
  if (!c) return null
  const all = (c.products ?? []).map(normProduct)
  const active = all.filter((p) => !p.archived)
  const archived = all.filter((p) => p.archived)
  const commit = (list: ProductContent[]) => setContent((x) => ({ ...x, products: list }))
  const open = (p: ProductContent, isNew: boolean) => { setShowErr(false); setEditing({ p, isNew }) }
  const save = () => {
    if (!editing) return
    if (Object.keys(productErrors(editing.p)).length) return setShowErr(true)
    commit(editing.isNew ? [...all, editing.p] : all.map((x) => (x.id === editing.p.id ? editing.p : x)))
    setEditing(null)
  }
  return (
    <>
      <PageHeader title="Products and vehicles" description="Things you sell, recommend or have in stock. Show them on your page with a Products widget." actions={<Button onClick={() => open(blankProduct(), true)}><Plus /> Add item</Button>} />
      <div className="grid max-w-3xl gap-6">
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6"><h2 className="font-semibold">No products yet</h2><p className="mt-1 text-sm text-muted-foreground">Add a product, then add a Products widget in My page → Content. Until you do, that widget stays hidden.</p></div>
        ) : (
          <ul className="grid gap-3">
            {active.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                <div className="min-w-0"><p className="font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.priceMinor !== undefined ? formatMoney(p.priceMinor, p.currency) : "No price shown"} · {p.mode === "link" ? (p.affiliate ? "Opens an affiliate link" : "Opens your own link") : "Customers enquire"} · {p.kind === "vehicle" ? "Vehicle" : "Product"} · <strong className={p.availability === "available" ? "font-medium" : "font-semibold text-foreground"}>{AVAILABILITY_LABEL[p.availability]}</strong></p></div>
                <div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => open(p, false)}><Pencil /> Edit</Button><Button variant="outline" size="sm" onClick={() => commit(all.map((x) => (x.id === p.id ? { ...x, archived: true } : x)))}><Archive /> Archive</Button></div>
              </li>
            ))}
          </ul>
        )}
        {archived.length ? (
          <section><h2 className="mb-2 text-sm font-semibold">Archived</h2><ul className="grid gap-2">{archived.map((p) => <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2 text-sm"><span>{p.name}</span><Button variant="outline" size="sm" onClick={() => commit(all.map((x) => (x.id === p.id ? { ...x, archived: false } : x)))}><ArchiveRestore /> Restore</Button></li>)}</ul></section>
        ) : null}
        <NotBuilt title="Checkout, orders and NFC products" phase="Phase 9">
          <p>Not built yet: shopping cart, payments, order fulfilment, and optional NFC cards/stickers/keyrings. Today a product opens an enquiry (call, WhatsApp, email) or a link to your own shop.</p>
        </NotBuilt>
      </div>
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing?.isNew ? "Add a product" : "Edit product"}</DialogTitle><DialogDescription>Shown in any Products widget on your page.</DialogDescription></DialogHeader>
          {editing ? <ProductForm product={editing.p} onChange={(p) => setEditing({ ...editing, p })} showErrors={showErr} /> : null}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save product</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
