import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clock3, SlidersHorizontal, CalendarDays, Users } from "lucide-react";
import { SiteHeader, SiteFooter, primaryAction } from "./Site";
import { MonoField } from "./MonoField";
import { BookingDemo } from "./BookingDemo";
import { businessContentSchema } from "@/features/businesses/content";
import { PHYSIO, GYM } from "@/features/showcase/examples";
import { buildContext } from "@/features/booking/model";
import { resolveStyle } from "@/features/page/themes/resolve";
import { EXAMPLE_OVERRIDES } from "@/features/showcase/lab-state";
import { Shot } from "./Shot";
import { resolveStatus, type ProductPage } from "./product";
import "@/features/page/renderer/page.css";
import "./booking-marketing.css";

export function BookingMarketingPage({ product }: { product: ProductPage }) {
  const action = primaryAction();
  const examples = ([
    { content: PHYSIO, category: "Clinic", scenario: "physio" as const, theme: "open", serviceId: "h1" },
    { content: GYM, category: "Coaching", scenario: "gym" as const, theme: "ink", serviceId: "g1" },
  ]).map(({ content, category, scenario, theme, serviceId }) => {
    const business = businessContentSchema.parse(content);
    const style = resolveStyle(theme, EXAMPLE_OVERRIDES[scenario]);
    return { name: business.identity.name, category, scenario, slug: business.identity.slug, context: buildContext(business), serviceId, cssVars: style.cssVars, attrs: style.attrs };
  });
  return <div className="booking-marketing">
    <SiteHeader />
    <main>
      <section className="booking-hero booking-section">
        <div className="booking-hero-copy">
          <Link href="/product" className="booking-kicker booking-back">Product / Booking</Link>
          <h1>Goodbye,<br />back and forth.</h1>
          <p className="booking-lead">From “when are you free?” to a time that works. Appointments, people and availability, together on your page.</p>
          <div className="booking-hero-actions"><Link data-brand-action href={action.href} className="booking-cta">{action.label}<ArrowRight size={18} aria-hidden="true" /></Link><a href="#try-booking" className="booking-text-link">Try booking<ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </div>
        <div className="booking-hero-art">
          <div className="booking-hero-orbit" aria-hidden="true"><CalendarDays size={22} /><span>A time that<br />works for you.</span></div>
          <Shot id="booking-clinic-time" alt="The real clinic appointment picker, with available days and times for an initial assessment" width={390} frame="phone" priority className="booking-hero-phone" />
        </div>
      </section>
      <section id="try-booking" className="booking-try-section">
        <MonoField className="booking-demo-field"><div className="booking-section"><BookingDemo examples={examples} /></div></MonoField>
      </section>
      <section className="booking-section booking-control-section">
        <div className="booking-control-heading"><p className="booking-kicker">Your diary. Your rules.</p><h2>Open for business.<br />On your terms.</h2><p className="booking-lead">Customers see the times you can offer. You decide what goes into the diary.</p><Link href="/product/team" className="booking-text-link">Meet the team setup<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <div className="booking-control-list">
          {[{ Icon: Clock3, title: "Make room between appointments.", text: "Working hours, breaks, time off and buffers shape the available slots." }, { Icon: SlidersHorizontal, title: "Set how far ahead people book.", text: "Choose your minimum notice and booking window." }, { Icon: Users, title: "The right person for the service.", text: "Customers can choose from the people who provide that appointment." }, { Icon: CalendarDays, title: "Keep the whole diary in view.", text: "Switch between agenda, day, week and month. Block time when you need it." }].map(({ Icon, title, text }) => <article key={title}><Icon size={23} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>
      <section className="booking-availability"><div className="booking-section booking-availability-grid">
        <div><p className="booking-kicker">Inside the preview</p><h2>Try the journey.<br />Know what’s connected.</h2><p>Explore the working booking flow today. Live syncing, messages and payments need their service connections.</p></div>
        <ul data-testid="status" className="booking-status-list">{resolveStatus(product.status).map((status) => <li key={status.label}>{status.state === "works" ? <Check size={17} aria-hidden="true" /> : <Clock3 size={17} aria-hidden="true" />}<div><h3>{status.label}</h3>{status.note && <p>{status.note}</p>}</div></li>)}</ul>
      </div></section>
      <nav aria-label="Related features" className="booking-section booking-related"><p className="booking-kicker">Alongside booking</p>{product.related.map((slug) => <Link key={slug} href={`/product/${slug}`}>{slug === "team" ? "People behind the business" : slug === "services" ? "Services worth a closer look" : "A simpler way to enquire"}<ArrowUpRight size={22} aria-hidden="true" /></Link>)}</nav>
    </main>
    <SiteFooter />
  </div>;
}
