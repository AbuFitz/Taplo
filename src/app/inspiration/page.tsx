import type { Metadata } from "next"
import { SiteFooter, SiteHeader } from "@/features/marketing/Site"
import { INDUSTRY_FILTERS } from "@/features/marketing/ia"
import { EXAMPLES, describe } from "@/features/inspiration/examples"
import { capabilityTags, styleTags } from "@/features/inspiration/facets"
import { Gallery, type GalleryItem } from "@/features/inspiration/Gallery"

export const metadata: Metadata = { title: "Designs | Taplo", description: "Real Taplo pages in nine looks. See each on a desktop and a phone, then use it for your own business." }

export default async function InspirationPage({ searchParams }: { searchParams: Promise<{ industry?: string }> }) {
  const q = (await searchParams).industry
  const initialIndustry = INDUSTRY_FILTERS.find((i) => i.id === q)?.id
  const items: GalleryItem[] = EXAMPLES.map((e) => {
    const f = describe(e)
    return { slug: e.slug, name: f.name, hook: e.hook, industry: e.industry, industryLabel: f.industryLabel, lookId: f.lookId, lookName: f.lookName, heading: f.heading, header: { side: "Compact", cover: "Cover", poster: "Image hero", centered: "Text-led", minimal: "Text-only" }[f.header] ?? f.header, style: styleTags(f), capabilities: capabilityTags(f.content) }
  })
  return (
    <div className="bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-10 sm:pt-14">
        <h1 className="font-display font-display-tight mb-6 text-[clamp(1.75rem,3.2vw,2.5rem)]">Designs</h1>
        <Gallery items={items} industries={INDUSTRY_FILTERS.map((i) => ({ id: i.id, label: i.label }))} initialIndustry={initialIndustry} />
      </main>
      <SiteFooter />
    </div>
  )
}
