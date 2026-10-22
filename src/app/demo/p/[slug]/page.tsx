import type { Metadata } from "next"
import { DemoProfile } from "@/features/demo/DemoProfile"

export const metadata: Metadata = { title: "Demo page", robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <DemoProfile mode="published" slug={slug} />
}
