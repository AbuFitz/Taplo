import Link from "next/link";
import { FeaturePlayground } from "@/features/marketing/FeaturePlayground";
import { ServicePricingDemo } from "@/features/marketing/ServicePricingDemo";
import { BookingMarketingPage } from "@/features/marketing/BookingMarketingPage";
import { PlaqueScene } from "@/features/marketing/PlaqueScene";
import { taploCodeSvg } from "@/features/qr/taplo-code";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { ArrowLink } from "@/features/marketing/Scenes";
import { FeatureDetails } from "@/features/marketing/FeatureDetails";
import { PRODUCT_TONES } from "@/features/marketing/ProductArtwork";
import { PRODUCT_PAGES, pageBySlug } from "@/features/marketing/product";

export function generateStaticParams() {
  return PRODUCT_PAGES.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = pageBySlug((await params).slug);
  return p ? { title: `${p.label} | Taplo`, description: p.lead } : {};
}
export const dynamic = "force-dynamic";
export default async function ProductPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = pageBySlug((await params).slug);
  if (!p) notFound();
  if (p.slug === "booking") return <BookingMarketingPage product={p} />;
  const a = primaryAction(),
    tone = PRODUCT_TONES[p.slug];
  return (
    <div className="feature-page bg-background">
      <SiteHeader />
      <main>
        <section style={{ background: tone.background, color: tone.ink }}>
          <div className="mx-auto max-w-[88rem] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
            <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <h1 className="font-display font-display-tight max-w-2xl text-[clamp(2.5rem,5.3vw,5rem)] leading-[1.01] tracking-[-0.05em]">
                  {p.title}
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed opacity-85 sm:text-xl">
                  {p.lead}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    data-brand-action
                    href={a.href}
                    className="inline-flex min-h-12 items-center gap-5 rounded-full bg-white px-6 font-semibold text-[#080808] shadow-sm outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-current"
                  >
                    {a.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <a
                    href="#feature-detail"
                    className="inline-flex min-h-11 items-center rounded font-semibold underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-current"
                  >
                    See details
                  </a>
                </div>
              </div>
              {p.slug === "services" ? (
                <ServicePricingDemo />
              ) : p.slug === "sharing" ? (
                <div className="sharing-plaque-art">
                  <PlaqueScene
                    code={taploCodeSvg(
                      "https://mytaplo.vercel.app/inspiration/no-6-coffee",
                      320,
                      "Example Taplo QR code",
                    )}
                  />
                </div>
              ) : (
                <FeaturePlayground slug={p.slug} />
              )}
            </div>
          </div>
        </section>
        <div
          id="feature-detail"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
        >
          <FeatureDetails slug={p.slug} />
        </div>
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight">
                Related features
              </h2>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                {p.related.map((r) => (
                  <li key={r}>
                    <ArrowLink href={`/product/${r}`}>
                      {pageBySlug(r)!.label}
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/inspiration"
              className="inline-flex min-h-12 items-center gap-5 rounded-full bg-signal px-6 font-semibold text-white outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-signal/50"
            >
              Find your look
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
