"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "../Shot";
const DESIGNS = [
  { label: "Appointments", name: "Hollin Physiotherapy", slug: "hollin-physio", asset: "hollin-physio" },
  { label: "Stock", name: "Harris Cars", slug: "harris-cars", asset: "brookfield-motors" },
  { label: "Menus", name: "No. 6 Coffee", slug: "no-6-coffee", asset: "corner-table-cafe" },
] as const;
/** Each choice opens the same working business that is pictured; setup carries its arrangement. */
export function LookSwitcher() {
  const [selected, select] = React.useState(0);
  const design = DESIGNS[selected];
  return <div className="home-designs grid items-center gap-8 lg:grid-cols-2 lg:gap-20" data-testid="home-designs">
    <div>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Choose a business design</legend>
        {DESIGNS.map((item, i) => <label key={item.slug} className="cursor-pointer rounded-full border border-black/20 px-5 py-3 text-sm font-medium has-[:checked]:bg-black has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black has-[:focus-visible]:ring-offset-4"><input type="radio" className="sr-only" name="home-design" checked={selected === i} onChange={() => select(i)} />{item.label}</label>)}
      </fieldset>
      <div className="mt-8" aria-live="polite"><p className="font-display text-3xl tracking-[-.04em] sm:text-4xl">{design.name}</p></div>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Link href={`/inspiration/${design.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Open the demo<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        <Link href={`/onboarding?from=${design.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-semibold text-white">Use this design</Link>
      </div>
      <Link href="/inspiration" className="mt-4 inline-flex min-h-11 items-center text-sm text-black/65 underline underline-offset-4">All business designs</Link>
    </div>
    <div className="home-design-art" key={design.slug}>
      <div className="home-design-desktop" aria-hidden="true"><Shot id={`ex-${design.asset}-desk` as never} alt="" width={800} fluid frame="none" /></div>
      <div className="home-design-phone"><Shot id={`ex-${design.asset}-phone` as never} alt={`${design.name} business design`} width={390} fluid frame="phone" /></div>
    </div>
  </div>;
}
