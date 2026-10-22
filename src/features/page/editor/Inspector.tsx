"use client"

import * as React from "react"
import { ArrowDown, ArrowLeft, ArrowUp, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WidgetIcon } from "../widgets/WidgetIcon"
import { getWidget } from "../widgets/registry"
import type { StoredWidget } from "../starter"
import { DesignTab } from "./DesignTab"
import { ProfileSections } from "./ContentTab"
import { SettingsTab } from "./SettingsTab"
import { Recommendations } from "./Recommendations"
import { WidgetAppearanceForm, WidgetFields } from "./WidgetEditor"
import type { Selection } from "./selection"
import type { Editor } from "./useEditor"

function Head({ title, hint, icon, onBack }: { title: string; hint?: string; icon?: React.ReactNode; onBack?: () => void }) {
  return (
    <div className="mb-3 flex items-start gap-2">
      {onBack ? <Button type="button" variant="ghost" size="icon" className="-ml-2 size-10 shrink-0" onClick={onBack} aria-label="Back to page style"><ArrowLeft /></Button> : null}
      {icon}
      <div className="min-w-0"><h2 className="truncate text-base font-semibold" data-testid="inspector-title">{title}</h2>{hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}</div>
    </div>
  )
}

/** Right pane: controls for exactly what is selected. Nothing else is shown. */
export function Inspector({ ed, selection, onSelect, notify }: { ed: Editor; selection: Selection; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const back = () => onSelect({ kind: "page" })

  if (selection.kind === "widget") {
    const stored = ed.state.page.widgets.find((w) => w.id === selection.id)
    const def = stored ? getWidget(stored.type) : undefined
    if (!stored || !def) return <Head title="That widget is no longer on the page" onBack={back} />
    return <WidgetInspector ed={ed} stored={stored} onBack={back} onSelect={onSelect} notify={notify} />
  }
  if (selection.kind === "header") {
    return (
      <div data-testid="inspector-header">
        <Head title="Header" hint="Your name, logo and how the top of the page is arranged." onBack={back} />
        <div className="grid gap-2">
          <ProfileSections ed={ed} only="identity" />
          <DesignTab ed={ed} scope="header" />
        </div>
      </div>
    )
  }
  if (selection.kind === "details") {
    return (
      <div data-testid="inspector-details">
        <Head title="Business details" hint="Widgets pull from these, so you only type things once." onBack={back} />
        <ProfileSections ed={ed} only="rest" />
      </div>
    )
  }
  if (selection.kind === "settings") {
    return (
      <div data-testid="inspector-settings">
        <Head title="Page settings" hint="How your page appears in search and when shared." onBack={back} />
        <SettingsTab ed={ed} notify={notify} />
      </div>
    )
  }
  return (
    <div data-testid="inspector-page">
      <Head title="Page style" hint="Applies to the whole page. Select a widget to style just that one." />
      <div className="grid gap-3">
        <Recommendations ed={ed} onSelect={onSelect} notify={notify} />
        <DesignTab ed={ed} scope="page" />
      </div>
    </div>
  )
}

function WidgetInspector({ ed, stored, onBack, onSelect, notify }: { ed: Editor; stored: StoredWidget; onBack: () => void; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const def = getWidget(stored.type)!
  const custom = Object.keys(stored.appearance).length
  const index = ed.state.page.widgets.findIndex((w) => w.id === stored.id)
  return (
    <div data-testid="inspector-widget" data-widget-type={stored.type}>
      <Head title={def.label} hint={def.description} onBack={onBack} icon={<WidgetIcon name={def.icon} className="mt-0.5 size-5 shrink-0 text-muted-foreground" />} />
      <Tabs defaultValue="content" key={stored.id}>
        <TabsList className="mb-3 grid h-11 w-full grid-cols-2">
          <TabsTrigger value="content" className="min-h-11">Content</TabsTrigger>
          <TabsTrigger value="look" className="min-h-11">Appearance{custom ? ` · ${custom}` : ""}</TabsTrigger>
        </TabsList>
        <TabsContent value="content"><WidgetFields stored={stored} ed={ed} /></TabsContent>
        <TabsContent value="look"><WidgetAppearanceForm stored={stored} ed={ed} /></TabsContent>
      </Tabs>
      {def.simulated ? <p className="mt-3 rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-xs text-amber-950"><strong>Simulated in demo:</strong> payments aren’t connected, so this opens a clearly-labelled mock-up.</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
        <Button type="button" variant="outline" className="min-h-11" data-testid="move-up" disabled={index <= 0} onClick={() => ed.moveWidget(stored.id, -1)}><ArrowUp /> Move up</Button>
        <Button type="button" variant="outline" className="min-h-11" data-testid="move-down" disabled={index >= ed.state.page.widgets.length - 1} onClick={() => ed.moveWidget(stored.id, 1)}><ArrowDown /> Move down</Button>
        {def.multiple ? <Button type="button" variant="outline" className="min-h-11" data-testid="duplicate-widget" onClick={() => { const id = ed.duplicateWidget(stored.id); if (id) onSelect({ kind: "widget", id }) }}><Copy /> Duplicate</Button> : null}
        <Button type="button" variant="outline" className="min-h-11" data-testid="remove-widget" onClick={() => { const w = ed.removeWidget(stored.id); if (w) { onSelect({ kind: "page" }); notify(`Removed “${def.label}” from your page. Your records are kept.`, true) } }}><Trash2 /> Remove from page</Button>
        <p className="basis-full text-xs text-muted-foreground">Removing a widget only takes it off your page. Your services, team, photos and other records are kept.</p>
      </div>
    </div>
  )
}
