import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServicePricingDemo } from "../ServicePricingDemo";

/** A single offer story, rather than another category chooser competing with design discovery. */
export function CoreFeatures() {
  return (
    <section className="home-core-features" aria-labelledby="core-title">
      <div className="home-core-inner">
        <div className="home-core-copy">
          <h2 id="core-title">
            Show the work.
            <br />
            Make the next step easy.
          </h2>
          <p>
            A service, a package or a first conversation. Put the price and the
            useful details where people need them.
          </p>
          <Link href="/product/services" className="home-core-link">
            Explore services
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-core-art">
          <ServicePricingDemo />
        </div>
      </div>
    </section>
  );
}
