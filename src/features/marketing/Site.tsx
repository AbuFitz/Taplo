import Link from "next/link";
import { TAPLO_DOMAINS } from "@/lib/domains";
import { ArrowRight } from "lucide-react";
import { TaploLogo } from "@/components/taplo/brand";
import { demoModeEnabled } from "@/lib/env";
import { SiteNav } from "./SiteNav";
import { PRODUCT_GROUPS } from "./ia";

/** Shared primary destination and wording across the site. */
export function primaryAction() {
  const demo = demoModeEnabled();
  return {
    label: "Start free",
    href: demo ? "/onboarding" : "/pricing",
    demo,
  };
}
export function SiteHeader() {
  const a = primaryAction();
  return <SiteNav cta={a.label} ctaHref={a.href} />;
}
export function SiteFooter() {
  const a = primaryAction();
  return (
    <footer className="mt-16 bg-[#080808] text-white">
      <div className="mx-auto max-w-[88rem] px-5 pb-7 pt-16 sm:px-8 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/25 pb-14 sm:pb-20">
          <h2 className="font-display font-display-tight max-w-3xl text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.03] tracking-[-0.045em]">
            Ready to build
            <br />
            your page?
          </h2>
          <Link
            data-brand-action
            href={a.href}
            className="inline-flex min-h-13 items-center gap-8 rounded-full bg-[#ffffff] px-7 font-semibold text-[#111111] outline-none hover:bg-white focus-visible:ring-3 focus-visible:ring-white/60"
          >
            {a.label}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
        <div className="grid gap-x-10 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_0.9fr] lg:py-16">
          <div className="max-w-xs">
            <Link
              href="/"
              aria-label="Taplo home"
              className="inline-flex rounded outline-none focus-visible:ring-3 focus-visible:ring-white"
            >
              <TaploLogo tone="light" className="h-12" />
            </Link>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              A page for your business.
            </p>
            <a
              href={`mailto:${TAPLO_DOMAINS.email}`}
              className="mt-4 inline-flex min-h-11 items-center text-sm text-white/80 underline underline-offset-4"
            >
              {TAPLO_DOMAINS.email}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Services, products, bookings and links, arranged around the way
              you work.
            </p>
          </div>
          <FooterColumn
            title="Build and book"
            links={[...PRODUCT_GROUPS[0]!.links, ...PRODUCT_GROUPS[1]!.links]}
          />
          <FooterColumn
            title="Show and share"
            links={[...PRODUCT_GROUPS[2]!.links, ...PRODUCT_GROUPS[3]!.links]}
          />
          <FooterColumn
            title="Explore"
            links={[
              { href: "/inspiration", label: "Designs" },
              { href: "/product", label: "All features" },
              { href: "/how-it-works", label: "How setup works" },
              { href: "/pricing", label: "Pricing" },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/25 pt-6 text-sm text-white/70">
          <p>
            Explore our{" "}
            <Link href="/inspiration" className="underline underline-offset-4">
              design examples
            </Link>
            .
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-6">
            <Link
              href="/credits"
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
            >
              Credits
            </Link>
            <Link
              href="/legal/privacy"
              className="inline-flex min-h-11 items-center rounded underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-3 focus-visible:ring-white"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="inline-flex min-h-11 items-center rounded underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-3 focus-visible:ring-white"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-[#ffffff]">{title}</h2>
      <ul className="mt-4 grid">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center rounded text-sm text-white/85 underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-3 focus-visible:ring-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
