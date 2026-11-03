import type { Metadata } from "next"
import { Lab } from "@/features/showcase/lab/Lab"

export const metadata: Metadata = { title: "Appearance · Taplo", description: "One page, four configurations of the same appearance engine.", robots: { index: false, follow: false } }

export default function Page() {
  return <Lab />
}
