"use client"

import * as React from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { canPublish, hasUnpublishedChanges, publish, readiness, unpublish } from "../actions"
import { useDraft } from "../hooks"
import { PreviewFrame } from "../ui"
import { Panel, PageHeader } from "./Panel"

const METRICS = ["Profile views", "Calls", "WhatsApp clicks", "Booking clicks", "Bookings made", "Revenue collected", "Review clicks"]

export function Overview() {
  const { state: s, patch, ent } = useDraft()
  const [copied, setCopied] = React.useState(false)
  if (!s || !ent) return null
  const checks = readiness(s)
  const requiredDone = checks.filter((c) => c.required && c.done).length
  const requiredTotal = checks.filter((c) => c.required).length
  const liveSlug = s.published?.content.identity.slug
  const url = liveSlug ? `${window.location.origin}/demo/p/${liveSlug}` : null
  const draftDiffers = hasUnpublishedChanges(s)

  return (
    <>
      <PageHeader title="Dashboard" description="Where your page stands and what to do next." actions={<Button asChild size="lg"><Link href="/dashboard/page">Edit my page</Link></Button>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Publish status">
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("rounded-full border px-3 py-1 text-sm font-medium", s.published && "border-green-600/50 bg-green-50 text-green-950")}>
                {s.published ? `Published · v${s.published.version}` : "Draft — not published"}
              </span>
              {draftDiffers ? <span className="text-sm text-amber-800">You have unpublished changes.</span> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button disabled={!canPublish(s)} onClick={() => patch(publish)}>{s.published ? "Publish changes" : "Publish"}</Button>
              {s.published ? <Button variant="outline" onClick={() => patch(unpublish)}>Unpublish</Button> : null}
              {url ? <Button variant="outline" asChild><a href={url} target="_blank" rel="noreferrer">View page</a></Button> : null}
              {url ? (
                <Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch {} }}>
                  {copied ? <><Check aria-hidden="true" /> Copied</> : <><Copy aria-hidden="true" /> Copy link</>}
                </Button>
              ) : null}
            </div>
            {!canPublish(s) ? <p className="mt-3 text-sm text-muted-foreground">To publish you still need: {checks.filter((c) => c.required && !c.done).map((c) => c.label.toLowerCase()).join(", ")}.</p> : null}
            <p className="mt-3 text-xs text-muted-foreground">Demo pages open at /demo/p/&lt;address&gt; and only work in this browser. On a connected environment the address is taplo.co/&lt;address&gt;.</p>
          </Panel>

          <Panel title={`Set-up progress · ${requiredDone}/${requiredTotal} required`}>
            <ul className="grid gap-2">
              {checks.map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className="flex min-h-11 items-center gap-3 rounded-md px-1 text-sm hover:underline">
                    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", c.done && "bg-primary text-primary-foreground")}>{c.done ? <Check className="size-3" aria-hidden="true" /> : null}</span>
                    <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.label}</span>
                    {!c.required ? <span className="text-xs text-muted-foreground">optional</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Activity" description="Real counts only. Nothing here is estimated or sample data.">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {METRICS.map((m) => (
                <div key={m} className="rounded-lg border p-3">
                  <dt className="text-xs text-muted-foreground">{m}</dt>
                  <dd className="mt-1 text-xl font-semibold" aria-label={`${m}: not tracked yet`}>—</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">Tracking arrives with the analytics phase{ent.analytics ? "." : " and needs the Core plan or above."} Dashboard previews will never count as visits.</p>
          </Panel>

          <Panel title="Upcoming bookings">
            <p className="text-sm text-muted-foreground">No bookings yet. Online booking is built in a later phase; for now customers call, WhatsApp or email you from your page.</p>
          </Panel>
        </div>
        <div className="min-w-0"><h2 className="mb-2 text-sm font-semibold">Your page</h2><PreviewFrame height={620} /></div>
      </div>
    </>
  )
}
