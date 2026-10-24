"use client"
import { MapPin, ArrowUpRight } from "lucide-react"
import { UrlField } from "@/features/demo/ui"
import { googleReviewUrl, isGoogleReviewUrl } from "../widgets/google-reviews"
import type { Editor } from "./useEditor"

export function GoogleReviewsSettings({ ed }: { ed: Editor }) {
  return <div className="grid gap-5" data-testid="google-reviews-setup">
    <div className="relative overflow-hidden rounded-xl bg-[#f1f1f1] p-5 text-[#111111]"><span className="mb-4 grid size-12 place-items-center rounded-xl bg-white text-[#111111] shadow-[4px_5px_0_#d6d6d6]"><MapPin className="size-7" aria-hidden="true" /></span><p className="font-display text-xl font-semibold tracking-tight">Your reputation. On Google.</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-[#555555]">Give customers a direct route to your Google reviews.</p></div>
    <UrlField label="Google Maps or review link" value={googleReviewUrl(ed.state.content)} validate={isGoogleReviewUrl} help="Open your business in Google Maps, choose Share, then paste the link." onCommit={url => ed.setContent(c => ({ ...c, reviewLinks: [...(c.reviewLinks ?? []).filter(l => l.platform !== 'google'), ...(url ? [{ platform: 'google' as const, url }] : [])] }), 'google-reviews')} />
    <p className="text-xs leading-relaxed text-muted-foreground">Customers read and write reviews on Google. Imported ratings and review cards need a Google connection; you cannot type your own rating or customer quotes here.</p>
    <a href="https://support.google.com/business/answer/3474122" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">Find your Google review link<ArrowUpRight aria-hidden="true" className="size-4" /></a>
  </div>
}
