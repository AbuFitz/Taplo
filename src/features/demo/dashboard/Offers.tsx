"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { newId } from "../actions"
import { useDraft } from "../hooks"

/** Offers are records (like services). The Offers widget shows the live ones and hides any that have expired. */
export function Offers() {
  const { c, setContent } = useDraft()
  const [f, setF] = React.useState({ title: "", description: "", code: "", endsAt: "" })
  const [err, setErr] = React.useState<string>()
  if (!c) return null
  const offers = (c.offers ?? []).filter((o) => !o.archived)
  const today = new Date().toISOString().slice(0, 10)
  const add = () => {
    if (!f.title.trim()) return setErr("Give the offer a title.")
    setErr(undefined)
    setContent((x) => ({ ...x, offers: [...(x.offers ?? []), { id: newId("offer"), title: f.title.trim(), description: f.description.trim() || undefined, code: f.code.trim() || undefined, endsAt: f.endsAt || undefined, archived: false }] }))
    setF({ title: "", description: "", code: "", endsAt: "" })
  }
  return (
    <section className="mt-10 max-w-3xl" aria-labelledby="offers-h">
      <h2 id="offers-h" className="text-lg font-semibold">Offers</h2>
      <p className="mb-3 text-sm text-muted-foreground">Deals and promotions. Add an Offers widget in My page to show them. Expired offers hide themselves.</p>
      {offers.length ? (
        <ul className="mb-4 grid gap-2">
          {offers.map((o) => (
            <li key={o.id} className="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm">
              <div><p className="font-semibold">{o.title}{o.endsAt && o.endsAt < today ? <span className="ml-2 rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">Expired — hidden</span> : null}</p>{o.description ? <p className="text-muted-foreground">{o.description}</p> : null}<p className="text-xs text-muted-foreground">{[o.code ? `Code ${o.code}` : null, o.endsAt ? `Until ${o.endsAt}` : null].filter(Boolean).join(" · ")}</p></div>
              <Button variant="outline" size="icon" aria-label={`Remove offer ${o.title}`} onClick={() => setContent((x) => ({ ...x, offers: (x.offers ?? []).filter((q) => q.id !== o.id) }))}><Trash2 /></Button>
            </li>
          ))}
        </ul>
      ) : <p className="mb-4 text-sm text-muted-foreground">No offers yet.</p>}
      <div className="grid gap-3 rounded-xl border p-4">
        <TaploInput label="Offer title" value={f.title} maxLength={120} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <div className="grid gap-1.5"><Label htmlFor="odesc">Details (optional)</Label><Textarea id="odesc" rows={2} maxLength={600} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="grid gap-3 sm:grid-cols-2"><TaploInput label="Code to mention (optional)" value={f.code} maxLength={40} onChange={(e) => setF({ ...f, code: e.target.value })} /><TaploInput label="Last day (optional)" type="date" value={f.endsAt} onChange={(e) => setF({ ...f, endsAt: e.target.value })} /></div>
        {err ? <p role="alert" className="text-sm text-destructive">{err}</p> : null}
        <Button className="justify-self-start" onClick={add}><Plus /> Add offer</Button>
        <p className="text-xs text-muted-foreground">Codes are shown as text only; Taplo doesn’t check or redeem them.</p>
      </div>
    </section>
  )
}
