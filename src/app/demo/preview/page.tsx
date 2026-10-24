import type { Metadata } from "next"
import { DemoProfile } from "@/features/demo/DemoProfile"
import { HEADER_LAYOUTS } from "@/features/page/contracts/style"

export const metadata: Metadata = { title: "Preview (demo)", robots: { index: false, follow: false } }

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { edit, header, widget, variant, look, savedLook, savedStyle } = await searchParams
  const headerLayout = HEADER_LAYOUTS.find((value) => value === header)
  return <DemoProfile savedStyleId={typeof savedStyle === "string" && savedStyle.length <= 64 ? savedStyle : undefined} lookId={typeof look === "string" && look.length <= 64 ? look : undefined} savedLookId={typeof savedLook === "string" && savedLook.length <= 64 ? savedLook : undefined} mode="draft" editing={edit === "1"} headerLayout={headerLayout} widgetId={typeof widget === "string" && widget.length <= 64 ? widget : undefined} variant={typeof variant === "string" && variant.length <= 64 ? variant : undefined} />
}
