"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpToLine, ArrowDownToLine, Check, ChevronRight, Eye, EyeOff, GripVertical, Lock, MoreHorizontal, Star } from "lucide-react"
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type Announcements, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { WidgetIcon } from "../widgets/WidgetIcon"
import { getWidget } from "../widgets/registry"
import type { StoredWidget } from "../starter"
import { summarise, type RecordKind } from "./content-model"
import type { Editor } from "./useEditor"

function useSummaries(ed: Editor) {
  return React.useMemo(() => new Map(ed.state.page.widgets.map((w) => [w.id, summarise(w, ed.records, ed.vm?.ctx ?? null)])), [ed.state.page.widgets, ed.records, ed.vm])
}

function Thumb({ s, icon }: { s: ReturnType<typeof summarise>; icon: string }) {
  return (
    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
      {s.thumb ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.thumb.src} alt="" className="size-full object-cover" /> : <WidgetIcon name={icon} className="size-6" />}
    </span>
  )
}

/**
 * Browse mode: what is on the page, as cards that say what each one holds. Tap a card to edit it. There are no
 * drag handles here (ordering is its own mode), and a card with nothing to show offers the one step that fixes it,
 * in place, instead of a link to another page.
 */
export function ContentCards({ ed, selectedId, onSelect, onDetails, onAddRecord }: { ed: Editor; selectedId: string | null; onSelect: (id: string) => void; onDetails: () => void; onAddRecord: (kind: RecordKind) => void }) {
  const sums = useSummaries(ed)
  const widgets = ed.state.page.widgets
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-2" aria-label="Content on your page" data-testid="content-list">
      {widgets.map((w) => {
        const s = sums.get(w.id)!
        const def = getWidget(w.type)!
        const main = w.type === "booking" && ed.vm?.promotedWidgetId === w.id
        const status = w.hidden ? { text: "Hidden", tone: "muted" } : s.locked ? { text: "Not on your page", tone: "warn" } : s.needs ? { text: "Not on your page yet", tone: "warn" } : { text: "On your page", tone: "ok" }
        return (
          <li key={w.id} data-widget-row={w.type} data-widget-row-id={w.id} className={cn("rounded-2xl border bg-card", selectedId === w.id && "border-primary ring-1 ring-primary", w.hidden && "opacity-75")}>
            <div className="flex items-center gap-1 p-1.5">
              <button type="button" onClick={() => onSelect(w.id)} aria-pressed={selectedId === w.id} data-testid="select-widget" className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
                <Thumb s={s} icon={def.icon} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5"><span className="truncate text-sm font-semibold">{s.name}</span>{main ? <Star aria-label="Main action" className="size-3.5 shrink-0 fill-amber-400 text-amber-500" /> : null}</span>
                  <span className="block truncate text-xs text-muted-foreground">{s.summary || (s.needs ? "Nothing to show yet" : def.description)}</span>
                  <span className={cn("mt-0.5 inline-flex items-center gap-1 text-[0.6875rem] font-medium", status.tone === "ok" ? "text-emerald-700" : status.tone === "warn" ? "text-amber-800" : "text-muted-foreground")}>
                    {status.tone === "ok" ? <Check aria-hidden="true" className="size-3" /> : s.locked ? <Lock aria-hidden="true" className="size-3" /> : null}{status.text}{main ? " · shown as your main action" : ""}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              </button>
              <Button type="button" variant="ghost" size="icon" className="size-11 shrink-0" aria-pressed={!w.hidden} aria-label={w.hidden ? `Show ${s.name} on your page` : `Hide ${s.name} from your page`} onClick={() => ed.updateWidget(w.id, { hidden: !w.hidden })}>
                {w.hidden ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {s.needs ? (
              <div className="px-2 pb-2">
                {s.needs.kind === "details" ? <Button variant="outline" className="min-h-11 w-full justify-start" onClick={onDetails}>{s.needs.cta}</Button> : s.needs.kind === "self" ? <Button variant="outline" className="min-h-11 w-full justify-start" onClick={() => onSelect(w.id)} data-testid="needs-cta">{s.needs.cta}</Button> : <Button variant="outline" className="min-h-11 w-full justify-start" onClick={() => onAddRecord(s.needs!.kind as RecordKind)} data-testid="needs-cta">{s.needs.cta}</Button>}
              </div>
            ) : null}
            {s.locked ? <p className="mx-2 mb-2 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"><Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />{s.locked} Your content is kept.</p> : null}
          </li>
        )
      })}
    </ul>
  )
}

function OrganiseRow({ w, name, summary, index, count, others, move, ed }: {
  w: StoredWidget; name: string; summary: string; index: number; count: number; others: { id: string; name: string }[]
  move: (to: number) => void; ed: Editor
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: w.id })
  const def = getWidget(w.type)!
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} data-widget-row={w.type} data-widget-row-id={w.id}
      className={cn("rounded-2xl border bg-card", isDragging && "relative z-10 shadow-xl ring-2 ring-primary", w.hidden && "opacity-70")}>
      <div className="flex items-center gap-1 p-1.5">
        <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} data-testid="drag-handle" data-base-ui-swipe-ignore="" style={{ touchAction: "none" }}
          aria-label={`Reorder ${name}. Position ${index + 1} of ${count}. Press space, then the arrow keys.`}
          className="grid size-12 shrink-0 cursor-grab place-items-center rounded-xl bg-muted text-muted-foreground outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"><GripVertical aria-hidden="true" className="size-5" /></button>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted/60 text-muted-foreground"><WidgetIcon name={def.icon} className="size-4" /></span>
        <span className="min-w-0 flex-1 px-1"><span className="block truncate text-sm font-semibold">{index + 1}. {name}</span><span className="block truncate text-xs text-muted-foreground">{w.hidden ? "Hidden · " : ""}{summary}</span></span>
        <Button type="button" variant="ghost" size="icon" className="size-11" disabled={index === 0} aria-label={`Move ${name} up`} data-testid="move-up" onClick={() => ed.moveWidget(w.id, -1)}><ArrowUp /></Button>
        <Button type="button" variant="ghost" size="icon" className="size-11" disabled={index === count - 1} aria-label={`Move ${name} down`} data-testid="move-down" onClick={() => ed.moveWidget(w.id, 1)}><ArrowDown /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`More ways to move ${name}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 w-60 overflow-y-auto">
            <DropdownMenuItem disabled={index === 0} onSelect={() => move(0)}><ArrowUpToLine /> Move to the top</DropdownMenuItem>
            <DropdownMenuItem disabled={index === count - 1} onSelect={() => move(count - 1)}><ArrowDownToLine /> Move to the bottom</DropdownMenuItem>
            <DropdownMenuSeparator /><DropdownMenuLabel>Move to just after</DropdownMenuLabel>
            {others.map((o) => <DropdownMenuItem key={o.id} onSelect={() => { const to = ed.state.page.widgets.findIndex((x) => x.id === o.id); const from = index; move(from < to ? to : to + 1) }}>{o.name}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}

/**
 * Organise mode: an explicit mode for ordering, with large handles, buttons and a "move to" menu as alternatives
 * to dragging, auto-scroll while dragging, keyboard support, and Cancel to put everything back. Each completed
 * move is one undo step, and ordering never touches the main action, which is set separately.
 */
export function OrganiseList({ ed, onDone }: { ed: Editor; onDone: () => void }) {
  const widgets = ed.state.page.widgets
  const sums = useSummaries(ed)
  const [startOrder] = React.useState<string[]>(() => widgets.map((w) => w.id))
  const [msg, setMsg] = React.useState("")
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const nm = (id: string | number) => sums.get(String(id))?.name ?? "Content"
  const pos = (id: string | number) => widgets.findIndex((w) => w.id === id) + 1
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${nm(active.id)}. Position ${pos(active.id)} of ${widgets.length}.`,
    onDragOver: ({ active, over }) => (over ? `${nm(active.id)} is over position ${pos(over.id)} of ${widgets.length}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `Dropped ${nm(active.id)} at position ${pos(over.id)} of ${widgets.length}.` : `Dropped ${nm(active.id)}. Order unchanged.`),
    onDragCancel: ({ active }) => `Move cancelled. ${nm(active.id)} stays where it was.`,
  }
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = widgets.findIndex((w) => w.id === active.id), to = widgets.findIndex((w) => w.id === over.id)
    if (from < 0 || to < 0) return
    ed.reorderWidgets(arrayMove(widgets, from, to).map((w) => w.id))
    setMsg(`${nm(active.id)} moved to position ${to + 1}.`)
  }
  const moveTo = (id: string, to: number) => {
    const from = widgets.findIndex((w) => w.id === id)
    if (from < 0 || from === to) return
    ed.reorderWidgets(arrayMove(widgets, from, to).map((w) => w.id))
    setMsg(`${nm(id)} moved to position ${to + 1}.`)
  }
  const changed = widgets.map((w) => w.id).join() !== startOrder.join()
  return (
    <div className="grid gap-3" data-testid="organise-panel">
      <p className="text-xs text-muted-foreground">Drag a handle, or use the arrows and the menu. The first item is at the top of your page. Which action is highlighted is a separate choice and does not change when you reorder.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} autoScroll={{ threshold: { x: 0, y: 0.18 }, acceleration: 14 }} accessibility={{ announcements, screenReaderInstructions: { draggable: "To pick up an item, press space or enter. Use the up and down arrow keys to move it, then press space or enter to drop it. Press escape to cancel." } }}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2" aria-label="Order of content on your page" data-testid="widget-list">
            {widgets.map((w, i) => <OrganiseRow key={w.id} w={w} name={sums.get(w.id)?.name ?? "Content"} summary={sums.get(w.id)?.summary ?? ""} index={i} count={widgets.length} ed={ed} move={(to) => moveTo(w.id, to)} others={widgets.filter((x) => x.id !== w.id).map((x) => ({ id: x.id, name: sums.get(x.id)?.name ?? "Content" }))} />)}
          </ul>
        </SortableContext>
      </DndContext>
      <p role="status" aria-live="polite" className="min-h-5 text-xs font-medium text-muted-foreground">{msg}</p>
      <div className="sticky bottom-0 -mx-1 flex gap-2 bg-background/95 px-1 py-2 backdrop-blur">
        <Button variant="outline" className="min-h-11 flex-1" disabled={!changed} onClick={() => { ed.reorderWidgets(startOrder); setMsg("Order put back."); }} data-testid="organise-cancel">Cancel changes</Button>
        <Button className="min-h-11 flex-1" onClick={onDone} data-testid="organise-done">Done</Button>
      </div>
    </div>
  )
}
