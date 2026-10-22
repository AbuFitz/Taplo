"use client"

import * as React from "react"
import { PortalContainerProvider } from "@/components/ui/portal-container"
import { cn } from "@/lib/utils"

/**
 * The scoped profile surface. Sets the --tp-* tokens as inline custom
 * properties (values are enum/hex validated upstream) and publishes its own
 * element so Radix portals render inside it and keep the theme.
 */
export function ThemeRoot({
  family,
  cssVars,
  className,
  attrs,
  children,
}: {
  family: string
  cssVars: Record<string, string>
  className?: string
  /** Finite data-* attributes used by CSS attribute selectors. */
  attrs?: Record<string, string>
  children: React.ReactNode
}) {
  const [el, setEl] = React.useState<HTMLElement | null>(null)
  return (
    <PortalContainerProvider value={el}>
      <div
        ref={setEl}
        data-taplo-theme=""
        data-taplo-page=""
        {...attrs}
        data-family={family}
        style={cssVars as React.CSSProperties}
        className={cn("relative min-h-screen", className)}
      >
        {children}
      </div>
    </PortalContainerProvider>
  )
}
