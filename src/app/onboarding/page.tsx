import { Suspense } from "react"
import { Onboarding } from "@/features/demo/Onboarding"

export default function Page() {
  // useSearchParams (plan and "start from this" choices) needs a boundary.
  return <Suspense fallback={<main className="p-8 text-sm text-muted-foreground">Loading…</main>}><Onboarding /></Suspense>
}
