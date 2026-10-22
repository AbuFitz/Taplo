import type { Metadata } from "next"
import { DemoProfile } from "@/features/demo/DemoProfile"

export const metadata: Metadata = { title: "Preview (demo)", robots: { index: false, follow: false } }

export default function Page() {
  return <DemoProfile mode="draft" />
}
