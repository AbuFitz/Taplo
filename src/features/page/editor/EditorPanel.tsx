"use client"

import * as React from "react"
import { ArrowLeft, Briefcase, LayoutTemplate, Palette, Rows3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getWidget } from "../widgets/registry"
import { ContentList } from "./ContentList"
import { Inspector } from "./Inspector"
import { CONTENT, rootOf, tabOf, type EditorTab, type Selection } from "./selection"
import type { Editor } from "./useEditor"

const TABS: { id: EditorTab; label: string; icon: typeof Palette }[] = [
  { id: "content", label: "Content", icon: Rows3 },
  { id: "header", label: "Header", icon: LayoutTemplate },
  { id: "design", label: "Design", icon: Palette },
  { id: "settings", label: "Settings", icon: Briefcase },
]

/**
 * The one editing panel (desktop and tablet): four tabs, one column, no horizontal scroll. Content lists what is on the
 * page and drills into one item at a time; Header, Design and Settings hold the rest. A phone gets the same four tabs
 * as bottom sheets (MobileEditor). Everything below is the same Inspector the sheets use.
 */
export function EditorPanel({ ed, selection, onSelect, notify }: { ed: Editor; selection: Selection; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const tab = tabOf(selection)
  const widget = selection.kind === "widget" ? ed.state.page.widgets.find((w) => w.id === selection.id) : undefined
  const widgetLabel = widget ? getWidget(widget.type)?.label ?? "Content" : "Content"
  const body = React.useRef<HTMLDivElement>(null)
  // A new screen starts at its top.
  const screen = selection.kind === "widget" ? selection.id : selection.kind
  React.useEffect(() => { body.current?.scrollTo({ top: 0 }) }, [tab, screen])

  return (
    <section aria-label="Edit your page" className="flex h-[calc(100dvh-6.5rem)] min-h-[30rem] min-w-0 flex-col overflow-hidden rounded-2xl border bg-card" data-testid="editor-panel">
      <div role="tablist" aria-label="Editor sections" className="grid shrink-0 grid-cols-4 gap-1 border-b bg-muted/40 p-1.5">
        {TABS.map((t) => {
          const on = tab === t.id
          return (
            <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={on} aria-controls="editor-tabpanel" data-testid={`tab-${t.id}`} onClick={() => onSelect(on && t.id === "content" ? CONTENT : rootOf(t.id))}
              className={cn("flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", on ? "bg-background text-foreground shadow-sm ring-1 ring-black/[0.06]" : "text-muted-foreground hover:bg-background/60 hover:text-foreground")}>
              <t.icon aria-hidden="true" className="size-4" />{t.label}
            </button>
          )
        })}
      </div>
      <div ref={body} id="editor-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4" data-testid="inspector">
        {selection.kind === "widget" ? (
          <div className="mb-3 flex items-center gap-1">
            <Button type="button" variant="ghost" size="sm" className="-ml-2 min-h-10 gap-1.5 px-2" onClick={() => onSelect(CONTENT)} data-testid="back-to-content"><ArrowLeft /> Your content</Button>
            <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold" data-testid="inspector-title">{widgetLabel}</span>
          </div>
        ) : null}
        {selection.kind === "content" ? <ContentList ed={ed} selection={selection} onSelect={onSelect} notify={notify} /> : tab === "settings" ? <SettingsBody ed={ed} selection={selection} onSelect={onSelect} notify={notify} /> : <Inspector ed={ed} selection={selection} onSelect={onSelect} notify={notify} compact />}
      </div>
    </section>
  )
}

/** Settings: business details first (what widgets pull from), page settings second. */
export function SettingsBody({ ed, selection, onSelect, notify }: { ed: Editor; selection: Selection; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const [part, setPart] = React.useState<"details" | "settings">(selection.kind === "settings" ? "settings" : "details")
  const pick = (p: "details" | "settings") => { setPart(p); onSelect({ kind: p }) }
  return (
    <div className="grid gap-4">
      <div role="group" aria-label="Settings" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {([["details", "Business details"], ["settings", "Page settings"]] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={part === id} onClick={() => pick(id)} className={cn("min-h-10 rounded-lg px-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring", part === id ? "bg-background shadow-sm" : "text-muted-foreground")}>{label}</button>
        ))}
      </div>
      <Inspector ed={ed} selection={{ kind: part }} onSelect={onSelect} notify={notify} compact />
    </div>
  )
}
