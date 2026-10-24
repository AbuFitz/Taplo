import { businessAddress } from "@/lib/domains";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader, primaryAction } from "@/features/marketing/Site";
import { PRODUCT_GROUPS } from "@/features/marketing/ia";
import { ProductLead } from "@/features/marketing/ProductLead";
import { Shot } from "@/features/marketing/Shot";
import "@/features/marketing/product-overview.css";

export const metadata: Metadata = {
  title: "Product | Taplo",
  description: "A business page with a job to do. Explore services, appointments, menus, vehicle stock and enquiries in real Taplo examples.",
};
export const dynamic = "force-dynamic";
export default function ProductIndex() {
  const action = primaryAction();
  return <div className="product-atlas">
    <SiteHeader />
    <main>
      <section className="product-atlas-hero product-atlas-width">
        <div className="product-atlas-intro">
          <h1>A page with<br />a job to do.</h1>
          <p>Make the next step easy. A booking, a question, a closer look at what you offer.</p>
          <Link href={action.href} className="product-atlas-cta">{action.label}<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href="#everything" className="product-atlas-all-link">See what’s inside<ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <ProductLead />
      </section>
      <section className="product-atlas-offer">
        <div className="product-atlas-width">
          <div className="product-atlas-offer-heading"><h2>More than<br />a list of links.</h2><div><p>The useful details belong on the page. Clear prices. Room to explain. A next step that makes sense for the business.</p><Link href="/product/services" className="product-atlas-text-link">Explore services and prices<ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
          <div className="product-atlas-menus">
            <figure><div className="product-atlas-menu-art"><Shot id="svc-menu-physio" alt="The actual clinic menu, with appointment descriptions, prices and durations" width={420} fluid frame="none" /></div><figcaption>Appointments, explained.</figcaption></figure>
            <figure><div className="product-atlas-menu-art"><Shot id="svc-menu-cafe" alt="The actual café menu, grouped into food and drinks" width={420} fluid frame="none" /></div><figcaption>A menu worth opening.</figcaption></figure>
            <figure><div className="product-atlas-menu-art"><Shot id="svc-menu-gym" alt="The actual coaching menu, with sessions and ways to get started" width={420} fluid frame="none" /></div><figcaption>A place to start.</figcaption></figure>
          </div>
        </div>
      </section>
      <section className="product-atlas-stock product-atlas-width">
        <div className="product-atlas-stock-art"><Shot id="ex-brookfield-motors-desk" alt="Harris Cars stock on a desktop page, with vehicle photographs and details" width={1100} fluid frame="browser" url={businessAddress("harris-cars")} /></div>
        <div className="product-atlas-stock-copy"><h2>For the bigger<br />decisions, too.</h2><p>A car needs more than a link. Give each vehicle its photographs, facts and price. Keep the customer’s question with the car they asked about.</p><Link href="/product/vehicles" className="product-atlas-text-link">Explore vehicle stock<ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="/inspiration/harris-cars" className="product-atlas-text-link">Open the dealer demo<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>
      <section id="everything" className="product-atlas-directory product-atlas-width">
        <div className="product-atlas-directory-heading"><h2>The parts.<br />Your combination.</h2><p>Start with what you need. Add the rest as your business grows.</p><Link href="/inspiration" className="product-atlas-text-link">Find your starting point<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <nav aria-label="All product features" className="product-atlas-groups">
          {PRODUCT_GROUPS.map((group) => <div key={group.title}><h3>{group.title}</h3><ul>{group.links.map((link) => <li key={link.href}><Link href={link.href}><span>{link.label}<small>{link.blurb}</small></span><ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul></div>)}
        </nav>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
