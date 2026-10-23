"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { useDemo } from "@/features/demo/store"
import { cn } from "@/lib/utils"

/**
 * The one action on a design. Someone with a page already gets the look applied to it, and nothing else: their words,
 * prices, photos and the order of their page are untouched, and undo is in the editor. Someone starting out begins setup
 * from the design, which carries the look and the kinds of content, never the sample business's own details.
 */
export function UseDesign({ slug, lookId, lookName, className, size = "md" }: { slug: string; lookId: string; lookName: string; className?: string; size?: "sm" | "md" }) {
  const { state, ready, update } = useDemo()
  const router = useRouter()
  const owner = ready && state?.onboarded ? state : null
  const base = cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/60", size === "sm" ? "min-h-10 px-4 text-sm" : "min-h-12 px-6 text-base", className)
  if (owner) {
    const applied = owner.page.themeId === lookId && Object.keys(owner.page.appearance ?? {}).length === 0
    return (
      <div className="grid gap-1.5">
        <button type="button" className={cn(base, "bg-foreground text-background hover:opacity-90")} onClick={() => { update((x) => ({ ...x, page: { ...x.page, themeId: lookId, appearance: {} } })); router.push("/dashboard/page") }} data-testid="apply-look">
          {applied ? <><Check aria-hidden="true" className="size-4" />Applied to your page</> : `Use this design on your page`}
        </button>
        <p className="text-xs text-foreground/60">Keeps your words, prices, photos and page order. Only the {lookName} look changes. You can undo it in the editor.</p>
      </div>
    )
  }
  return <Link href={`/onboarding?from=${slug}`} className={cn(base, "bg-foreground text-background hover:opacity-90")} data-testid="start-design">Start with this design</Link>
}
