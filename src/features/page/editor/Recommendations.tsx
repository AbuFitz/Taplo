"use client"

import * as React from "react"
import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { recommend, type Recommendation } from "./recommend"
import type { Selection } from "./selection"
import type { Editor } from "./useEditor"

/** Optional, dismissible suggestions. Accepting one is a single undoable edit. */
export function Recommendations({ ed, onSelect, notify }: { ed: Editor; onSelect: (s: Selection) => void; notify: (msg: string, undoable?: boolean) => void }) {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())
  const items = React.useMemo(() => {
    if (!ed.vm) return []
    return recommend({ business: ed.vm.business, page: ed.state.page, onlineBooking: ed.vm.onlineBooking, readabilityNotices: ed.vm.style.notices.length }).filter((r) => !dismissed.has(r.id)).slice(0, 3)
  }, [ed.vm, ed.state.page, dismissed])
  if (!items.length) return null

  const accept = (r: Recommendation) => {
    if (r.action === "addWidget") { const id = ed.addWidget(r.widget); onSelect({ kind: "widget", id }); notify(`Added ${r.label.replace(/^Add /, "")}.`, true) }
    else if (r.action === "open") onSelect({ kind: r.target })
    else { ed.setAppearance((a) => { const n = { ...a }; delete n.colors; return n }); notify("Colours reset.", true) }
  }

  return (
    <section aria-label="Suggestions" className="grid gap-2 rounded-xl border bg-muted/40 p-3" data-testid="recommendations">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold"><Lightbulb aria-hidden="true" className="size-4" />Suggestions <span className="text-xs font-normal text-muted-foreground">Optional</span></h3>
      <ul className="grid gap-2">
        {items.map((r) => (
          <li key={r.id} className="grid gap-1.5 rounded-lg border bg-card p-2.5" data-testid="recommendation">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><p className="text-sm font-medium">{r.title}</p><p className="text-xs text-muted-foreground">{r.why}</p></div>
              <button type="button" className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted" aria-label={`Dismiss: ${r.title}`} onClick={() => setDismissed((d) => new Set(d).add(r.id))}><X className="size-4" /></button>
            </div>
            <Button type="button" size="sm" variant="outline" className="justify-self-start" onClick={() => accept(r)}>{r.label}</Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
