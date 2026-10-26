import type { Viewport } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PLANS, PLAN_IDS } from "@/features/subscriptions/plans";
import { formatMoney } from "@/features/services/format";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import "@/features/marketing/home/master-home.css";
import { Film } from "@/features/marketing/Film";
import { HomeBooking } from "@/features/marketing/home/HomeBooking";
import { PresenceSection } from "@/features/marketing/home/PresenceSection";
import { LiveStage } from "@/features/marketing/home/LiveStage";

export const dynamic = "force-dynamic";
const action =
  "inline-flex min-h-11 items-center justify-center gap-5 rounded-md bg-white px-5 text-sm font-semibold text-black outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#080808",
};

export default function Home() {
  const a = primaryAction();
  return (
    <div className="marketing-shell home-dark bg-[#080808] text-white">
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
              Your business,
              <br />
              ready to share.
            </h1>
            <div className="max-w-md">
              <p className="text-base leading-relaxed text-white/65 sm:hidden">
                Put your services, photos and links on a page that feels like
                you. Give customers somewhere to book, browse or get in touch.
              </p>
              <p className="hidden text-lg leading-relaxed text-white/65 sm:block">
                Put your services, photos, products and links on a page that
                feels like you. Give customers somewhere to book, browse or get
                in touch.
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

        <HomeBooking />

        <PresenceSection />

        <section
          id="film-h"
          aria-label="Taplo in motion"
          className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 sm:py-20"
        >
          <Film />
        </section>

        <section className="home-plans" data-testid="home-plans">
          <div className="home-plans-inner">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-medium tracking-[-.045em]">
                Start with a page.
                <br />
                Choose what comes next.
              </h2>
              <p className="home-plans-intro">
                Build on Free. Compare the booking, team and design tools in
                each plan before you choose.
              </p>
              <Link href="/pricing" className="home-plans-link">
                Compare plans
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <ul className="home-plans-list">
              {PLAN_IDS.map((id) => (
                <li
                  key={id}
                  data-plan={id}
                  className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-5"
                >
                  <h3 className="text-lg font-medium">{PLANS[id].name}</h3>
                  <p className="home-plan-summary">{PLANS[id].summary}</p>
                  <p className="text-sm font-medium tabular-nums">
                    {PLANS[id].priceMinorGbp === 0
                      ? "£0"
                      : `${formatMoney(PLANS[id].priceMinorGbp)} / month`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
