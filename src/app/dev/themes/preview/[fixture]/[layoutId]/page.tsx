import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { devToolsEnabled } from "@/lib/env"
import { getFixture } from "@/features/themes/fixtures"
import { resolveLayout } from "@/features/themes/presets/layouts"
import { ProfileRenderer, buildPublicProfileViewModel } from "@/features/themes/renderer"

export const metadata: Metadata = { robots: { index: false, follow: false }, title: "Theme preview (dev)" }

/** Chrome-free render of one fixture through one layout. Used by the showcase iframes and for screenshots. */
export default async function Page({ params, searchParams }: { params: Promise<{ fixture: string; layoutId: string }>; searchParams: Promise<{ plan?: string }> }) {
  if (!devToolsEnabled()) notFound()
  const { fixture: key, layoutId } = await params
  const { plan } = await searchParams
  const fixture = getFixture(key)
  if (!fixture) notFound()
  const { layout } = resolveLayout(layoutId)
  const vm = buildPublicProfileViewModel(fixture.content, {
    config: { layoutId: layout.id, layoutVersion: layout.version, tokenPresetId: layout.tokenPresetId, overrides: {} },
    plan: plan === "free" || plan === "core" || plan === "pro" || plan === "business" ? plan : fixture.plan,
  })
  return <ProfileRenderer vm={vm} />
}
