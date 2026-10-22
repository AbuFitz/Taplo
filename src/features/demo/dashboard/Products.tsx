"use client"

import * as React from "react"
import { Archive, ArchiveRestore, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { ImageField } from "@/features/page/editor/controls"
import { formatMoney } from "@/features/services/format"
import type { ProductContent } from "@/features/businesses/content"
import { newId, normProduct } from "../actions"
import { useDraft } from "../hooks"
import { UrlField } from "../ui"
import { NotBuilt, PageHeader } from "./Panel"

const blank = (): ProductContent => ({ id: newId("prod"), name: "", currency: "GBP", mode: "enquire", archived: false })

/** Products are business records. Product widgets reference them; nothing is copied onto the page. */
export function Products() {
  const { c, setContent } = useDraft()
  const [editing, setEditing] = React.useState<{ p: ProductContent; isNew: boolean } | null>(null)
  const [price, setPrice] = React.useState("")
  const [showErr, setShowErr] = React.useState(false)
  if (!c) return null
  const all = (c.products ?? []).map(normProduct)
  const active = all.filter((p) => !p.archived)
  const archived = all.filter((p) => p.archived)
  const commit = (list: ProductContent[]) => setContent((x) => ({ ...x, products: list }))
  const open = (p: ProductContent, isNew: boolean) => { setPrice(p.priceMinor === undefined ? "" : (p.priceMinor / 100).toFixed(p.priceMinor % 100 === 0 ? 0 : 2)); setShowErr(false); setEditing({ p, isNew }) }
  const save = () => {
    if (!editing) return
    if (!editing.p.name.trim() || (editing.p.mode === "link" && !editing.p.linkUrl)) return setShowErr(true)
    commit(editing.isNew ? [...all, editing.p] : all.map((x) => (x.id === editing.p.id ? editing.p : x)))
    setEditing(null)
  }
  return (
    <>
      <PageHeader title="Products" description="Things you sell. Add them to your page with a Products widget." actions={<Button onClick={() => open(blank(), true)}><Plus /> Add product</Button>} />
      <div className="grid max-w-3xl gap-6">
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6"><h2 className="font-semibold">No products yet</h2><p className="mt-1 text-sm text-muted-foreground">Add a product, then add a Products widget in My page → Content. Until you do, that widget stays hidden.</p></div>
        ) : (
          <ul className="grid gap-3">
            {active.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
                <div className="min-w-0"><p className="font-semibold">{p.name}</p><p className="text-sm text-muted-foreground">{p.priceMinor !== undefined ? formatMoney(p.priceMinor, p.currency) : "No price shown"} · {p.mode === "link" ? "Opens your own link" : "Customers enquire"}</p></div>
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
          {editing ? (
            <div className="grid gap-4">
              <TaploInput label="Name" value={editing.p.name} maxLength={120} error={showErr && !editing.p.name.trim() ? "Give the product a name." : undefined} onChange={(e) => setEditing({ ...editing, p: { ...editing.p, name: e.target.value } })} />
              <div className="grid gap-1.5"><Label htmlFor="pdesc">Description (optional)</Label><Textarea id="pdesc" rows={2} maxLength={800} value={editing.p.description ?? ""} onChange={(e) => setEditing({ ...editing, p: { ...editing.p, description: e.target.value || undefined } })} /></div>
              <TaploInput label="Price (£, optional)" inputMode="decimal" value={price} onChange={(e) => { const r = e.target.value; if (!/^\d{0,6}(\.\d{0,2})?$/.test(r)) return; setPrice(r); setEditing({ ...editing, p: { ...editing.p, priceMinor: r === "" || r === "." ? undefined : Math.round(parseFloat(r) * 100) } }) }} />
              <div className="grid gap-1.5">
                <Label htmlFor="pmode">What happens when someone taps it?</Label>
                <Select value={editing.p.mode} onValueChange={(v) => setEditing({ ...editing, p: { ...editing.p, mode: v as ProductContent["mode"] } })}>
                  <SelectTrigger id="pmode" className="min-h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper"><SelectItem value="enquire">They enquire (call, WhatsApp, email)</SelectItem><SelectItem value="link">It opens my own shop link</SelectItem></SelectContent>
                </Select>
              </div>
              {editing.p.mode === "link" ? <UrlField label="Your shop or payment link" value={editing.p.linkUrl} onCommit={(v) => setEditing({ ...editing, p: { ...editing.p, linkUrl: v } })} /> : null}
              <ImageField label="Picture (optional)" value={editing.p.image ?? null} defaultAlt={editing.p.name || "Product"} maxEdge={900} onChange={(v) => setEditing({ ...editing, p: { ...editing.p, image: v ?? undefined } })} />
            </div>
          ) : null}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save product</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
