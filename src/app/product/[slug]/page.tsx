import Link from "next/link";
import { BookingMarketingPage } from "@/features/marketing/BookingMarketingPage";
import { PlaqueScene } from "@/features/marketing/PlaqueScene";
import { taploCodeSvg } from "@/features/qr/taplo-code";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock, Layers, ExternalLink } from "lucide-react";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { ArrowLink } from "@/features/marketing/Scenes";
import { SCENES } from "@/features/marketing/ProductScenes";
import {
  ProductArtwork,
  PRODUCT_TONES,
} from "@/features/marketing/ProductArtwork";
import {
  PRODUCT_PAGES,
  pageBySlug,
  resolveStatus,
} from "@/features/marketing/product";

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
  const Scene = SCENES[p.slug],
    a = primaryAction(),
    tone = PRODUCT_TONES[p.slug];
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section style={{ background: tone.background, color: tone.ink }}>
          <div className="mx-auto max-w-[88rem] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-3 text-sm"
            >
              <Link
                href="/product"
                className="rounded underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-current"
              >
                Product
              </Link>
              <span aria-hidden="true" className="opacity-50">
                /
              </span>
              <span>{p.label}</span>
            </nav>
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <p className="text-sm font-semibold">{p.eyebrow}</p>
                <h1 className="font-display font-display-tight mt-5 max-w-2xl text-[clamp(2.5rem,5.3vw,5rem)] leading-[1.01] tracking-[-0.05em]">
                  {p.title}
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed opacity-85 sm:text-xl">
                  {p.lead}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
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
                    Take a closer look
                  </a>
                </div>
              </div>
              {p.slug === "sharing" ? <div className="sharing-plaque-art"><PlaqueScene code={taploCodeSvg("https://taplo-lilac.vercel.app/inspiration/no-6-coffee",320,"Example Taplo QR code")}/></div> : <ProductArtwork slug={p.slug} priority />}
            </div>
          </div>
        </section>
        <div
          id="feature-detail"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
        >
          <Scene />
        </div>
        <section className="border-y border-foreground/15 bg-[#f6f4ec] py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight">
                What’s available.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/70">
                Explore the working frontend now. Bookings and enquiries stay in
                this browser until the live services are connected.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/65">
                Plan features, service connections and other platforms are
                called out separately, so you know what each option needs.
              </p>
            </div>
            <ul
              className="divide-y divide-foreground/15 border-y border-foreground/15"
              data-testid="status"
            >
              {resolveStatus(p.status).map((s) => {
                const category =
                  s.state === "works"
                    ? "Available in the preview"
                    : s.requirement === "plan"
                      ? "Plan feature"
                      : s.requirement === "platform"
                        ? "Depends on the other platform"
                        : "Needs a connection";
                const Icon =
                  s.state === "works"
                    ? Check
                    : s.requirement === "plan"
                      ? Layers
                      : s.requirement === "platform"
                        ? ExternalLink
                        : Clock;
                return (
                  <li key={s.label} className="flex gap-4 py-5">
                    <Icon
                      aria-hidden="true"
                      className={`mt-1 size-5 shrink-0 ${s.state === "works" ? "text-neutral-800" : "text-neutral-600"}`}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/65">
                        {category}
                      </p>
                      <p className="mt-2 font-semibold">{s.label}</p>
                      {s.note && (
                        <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                          {s.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight tracking-tight">
                Better together.
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
