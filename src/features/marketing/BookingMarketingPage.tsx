import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  SlidersHorizontal,
  CalendarDays,
  Users,
} from "lucide-react";
import { SiteHeader, SiteFooter, primaryAction } from "./Site";
import { MonoField } from "./MonoField";
import { BookingDemo } from "./BookingDemo";
import { businessContentSchema } from "@/features/businesses/content";
import { PHYSIO, GYM } from "@/features/showcase/examples";
import { buildContext } from "@/features/booking/model";
import { resolveStyle } from "@/features/page/themes/resolve";
import { EXAMPLE_OVERRIDES } from "@/features/showcase/lab-state";
import { FeaturePlayground } from "./FeaturePlayground";
import { type ProductPage } from "./product";
import "@/features/page/renderer/page.css";
import "./booking-marketing.css";

export function BookingMarketingPage({ product }: { product: ProductPage }) {
  const action = primaryAction();
  const examples = [
    {
      content: PHYSIO,
      category: "Clinic",
      scenario: "physio" as const,
      theme: "open",
      serviceId: "h1",
    },
    {
      content: GYM,
      category: "Coaching",
      scenario: "gym" as const,
      theme: "ink",
      serviceId: "g1",
    },
  ].map(({ content, category, scenario, theme, serviceId }) => {
    const business = businessContentSchema.parse(content);
    const style = resolveStyle(theme, EXAMPLE_OVERRIDES[scenario]);
    return {
      name: business.identity.name,
      category,
      scenario,
      slug: business.identity.slug,
      context: buildContext(business),
      serviceId,
      cssVars: style.cssVars,
      attrs: style.attrs,
    };
  });
  return (
    <div className="booking-marketing">
      <SiteHeader />
      <main>
        <section className="booking-hero booking-section">
          <div className="booking-hero-copy">
            <h1>
              Take bookings.
              <br />
              On your terms.
            </h1>
            <p className="booking-lead">
              Let customers choose a service, a team member and an available
              time. Accept bookings straight away or review requests first.
            </p>
            <div className="booking-hero-actions">
              <Link
                data-brand-action
                href={action.href}
                className="booking-cta"
              >
                {action.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="#try-booking" className="booking-text-link">
                Try booking
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="booking-hero-art">
            <FeaturePlayground slug="booking" />
          </div>
        </section>
        <section id="try-booking" className="booking-try-section">
          <MonoField className="booking-demo-field">
            <div className="booking-section">
              <BookingDemo examples={examples} />
            </div>
          </MonoField>
        </section>
        <section className="booking-section booking-control-section">
          <div className="booking-control-heading">
            <p className="booking-kicker">Availability</p>
            <h2>Set the hours that suit you.</h2>
            <p className="booking-lead">
              Customers see the times you can offer. You decide what goes into
              the diary.
            </p>
            <Link href="/product/team" className="booking-text-link">
              Team profiles
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="booking-control-list">
            {[
              {
                Icon: Clock3,
                title: "Make room between appointments.",
                text: "Working hours, breaks, time off and buffers shape the available slots.",
              },
              {
                Icon: SlidersHorizontal,
                title: "Set how far ahead people book.",
                text: "Choose your minimum notice and booking window.",
              },
              {
                Icon: Users,
                title: "The right person for the service.",
                text: "Customers can choose from the people who provide that appointment.",
              },
              {
                Icon: CalendarDays,
                title: "Keep the whole diary in view.",
                text: "Switch between agenda, day, week and month. Block time when you need it.",
              },
            ].map(({ Icon, title, text }) => (
              <article key={title}>
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <nav
          aria-label="Related features"
          className="booking-section booking-related"
        >
          <p className="booking-kicker">Alongside booking</p>
          {product.related.map((slug) => (
            <Link key={slug} href={`/product/${slug}`}>
              {slug === "team"
                ? "Team profiles"
                : slug === "services"
                  ? "Services and prices"
                  : "Contact and enquiries"}
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
