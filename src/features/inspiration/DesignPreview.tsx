"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react"
import { PagePreview } from "@/features/preview/PagePreview"
import { cn } from "@/lib/utils"

/** One working page, viewed at real responsive widths. Switching size preserves the preview document. */
export function DesignPreview({ scenario, name }: { scenario: string; name: string }) {
  const [view, setView] = React.useState<"phone" | "desktop">("phone")
  return (
    <div data-testid="design-preview" data-view={view}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <fieldset className="inline-flex rounded-full bg-foreground/[0.06] p-1">
          <legend className="sr-only">Preview size</legend>
          {(["phone", "desktop"] as const).map((v) => {
            const Icon = v === "phone" ? Smartphone : Monitor
            return <label key={v} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", view === v ? "bg-background shadow-sm" : "text-foreground/65")}>
              <input type="radio" className="sr-only" name="design-preview-size" checked={view === v} onChange={() => setView(v)} />
              <Icon aria-hidden="true" className="size-4" />{v === "phone" ? "Phone" : "Desktop"}
            </label>
          })}
        </fieldset>
        <Link href={`/appearance/frame?scenario=${scenario}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">Open full page<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
      </div>
      <div className="flex min-h-[30rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f5f5f5] py-4 sm:px-6 sm:py-7" style={{ height: "min(50rem, 78dvh)" }}>
        <div className={cn("h-full min-h-0 w-full", view === "phone" ? "max-w-[28rem] overflow-hidden rounded-3xl bg-white" : "px-2")}>
          <PagePreview src={`/appearance/frame?scenario=${scenario}`} title={`${name}, live`} mode={view === "phone" ? "fill" : "desktop"} chrome={false} url={`${name} · example`} testId="design-preview-frame" />
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground/60">Explore the page: open a service, compare prices and try the booking flow.</p>
    </div>
  )
}
