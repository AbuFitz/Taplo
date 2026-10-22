import * as React from "react"
import { cn } from "@/lib/utils"

/** Surface container. Cards are an available component, not a mandatory wrapper. */
export function TaploCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="taplo-card"
      className={cn("rounded-tp border border-tp-border bg-tp-surface text-tp-fg shadow-tp", className)}
      {...props}
    />
  )
}
