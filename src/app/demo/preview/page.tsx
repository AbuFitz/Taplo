import type { Metadata } from "next"
import { DemoProfile } from "@/features/demo/DemoProfile"

export const metadata: Metadata = { title: "Preview (demo)", robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  return <DemoProfile mode="draft" editing={edit === "1"} />
}
