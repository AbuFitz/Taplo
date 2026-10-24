import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { devToolsEnabled } from "@/lib/env"
import { StoryFrame } from "@/features/workbench/StoryFrame"
import { storyById } from "@/features/workbench/stories"
import { headers } from "next/headers"

export const metadata: Metadata = { title: "Story", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!devToolsEnabled()) notFound()
  const s = storyById((await params).id)
  if (!s) notFound()
  const requestHeaders = await headers()
  const host = requestHeaders.get("host") ?? "localhost:3100"
  const protocol = requestHeaders.get("x-forwarded-proto") === "http" || /^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? "http" : "https"
  return <StoryFrame id={s.id} origin={`${protocol}://${host}`} />
}
