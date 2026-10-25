"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddContent } from "./AddContent"
import { ContentCards } from "./ContentCards"
import type { RecordKind } from "./content-model"
import type { Selection } from "./selection"
import type { Editor } from "./useEditor"

/**
 * What is on the page, in order, as readable cards. "Add content" is always the first thing in reach; Organise is a
 * deliberate mode. Choosing a card opens its editing screen (the parent decides where: a panel or a sheet).
 */
export function ContentList({ ed, selection, onSelect, notify }: { ed: Editor; selection: Selection; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const [addOpen, setAddOpen] = React.useState(false)
  const [kind, setKind] = React.useState<RecordKind | null>(null)
  const [repairId, setRepairId] = React.useState<string | null>(null)
  const widgets = ed.state.page.widgets
  const add = () => { setRepairId(null); setKind(null); setAddOpen(true) }
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3" data-testid="structure">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h2 id="widgets-h" className="text-base font-semibold">Page blocks</h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="min-h-10" onClick={add} data-testid="add-widget"><Plus /> Add content</Button>
        </div>
      </div>
      {widgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-5 text-center">
          <h3 className="text-sm font-semibold">Nothing on your page yet</h3>
          <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">Visitors see your name and contact buttons. Add services, photos, reviews and more, and watch each one appear.</p>
          <div className="mt-3 flex justify-center"><Button size="sm" className="min-h-10" onClick={add}><Plus /> Add content</Button></div>
        </div>
      ) : (
        <ContentCards ed={ed} selectedId={selection.kind === "widget" ? selection.id : null} onSelect={(id) => onSelect({ kind: "widget", id })} onDetails={() => onSelect({ kind: "details" })} onAddRecord={(k, id) => { setRepairId(id); setKind(k); setAddOpen(true) }} />
      )}
      <AddContent ed={ed} open={addOpen} onOpenChange={setAddOpen} initialKind={kind} repairId={repairId} onAdded={(id) => { onSelect({ kind: "widget", id }); notify("Added to your page.", true) }} />
    </div>
  )
}
