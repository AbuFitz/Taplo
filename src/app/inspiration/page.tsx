import type { Metadata } from "next";
import { INDUSTRY_FILTERS } from "@/features/marketing/ia";
import { EXAMPLES, describe } from "@/features/inspiration/examples";
import { capabilityTags, styleTags } from "@/features/inspiration/facets";
import { Gallery, type GalleryItem } from "@/features/inspiration/Gallery";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description:
    "Explore designs for businesses, independent founders and creative portfolios. Open a demo and make it your own.",
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
          floating: "Floating profile",
          portrait: "Portrait introduction",
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
      <main className="mx-auto w-full max-w-[100rem] px-4 pb-12 pt-3 sm:px-7 sm:pt-5">
        <h1 className="sr-only">Design inspiration</h1>
        <Gallery
          items={items}
          industries={INDUSTRY_FILTERS.map((i) => ({
            id: i.id,
            label: i.label,
          }))}
          initialIndustry={initialIndustry}
        />
      </main>
    </div>
  );
}
