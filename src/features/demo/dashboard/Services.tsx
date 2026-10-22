"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, Archive, ArchiveRestore, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDuration, formatPrice } from "@/features/services/format"
import type { ServiceContent } from "@/features/businesses/content"
import { blankService, normService } from "../actions"
import { useDraft } from "../hooks"
import { ServiceForm, serviceErrors } from "../ServiceForm"
import { PageHeader } from "./Panel"

export function Services() {
  const { c, ent, setContent } = useDraft()
  const [editing, setEditing] = React.useState<{ svc: ServiceContent; isNew: boolean } | null>(null)
  const [showErrors, setShowErrors] = React.useState(false)
  if (!c || !ent) return null

  const all = (c.services ?? []).map(normService).sort((a, b) => a.sortOrder - b.sortOrder)
  const active = all.filter((s) => !s.archived)
  const archived = all.filter((s) => s.archived)
  const hidden = ent.maxServices === null ? 0 : Math.max(0, active.length - ent.maxServices)

  const commit = (list: ServiceContent[]) => setContent((x) => ({ ...x, services: list.map((s, i) => ({ ...s, sortOrder: i })) }))
  const move = (id: string, dir: -1 | 1) => {
    const list = [...active]
    const i = list.findIndex((s) => s.id === id)
    const j = i + dir
    if (j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j]!, list[i]!]
    commit([...list, ...archived])
  }
  const toggleArchive = (id: string) => commit(all.map((s) => (s.id === id ? { ...s, archived: !s.archived } : s)))
  const save = () => {
    if (!editing) return
    if (Object.keys(serviceErrors(editing.svc)).length) return setShowErrors(true)
    commit(editing.isNew ? [...all, editing.svc] : all.map((s) => (s.id === editing.svc.id ? editing.svc : s)))
    setEditing(null)
    setShowErrors(false)
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="What you offer and what it costs. You set every price; Taplo never fills one in."
        actions={<Button onClick={() => { setShowErrors(false); setEditing({ svc: blankService(all.length), isNew: true }) }}><Plus /> Add service</Button>}
      />
      {hidden > 0 ? (
        <p role="status" className="mb-4 max-w-2xl rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Your plan shows the first {ent.maxServices} services publicly. {hidden} more {hidden === 1 ? "is" : "are"} saved but hidden. Upgrade to Core for unlimited services — nothing is deleted.
        </p>
      ) : null}
      {active.length === 0 ? (
        <div className="max-w-xl rounded-xl border border-dashed p-6">
          <h2 className="font-semibold">No services yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add your first service so customers can see what you offer. Your page hides this section until you do.</p>
        </div>
      ) : (
        <ul className="grid max-w-3xl gap-3">
          {active.map((s, i) => (
            <li key={s.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{s.name || "Untitled service"} {ent.maxServices !== null && i >= ent.maxServices ? <span className="ml-2 rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">Hidden on your plan</span> : null}</p>
                  <p className="text-sm text-muted-foreground">{[formatPrice(s), formatDuration(s.durationMinutes), s.group].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" aria-label={`Move ${s.name} up`} disabled={i === 0} onClick={() => move(s.id, -1)}><ArrowUp /></Button>
                  <Button variant="outline" size="icon" aria-label={`Move ${s.name} down`} disabled={i === active.length - 1} onClick={() => move(s.id, 1)}><ArrowDown /></Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowErrors(false); setEditing({ svc: s, isNew: false }) }}><Pencil /> Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => toggleArchive(s.id)}><Archive /> Archive</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {archived.length ? (
        <section className="mt-8 max-w-3xl">
          <h2 className="mb-2 text-sm font-semibold">Archived</h2>
          <p className="mb-2 text-sm text-muted-foreground">Hidden from your page. Kept so past bookings still make sense.</p>
          <ul className="grid gap-2">
            {archived.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2 text-sm">
                <span>{s.name || "Untitled service"}</span>
                <Button variant="outline" size="sm" onClick={() => toggleArchive(s.id)}><ArchiveRestore /> Restore</Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) { setEditing(null); setShowErrors(false) } }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.isNew ? "Add a service" : "Edit service"}</DialogTitle>
            <DialogDescription>Customers see this on your page.</DialogDescription>
          </DialogHeader>
          {editing ? <ServiceForm key={editing.svc.id} service={editing.svc} showErrors={showErrors} onChange={(svc) => setEditing({ ...editing, svc })} /> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
