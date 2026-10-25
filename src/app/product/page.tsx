import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { ProductExplorer } from "@/features/marketing/ProductExplorer";
import { ProductSnapshots } from "@/features/marketing/ProductSnapshots";
import { ScrollReveal } from "@/features/marketing/ScrollReveal";
import "@/features/marketing/product-editorial.css";
export const metadata: Metadata = {
  title: "Product | Taplo",
  description:
    "Show your work, take bookings, list what you sell and stay in touch. Bring the useful parts of your business into one Taplo page.",
};
export const dynamic = "force-dynamic";
export default function ProductIndex() {
  const action = primaryAction();
  return (
    <div className="product-editorial">
      <SiteHeader />
      <main>
        <section className="product-opening">
          <h1>
            One page for
            <br />
            <span>your business.</span>
          </h1>
          <div>
            <p>
              Show your services and products, take booking requests and
              give customers a way to contact you.
            </p>
            <Link data-brand-action href={action.href}>
              {action.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
        <ProductExplorer />
        <section
          className="product-combination"
          aria-labelledby="combination-title"
        >
          <ScrollReveal>
            <h2 id="combination-title">
              Choose what
              <br />
              <span>goes on your page.</span>
            </h2>
          </ScrollReveal>
          <p>
            Add services, products, photos or a booking calendar. Keep your
            existing website and link to the tools you already use.
          </p>
          <div className="product-block-strip" aria-hidden="true">
            <span>Projects</span>
            <span>Services</span>
            <span>Team</span>
            <span>Links</span>
            <span>Reviews</span>
          </div>
        </section>
        <ProductSnapshots />
      </main>
      <SiteFooter />
    </div>
  );
}
