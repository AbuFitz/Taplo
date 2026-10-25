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
            Already out there?
            <br />
            <span>Bring it together.</span>
          </h2>
          <p>
            Keep your website. Keep your socials. Give people one place to find
            your work and the right way to reach you.
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
                Our website<small>The full picture.</small>
              </span>
              <ArrowUpRight />
            </div>
            <div>
              <SocialIcon platform="instagram" />
              <span>
                On Instagram<small>A little behind the scenes.</small>
              </span>
              <ArrowUpRight />
            </div>
            <div>
              <CalendarDays />
              <span>
                Book with us<small>Your existing booking link.</small>
              </span>
              <ArrowUpRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
