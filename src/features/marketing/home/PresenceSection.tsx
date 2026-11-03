import { ArrowUpRight, Globe, CalendarDays, ShoppingBag, MapPin } from "lucide-react";
import { SocialIcon } from "@/features/page/widgets/social-icons";
import "./presence-section.css";

const TOOLS = [
  { name: "Your website", note: "Projects and services", Icon: Globe },
  { name: "Instagram", note: "Latest work and updates", Icon: () => <SocialIcon platform="instagram" /> },
  { name: "Book a call", note: "Choose a time on Calendly", Icon: CalendarDays },
  { name: "Your shop", note: "Open the full range", Icon: ShoppingBag },
  { name: "Find us", note: "Directions and opening hours", Icon: MapPin },
];

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
          aria-label="A website, Instagram, a booking link, a shop and a map, all gathered on one Taplo page"
        >
          <div className="presence-url">
            <span className="presence-monogram">n.</span>
            <span>
              mytaplo.com/<strong>northstudio</strong>
            </span>
            <ArrowUpRight />
          </div>
          <ul className="presence-list" aria-hidden="true">
            {TOOLS.map(({ name, note, Icon }) => (
              <li key={name}>
                <Icon />
                <span className="presence-word">{name}</span>
                <small>{note}</small>
                <ArrowUpRight className="presence-arrow" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
