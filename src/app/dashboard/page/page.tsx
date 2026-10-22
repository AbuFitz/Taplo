import { Suspense } from "react"
import { MyPage } from "@/features/page/editor/MyPage"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyPage />
    </Suspense>
  )
}
