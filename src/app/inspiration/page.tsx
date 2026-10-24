import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/features/marketing/Site";
import { INDUSTRY_FILTERS } from "@/features/marketing/ia";
import { EXAMPLES, describe } from "@/features/inspiration/examples";
import { capabilityTags, styleTags } from "@/features/inspiration/facets";
import { Gallery, type GalleryItem } from "@/features/inspiration/Gallery";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description:
    "Explore Taplo business page designs. See each on a desktop and a phone, then use it for your own business.",
};

export default async function InspirationPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const q = (await searchParams).industry;
  const initialIndustry = INDUSTRY_FILTERS.find((i) => i.id === q)?.id;
  const items: GalleryItem[] = EXAMPLES.map((e) => {
    const f = describe(e);
    return {
      slug: e.slug,
      scenario: e.scenario,
      assetSlug: f.assetSlug,
      name: f.name,
      hook: e.hook,
      industry: e.industry,
      industryLabel: f.industryLabel,
      lookId: f.lookId,
      lookName: f.lookName,
      overrides: f.overrides,
      heading: f.heading,
      header:
        {
          side: "Compact",
          cover: "Cover",
          poster: "Image hero",
          centered: "Text-led",
          minimal: "Text-only",
          feature: "Wide feature",
          editorial: "Editorial",
          banner: "Photo profile",
        }[f.header] ?? f.header,
      style: styleTags(f),
      capabilities: capabilityTags(f.content),
    };
  });
  return (
    <div className="design-library bg-[#080808] text-white [--foreground:#ffffff] [--background:#080808] [--muted:#242424] [--muted-foreground:#aaaaaa]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-10 sm:pt-14">
        <div className="max-w-3xl pb-10 sm:pb-14">
          <h1 className="font-display font-display-tight text-[clamp(2.75rem,6vw,5rem)] text-balance">
            Find your starting point.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/65">
            Choose the structure. Make it your own. Every design opens as a working business demo.
          </p>
        </div>
        <Gallery
          items={items}
          industries={INDUSTRY_FILTERS.map((i) => ({
            id: i.id,
            label: i.label,
          }))}
          initialIndustry={initialIndustry}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
