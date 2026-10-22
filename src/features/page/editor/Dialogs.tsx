"use client"

import * as React from "react"
import { Lock, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getIndustryPreset } from "@/features/themes/presets/industries"
import { WIDGET_CATEGORIES, type WidgetType } from "../contracts/widgets"
import { planStarter } from "../starter"
import { WidgetIcon } from "../widgets/WidgetIcon"
import { WIDGETS, getWidget } from "../widgets/registry"
import { CATEGORY_LABEL } from "../widgets/types"
import type { Editor } from "./useEditor"

export function AddWidgetDialog({ open, onOpenChange, ed, onAdded }: { open: boolean; onOpenChange: (o: boolean) => void; ed: Editor; onAdded: (id: string, type: WidgetType) => void }) {
  const [q, setQ] = React.useState("")
  const have = new Set(ed.state.page.widgets.map((w) => w.type as string))
  const list = Object.values(WIDGETS).filter((d) => !q.trim() || `${d.label} ${d.description}`.toLowerCase().includes(q.trim().toLowerCase()))
  const planNeeded = (type: WidgetType) => {
    const s = ed.vm ? getWidget(type)!.status(ed.vm.widgets.find((w) => w.type === type)?.settings ?? {}, ed.vm.ctx) : null
    return s?.state === "locked" ? s.reason : null
  }
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setQ("") }}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a widget</DialogTitle>
          <DialogDescription>Widgets are the building blocks of your page. They use your existing services, team and photos, so nothing is typed twice.</DialogDescription>
        </DialogHeader>
        <Input aria-label="Search widgets" placeholder="Search: reviews, gallery, video…" value={q} onChange={(e) => setQ(e.target.value)} className="min-h-11" />
        <div className="grid gap-5">
          {WIDGET_CATEGORIES.map((cat) => {
            const items = list.filter((d) => d.category === cat)
            if (!items.length) return null
            return (
              <section key={cat} aria-label={CATEGORY_LABEL[cat]}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{CATEGORY_LABEL[cat]}</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {items.map((d) => {
                    const already = !d.multiple && have.has(d.type)
                    const locked = planNeeded(d.type)
                    return (
                      <li key={d.type}>
                        <button type="button" disabled={already} onClick={() => { const id = ed.addWidget(d.type); onAdded(id, d.type); onOpenChange(false); setQ("") }}
                          className="flex min-h-14 w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors enabled:hover:bg-muted disabled:opacity-55">
                          <WidgetIcon name={d.icon} className="mt-0.5 size-5 shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{d.label}{d.simulated ? <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-900">Simulated</span> : null}</span>
                            <span className="block text-xs text-muted-foreground">{already ? "Already on your page" : d.description}</span>
                            {locked && !already ? <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Lock aria-hidden="true" className="size-3" />{locked}</span> : null}
                          </span>
                          {!already ? <Plus aria-hidden="true" className="ml-auto size-4 shrink-0 text-muted-foreground" /> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
          {!list.length ? <p className="text-sm text-muted-foreground">No widgets match “{q}”.</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Applying a starter is its own action: preview exactly what is kept, added and removed, then it is undoable. */
export function StarterDialog({ open, onOpenChange, ed, onApplied }: { open: boolean; onOpenChange: (o: boolean) => void; ed: Editor; onApplied: (msg: string) => void }) {
  const [mode, setMode] = React.useState<"add" | "replace">("add")
  const industry = getIndustryPreset(ed.state.content.identity.industryKey)
  const plan = React.useMemo(() => planStarter(ed.state.page.widgets, industry.id, mode), [ed.state.page.widgets, industry.id, mode])
  const lbl = (t: string) => getWidget(t)?.label ?? t
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Suggested widgets for {ed.state.content.identity.industryLabel || industry.label}</DialogTitle>
          <DialogDescription>A starting point only. It never changes your theme, colours or business records, and you can undo it.</DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label="How to apply" className="grid gap-2">
          {([["add", "Add what’s missing", "Keeps everything you have, in your order, and adds suggested widgets you don’t have yet at the end."], ["replace", "Rearrange to the suggestion", "Reorders to the suggested layout, keeping your existing widgets’ settings. Widgets not in the suggestion come off the page (you’ll see which)."]] as const).map(([v, t, d]) => (
            <label key={v} className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${mode === v ? "border-primary bg-primary/5 ring-1 ring-primary" : ""}`}>
              <input type="radio" name="starter-mode" className="mt-1" checked={mode === v} onChange={() => setMode(v)} />
              <span><span className="block text-sm font-semibold">{t}</span><span className="text-xs text-muted-foreground">{d}</span></span>
            </label>
          ))}
        </div>
        <div className="grid gap-3 text-sm" aria-live="polite">
          <p><strong>Will be added ({plan.added.length}):</strong> {plan.added.length ? plan.added.map((w) => lbl(w.type)).join(", ") : "nothing"}</p>
          <p><strong>Will stay ({plan.kept.length}):</strong> {plan.kept.length ? plan.kept.map((w) => lbl(w.type)).join(", ") : "nothing"}</p>
          <p className={plan.removed.length ? "text-amber-900" : ""}><strong>Will come off the page ({plan.removed.length}):</strong> {plan.removed.length ? plan.removed.map((w) => lbl(w.type)).join(", ") : "nothing"}</p>
          {plan.removed.length ? <p className="text-xs text-muted-foreground">Their business records stay. You can undo this straight afterwards.</p> : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!plan.added.length && !plan.removed.length && mode === "add"} onClick={() => { ed.setPage((p) => ({ ...p, widgets: plan.result })); onOpenChange(false); onApplied(mode === "add" ? `Added ${plan.added.length} suggested widget${plan.added.length === 1 ? "" : "s"}.` : "Rearranged to the suggested layout.") }}><Sparkles /> Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
