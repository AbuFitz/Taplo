"use client"

import * as React from "react"
import { GROUPS, STORIES, type Story } from "./stories"

/** The index: every story in a frame of its real width. Frames grow to their content. */
export function WorkbenchIndex() {
  const [heights, setHeights] = React.useState<Record<string, number>>({})
  const [only, setOnly] = React.useState<string>("all")
  React.useEffect(() => {
    const on = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === "wb-height") setHeights((h) => (h[e.data.id] === e.data.h ? h : { ...h, [e.data.id]: e.data.h })) }
    window.addEventListener("message", on)
    return () => window.removeEventListener("message", on)
  }, [])
  const list = STORIES.filter((s) => only === "all" || s.group === only)
  return (
    <main className="mx-auto max-w-[1700px] px-5 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Component workbench</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Every block and overlay in its real shared component, at its real width, in the states that matter. {STORIES.length} stories. Frames are the production renderer; nothing here is a replica.</p>
      <nav aria-label="Groups" className="mt-4 flex flex-wrap gap-2">
        {["all", ...GROUPS].map((g) => <button key={g} type="button" aria-pressed={only === g} onClick={() => setOnly(g)} className="min-h-9 rounded-full border px-3.5 text-sm aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background">{g === "all" ? "All" : g}</button>)}
      </nav>
      <ul className="mt-8 flex flex-wrap items-start gap-x-8 gap-y-12">
        {list.map((s) => <Card key={s.id} s={s} h={heights[s.id]} />)}
      </ul>
    </main>
  )
}

function Card({ s, h }: { s: Story; h?: number }) {
  return (
    <li style={{ width: s.vp }} className="max-w-full">
      <p className="mb-1 text-sm font-medium">{s.title}</p>
      <p className="mb-2 font-mono text-xs text-muted-foreground">{s.id} · {s.vp}px · {s.surface}{s.play ? " · opens on click" : ""}</p>
      <div className="overflow-hidden rounded-xl border bg-white">
        <iframe title={s.title} src={`/workbench/${s.id}`} loading="lazy" style={{ width: s.vp, height: Math.min(h ?? 300, 1400) }} className="block max-w-full" />
      </div>
      {s.play ? <a className="mt-1 inline-block text-xs underline" href={`/workbench/${s.id}`} target="_blank" rel="noreferrer">Open to try the interaction</a> : null}
    </li>
  )
}
