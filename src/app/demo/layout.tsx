import { notFound } from "next/navigation"
import { demoModeEnabled } from "@/lib/env"

// Read the demo flag per request, never frozen at build time.
export const dynamic = "force-dynamic"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  if (!demoModeEnabled()) notFound()
  return children
}
