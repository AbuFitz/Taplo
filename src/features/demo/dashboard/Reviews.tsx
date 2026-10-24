"use client"
import { MapPin, ArrowUpRight } from "lucide-react"
import { googleReviewUrl, isGoogleReviewUrl } from "@/features/page/widgets/google-reviews"
import { useDraft } from "../hooks"
import { UrlField } from "../ui"
import { PageHeader, Panel } from "./Panel"

export function Reviews() {
  const { c, ent, setContent } = useDraft()
  if (!c || !ent) return null
  const url = googleReviewUrl(c)
  return <><PageHeader title="Google reviews" description="Your reputation lives on Google. Give customers a direct route to it." /><div className="grid max-w-2xl gap-6">
    <div className="relative overflow-hidden rounded-2xl bg-[#f1f1f1] p-7 text-[#111111]"><MapPin aria-hidden="true" className="mb-8 size-12 text-[#111111]" /><h2 className="font-display text-3xl font-semibold tracking-tight">Let your customers do the talking.</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-[#555555]">Share the reviews people leave on Google, and make it easy for your next customer to leave one too.</p></div>
    <Panel title="Your Google business" description="Use your Google Maps business link or your Google review link.">{ent.reviewLinks ? <div className="grid gap-4"><UrlField label="Google Maps or review link" value={url} validate={isGoogleReviewUrl} onCommit={value => setContent(x => ({ ...x, reviewLinks: [...(x.reviewLinks ?? []).filter(l => l.platform !== 'google'), ...(value ? [{ platform: 'google' as const, url: value }] : [])] }))} help="In Google Maps, open your business, choose Share and copy the link." />{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline">Open on Google<ArrowUpRight aria-hidden="true" className="size-4" /></a> : null}<p className="text-xs leading-relaxed text-muted-foreground">This links customers to Google. Showing imported ratings and individual reviews needs a Google connection. Customer reviews and ratings cannot be entered manually.</p></div> : <p className="text-sm text-muted-foreground">Google review links start on the Core plan.</p>}</Panel>
  </div></>
}
