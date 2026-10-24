import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { WHEN_UNAVAILABLE } from "@/lib/capabilities";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { SetupStory } from "@/features/marketing/SetupStory";
export const metadata: Metadata = {
  title: "How it works | Taplo",
  description:
    "Build your first business page with a visual guided setup. Choose a look and add what you offer.",
};
export const dynamic = "force-dynamic";
const FAQ = [
  {
    q: "Do I need a separate website or domain?",
    a: "You can build your page without one. A Taplo page address and custom domains depend on publishing being connected; you do not need to buy a domain to explore the preview.",
  },
  {
    q: "Where is my page kept at the moment?",
    a: `${WHEN_UNAVAILABLE.accounts} ${WHEN_UNAVAILABLE.publicPublishing}`,
  },
  {
    q: "Can customers pay me through Taplo?",
    a: "The preview takes no payments. You can try bookings and enquiries in the browser, or link a product to a shop you already use. Checkout on Taplo needs a payment service connected.",
  },
  {
    q: "Can I change the design later?",
    a: "Your content stays put when the look changes. You can adjust the design with visual controls; the options available depend on your plan.",
  },
  {
    q: "Do I have to fill everything in at once?",
    a: "Start with the basics and one thing you offer. Add photos, people, hours and more services or stock when you are ready.",
  },
];
export default function HowItWorks() {
  const a = primaryAction();
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <section className="bg-[#f1eddf] text-[#142d3e]">
          <div className="mx-auto grid max-w-[88rem] items-end gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.8fr] lg:gap-24">
            <div>
              <p className="text-sm font-semibold">Make a start</p>
              <h1 className="font-display font-display-tight mt-5 text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.01] tracking-[-0.05em]">
                A few good choices.
                <br />A page of your own.
              </h1>
            </div>
            <div>
              <p className="max-w-lg text-lg leading-relaxed sm:text-xl">
                Bring the name. Pick a look. Add what you do. Your page takes
                shape as you go, with room to keep making it yours.
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
        </section>
        <section
          aria-labelledby="setup-preview-title"
          className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
        >
          <h2
            id="setup-preview-title"
            className="font-display text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight"
          >
            Get a feel for the setup.
          </h2>
          <p className="mb-8 mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
            Choose a step to see the actual screen. On a phone, you will see the
            phone layout.
          </p>
          <SetupStory />
        </section>
        <section className="border-y border-foreground/15 bg-[#f6f4ec]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight">
              A few things you might be wondering.
            </h2>
            <dl className="mt-10 divide-y divide-foreground/15 border-y border-foreground/15">
              {FAQ.map((f) => (
                <div
                  key={f.q}
                  className="grid gap-4 py-7 md:grid-cols-[0.8fr_1.2fr] md:gap-14"
                >
                  <dt className="text-lg font-semibold tracking-tight">
                    {f.q}
                  </dt>
                  <dd className="max-w-2xl text-base leading-relaxed text-foreground/70">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href={a.href}
              className="mt-10 inline-flex min-h-12 items-center gap-6 rounded-full bg-signal px-6 font-semibold text-white outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-signal/50"
            >
              {a.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
