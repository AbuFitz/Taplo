"use client";
import { businessAddress } from "@/lib/domains";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "../Shot";
import { HOME_DESIGNS } from "./designs";
/** Each choice opens the same working business that is pictured; setup carries its arrangement. */
export function LookSwitcher() {
  const [selected, select] = React.useState(0);
  const design = HOME_DESIGNS[selected];
  return <div className="home-designs grid items-center gap-8 lg:grid-cols-2 lg:gap-20" data-testid="home-designs">
    <div>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Choose a page design</legend>
        {HOME_DESIGNS.map((item, i) => <label key={item.slug} className="cursor-pointer rounded-full border border-black/20 px-5 py-3 text-sm font-medium has-[:checked]:bg-black has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black has-[:focus-visible]:ring-offset-4"><input type="radio" className="sr-only" name="home-design" checked={selected === i} onChange={() => select(i)} />{item.label}</label>)}
      </fieldset>
      <div className="mt-8" aria-live="polite"><p className="font-display text-3xl tracking-[-.04em] sm:text-4xl">{design.name}</p></div>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Link href={`/inspiration/${design.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Open the demo<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        <Link data-brand-action href={`/onboarding?from=${design.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-semibold text-white">Use this design</Link>
      </div>
      <Link href="/inspiration" className="mt-4 inline-flex min-h-11 items-center text-sm text-black/65 underline underline-offset-4">All designs</Link>
    </div>
    <div className="home-design-art" key={design.slug}>
      <div className="home-design-desktop" aria-hidden="true"><Shot id={`ex-${design.asset}-desk` as never} alt="" width={800} fluid frame="browser" url={businessAddress(design.slug)} /></div>
      <div className="home-design-phone"><Shot id={`ex-${design.asset}-phone` as never} alt={`${design.name} page design`} width={390} fluid frame="phone" /></div>
    </div>
  </div>;
}
