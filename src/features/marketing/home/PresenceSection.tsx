import { ArrowUpRight, Globe, CalendarDays } from "lucide-react";
import { SocialIcon } from "@/features/page/widgets/social-icons";
import "./presence-section.css";

/** Illustrative links, deliberately not simulated external account connections. */
export function PresenceSection() {
  return (
    <section className="home-presence" aria-labelledby="presence-title">
      <div className="home-presence-inner">
        <div className="home-presence-copy">
          <h2 id="presence-title">
            Keep the tools
            <br />
            <span>you already use.</span>
          </h2>
          <p>
            Already have a website, shop or booking link? Add them to Taplo
            alongside your social profiles. Customers can find everything from
            the same page.
          </p>
        </div>
        <div
          className="presence-art"
          role="img"
          aria-label="Illustration of a website, Instagram and a booking link gathered on one Taplo page"
        >
          <div className="presence-url">
            <span className="presence-monogram">n.</span>
            <span>
              mytaplo.com/<strong>northstudio</strong>
            </span>
            <ArrowUpRight />
          </div>
          <div className="presence-links">
            <div>
              <Globe />
              <span>
                Our website<small>Projects and services</small>
              </span>
              <ArrowUpRight />
            </div>
            <div>
              <SocialIcon platform="instagram" />
              <span>
                On Instagram<small>Latest work and studio updates</small>
              </span>
              <ArrowUpRight />
            </div>
            <div>
              <CalendarDays />
              <span>
                Book a call<small>Choose a time on Calendly</small>
              </span>
              <ArrowUpRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
