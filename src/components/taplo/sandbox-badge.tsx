"use client"

import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SANDBOX_MISSING, SANDBOX_SUMMARY } from "@/lib/capabilities"

/** The one place the sandbox is disclosed: a small badge in the application header, with the details one tap away. */
export function SandboxBadge({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border bg-muted/60 px-2.5 text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring ${className ?? ""}`} data-testid="sandbox-badge">
        <Info aria-hidden="true" className="size-3.5" />Sandbox
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 text-sm">
        <p className="font-semibold">Sandbox</p>
        <p className="mt-1 text-muted-foreground">{SANDBOX_SUMMARY}</p>
        <p className="mt-3 text-xs font-medium text-foreground">Not connected yet</p>
        <ul className="mt-1 grid gap-0.5 text-muted-foreground">{SANDBOX_MISSING.map((m) => <li key={m}>· {m}</li>)}</ul>
      </PopoverContent>
    </Popover>
  )
}
