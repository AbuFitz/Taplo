"use client"

import * as React from "react"
import Link from "next/link"
import { Briefcase, Eye, EyeOff, LayoutTemplate, Menu, Palette, Redo2, Rows3, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canPublish, hasUnpublishedChanges, publish } from "@/features/demo/actions"
import { PagePreview } from "@/features/preview/PagePreview"
import { cn } from "@/lib/utils"
import { getWidget } from "../widgets/registry"
import { EditorDrawer, PEEK, type DrawerSnap } from "./EditorDrawer"
import { ContentList } from "./ContentList"
import { SettingsBody } from "./EditorPanel"
import { Inspector } from "./Inspector"
import { CONTENT, PAGE, type Selection } from "./selection"
import type { Editor } from "./useEditor"

type Panel = "content" | "header" | "design" | "settings" | "selection"

const BAR = 64 // bottom toolbar height in px (excluding the safe-area inset)

function useViewportSize() {
  const [v, setV] = React.useState({ w: 390, h: 800 })
  React.useEffect(() => {
    const read = () => setV({ w: window.innerWidth, h: window.visualViewport?.height ?? window.innerHeight })
    read()
    window.addEventListener("resize", read)
    window.visualViewport?.addEventListener("resize", read)
    return () => { window.removeEventListener("resize", read); window.visualViewport?.removeEventListener("resize", read) }
  }, [])
  return v
}

/**
 * Editing on a phone or tablet. The preview is the screen: it fills the space between a slim top
 * bar and a three-item toolbar (Content, Design, Organise) and shows the page at the device's real
 * viewport. Everything else is a contextual sheet. A tapped widget scrolls into the part of the
 * preview the sheet leaves visible. Landscape phones get a side panel instead of a bottom sheet.
 */
export function MobileEditor({ ed, selection, setSelection, notify, note, clearNote }: {
  ed: Editor; selection: Selection; setSelection: (s: Selection) => void
  notify: (msg: string, undoable?: boolean) => void
  note: { msg: string; undoable: boolean } | null; clearNote: () => void
}) {
  const [stack, setStack] = React.useState<Panel[]>([])
  void CONTENT
  const [snap, setSnap] = React.useState<DrawerSnap | null>(PEEK)
  const [customer, setCustomer] = React.useState(false)
  const vp = useViewportSize()
  const headRef = React.useRef<HTMLElement>(null)
  const barRef = React.useRef<HTMLElement>(null)
  const [head, setHead] = React.useState(56)
  const [bar, setBar] = React.useState(0)
  React.useEffect(() => {
    const measure = () => { setHead(headRef.current?.offsetHeight ?? 56); setBar(barRef.current?.offsetHeight ?? 0) }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [vp.w, vp.h])
  const short = vp.h < 520 && vp.w > vp.h
  const s = ed.state
  const changed = hasUnpublishedChanges(s)
  const open = stack.length > 0 && !customer
  const top = stack[stack.length - 1]

  const openPanel = (p: Panel, how: "replace" | "push" = "replace", at: DrawerSnap = PEEK) => {
    setStack((st) => (how === "push" ? [...st.filter((x) => x !== p), p] : [p]))
    setSnap(at)
  }
  const close = () => setStack([])
  const back = () => setStack((st) => st.slice(0, -1))
  const toggleTab = (p: Panel) => (top === p && stack.length === 1 ? close() : openPanel(p, "replace", 0.62))

  const fromPreview = (sel: Selection) => {
    setSelection(sel)
    if (sel.kind === "content") close()
    else if (sel.kind === "header") openPanel("header", "replace", 0.62)
    else openPanel("selection", "replace", PEEK)
  }
  const fromList = (sel: Selection) => { setSelection(sel); openPanel("selection", "push", PEEK) }

  const title = (() => {
    if (top === "content") return "Your content"
    if (top === "header") return "Header"
    if (top === "design") return "Design"
    if (top === "settings") return "Settings"
    if (selection.kind === "widget") { const w = s.page.widgets.find((x) => x.id === selection.id); return (w && getWidget(w.type)?.label) ?? "Content" }
    return { content: "Your content", page: "Design", header: "Header", details: "Business details", settings: "Page settings" }[selection.kind]
  })()

  const room = Math.max(0, vp.h - bar - head)
  const drawerPx = (typeof snap === "number" ? snap : PEEK) * room
  const inset = open && !short ? Math.round(drawerPx) : 0

  const tabs: { id: Panel; label: string; icon: typeof Rows3 }[] = [
    { id: "content", label: "Content", icon: Rows3 },
    { id: "header", label: "Header", icon: LayoutTemplate },
    { id: "design", label: "Design", icon: Palette },
    { id: "settings", label: "Settings", icon: Briefcase },
  ]
  const tabButton = (t: (typeof tabs)[number], compact = false) => {
    const active = open && stack[0] === t.id && (t.id !== "selection")
    return (
      <button key={t.id} type="button" onClick={() => toggleTab(t.id)} aria-pressed={active} data-testid={`tab-${t.id}`}
        className={cn("flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.6875rem] font-medium transition-colors", compact && "min-h-10 flex-none px-3", active ? "bg-neutral-900 text-white" : "text-neutral-600 active:bg-black/5")}>
        <t.icon className="size-5" aria-hidden="true" />{compact ? <span className="sr-only">{t.label}</span> : t.label}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-hidden bg-background" style={{ height: "100dvh" }} data-testid="my-page" data-editor="compact">
      <header ref={headRef} className="flex shrink-0 items-center gap-1 border-b border-black/[0.07] bg-background/95 px-2 pb-1.5 pt-[calc(0.375rem+env(safe-area-inset-top,0px))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]" role="toolbar" aria-label="Page actions">
        <Button asChild variant="ghost" size="icon" aria-label="Dashboard menu"><Link href="/dashboard"><Menu /></Link></Button>
        <p className="min-w-0 flex-1 truncate px-1 text-sm font-semibold tracking-[-0.01em]">{s.content.identity.name || "Your page"}</p>
        {short && !customer ? <div className="mr-1 flex">{tabs.map((t) => tabButton(t, true))}</div> : null}
        <Button variant="ghost" size="icon" onClick={ed.undo} disabled={!ed.canUndo} aria-label="Undo" data-testid="undo"><Undo2 /></Button>
        <Button variant="ghost" size="icon" onClick={ed.redo} disabled={!ed.canRedo} aria-label="Redo" data-testid="redo"><Redo2 /></Button>
        <Button variant={customer ? "default" : "outline"} size="sm" onClick={() => { setCustomer((c) => !c); close() }} aria-pressed={customer} data-testid="customer-preview">
          {customer ? <EyeOff /> : <Eye />}{customer ? "Edit" : "Preview"}
        </Button>
        <Button size="sm" disabled={!canPublish(s)} onClick={() => { ed.update((x) => publish(x)); notify(s.published ? "Changes published." : "Your page is published.") }} data-testid="publish">{s.published ? (changed ? "Publish" : "Live") : "Publish"}</Button>
      </header>

      <div className="relative min-h-0 flex-1">
        <PagePreview
          mode="fill"
          src={customer ? "/demo/preview" : "/demo/preview?edit=1"}
          title="Live preview of your page"
          edit={customer ? undefined : { selection, onSelect: fromPreview, bottomInset: inset }}
          testId="preview-frame"
        />
        {note ? (
          <div role="status" data-testid="notice" className="absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-3 rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg">
            <span>{note.msg}</span>
            <span className="flex shrink-0 gap-3">
              {note.undoable ? <button type="button" className="min-h-8 font-semibold underline underline-offset-4" onClick={() => { ed.undo(); clearNote() }}>Undo</button> : null}
              <button type="button" className="min-h-8 text-white/70" onClick={clearNote} aria-label="Dismiss">✕</button>
            </span>
          </div>
        ) : null}
        {customer ? <p className="pointer-events-none absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-neutral-900/85 px-3 py-1.5 text-xs text-white">Customer preview: buttons work like the real page</p> : null}
      </div>

      {!short && !customer ? (
        <nav ref={barRef} aria-label="Editor" className="shrink-0 border-t border-black/[0.07] bg-background/95 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))]" style={{ minHeight: BAR }}>
          <div className="flex gap-1">{tabs.map((t) => tabButton(t))}</div>
        </nav>
      ) : null}

      <EditorDrawer open={open} onOpenChange={(o) => { if (!o) close() }} snap={snap} onSnap={setSnap} side={short ? "right" : "bottom"} offsetTop={head} offsetBottom={short ? 0 : bar} title={title} canGoBack={stack.length > 1} onBack={back}>
        {stack.map((p) => (
          <div key={p} hidden={p !== top} className={p === top ? undefined : "hidden"}>
            {p === "content" ? <ContentList ed={ed} selection={selection} onSelect={fromList} notify={notify} /> : null}
            {p === "header" ? <Inspector ed={ed} selection={{ kind: "header" }} onSelect={setSelection} notify={notify} compact /> : null}
            {p === "design" ? <Inspector ed={ed} selection={PAGE} onSelect={fromList} notify={notify} compact /> : null}
            {p === "settings" ? <SettingsBody ed={ed} selection={selection} onSelect={setSelection} notify={notify} /> : null}
            {p === "selection" ? <Inspector ed={ed} selection={selection} onSelect={(sel) => { setSelection(sel); if (sel.kind === "content") back() }} notify={notify} compact /> : null}
          </div>
        ))}
      </EditorDrawer>
    </div>
  )
}
