import { notFound, permanentRedirect } from "next/navigation"
import type { Metadata } from "next"
import { getPublishedProfile } from "@/features/businesses/public-profile"
import { isReservedSlug, normalizeSlug } from "@/features/businesses/slug"
import { PageRenderer, buildPageViewModel } from "@/features/page/renderer"
import { getTheme } from "@/features/page/themes/catalogue"

type Params = Promise<{ businessSlug: string }>
type Search = Promise<{ theme?: string }>

async function load(params: Params) {
  const { businessSlug } = await params
  const slug = normalizeSlug(businessSlug)
  if (!slug || isReservedSlug(slug)) return null
  return getPublishedProfile(slug)
}

async function loadFound(params: Params) {
  const lookup = await load(params)
  if (!lookup || lookup.kind === "none") return null
  // A renamed business keeps a permanent redirect from its old address.
  if (lookup.kind === "redirect") permanentRedirect(`/${lookup.slug}`)
  return lookup.profile
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await loadFound(params)
  if (!p) return { title: "Business not found", robots: { index: false } }
  const b = p.content
  const where = b.location.locality ? ` in ${b.location.locality}` : ""
  return {
    title: `${b.identity.name} — ${b.identity.industryLabel}${where}`,
    description: b.identity.tagline ?? b.about?.slice(0, 155),
    alternates: { canonical: `/${b.identity.slug}` },
    // Synthetic fixtures must never be indexed.
    robots: p.synthetic ? { index: false, follow: false } : undefined,
  }
}

export default async function BusinessProfilePage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const p = await loadFound(params)
  if (!p) notFound()
  const { theme } = await searchParams
  const vm = buildPageViewModel(p.content, p.page, {
    plan: p.plan,
    subscriptionStatus: p.subscriptionStatus,
    // Trying other themes is only offered on synthetic demo profiles, never on real pages.
    themeOverride: p.synthetic && theme && getTheme(theme) ? theme : undefined,
  })
  return (
    <>
      {p.synthetic ? (
        <div role="note" className="relative z-10 bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Synthetic demo profile — not a real business. Try another look with <code>?theme=noir</code>, <code>pop</code>, <code>showroom</code>…
        </div>
      ) : null}
      <PageRenderer vm={vm} />
    </>
  )
}
