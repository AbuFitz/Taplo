import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

type Variant = "lockup" | "mark" | "app" | "stacked"

/**
 * The single place Taplo's logo is rendered, from the supplied files in /public/logo.
 * `tone="dark"` is the black artwork for light backgrounds; `tone="light"` is the white artwork for dark ones.
 * The lockup artwork carries its own safe margin, so the box is sized by `className` height.
 */
export function TaploLogo({ variant = "lockup", tone = "dark", className }: { variant?: Variant; tone?: "dark" | "light"; className?: string }) {
  const set = variant === "lockup" ? BRAND.lockup : variant === "mark" ? BRAND.mark : variant === "app" ? BRAND.app : BRAND.stacked
  const src = tone === "light" ? set.light : set.dark
  const size = variant === "lockup" ? "h-11 w-auto -my-1.5 -ml-3" : variant === "stacked" ? "h-24 w-auto" : "size-8"
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={BRAND.name} className={cn(size, className)} draggable={false} />
}
