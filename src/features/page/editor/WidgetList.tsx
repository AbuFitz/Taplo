"use client"

import * as React from "react"
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type Announcements } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Eye, EyeOff, GripVertical, Lock, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WidgetIcon } from "../widgets/WidgetIcon"
import { getWidget } from "../widgets/registry"
import type { RenderWidget } from "../renderer"
import type { StoredWidget } from "../starter"
import type { Editor } from "./useEditor"

const FIX_HREF: Record<string, string> = { profile: "#profile", services: "/dashboard/services", reviews: "/dashboard/reviews", team: "/dashboard/team", products: "/dashboard/products", settings: "#profile" }

function summary(w: RenderWidget): string {
  const s = w.settings as Record<string, unknown>
  const t = [s.title, s.label, s.headline, s.text].find((x) => typeof x === "string" && x.trim()) as string | undefined
  return t ?? ""
}

function Row({ stored, rw, selected, onSelect, onDetails, ed }: {
  stored: StoredWidget; rw: RenderWidget | undefined; selected: boolean; onSelect: () => void; onDetails: () => void; ed: Editor
}) {
  const def = getWidget(stored.type)!
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: stored.id })
  const status = rw?.status
  const note = status && status.state !== "ready" ? status : null
  const label = def.label
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} data-widget-row={stored.type} data-widget-row-id={stored.id}
      className={cn("rounded-xl border bg-card text-card-foreground", selected && "border-primary ring-1 ring-primary", isDragging && "relative z-10 shadow-lg ring-2 ring-primary", stored.hidden && "opacity-70")}>
      <div className="flex items-center gap-1 p-1.5">
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
        <button type="button" onClick={onSelect} aria-pressed={selected} data-testid="select-widget" className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-1 text-left hover:bg-muted">
          <WidgetIcon name={def.icon} className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{label}{summary(rw ?? ({ settings: stored.settings } as RenderWidget)) ? <span className="font-normal text-muted-foreground"> · {summary(rw ?? ({ settings: stored.settings } as RenderWidget))}</span> : null}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {stored.hidden ? "Hidden from visitors" : rw?.id && stored.type === "booking" && ed.vm?.promotedWidgetId === stored.id ? "Shown as your main action" : note ? (note.state === "locked" ? "Plan needed — not shown" : "Needs content — not shown yet") : "Showing on your page"}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center">
          <Button type="button" variant="ghost" size="icon" className="size-11" aria-pressed={!stored.hidden} aria-label={stored.hidden ? `Show ${label}` : `Hide ${label}`} onClick={() => ed.updateWidget(stored.id, { hidden: !stored.hidden })}>{stored.hidden ? <EyeOff /> : <Eye />}</Button>
        </div>
      </div>
      {note ? (
        <p className="mx-2 mb-2 flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          {note.state === "locked" ? <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /> : <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />}
          <span>{note.reason}{note.state === "empty" && note.fix ? <> {note.fix === "profile" || note.fix === "settings" ? <button type="button" className="font-medium text-primary underline underline-offset-2" onClick={onDetails}>Fix it in Business details</button> : <a className="font-medium text-primary underline underline-offset-2" href={FIX_HREF[note.fix]}>Go there</a>}</> : null}</span>
        </p>
      ) : null}
    </li>
  )
}

/**
 * Sortable widget list. Pointer, touch and keyboard drag are all handled by dnd-kit;
 * move up/down buttons are always available as the accessible alternative.
 */
export function WidgetList({ ed, selectedId, onSelect, onDetails }: { ed: Editor; selectedId: string | null; onSelect: (id: string) => void; onDetails: () => void }) {
  const widgets = ed.state.page.widgets
  const rwById = React.useMemo(() => new Map((ed.vm?.widgets ?? []).map((w) => [w.id, w])), [ed.vm])
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
            {widgets.map((w) => (
              <Row key={w.id} stored={w} rw={rwById.get(w.id)} selected={selectedId === w.id} onSelect={() => onSelect(w.id)} onDetails={onDetails} ed={ed} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  )
}
