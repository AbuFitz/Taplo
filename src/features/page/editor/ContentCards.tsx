"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpToLine, ArrowDownToLine, Eye, EyeOff, GripVertical, Lock, MoreHorizontal } from "lucide-react"
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type Announcements, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
      {s.thumb ? (
        // Uploaded browser-only images deliberately bypass the server image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.thumb.src} alt="" className="size-full object-cover" />
      ) : <WidgetIcon name={icon} className="size-6" />}
    </span>
  )
}

/**
 * What is on the page, as rows that say what each one holds. Tap a row to edit it. Every row has a handle: drag it (or
 * focus it and use the arrow keys) to move it, with the other rows making room as it goes; there is no separate mode
 * for ordering. The row's menu offers the same moves as plain choices, and any move is one undo. A row with nothing to
 * show offers the one step that fixes it, in place, instead of a link to another page.
 */
export function ContentCards({ ed, selectedId, onSelect, onDetails, onAddRecord }: { ed: Editor; selectedId: string | null; onSelect: (id: string) => void; onDetails: () => void; onAddRecord: (kind: RecordKind, widgetId: string) => void }) {
  const sums = useSummaries(ed)
  const widgets = ed.state.page.widgets
  const [msg, setMsg] = React.useState("")
  // Mouse: a few pixels of movement. Touch: only from the handle, after a short press, so the list scrolls normally everywhere else. Keyboard: the handle.
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
  const moveTo = (id: string, to: number) => {
    const from = widgets.findIndex((w) => w.id === id)
    if (from < 0 || from === to || to < 0 || to >= widgets.length) return
    ed.reorderWidgets(arrayMove(widgets, from, to).map((w) => w.id))
    setMsg(`${nm(id)} moved to position ${to + 1}.`)
  }
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    moveTo(String(active.id), widgets.findIndex((w) => w.id === over.id))
  }
  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} autoScroll={{ threshold: { x: 0, y: 0.18 }, acceleration: 14 }} accessibility={{ announcements, screenReaderInstructions: { draggable: "To pick up a row, press space or enter on its handle. Use the arrow keys to move it, then space or enter to drop it. Press escape to cancel." } }}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <ul className="content-block-board" aria-label="Content on your page" data-testid="content-list">
            {widgets.map((w, i) => <Row key={w.id} w={w} i={i} count={widgets.length} ed={ed} sum={sums.get(w.id)!} selected={selectedId === w.id} onSelect={onSelect} onDetails={onDetails} onAddRecord={onAddRecord} moveTo={(to) => moveTo(w.id, to)} />)}
          </ul>
        </SortableContext>
      </DndContext>
      <p role="status" aria-live="polite" className="sr-only">{msg}</p>
    </>
  )
}

function Row({ w, i, count, ed, sum: s, selected, onSelect, onDetails, onAddRecord, moveTo }: {
  w: StoredWidget; i: number; count: number; ed: Editor; sum: ReturnType<typeof summarise>; selected: boolean
  onSelect: (id: string) => void; onDetails: () => void; onAddRecord: (kind: RecordKind, widgetId: string) => void; moveTo: (to: number) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: w.id })
  const def = getWidget(w.type)!
  const main = w.type === "booking" && ed.vm?.promotedWidgetId === w.id
  // What is on the page is the normal state and says nothing; only the exceptions get a line.
  const status = w.hidden ? { text: "Hidden from your page", tone: "muted" } : s.locked ? { text: "Not on your page", tone: "warn" } : s.needs ? { text: "Not on your page yet", tone: "warn" } : null
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} data-widget-row={w.type} data-widget-row-id={w.id}
      className={cn("content-block-card content-block-row bg-card transition-colors", selected && "bg-[var(--signal-soft)]", w.hidden && "opacity-75", isDragging && "relative z-10 shadow-[0_12px_32px_-8px_rgb(10_16_32/0.35)] ring-2 ring-signal")}>
      <div className="flex items-center pr-1">
        <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} data-testid="drag-handle" data-base-ui-swipe-ignore="" style={{ touchAction: "none" }}
          aria-label={`Reorder ${s.name}. Position ${i + 1} of ${count}. Press space, then the arrow keys.`}
          className="grid h-14 w-11 shrink-0 cursor-grab place-items-center text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"><GripVertical aria-hidden="true" className="size-4" /></button>
        <button type="button" onClick={() => {
          if (s.needs?.kind === "details") onDetails()
          else if (s.needs && s.needs.kind !== "self") onAddRecord(s.needs.kind as RecordKind, w.id)
          else onSelect(w.id)
        }} aria-pressed={selected} data-testid="select-widget" className="flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-md py-1 pr-1 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
          <Thumb s={s} icon={def.icon} />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-1.5"><span className="text-sm font-semibold">{s.name}</span>{main ? <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[0.6875rem] font-medium text-neutral-600">Main action</span> : null}</span>
            <span className="block truncate text-xs text-muted-foreground">{s.needs ? s.needs.cta : s.summary || def.description}</span>
            {status ? <span className={cn("mt-0.5 flex items-center gap-1 text-xs font-medium", status.tone === "warn" ? "text-foreground" : "text-muted-foreground")}>{s.locked ? <Lock aria-hidden="true" className="size-3" /> : null}{status.text}</span> : null}
          </span>
        </button>
        <Button type="button" variant="ghost" size="icon" className="size-11 shrink-0" aria-pressed={!w.hidden} aria-label={w.hidden ? `Show ${s.name} on your page` : `Hide ${s.name} from your page`} onClick={() => ed.updateWidget(w.id, { hidden: !w.hidden })}>
          {w.hidden ? <EyeOff /> : <Eye />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon" className="size-11 shrink-0" aria-label={`More for ${s.name}`} data-testid="row-menu"><MoreHorizontal /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Move</DropdownMenuLabel>
            <DropdownMenuItem disabled={i === 0} onSelect={() => moveTo(i - 1)} data-testid="move-up"><ArrowUp /> Up one</DropdownMenuItem>
            <DropdownMenuItem disabled={i === count - 1} onSelect={() => moveTo(i + 1)} data-testid="move-down"><ArrowDown /> Down one</DropdownMenuItem>
            <DropdownMenuItem disabled={i === 0} onSelect={() => moveTo(0)}><ArrowUpToLine /> To the top</DropdownMenuItem>
            <DropdownMenuItem disabled={i === count - 1} onSelect={() => moveTo(count - 1)}><ArrowDownToLine /> To the bottom</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {s.locked ? <p className="mx-3 mb-3 ml-11 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"><Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />{s.locked} Your content is kept.</p> : null}
    </li>
  )
}
