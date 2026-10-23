"use client"

import * as React from "react"
import { Check, Copy, Globe, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { SLUG_PROBLEM_MESSAGE } from "@/features/businesses/slug"
import { canPublish, hasUnpublishedChanges, publish, readiness, setSlug, slugProblems, unpublish } from "@/features/demo/actions"
import { SwitchField } from "./controls"
import type { Editor } from "./useEditor"

function Card({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return <section id={id} className="grid gap-3 rounded-xl border bg-card p-4"><h2 className="text-sm font-semibold">{title}</h2>{children}</section>
}

export function SettingsTab({ ed, notify }: { ed: Editor; notify: (m: string, undoable?: boolean) => void }) {
  const s = ed.state
  const [copied, setCopied] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const probs = slugProblems(s.content.identity.slug)
  const liveSlug = s.published?.content.identity.slug
  const url = typeof window !== "undefined" && liveSlug ? `${window.location.origin}/demo/p/${liveSlug}` : null
  const meta = s.page.meta
  const missing = readiness(s).filter((c) => c.required && !c.done)
  const changed = hasUnpublishedChanges(s)
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"
  const previewTitle = meta.shareTitle || `${s.content.identity.name || "Your business"} — ${s.content.identity.industryLabel || "Taplo"}`
  const previewDesc = meta.shareDescription || s.content.identity.tagline || "Find us on Taplo."

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <Card title="Publishing" id="publishing">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-sm font-medium ${s.published ? "border-green-600/50 bg-green-50 text-green-950" : ""}`}>{s.published ? `Published · version ${s.published.version}` : "Draft — not published"}</span>
          {changed ? <span className="text-sm text-amber-800">You have unpublished changes.</span> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={!canPublish(s)} onClick={() => { ed.update((x) => publish(x)); notify(s.published ? "Changes published." : "Your page is published.") }}>{s.published ? "Publish changes" : "Publish"}</Button>
          {s.published ? <Button variant="outline" onClick={() => ed.update((x) => unpublish(x))}>Unpublish</Button> : null}
          {s.published && changed ? <Button variant="outline" onClick={() => { ed.update((x) => (x.published ? { ...x, content: structuredClone(x.published.content), page: structuredClone(x.published.page) } : x)); notify("Went back to your published version.", true) }}>Discard unpublished changes</Button> : null}
          {url ? <Button variant="outline" asChild><a href={url} target="_blank" rel="noreferrer">View published page</a></Button> : null}
        </div>
        {!canPublish(s) ? <p className="text-sm text-muted-foreground">To publish you still need: {missing.map((m) => m.label.toLowerCase()).join(", ")}.</p> : null}
        <p className="text-xs text-muted-foreground">Visitors only ever see the published version. Your draft can change freely until you publish.</p>
      </Card>

      <Card title="Page address">
        <div>
          <TaploInput label="Your web address" value={s.content.identity.slug} maxLength={40} autoCapitalize="none" onBlur={() => setTouched(true)} onChange={(e) => ed.update((x) => setSlug(x, e.target.value), { coalesce: "slug" })} error={touched && probs.length ? SLUG_PROBLEM_MESSAGE[probs[0]!] : undefined} />
          <p className="mt-1.5 text-sm text-muted-foreground">taplo.co/<strong>{s.content.identity.slug || "…"}</strong></p>
          <p className="mt-1 text-xs text-muted-foreground">If you change it later, the old address keeps redirecting to the new one.</p>
        </div>
      </Card>

      <Card title="Sharing">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={!url} onClick={async () => { if (!url) return; try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {} }}>{copied ? <><Check aria-hidden="true" /> Copied</> : <><Copy aria-hidden="true" /> Copy link</>}</Button>
          {canShare ? <Button variant="outline" disabled={!url} onClick={() => url && navigator.share({ title: previewTitle, text: previewDesc, url }).catch(() => {})}><Share2 aria-hidden="true" /> Share…</Button> : null}
        </div>
        {!url ? <p className="text-xs text-muted-foreground">Publish to get a link you can share.</p> : null}
        <TaploInput label="Title when shared (optional)" value={meta.shareTitle ?? ""} maxLength={80} onChange={(e) => ed.setPage((p) => ({ ...p, meta: { ...p.meta, shareTitle: e.target.value || undefined } }), "sharetitle")} />
        <div className="grid gap-1.5"><Label htmlFor="sharedesc" className="text-sm font-medium">Description when shared (optional)</Label><Textarea id="sharedesc" rows={2} maxLength={200} value={meta.shareDescription ?? ""} onChange={(e) => ed.setPage((p) => ({ ...p, meta: { ...p.meta, shareDescription: e.target.value || undefined } }), "sharedesc")} /></div>
        <div aria-label="Link preview" className="rounded-lg border bg-muted/50 p-3 text-sm"><p className="text-xs text-muted-foreground">taplo.co/{s.content.identity.slug || "…"}</p><p className="font-semibold">{previewTitle}</p><p className="text-muted-foreground">{previewDesc}</p></div>
      </Card>

      <Card title="Search engines">
        <SwitchField label="Let Google and others find my page" checked={meta.searchVisible} onChange={(v) => ed.setPage((p) => ({ ...p, meta: { ...p.meta, searchVisible: v } }))} hint="When off, your page asks search engines not to list it. People with your link can still open it." />
        <p className="text-xs text-muted-foreground">Pages in the sandbox are never listed in search, whatever this says.</p>
      </Card>

      <Card title="Your own domain">
        <p className="flex items-center gap-2 text-sm"><Globe className="size-4" aria-hidden="true" /> Use an address like book.yourbusiness.co.uk</p>
        <p className="text-sm text-muted-foreground">Included on the Business plan. <strong>Not connected in this demo:</strong> it needs DNS verification and a hosting integration, so nothing here can be set up yet.</p>
      </Card>
    </div>
  )
}
