"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/** A link to the home page that, when already there, scrolls back to the top instead of doing nothing. */
export function HomeLink({ onClick, ...props }: Omit<React.ComponentProps<typeof Link>, "href">) {
  const path = usePathname()
  return (
    <Link
      {...props}
      href="/"
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || path !== "/" || event.metaKey || event.ctrlKey || event.shiftKey) return
        event.preventDefault()
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" })
        if (window.location.hash) history.replaceState(null, "", "/")
      }}
    />
  )
}
