import * as React from "react"
import { cn } from "@/lib/utils"

type Tone = "neutral" | "accent" | "outline"
const TONE: Record<Tone, string> = {
  neutral: "bg-tp-surface text-tp-fg border-tp-border",
  accent: "bg-tp-accent text-tp-accent-fg border-transparent",
  outline: "bg-transparent text-tp-muted border-tp-border",
}

/** Status is always text + shape, never colour alone. */
export function TaploBadge({ tone = "neutral", className, ...props }: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-tp border px-2.5 py-1 text-xs font-medium leading-none",
        TONE[tone],
        className,
      )}
      {...props}
    />
  )
}
