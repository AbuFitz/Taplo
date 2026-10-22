"use client"

import * as React from "react"
import { Redo2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canPublish, hasUnpublishedChanges, publish, readiness } from "@/features/demo/actions"
import { PreviewFrame } from "@/features/demo/ui"
import { Inspector } from "./Inspector"
import { MobileEditor } from "./MobileEditor"
import { Structure } from "./Structure"
import { PAGE, type Selection } from "./selection"
import { useEditor } from "./useEditor"

/** Three panes from this width up: structure, live preview, controls. Below it: an Edit/Preview switch and a controls sheet. */
const WIDE = "(min-width: 1280px)"
function useWide() {
  return React.useSyncExternalStore(
    (cb) => { const m = window.matchMedia(WIDE); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb) },
    () => window.matchMedia(WIDE).matches,
    () => false,
  )
}

export function MyPage() {
  const ed = useEditor()
  const wide = useWide()
  const [selection, setSelection] = React.useState<Selection>(PAGE)
  const [note, setNote] = React.useState<{ msg: string; undoable: boolean } | null>(null)
  const noteTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const notify = React.useCallback((msg: string, undoable = false) => {
    setNote({ msg, undoable })
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setNote(null), 9000)
  }, [])

  const select = setSelection

  // A selected widget that disappears (removed, or undone away) shows the page controls instead.
  const gone = selection.kind === "widget" && ed && !ed.state.page.widgets.some((w) => w.id === selection.id)

  // Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z, except while typing (inputs keep their own native undo).
  React.useEffect(() => {
    if (!ed) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return
      if (!(e.metaKey || e.ctrlKey)) return
      const k = e.key.toLowerCase()
      if (k === "z" && !e.shiftKey) { e.preventDefault(); ed.undo() }
      else if ((k === "z" && e.shiftKey) || k === "y") { e.preventDefault(); ed.redo() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ed])

  if (!ed) return null
  const s = ed.state
  const missing = readiness(s).filter((c) => c.required && !c.done)
  const changed = hasUnpublishedChanges(s)
  const effective = gone ? PAGE : selection

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Page actions">
      <Button variant="outline" size="icon" className="size-11" onClick={ed.undo} disabled={!ed.canUndo} aria-label="Undo" data-testid="undo"><Undo2 /></Button>
      <Button variant="outline" size="icon" className="size-11" onClick={ed.redo} disabled={!ed.canRedo} aria-label="Redo" data-testid="redo"><Redo2 /></Button>
      <span className="mx-1 hidden text-xs text-muted-foreground sm:inline" data-testid="save-state">{ed.storageFailed ? "⚠ Not saved: browser storage is full or blocked" : s.published ? (changed ? "Draft saved · unpublished changes" : "Saved · live") : "Draft saved"}</span>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild variant="outline" className="hidden min-h-11 sm:inline-flex"><a href="/demo/preview" target="_blank" rel="noreferrer" data-testid="full-preview">Open preview</a></Button>
        <Button className="min-h-11" disabled={!canPublish(s)} onClick={() => { ed.update((x) => publish(x)); notify(s.published ? "Changes published." : "Your page is published.") }} data-testid="publish">{s.published ? (changed ? "Publish changes" : "Published") : "Publish"}</Button>
      </div>
    </div>
  )

  const banners = (
    <>
      {ed.storageFailed ? <p role="alert" className="mb-3 rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-sm text-amber-950">Your browser couldn’t save your latest changes (storage is full or blocked). Remove a large picture, or they’ll be lost on reload.</p> : null}
      {s.notes?.length ? (
        <div role="status" className="mb-3 flex items-start justify-between gap-3 rounded-md border bg-muted/50 px-3 py-2 text-xs text-muted-foreground" data-testid="upgrade-note">
          <span>{s.notes.join(" ")}</span>
          <button type="button" className="shrink-0 font-medium text-primary underline underline-offset-4" onClick={() => ed.update((x) => ({ ...x, notes: [] }))}>Dismiss</button>
        </div>
      ) : null}
      {note ? (
        <div role="status" className="mb-3 flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2 text-sm" data-testid="notice">
          <span>{note.msg}</span>
          {note.undoable ? <Button size="sm" variant="outline" onClick={() => { ed.undo(); setNote(null) }}>Undo</Button> : null}
        </div>
      ) : null}
    </>
  )

  const inspector = <Inspector ed={ed} selection={effective} onSelect={setSelection} notify={notify} />
  const preview = <PreviewFrame height={wide ? 780 : 700} selection={effective} onSelect={select} />

  if (!wide) return <MobileEditor ed={ed} selection={effective} setSelection={setSelection} notify={notify} note={note} clearNote={() => setNote(null)} />

  return (
    <div data-testid="my-page">
      <div className="sticky top-0 z-20 -mx-4 mb-3 border-b bg-background/95 px-4 py-2.5 backdrop-blur lg:-mx-8 lg:px-8">{toolbar}</div>
      {banners}
      {missing.length ? <p className="mb-3 text-xs text-muted-foreground">To publish: {missing.map((m) => m.label.toLowerCase()).join(", ")}.</p> : null}

      <div className="grid grid-cols-[18rem_minmax(0,1fr)_22rem] items-start gap-5">
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto pr-1"><Structure ed={ed} selection={effective} onSelect={setSelection} notify={notify} /></div>
          <div className="sticky top-20 min-w-0">{preview}</div>
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-xl border bg-card p-4" data-testid="inspector">{inspector}</div>
      </div>
    </div>
  )
}
