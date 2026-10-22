"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Eye, Redo2, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { canPublish, hasUnpublishedChanges, publish, readiness } from "@/features/demo/actions"
import { PreviewFrame } from "@/features/demo/ui"
import { ContentTab } from "./ContentTab"
import { DesignTab } from "./DesignTab"
import { SettingsTab } from "./SettingsTab"
import { useEditor } from "./useEditor"

/** The "My page" workspace: Content, Design and Page settings beside a persistent live preview. */
export function MyPage() {
  const ed = useEditor()
  const params = useSearchParams()
  const initial = params.get("tab")
  const [tab, setTab] = React.useState(initial === "design" || initial === "settings" ? initial : "content")
  const [note, setNote] = React.useState<{ msg: string; undoable: boolean } | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const noteTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const notify = React.useCallback((msg: string, undoable = false) => {
    setNote({ msg, undoable })
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setNote(null), 9000)
  }, [])

  // Ctrl/Cmd+Z and Shift+Ctrl/Cmd+Z, except while typing (inputs keep their native undo).
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

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Page actions">
      <Button variant="outline" size="icon" className="size-11" onClick={ed.undo} disabled={!ed.canUndo} aria-label="Undo" data-testid="undo"><Undo2 /></Button>
      <Button variant="outline" size="icon" className="size-11" onClick={ed.redo} disabled={!ed.canRedo} aria-label="Redo" data-testid="redo"><Redo2 /></Button>
      <span className="mx-1 hidden text-xs text-muted-foreground sm:inline" data-testid="save-state">{ed.storageFailed ? "⚠ Not saved: browser storage is full or blocked" : s.published ? (changed ? "Saved · unpublished changes" : "Saved · live") : "Saved · draft"}</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" className="min-h-11 lg:hidden" onClick={() => setPreviewOpen(true)} data-testid="open-preview"><Eye /> Preview</Button>
        <Button className="min-h-11" disabled={!canPublish(s)} onClick={() => { ed.update((x) => publish(x)); notify(s.published ? "Changes published." : "Your page is published.") }} data-testid="publish">{s.published ? (changed ? "Publish changes" : "Published") : "Publish"}</Button>
      </div>
    </div>
  )

  return (
    <div data-testid="my-page">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">My page</h1>
        <p className="text-sm text-muted-foreground">Add widgets, choose a look, and publish. What you see on the right is exactly what visitors get.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="sticky top-0 z-20 -mx-4 mb-3 border-b bg-background/95 px-4 py-2.5 backdrop-blur lg:mx-0 lg:rounded-xl lg:border lg:px-3">{toolbar}</div>
          {ed.storageFailed ? <p role="alert" className="mb-3 rounded-md border border-amber-400 bg-amber-100 px-3 py-2 text-sm text-amber-950">Your browser couldn’t save your latest changes (storage is full or blocked). Remove a large picture, or they’ll be lost on reload.</p> : null}
          {s.notes?.length ? (
            <div role="status" className="mb-3 flex items-start justify-between gap-3 rounded-md border bg-muted/50 px-3 py-2 text-xs text-muted-foreground" data-testid="upgrade-note">
              <span>{s.notes.join(" ")}</span>
              <button type="button" className="shrink-0 font-medium text-primary underline underline-offset-4" onClick={() => ed.update((x) => ({ ...x, notes: [] }))}>Dismiss</button>
            </div>
          ) : null}
          {ed.vm && ed.vm.notes.length ? <ul role="status" className="mb-3 grid gap-1 rounded-md border bg-muted/50 px-3 py-2 text-xs text-muted-foreground" aria-label="Notes about your page">{ed.vm.notes.map((n) => <li key={n}>• {n}</li>)}</ul> : null}
          {note ? (
            <div role="status" className="mb-3 flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2 text-sm" data-testid="notice">
              <span>{note.msg}</span>
              {note.undoable ? <Button size="sm" variant="outline" onClick={() => { ed.undo(); setNote(null) }}>Undo</Button> : null}
            </div>
          ) : null}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="content" className="min-h-10">Content</TabsTrigger>
              <TabsTrigger value="design" className="min-h-10">Design</TabsTrigger>
              <TabsTrigger value="settings" className="min-h-10">Page settings</TabsTrigger>
            </TabsList>
            <TabsContent value="content"><ContentTab ed={ed} notify={notify} /></TabsContent>
            <TabsContent value="design"><DesignTab ed={ed} /></TabsContent>
            <TabsContent value="settings"><SettingsTab ed={ed} notify={notify} /></TabsContent>
          </Tabs>
          {missing.length ? <p className="mt-4 text-xs text-muted-foreground">To publish: {missing.map((m) => m.label.toLowerCase()).join(", ")}.</p> : null}
        </div>
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-4">
            <h2 className="mb-2 text-sm font-semibold">Live preview</h2>
            <PreviewFrame height={760} />
          </div>
        </div>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="bottom" className="h-[92dvh] gap-2 rounded-t-2xl p-3">
          <SheetHeader className="p-0"><SheetTitle>Preview</SheetTitle></SheetHeader>
          {previewOpen ? <PreviewFrame height={700} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
