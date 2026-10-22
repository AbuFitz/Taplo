"use client"

import * as React from "react"
import { Briefcase, LayoutTemplate, Palette, Plus, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddWidgetDialog, StarterDialog } from "./Dialogs"
import { WidgetList } from "./WidgetList"
import { sameSelection, type Selection } from "./selection"
import type { Editor } from "./useEditor"

function Item({ icon: Icon, label, hint, active, onClick, testId }: { icon: typeof Palette; label: string; hint: string; active: boolean; onClick: () => void; testId: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} data-testid={testId}
      className={cn("flex min-h-12 w-full items-center gap-3 rounded-xl border bg-card px-3 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring", active && "border-primary ring-1 ring-primary")}>
      <Icon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      <span className="min-w-0"><span className="block truncate text-sm font-semibold">{label}</span><span className="block truncate text-xs text-muted-foreground">{hint}</span></span>
    </button>
  )
}

/** Left pane: what is on the page, in order. Selecting anything here (or in the preview) opens its controls. */
export function Structure({ ed, selection, onSelect, notify }: { ed: Editor; selection: Selection; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const [addOpen, setAddOpen] = React.useState(false)
  const [starterOpen, setStarterOpen] = React.useState(false)
  const widgets = ed.state.page.widgets
  const name = ed.state.content.identity.name.trim()
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3" data-testid="structure">
      <div className="grid gap-2">
        <Item icon={Palette} label="Page style" hint="Colours, fonts, buttons, spacing" active={sameSelection(selection, { kind: "page" })} onClick={() => onSelect({ kind: "page" })} testId="select-page" />
        <Item icon={LayoutTemplate} label={name || "Header"} hint="Name, logo and header arrangement" active={sameSelection(selection, { kind: "header" })} onClick={() => onSelect({ kind: "header" })} testId="select-header" />
      </div>

      <section aria-labelledby="widgets-h" className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 id="widgets-h" className="text-sm font-semibold">Widgets</h2>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setStarterOpen(true)}><Sparkles /> Suggestions</Button>
            <Button size="sm" onClick={() => setAddOpen(true)} data-testid="add-widget"><Plus /> Add</Button>
          </div>
        </div>
        {widgets.length === 0 ? (
          <div className="rounded-xl border border-dashed p-5 text-center">
            <h3 className="text-sm font-semibold">No widgets yet</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">Visitors see your name and contact buttons. Add services, reviews, photos and more.</p>
            <div className="mt-3 flex justify-center gap-2"><Button variant="outline" size="sm" onClick={() => setStarterOpen(true)}><Sparkles /> Suggestions</Button><Button size="sm" onClick={() => setAddOpen(true)}><Plus /> Add</Button></div>
          </div>
        ) : (
          <WidgetList ed={ed} selectedId={selection.kind === "widget" ? selection.id : null} onSelect={(id) => onSelect({ kind: "widget", id })} onDetails={() => onSelect({ kind: "details" })} />
        )}
      </section>

      <Item icon={Briefcase} label="Business details" hint="Contact, hours, questions, photos" active={sameSelection(selection, { kind: "details" })} onClick={() => onSelect({ kind: "details" })} testId="select-details" />

      <Item icon={Settings} label="Page settings" hint="Search visibility and share text" active={sameSelection(selection, { kind: "settings" })} onClick={() => onSelect({ kind: "settings" })} testId="select-settings" />

      <AddWidgetDialog open={addOpen} onOpenChange={setAddOpen} ed={ed} onAdded={(id) => onSelect({ kind: "widget", id })} />
      <StarterDialog open={starterOpen} onOpenChange={setStarterOpen} ed={ed} onApplied={(m) => notify(m, true)} />
    </div>
  )
}
