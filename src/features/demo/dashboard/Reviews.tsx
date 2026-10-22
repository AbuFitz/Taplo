"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TaploInput } from "@/components/taplo/taplo-input"
import { SOURCE_LABEL } from "@/components/taplo/taplo-review-card"
import type { ReviewLink } from "@/features/businesses/content"
import { useDraft } from "../hooks"
import { UrlField } from "../ui"
import { PageHeader, Panel } from "./Panel"

const PLATFORMS: ReviewLink["platform"][] = ["google", "facebook", "trustpilot"]
const P_LABEL: Record<string, string> = { google: "Google", facebook: "Facebook", trustpilot: "Trustpilot" }

export function Reviews() {
  const { c, ent, setContent } = useDraft()
  const [form, setForm] = React.useState({ author: "", quote: "", permission: false })
  const [err, setErr] = React.useState<string>()
  const [platform, setPlatform] = React.useState<ReviewLink["platform"]>("google")
  const [url, setUrl] = React.useState<string>()
  const [urlKey, setUrlKey] = React.useState(0)
  if (!c || !ent) return null
  const tests = c.testimonials ?? []
  const links = c.reviewLinks ?? []

  const add = () => {
    if (!form.author.trim() || !form.quote.trim()) return setErr("Add the customer’s name and what they said.")
    if (!form.permission) return setErr("Confirm you have permission to publish this.")
    setErr(undefined)
    setContent((x) => ({ ...x, testimonials: [...tests, { id: `t-${Math.random().toString(36).slice(2, 8)}`, quote: form.quote.trim(), author: form.author.trim(), source: "owner_supplied", permissionConfirmed: true }] }))
    setForm({ author: "", quote: "", permission: false })
  }

  return (
    <>
      <PageHeader title="Reviews" description="Testimonials you add are always labelled as shared by your business. Taplo never invents a rating or combines scores from different places." />
      <div className="grid max-w-3xl gap-6">
        <Panel title="Review links" description="Where customers can leave a review. Shown neutrally to everyone — Taplo never routes happy customers to public sites and unhappy ones elsewhere.">
          {ent.reviewLinks ? (
            <>
              <ul className="mb-4 grid gap-2">
                {links.map((l) => (
                  <li key={l.platform} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                    <span><strong>{P_LABEL[l.platform]}</strong> <span className="text-muted-foreground break-all">{l.url}</span></span>
                    <Button variant="outline" size="icon" aria-label={`Remove ${P_LABEL[l.platform]} link`} onClick={() => setContent((x) => ({ ...x, reviewLinks: links.filter((q) => q.platform !== l.platform) }))}><Trash2 /></Button>
                  </li>
                ))}
              </ul>
              <div className="grid items-end gap-3 sm:grid-cols-[10rem_1fr_auto]">
                <div className="grid gap-1.5">
                  <Label htmlFor="rl-platform">Platform</Label>
                  <Select value={platform} onValueChange={(v) => setPlatform(v as ReviewLink["platform"])}>
                    <SelectTrigger id="rl-platform" className="min-h-11 w-full"><SelectValue /></SelectTrigger>
                    <SelectContent position="popper">{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{P_LABEL[p]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <UrlField key={urlKey} label="Review page address" onCommit={setUrl} />
                <Button disabled={!url} className="min-h-11" onClick={() => { if (!url) return; setContent((x) => ({ ...x, reviewLinks: [...links.filter((q) => q.platform !== platform), { platform, url }] })); setUrl(undefined); setUrlKey((k) => k + 1) }}><Plus /> Add</Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Automatic Google review sync is a later feature and needs an authorised integration. Nothing is scraped.</p>
            </>
          ) : <p className="text-sm text-muted-foreground">Review links start on the Core plan.</p>}
        </Panel>

        <Panel title="Testimonials" description={ent.testimonials ? "Words from your customers, shown with a clear source label." : "Not available on your plan."}>
          <ul className="mb-4 grid gap-3">
            {tests.map((t) => (
              <li key={t.id} className="rounded-lg border p-3 text-sm">
                <p>“{t.quote}”</p>
                <p className="mt-1 text-muted-foreground">{t.author} · {SOURCE_LABEL[t.source]}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setContent((x) => ({ ...x, testimonials: tests.filter((q) => q.id !== t.id) }))}><Trash2 /> Remove</Button>
              </li>
            ))}
          </ul>
          {tests.length === 0 ? <p className="mb-3 text-sm text-muted-foreground">None yet. Your page won’t show a reviews section for testimonials until you add one, and it never shows a made-up score.</p> : null}
          <div className="grid gap-3">
            <TaploInput label="Customer name" value={form.author} maxLength={120} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <div className="grid gap-1.5"><Label htmlFor="t-quote">What they said</Label><Textarea id="t-quote" rows={3} maxLength={800} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
            <label className="flex min-h-11 items-center gap-2 text-sm"><Checkbox checked={form.permission} onCheckedChange={(v) => setForm({ ...form, permission: v === true })} />I have permission to publish this</label>
            {err ? <p role="alert" className="text-sm text-destructive">{err}</p> : null}
            <Button className="justify-self-start" onClick={add}><Plus /> Add testimonial</Button>
          </div>
        </Panel>
      </div>
    </>
  )
}
