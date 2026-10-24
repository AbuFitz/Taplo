"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CalendarCheck, Clock3 } from "lucide-react";
import { ThemeRoot } from "@/components/taplo/theme-root";
import { BookingFlow } from "@/features/booking/ui/BookingFlow";
import type { BookingContext } from "@/features/booking/model";
import { PagePreview } from "@/features/preview/PagePreview";

export interface BookingExample {
  name: string;
  category: string;
  scenario: string;
  slug: string;
  context: BookingContext;
  serviceId: string;
  cssVars: Record<string, string>;
  attrs: Record<string, string>;
}

/** The marketing example runs the customer booking engine, including its real outcome. */
export function BookingDemo({ examples }: { examples: BookingExample[] }) {
  const [active, setActive] = useState(0);
  const example = examples[active];
  const service = example.context.services.find((s) => s.id === example.serviceId)!;
  const instant = service.bookingMode === "instant";
  const price = service.priceMode === "free" ? "Free" : new Intl.NumberFormat("en-GB", { style: "currency", currency: service.currency, maximumFractionDigits: 0 }).format((service.priceMinor ?? 0) / 100);
  return (
    <div className="booking-demo" data-testid="booking-marketing-demo">
      <div className="booking-demo-controls">
        <p className="booking-kicker">Try it for yourself</p>
        <h2>Book it in.<br />Or agree it first.</h2>
        <fieldset className="booking-business-picker">
          <legend className="sr-only">Choose a booking example</legend>
          {examples.map((item, i) => <label key={item.slug}>
            <input type="radio" name="booking-example" value={item.slug} checked={i === active} onChange={() => setActive(i)} />
            <span>{item.category}</span>
          </label>)}
        </fieldset>
        <div className="booking-service-readout" aria-live="polite" aria-atomic="true">
          <p className="booking-example-name">{example.name}</p>
          <div className="booking-service-title"><h3>{service.name}</h3><span>{price}</span></div>
          <p className="booking-service-duration"><Clock3 size={15} aria-hidden="true" />{service.durationMinutes} minutes<span aria-hidden="true">·</span>{instant ? "Instant booking" : "Request to book"}</p>
          <p className="booking-outcome-copy">{instant ? "Choose a coach and a time. Your appointment is confirmed in the demo." : "Choose a practitioner and a time. The clinic reviews your request before confirming."}</p>
        </div>
        <ThemeRoot family="page" cssVars={example.cssVars} attrs={example.attrs} className="booking-flow-scope">
          <BookingFlow key={example.slug} ctx={example.context} serviceId={example.serviceId} title={`Book with ${example.name}`} trigger={<button type="button" className="booking-cta booking-cta-light"><CalendarCheck size={18} aria-hidden="true" />Try a booking<ArrowRight size={18} aria-hidden="true" /></button>} />
        </ThemeRoot>
        <p className="booking-demo-note">Sample businesses. Nothing is sent or charged. Bookings stay in this browser.</p>
        <Link className="booking-text-link" href={`/onboarding?from=${example.slug}`} data-testid="booking-adopt">Start with this design<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="booking-demo-art">
        <Link href={`/inspiration/${example.slug}`} className="booking-preview-link" aria-label={`Open ${example.name} demo`}>
          <div className="booking-phone-crop" aria-hidden="true">
            <PagePreview key={example.slug} src={`/appearance/frame?scenario=${example.scenario}`} title={`${example.name} customer page`} mode="device" chrome cropDevice interactive={false} loading="lazy" />
          </div>
          <span className="booking-open-demo">Open demo<ArrowUpRight size={16} aria-hidden="true" /></span>
        </Link>
      </div>
    </div>
  );
}
