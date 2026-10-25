import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans";
import { formatMoney } from "@/features/services/format";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { CoreFeatures } from "@/features/marketing/home/CoreFeatures";
import "@/features/marketing/home/master-home.css";
import { Film } from "@/features/marketing/Film";
import { HomeBooking } from "@/features/marketing/home/HomeBooking";
import { PresenceSection } from "@/features/marketing/home/PresenceSection";
import { PlaqueScene } from "@/features/marketing/PlaqueScene";
import { LiveStage } from "@/features/marketing/home/LiveStage";
import { taploCodeSvg } from "@/features/qr/taplo-code";

export const dynamic = "force-dynamic";
const action =
  "inline-flex min-h-11 items-center justify-center gap-5 rounded-md bg-white px-5 text-sm font-semibold text-black outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";
export default function Home() {
  const a = primaryAction();
  const qr = taploCodeSvg(
    "https://mytaplo.vercel.app/inspiration/no-6-coffee",
    320,
    "Example Taplo QR code",
  );
  return (
    <div className="marketing-shell bg-[#080808] text-white">
      <SiteHeader />
      <main>
        <section
          aria-labelledby="home-title"
          className="mx-auto max-w-[88rem] px-5 pt-12 sm:px-8 sm:pt-20"
        >
          <div className="grid gap-7 pb-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-24">
            <h1
              id="home-title"
              className="font-display max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[1.04] tracking-[-.055em]"
            >
              Your business.
              <br />
              One useful page.
            </h1>
            <div className="max-w-md">
              <p className="text-base leading-relaxed text-white/65 sm:hidden">
                The work you do. The details they need. One link that brings it
                together.
              </p>
              <p className="hidden text-lg leading-relaxed text-white/65 sm:block">
                Your services, prices, photos and stock. Give customers one
                place to explore your business and take the next step.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Link data-brand-action href={a.href} className={action}>
                  {a.label}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  href="/inspiration"
                  className="inline-flex min-h-11 items-center gap-2 rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore designs
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </div>
          <LiveStage />
        </section>

        <CoreFeatures />
        <HomeBooking />

        <PresenceSection />

        <div className="home-sharing-surface bg-[#f7f7f7]">
          <section
            aria-labelledby="sharing-h"
            className="marketing-light home-sharing-section mx-auto grid max-w-[88rem] items-center gap-10 px-5 py-16 text-black sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20"
          >
            <div>
              <h2
                id="sharing-h"
                className="font-display max-w-lg text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1.06] tracking-[-.045em]"
              >
                Your page.
                <br />
                Out in the world.
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-black/65">
                A branded plaque for your counter. A digital business card for
                Apple Wallet, Google Wallet and Samsung Wallet. One code that
                opens your business page.
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-black/60">
                Physical plaques and digital wallet passes are in development.
              </p>
            </div>
            <PlaqueScene code={qr} />
          </section>
        </div>

        <section
          id="film-h"
          aria-label="Taplo in motion"
          className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 sm:py-20"
        >
          <Film />
        </section>

        <section className="mx-auto grid max-w-[88rem] gap-10 border-t border-white/15 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">
              Start free.
              <br />
              Add more when you need it.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              A plan for your next step.
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-flex min-h-11 items-center gap-3 rounded text-sm text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white"
            >
              Compare plans
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {PLAN_IDS.map((id) => (
              <li
                key={id}
                className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-5"
              >
                <h3 className="text-lg font-medium">{PLANS[id].name}</h3>
                <p className="text-sm leading-relaxed text-white/55">
                  {PLANS[id].summary}
                </p>
                <p className="text-sm font-medium tabular-nums">
                  {PLANS[id].priceMinorGbp === 0
                    ? "£0"
                    : `${formatMoney(PLANS[id].priceMinorGbp)} / month`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
