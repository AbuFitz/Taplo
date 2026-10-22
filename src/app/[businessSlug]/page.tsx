import { notFound, permanentRedirect } from "next/navigation"
import type { Metadata } from "next"
import { getPublishedProfile } from "@/features/businesses/public-profile"
import { isReservedSlug, normalizeSlug } from "@/features/businesses/slug"
import { ProfileRenderer, buildPublicProfileViewModel } from "@/features/themes/renderer"

type Params = Promise<{ businessSlug: string }>

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

export default async function BusinessProfilePage({ params }: { params: Params }) {
  const p = await loadFound(params)
  if (!p) notFound()
  const vm = buildPublicProfileViewModel(p.content, { config: p.config, plan: p.plan, subscriptionStatus: p.subscriptionStatus })
  return (
    <>
      {p.synthetic ? (
        <div role="note" className="bg-amber-300 px-4 py-2 text-center text-sm font-medium text-black">
          Synthetic development fixture — not a real business.
        </div>
      ) : null}
      <ProfileRenderer vm={vm} />
    </>
  )
}
