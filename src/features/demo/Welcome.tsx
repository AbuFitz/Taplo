"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Paintbrush } from "lucide-react";
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
  name: string;
  category: string;
  detail: string;
}[] = [
  {
    scenario: "station",
    slug: "station-road-barbers",
    name: "Station Road Barbers",
    category: "Barber shop",
    detail: "Prices, a familiar face and your next haircut sorted.",
  },
  {
    scenario: "detailer",
    slug: "parkside-valeting",
    name: "Parkside Valeting",
    category: "Valeting & detailing",
    detail: "Show the work. Explain the packages. Arrange a visit.",
  },
  {
    scenario: "brookfield",
    slug: "brookfield-motors",
    name: "Brookfield Motors",
    category: "Car dealership",
    detail: "Proper stock photographs and the facts buyers need.",
  },
];

/** Only shown for an empty account. Existing drafts never enter the sample-loading flow. */
export function Welcome() {
  const { update } = useDemo();
  const router = useRouter();
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
      <div className="grid gap-8 rounded-[2rem] bg-[#eeefe6] p-7 text-[#173f39] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Paintbrush aria-hidden="true" className="size-4" /> Make it yours
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
            Your business. A page that feels like it.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed">
            Start with your name, choose a look and add what you offer. See your
            page take shape as you go.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium">
            {[
              "Phone and desktop previews",
              "Change any look",
              "Your content stays yours",
            ].map((x) => (
              <li className="flex items-center gap-1.5" key={x}>
                <Check aria-hidden="true" className="size-3.5" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <Button
          asChild
          size="lg"
          className="min-h-12 rounded-full bg-[#173f39] px-6 text-white hover:bg-[#24564d]"
        >
          <Link href="/onboarding">
            Start setup <ArrowRight aria-hidden="true" />
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
              Try editing a fictional business. Bookings and messages stay in
              this browser.
            </p>
          </div>
          <Link
            href="/inspiration"
            className="text-sm font-medium underline underline-offset-4"
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
                  src={`/marketing/ex-${s.slug}-desk.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 340px, (min-width: 640px) 30vw, 100vw"
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.category}
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
        <summary className="cursor-pointer text-sm font-medium">
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
