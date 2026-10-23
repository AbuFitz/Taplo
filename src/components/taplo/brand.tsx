import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

/**
 * The single place Taplo's logo is rendered. Until the supplied SVG is placed (see
 * public/brand/README.md) it shows the plain typeset name, and says so to tooling via data-provisional.
 */
export function TaploLogo({ variant = "lockup", tone = "dark", className }: { variant?: "lockup" | "mark"; tone?: "dark" | "light"; className?: string }) {
  if (variant === "mark" && BRAND.markSupplied) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={BRAND.markSrc} alt={BRAND.name} className={cn("size-8", className)} />
  }
  if (variant === "lockup" && BRAND.logoSupplied) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tone === "light" ? BRAND.lockupLightSrc : BRAND.lockupSrc} alt={BRAND.name} className={cn("h-7 w-auto", className)} />
  }
  return (
    <span data-provisional-logo="" className={cn("font-display text-[1.375rem] leading-none", tone === "light" ? "text-white" : "text-foreground", className)}>
      {BRAND.name}
    </span>
  )
}
