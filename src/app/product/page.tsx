import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { PRODUCT_GROUPS } from "@/features/marketing/ia";
import { pageBySlug } from "@/features/marketing/product";
import { ProductArtwork } from "@/features/marketing/ProductArtwork";

export const metadata: Metadata = {
  title: "Product | Taplo",
  description:
    "Bring your business together with a page for your services, bookings, team, stock and enquiries.",
};
export const dynamic = "force-dynamic";
export default function ProductIndex() {
  const a = primaryAction();
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[#f4f4f4] text-[#080808]">
          <div className="mx-auto max-w-[88rem] px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.8fr] lg:gap-24">
              <h1 className="font-display font-display-tight max-w-4xl text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.99] tracking-[-0.055em]">
                A page that gets on with business.
              </h1>
              <div>
                <p className="max-w-lg text-lg leading-relaxed sm:text-xl">
                  Your services, your stock and your people. The useful details,
                  with a clear next step. Choose what your page needs and make
                  it your own.
                </p>
                <Link
                  href={a.href}
                  className="mt-7 inline-flex min-h-12 items-center gap-6 rounded-full bg-signal px-6 font-semibold text-white outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-signal/50"
                >
                  {a.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
            <nav
              aria-label="Product sections"
              className="mt-12 flex flex-wrap gap-x-7 gap-y-2 border-t border-[#080808]/20 pt-6"
            >
              {PRODUCT_GROUPS.map((g, n) => (
                <a
                  key={g.title}
                  href={`#product-group-${n}`}
                  className="inline-flex min-h-11 items-center rounded text-sm font-semibold underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-current"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          </div>
        </section>
        <div className="mx-auto max-w-[88rem] px-5 pb-10 sm:px-8">
          {PRODUCT_GROUPS.map((g, n) => (
            <section
              key={g.title}
              id={`product-group-${n}`}
              aria-labelledby={`group-title-${n}`}
              className="scroll-mt-24 pt-16 sm:pt-24"
            >
              <div className="mb-8 flex items-baseline gap-4 border-t border-foreground/15 pt-6">
                <span
                  aria-hidden="true"
                  className="text-sm font-semibold text-signal"
                >
                  0{n + 1}
                </span>
                <h2
                  id={`group-title-${n}`}
                  className="font-display text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight"
                >
                  {g.title}
                </h2>
              </div>
              <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {g.links.map((l) => {
                  const p = pageBySlug(l.href.split("/").pop()!)!;
                  return (
                    <li
                      key={l.href}
                      className={g.links.length === 1 ? "md:col-span-2" : ""}
                    >
                      <Link
                        href={l.href}
                        className={`group block rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-signal/50 focus-visible:ring-offset-4 ${g.links.length === 1 ? "md:grid md:grid-cols-2 md:items-center md:gap-10" : ""}`}
                      >
                        <ProductArtwork slug={p.slug} compact />
                        <div className="mt-6">
                          <p className="text-sm font-semibold text-foreground/65">
                            {l.label}
                          </p>
                          <h3 className="mt-3 flex items-start justify-between gap-5 font-display text-[clamp(1.5rem,2.5vw,2.5rem)] leading-[1.08] tracking-tight">
                            {p.title}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="mt-1 size-6 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </h3>
                          <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/65">
                            {l.blurb}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
