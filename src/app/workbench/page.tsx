import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { devToolsEnabled } from "@/lib/env"
import { WorkbenchIndex } from "@/features/workbench/Gallery"

export const metadata: Metadata = { title: "Component workbench", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default function Page() {
  if (!devToolsEnabled()) notFound()
  return <WorkbenchIndex />
}
