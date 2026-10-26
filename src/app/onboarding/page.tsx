import { SetupLoading } from "@/features/demo/SetupLoading"
import { Suspense } from "react"
import { Onboarding } from "@/features/setup/SetupFlow"

export default function Page() {
  // useSearchParams (plan and "start from this" choices) needs a boundary.
  return <Suspense fallback={<SetupLoading />}><Onboarding /></Suspense>
}
