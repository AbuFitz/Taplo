"use client"
import { ArrowUpRight } from "lucide-react"
import { googleReviewUrl, isGoogleReviewUrl } from "@/features/page/widgets/google-reviews"
import { useDraft } from "../hooks"
import { UrlField } from "../ui"
import { PageHeader, Panel } from "./Panel"

export function Reviews() {
  const { c, ent, setContent } = useDraft()
  if (!c || !ent) return null
  const url = googleReviewUrl(c)
  return <><PageHeader scene="reviews" title="Reviews" description="Connect customers with the reviews they trust." /><div className="grid max-w-2xl gap-6">
    <Panel title="Google reviews" description="Use your Google Maps business link or your Google review link.">{ent.reviewLinks ? <div className="grid gap-4"><UrlField label="Google Maps or review link" value={url} validate={isGoogleReviewUrl} onCommit={value => setContent(x => ({ ...x, reviewLinks: [...(x.reviewLinks ?? []).filter(l => l.platform !== 'google'), ...(value ? [{ platform: 'google' as const, url: value }] : [])] }))} help="In Google Maps, open your business, choose Share and copy the link." />{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline">Open on Google<ArrowUpRight aria-hidden="true" className="size-4" /></a> : null}<p className="text-xs leading-relaxed text-muted-foreground">This links customers to Google. Showing imported ratings and individual reviews needs a Google connection. Customer reviews and ratings cannot be entered manually.</p></div> : <p className="text-sm text-muted-foreground">Google review links start on the Core plan.</p>}</Panel>
  </div></>
}
