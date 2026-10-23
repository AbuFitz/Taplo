import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

type Variant = "wordmark" | "lockup" | "mark" | "app" | "stacked"

/**
 * The single place Taplo's logo is rendered, from the supplied files in /public/logo. The wordmark is the primary logo
 * (docs/brand/logo-decision.md): it stays legible down to 16 px, where the symbol's inner facets merge.
 * `tone="dark"` is the black artwork for light backgrounds; `tone="light"` is the white artwork for dark ones.
 * The lockup artwork carries its own safe margin, so the box is sized by `className` height.
 */
export function TaploLogo({ variant = "wordmark", tone = "dark", className }: { variant?: Variant; tone?: "dark" | "light"; className?: string }) {
  const set = variant === "wordmark" ? BRAND.wordmark : variant === "lockup" ? BRAND.lockup : variant === "mark" ? BRAND.mark : variant === "app" ? BRAND.app : BRAND.stacked
  const src = tone === "light" ? set.light : set.dark
  const size = variant === "wordmark" ? "h-9 w-auto -my-1.5 -ml-1" : variant === "lockup" ? "h-11 w-auto -my-1.5 -ml-3" : variant === "stacked" ? "h-24 w-auto" : "size-8"
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={BRAND.name} className={cn(size, className)} draggable={false} />
}
