import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/features/marketing/Site";
import { ArrowLink } from "@/features/marketing/Scenes";
import { MarketingPreview } from "@/features/marketing/MarketingPreview";
import { DesignPreview } from "@/features/inspiration/DesignPreview";
import { EXAMPLES, bySlug, describe } from "@/features/inspiration/examples";
import { INDUSTRY_FILTERS } from "@/features/marketing/ia";
import { relatedExamples } from "@/features/inspiration/related";
import { UseDesign } from "@/features/inspiration/UseDesign";

export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const e = bySlug((await params).slug);
  return e
    ? {
        title: `${describe(e).name} · ${describe(e).lookName} | Taplo designs`,
        description: e.hook,
      }
    : {};
}
export const dynamic = "force-dynamic";

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const e = bySlug((await params).slug);
  if (!e) notFound();
  const f = describe(e);
  const industry = INDUSTRY_FILTERS.find((i) => i.id === e.industry)!;
  const others = relatedExamples(e);
  return (
    <div className="design-library bg-[#101010] text-white [--foreground:#ffffff] [--background:#101010] [--muted:#242424] [--muted-foreground:#aaaaaa]">
      <SiteHeader />
      <main>
        <section className="mx-auto w-full max-w-7xl px-5 pb-8 pt-8 sm:pt-12">
          <nav aria-label="Breadcrumb" className="text-sm text-foreground/60">
            <Link href="/inspiration" className="underline underline-offset-4">
              Designs
            </Link>{" "}
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span>{f.name}</span>
          </nav>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end lg:gap-16">
            <div>
              <h1 className="font-display font-display-tight text-[clamp(2.75rem,5.6vw,4.5rem)]">
                {f.name}
              </h1>
              <p className="mt-3 text-sm text-foreground/60">
                On the {f.lookName} design ·{" "}
                <Link
                  href="/inspiration"
                  className="underline underline-offset-4"
                >
                  {industry.label}
                </Link>
              </p>
            </div>
            <UseDesign
              slug={e.slug}
              lookId={f.lookId}
              lookName={f.lookName}
              overrides={f.overrides}
            />
          </div>
        </section>

        <section
          aria-label="Try this design"
          className="mx-auto w-full max-w-7xl px-5 pb-14"
        >
          <DesignPreview scenario={e.scenario} name={f.name} slug={e.slug} />
        </section>

        <section
          aria-label="Related designs"
          className="mx-auto w-full max-w-7xl px-5 py-14 sm:py-20"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display font-display-tight text-[clamp(1.75rem,3.5vw,2.75rem)]">
              Another way to make it yours.
            </h2>
            <ArrowLink href="/inspiration">All designs</ArrowLink>
          </div>
          <ul className="mt-8 grid gap-10 sm:grid-cols-3">
            {others.map((o) => {
              const g = describe(o);
              return (
                <li key={o.slug}>
                  <Link
                    href={`/inspiration/${o.slug}`}
                    className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                  >
                    <div className="px-4 py-6">
                      <div className="mx-auto max-w-[220px] transition-transform group-hover:-translate-y-1 motion-reduce:transition-none">
                        <MarketingPreview
                          scenario={o.scenario}
                          slug={o.slug}
                          name={g.name}
                        />
                      </div>
                    </div>
                    <h3 className="mt-4 font-display text-2xl">{g.name}</h3>
                    <p className="mt-1 text-sm text-foreground/65">
                      {g.lookName} · {g.industryLabel}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
