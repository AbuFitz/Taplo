import { Suspense } from "react"
import type { Metadata } from "next"
import { Frame } from "@/features/showcase/Frame"

export const metadata: Metadata = { title: "Appearance preview", robots: { index: false, follow: false } }

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Frame />
    </Suspense>
  )
}
