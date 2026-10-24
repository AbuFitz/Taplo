import type { Metadata } from "next"
import { DemoProfile } from "@/features/demo/DemoProfile"
import { HEADER_LAYOUTS } from "@/features/page/contracts/style"

export const metadata: Metadata = { title: "Preview (demo)", robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { edit, header, widget, variant } = await searchParams
  const headerLayout = HEADER_LAYOUTS.find((value) => value === header)
  return <DemoProfile mode="draft" editing={edit === "1"} headerLayout={headerLayout} widgetId={typeof widget === "string" && widget.length <= 64 ? widget : undefined} variant={typeof variant === "string" && variant.length <= 64 ? variant : undefined} />
}
