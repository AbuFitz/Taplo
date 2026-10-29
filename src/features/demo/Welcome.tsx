"use client";

import Image from "next/image";
import Link from "next/link"
import { ALL_SHOWCASE } from "@/features/inspiration/showcase-set"
import { getStartingLook } from "@/features/page/themes/starting-looks"
import { Illustration } from "@/components/taplo/illustrations";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDUSTRY_FIXTURE_KEYS, getFixture } from "@/features/themes/fixtures";
import { loadSample } from "./actions";
import {
  initialConfig,
  toContent,
  toPage,
} from "@/features/showcase/lab-state";
import type { Scenario } from "@/features/showcase/content";
import { initialState, useDemo } from "./store";

const SAMPLES: {
  scenario: Scenario;
  slug: string;
  asset: string;
  name: string;
  category: string;
  detail: string;
}[] = [
  {
    scenario: "station",
    slug: "jays-barbers", asset: "station-road-barbers",
    name: "Jay’s Barbers",
    category: "Barber shop",
    detail: "Prices, a familiar face and your next haircut sorted.",
  },
  {
    scenario: "detailer",
    slug: "detail-dept", asset: "parkside-valeting",
    name: "Detail Dept.",
    category: "Valeting & detailing",
    detail: "Show the work. Explain the packages. Arrange a visit.",
  },
  {
    scenario: "brookfield",
    slug: "harris-cars", asset: "brookfield-motors",
    name: "Harris Cars",
    category: "Car dealership",
    detail: "Proper stock photographs and the facts buyers need.",
  },
  { scenario: "corner", slug: "no-6-coffee", asset: "corner-table-cafe", name: "No. 6 Coffee", category: "Neighbourhood café", detail: "A proper menu, opening times and a way to ask about a larger visit." },
  { scenario: "oakfield", slug: "dans-home-repairs", asset: "oakfield-home-repairs", name: "Dan’s Home Repairs", category: "Home repairs", detail: "Explain the work, agree the scope and arrange a visit." },
  { scenario: "rowan", slug: "maths-with-aisha", asset: "rowan-learning", name: "Maths with Aisha", category: "Maths tutor", detail: "A personal introduction and sessions at a pace you can follow." },
];

/** The starting look an example page wears, so each card says what it shows. */
const lookName = (scenario: Scenario): string | undefined => {
  const id = ALL_SHOWCASE.find((i) => i.scenario === scenario)?.look
  return id ? getStartingLook(id)?.name : undefined
}

/** Only shown for an empty account. Existing drafts never enter the sample-loading flow. */
export function Welcome() {
  const { state, update } = useDemo();
  const router = useRouter();
  const resumeName = state?.content.identity.name?.trim();
  const load = (scenario: Scenario) => {
    const cfg = initialConfig(scenario);
    update(
      (s) => {
        // A draft opened in another tab must not be replaced by an old welcome screen.
        if (s.onboarded || s.content.identity.name) return s;
        return {
          ...initialState(),
          plan: s.plan,
          onboarded: true,
          slugEdited: true,
          step: "publish",
          content: structuredClone(toContent(cfg)),
          page: structuredClone(toPage(cfg)),
        };
      },
      { resetHistory: true },
    );
    router.push("/dashboard/page");
  };
  return (
    <div className="mx-auto max-w-6xl pb-12 pt-8 sm:pt-14">
      <div className="grid items-center gap-8 rounded-[2rem] bg-[#f4f4f4] p-7 text-[#111111] sm:p-10 lg:grid-cols-[1fr_auto]" data-testid="first-run">
        <div className="max-w-xl">
          <Illustration name="profile" className="mb-5 h-20 w-24 text-[#111111]/75" />
          <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
            Set up your business page.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#444]">
            {resumeName ? `Your setup for ${resumeName} is saved on this device.` : "Add what you offer, pick a look, share the link."}
          </p>
          <ol className="mt-6 grid gap-2 text-sm font-medium sm:grid-flow-col sm:auto-cols-max sm:gap-6">
            {["Add your details", "Choose a look", "Share your page"].map((x, i) => (
              <li className="flex items-center gap-2" key={x}>
                <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-[#111111] text-xs text-white">{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>
        <Button
          asChild
          size="lg"
          className="min-h-12 rounded-full bg-[#111111] px-6 text-white hover:bg-[#333333]"
        >
          <Link href="/onboarding">
            {resumeName ? "Continue setup" : "Start setup"} <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <section className="mt-10" aria-labelledby="sample-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="sample-title"
              className="text-xl font-semibold tracking-tight"
            >
              Have a look around first
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Open an example page. Anything you try stays on this device.
            </p>
          </div>
          <Link
            href="/inspiration"
            className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
          >
            See all designs
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <button
              key={s.scenario}
              type="button"
              onClick={() => load(s.scenario)}
              aria-label={`Try ${s.name}`}
              className="group overflow-hidden rounded-2xl border bg-card text-left transition hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="relative aspect-[1.35] overflow-hidden bg-muted">
                <Image
                  src={`/marketing/ex-${s.asset}-desk.webp?v=20261024-brands`}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 340px, (min-width: 640px) 30vw, 100vw"
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.category}
                  {lookName(s.scenario) ? <span className="font-normal normal-case tracking-normal"> · {lookName(s.scenario)}</span> : null}
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.detail}
                </p>
                <span className="mt-5 flex items-center justify-between text-sm font-semibold">
                  Try this page{" "}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <details className="mt-8 rounded-xl border p-4">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium">
          More sample businesses
        </summary>
        <p className="mt-3 text-xs text-muted-foreground">
          Earlier examples for exploring other types of business.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INDUSTRY_FIXTURE_KEYS.map((k) => (
            <Button
              key={k}
              size="sm"
              className="min-h-11"
              variant="outline"
              onClick={() => {
                update(
                  (s) =>
                    s.onboarded || s.content.identity.name
                      ? s
                      : loadSample(s, k),
                  { resetHistory: true },
                );
                router.push("/dashboard/page");
              }}
            >
              {getFixture(k)!.label}
            </Button>
          ))}
        </div>
      </details>
    </div>
  );
}
