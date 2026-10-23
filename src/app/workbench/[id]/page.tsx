import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { devToolsEnabled } from "@/lib/env"
import { StoryFrame } from "@/features/workbench/StoryFrame"
import { storyById } from "@/features/workbench/stories"

export const metadata: Metadata = { title: "Story", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!devToolsEnabled()) notFound()
  const s = storyById((await params).id)
  if (!s) notFound()
  return <StoryFrame id={s.id} />
}
