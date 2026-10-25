"use client"

import { businessAddress } from "@/lib/domains"

import * as React from "react"
import { StudioNotice } from "@/features/demo/StudioNotice"
import { Redo2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { canPublish, hasUnpublishedChanges, publish, readiness } from "@/features/demo/actions"
import { PreviewFrame } from "@/features/demo/ui"
import { DashboardMenu } from "@/features/demo/DashboardShell"
import { EditorPanel } from "./EditorPanel"
import { MobileEditor } from "./MobileEditor"
import { CONTENT, type Selection } from "./selection"
import { useEditor } from "./useEditor"

/** Panel + live preview from this width up (the panel is a fixed 26rem, so the preview keeps at least 30rem). Below it: the phone and tablet editor. */
const WIDE = "(min-width: 960px)"
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
  const [selection, setSelection] = React.useState<Selection>(CONTENT)
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
  const effective = gone ? CONTENT : selection

  const saveText = ed.storageFailed ? "Not saved: browser storage is full or blocked" : s.published ? (changed ? "Draft saved · unpublished changes" : "Preview saved") : "Draft saved"
  const toolbar = (
    <div className="flex items-center gap-2" role="toolbar" aria-label="Page actions">
      <DashboardMenu className="-ml-2" />
      <div className="min-w-0 pr-2">
        <p className="truncate text-sm font-semibold leading-tight">{s.content.identity.name || "Your page"}</p>
        <p className={cn("truncate text-xs leading-tight", ed.storageFailed ? "text-destructive" : "text-muted-foreground")} data-testid="save-state">{saveText}</p>
      </div>
      <div className="ml-auto flex items-center gap-1.5"><span className="hidden xl:inline-flex"><StudioNotice /></span>
        <Button variant="ghost" size="icon" className="size-11" onClick={ed.undo} disabled={!ed.canUndo} aria-label="Undo" data-testid="undo"><Undo2 /></Button>
        <Button variant="ghost" size="icon" className="size-11" onClick={ed.redo} disabled={!ed.canRedo} aria-label="Redo" data-testid="redo"><Redo2 /></Button>
        <Button asChild variant="outline" className="min-h-11"><a href="/demo/preview" target="_blank" rel="noreferrer" data-testid="full-preview">Preview</a></Button>
        <Button className="min-h-11" disabled={!canPublish(s)} onClick={() => { ed.update((x) => publish(x)); notify("Preview saved on this device.") }} data-testid="publish">{s.published ? (changed ? "Publish changes" : "Published") : "Publish"}</Button>
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

  const preview = <PreviewFrame url={businessAddress(s.content.identity.slug)} fill selection={effective} onSelect={select} />

  if (!wide) return <MobileEditor ed={ed} selection={effective} setSelection={setSelection} notify={notify} note={note} clearNote={() => setNote(null)} />

  return (
    <div data-testid="my-page" data-editor="desktop" className="editor-workspace">
      <div className="editor-workspace-toolbar">{toolbar}</div>
      {banners}
      {missing.length ? <p className="mb-3 text-xs text-muted-foreground">To publish: {missing.map((m) => m.label.toLowerCase()).join(", ")}.</p> : null}

      <div className="editor-workspace-grid">
        <div className="min-w-0"><EditorPanel ed={ed} selection={effective} onSelect={setSelection} notify={notify} /></div>
        <div className="sticky top-20 min-w-0">{preview}</div>
      </div>
    </div>
  )
}
