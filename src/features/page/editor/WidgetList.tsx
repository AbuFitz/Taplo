"use client"

import * as React from "react"
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type Announcements } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDown, ArrowUp, ChevronDown, Copy, Eye, EyeOff, GripVertical, Lock, TriangleAlert, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { WidgetIcon } from "../widgets/WidgetIcon"
import { getWidget } from "../widgets/registry"
import type { RenderWidget } from "../renderer"
import type { StoredWidget } from "../starter"
import { WidgetAppearanceForm, WidgetFields } from "./WidgetEditor"
import type { Editor } from "./useEditor"

const FIX_HREF: Record<string, string> = { profile: "#profile", services: "/dashboard/services", reviews: "/dashboard/reviews", team: "/dashboard/team", products: "/dashboard/products", settings: "#profile" }

function summary(w: RenderWidget): string {
  const s = w.settings as Record<string, unknown>
  const t = [s.title, s.label, s.headline, s.text].find((x) => typeof x === "string" && x.trim()) as string | undefined
  return t ?? ""
}

function Row({ stored, rw, index, total, open, onToggle, ed, onRemoved, say }: {
  stored: StoredWidget; rw: RenderWidget | undefined; index: number; total: number; open: boolean; onToggle: () => void; ed: Editor; onRemoved: (w: StoredWidget) => void; say: (m: string) => void
}) {
  const def = getWidget(stored.type)!
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: stored.id })
  const status = rw?.status
  const note = status && status.state !== "ready" ? status : null
  const label = def.label
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} data-widget-row={stored.type} data-widget-row-id={stored.id}
      className={cn("rounded-xl border bg-card text-card-foreground", isDragging && "relative z-10 shadow-lg ring-2 ring-primary", stored.hidden && "opacity-70")}>
      <div className="flex items-center gap-1.5 p-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${label}. Or press space, then the arrow keys.`}
          className="grid size-11 shrink-0 cursor-grab place-items-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          style={{ touchAction: "none" }}
          data-testid="drag-handle"
        >
          <GripVertical aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`panel-${stored.id}`} className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 text-left hover:bg-muted">
          <WidgetIcon name={def.icon} className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{label}{summary(rw ?? ({ settings: stored.settings } as RenderWidget)) ? <span className="font-normal text-muted-foreground"> · {summary(rw ?? ({ settings: stored.settings } as RenderWidget))}</span> : null}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {stored.hidden ? "Hidden from visitors" : note ? (note.state === "locked" ? "Plan needed — not shown" : "Needs content — not shown yet") : "Showing on your page"}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className={cn("ml-auto size-4 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
        <div className="flex shrink-0 items-center">
          <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => { ed.moveWidget(stored.id, -1); say(`${label} moved to position ${index} of ${total}`) }}><ArrowUp /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-11" aria-label={`Move ${label} down`} disabled={index === total - 1} onClick={() => { ed.moveWidget(stored.id, 1); say(`${label} moved to position ${index + 2} of ${total}`) }}><ArrowDown /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-11" aria-pressed={!stored.hidden} aria-label={stored.hidden ? `Show ${label}` : `Hide ${label}`} onClick={() => ed.updateWidget(stored.id, { hidden: !stored.hidden })}>{stored.hidden ? <EyeOff /> : <Eye />}</Button>
        </div>
      </div>
      {note ? (
        <p className="mx-2 mb-2 flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          {note.state === "locked" ? <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /> : <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />}
          <span>{note.reason}{note.state === "empty" && note.fix ? <> <a className="font-medium text-primary underline underline-offset-2" href={FIX_HREF[note.fix]}>{note.fix === "profile" || note.fix === "settings" ? "Fix it in Profile" : "Go there"}</a></> : null}</span>
        </p>
      ) : null}
      {open ? (
        <div id={`panel-${stored.id}`} className="border-t p-3">
          <Tabs defaultValue="content">
            <TabsList className="mb-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="look">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="content"><WidgetFields stored={stored} ed={ed} /></TabsContent>
            <TabsContent value="look"><WidgetAppearanceForm stored={stored} ed={ed} /></TabsContent>
          </Tabs>
          {def.simulated ? <p className="mt-3 rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-xs text-amber-950"><strong>Simulated in demo:</strong> payments aren’t connected, so this opens a clearly-labelled mock-up.</p> : null}
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
            {def.multiple ? <Button type="button" variant="outline" size="sm" onClick={() => { const id = ed.duplicateWidget(stored.id); if (id) say(`${label} duplicated`) }}><Copy /> Duplicate</Button> : null}
            <Button type="button" variant="outline" size="sm" onClick={() => { const w = ed.removeWidget(stored.id); if (w) onRemoved(w) }}><Trash2 /> Remove from page</Button>
            <p className="basis-full text-xs text-muted-foreground">Removing a widget only takes it off your page. Your services, team, photos and other records are kept.</p>
          </div>
        </div>
      ) : null}
    </li>
  )
}

/**
 * Sortable widget list. Pointer, touch and keyboard drag are all handled by dnd-kit;
 * move up/down buttons are always available as the accessible alternative.
 */
export function WidgetList({ ed, openId, setOpenId, onRemoved }: { ed: Editor; openId: string | null; setOpenId: (id: string | null) => void; onRemoved: (w: StoredWidget) => void }) {
  const widgets = ed.state.page.widgets
  const rwById = React.useMemo(() => new Map((ed.vm?.widgets ?? []).map((w) => [w.id, w])), [ed.vm])
  const [live, setLive] = React.useState("")
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const name = (id: string | number) => { const w = widgets.find((x) => x.id === id); return w ? getWidget(w.type)?.label ?? "Widget" : "Widget" }
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${name(active.id)}. Position ${widgets.findIndex((w) => w.id === active.id) + 1} of ${widgets.length}.`,
    onDragOver: ({ active, over }) => (over ? `${name(active.id)} is over position ${widgets.findIndex((w) => w.id === over.id) + 1} of ${widgets.length}.` : undefined),
    onDragEnd: ({ active, over }) => (over ? `Dropped ${name(active.id)} at position ${widgets.findIndex((w) => w.id === over.id) + 1} of ${widgets.length}.` : `Dropped ${name(active.id)}. Order unchanged.`),
    onDragCancel: ({ active }) => `Move cancelled. ${name(active.id)} stays where it was.`,
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = widgets.findIndex((w) => w.id === active.id)
    const to = widgets.findIndex((w) => w.id === over.id)
    if (from < 0 || to < 0) return
    ed.reorderWidgets(arrayMove(widgets, from, to).map((w) => w.id))
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} accessibility={{ announcements, screenReaderInstructions: { draggable: "To pick up a widget, press space or enter. Use the up and down arrow keys to move it, then press space or enter to drop it. Press escape to cancel." } }}>
        <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2" aria-label="Widgets on your page" data-testid="widget-list">
            {widgets.map((w, i) => (
              <Row key={w.id} stored={w} rw={rwById.get(w.id)} index={i} total={widgets.length} open={openId === w.id} onToggle={() => setOpenId(openId === w.id ? null : w.id)} ed={ed} onRemoved={onRemoved} say={setLive} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div role="status" aria-live="polite" className="sr-only">{live}</div>
    </>
  )
}
