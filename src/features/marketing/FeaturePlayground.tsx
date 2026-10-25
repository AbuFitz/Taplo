"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Car,
  Clock3,
  Mail,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import type { ProductPage } from "./product";
import "./feature-playground.css";

/** Interactive editorial illustrations. They never report a real send, reservation or payment. */
export function FeaturePlayground({ slug }: { slug: ProductPage["slug"] }) {
  const [choice, setChoice] = React.useState(0);
  const reduced = useReducedMotion();
  const id = React.useId();
  const options: Partial<Record<ProductPage["slug"], string[]>> = {
    design: ["Ink", "Stone", "Moss"],
    enquiries: ["A project", "A service", "A viewing"],
    messages: ["Confirm", "Remind", "Update"],
    team: ["Alex", "Jamie", "Morgan"],
    products: ["Small", "Medium", "Large"],
    vehicles: ["Available", "Reserved", "Sold"],
    "gallery-reviews": ["Golf", "CX-5", "MINI"],
    booking: ["Consultation", "Follow-up", "Online"],
  };
  const labels = options[slug] ?? [];
  const themes = [
    { bg: "#161719", ink: "#ffffff", card: "#292b2f", accent: "#d4e6c7" },
    { bg: "#e7e1d7", ink: "#24211d", card: "#fffcf5", accent: "#292621" },
    { bg: "#223d34", ink: "#ffffff", card: "#345448", accent: "#d4e6c7" },
  ];
  const theme = themes[choice % 3];
  const viewing = ["A project", "Full valet", "Volkswagen Golf"][choice];
  const gallery = [
    "/taplo-demo/brookfield-golf.png",
    "/taplo-demo/brookfield-cx5.png",
    "/taplo-demo/brookfield-mini.png",
  ];
  return (
    <div
      className="feature-playground"
      data-feature={slug}
      data-testid={`feature-demo-${slug}`}
    >
      <fieldset className="feature-demo-switch">
        <legend className="sr-only">Explore {slug.replaceAll("-", " ")}</legend>
        {labels.map((label, n) => (
          <label key={label}>
            <input
              type="radio"
              name={id}
              checked={choice === n}
              onChange={() => setChoice(n)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="feature-demo-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={choice}
            className="feature-demo-card"
            initial={reduced ? false : { y: 8 }}
            animate={{ y: 0 }}
            exit={reduced ? {} : { y: -4 }}
            transition={{ duration: 0.18 }}
            style={
              slug === "design"
                ? { background: theme.bg, color: theme.ink }
                : undefined
            }
          >
            {slug === "design" ? (
              <>
                <div className="feature-demo-top">
                  <Palette size={18} aria-hidden="true" />
                  <span>A look of your own</span>
                </div>
                <div
                  className="feature-demo-monogram"
                  style={{ background: theme.card }}
                >
                  O.
                </div>
                <h2>
                  Other
                  <br />
                  <em>Studio.</em>
                </h2>
                <p>Independent ideas. Beautifully made.</p>
                <div
                  className="feature-mini-block"
                  style={{ background: theme.card }}
                >
                  <span>Brand & direction</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <div
                  className="feature-mini-block"
                  style={{ background: theme.card }}
                >
                  <span>Selected work</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <Link
                  className="feature-demo-action"
                  href="/inspiration"
                  style={{
                    background: theme.accent,
                    color: choice === 1 ? "#fff" : "#172019",
                  }}
                >
                  Find your starting look
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "enquiries" ? (
              <>
                <div className="feature-demo-top">
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>The right context, attached</span>
                </div>
                <h2>
                  Let’s talk
                  <br />
                  about it.
                </h2>
                <div className="feature-enquiry-subject">
                  <small>About</small>
                  <strong>{viewing}</strong>
                </div>
                <label className="feature-demo-field">
                  Your message
                  <textarea
                    key={choice}
                    defaultValue={
                      [
                        "I have an idea for a new brand. Can we talk?",
                        "Could you tell me what’s included in the full valet?",
                        "Could I arrange a viewing of this car?",
                      ][choice]
                    }
                    rows={3}
                    maxLength={300}
                  />
                </label>
                <Link
                  className="feature-demo-action"
                  href={`/inspiration/${choice === 2 ? "harris-cars" : choice === 1 ? "detail-dept" : "sora-fields"}`}
                >
                  Try an example page
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "messages" ? (
              <>
                <div className="feature-demo-top">
                  <Mail size={18} aria-hidden="true" />
                  <span>Example message</span>
                </div>
                <h2>
                  {
                    ["All the details.", "A little reminder.", "Plans change."][
                      choice
                    ]
                  }
                </h2>
                <div className="feature-message-bubble">
                  <span>FORM STUDIO</span>
                  <p>
                    {
                      [
                        "Your appointment details, together in one place. Consultation · Thursday · 11:30.",
                        "A reminder about your consultation tomorrow at 11:30. Here’s everything you need before your visit.",
                        "Need a different time? View your appointment details and get in touch about a change.",
                      ][choice]
                    }
                  </p>
                  <small>Illustration · no message sent</small>
                </div>
                <p className="feature-demo-note">
                  Appointment messages need a connected delivery service.
                </p>
                <Link href="/product/booking" className="feature-demo-action">
                  Explore the booking journey
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "team" ? (
              <>
                <div className="feature-demo-top">
                  <Users size={18} aria-hidden="true" />
                  <span>People, not just appointments</span>
                </div>
                <div className="feature-team-avatar" aria-hidden="true">
                  {labels[choice][0]}
                  <i />
                </div>
                <h2>{labels[choice]}.</h2>
                <p>
                  {
                    [
                      "First appointments & a fresh perspective.",
                      "Follow-up appointments & steady progress.",
                      "Online consultations & practical guidance.",
                    ][choice]
                  }
                </p>
                <div className="feature-mini-block">
                  <span>
                    {
                      [
                        "Initial consultation",
                        "Follow-up",
                        "Online consultation",
                      ][choice]
                    }
                  </span>
                  <span>{["45", "30", "30"][choice]} min</span>
                </div>
                <Link
                  href="/inspiration/hollin-physio"
                  className="feature-demo-action"
                >
                  Meet an example team
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "products" ? (
              <>
                <div className="feature-demo-top">
                  <span>FORM OBJECTS</span>
                  <span>01 / 03</span>
                </div>
                <div className="feature-object-art" aria-hidden="true">
                  <div
                    style={{ transform: `scale(${0.75 + choice * 0.12})` }}
                  />
                </div>
                <h2>
                  The everyday
                  <br />
                  vessel.
                </h2>
                <div className="feature-mini-block">
                  <span>{labels[choice]} · Stoneware</span>
                  <strong>{["£24", "£36", "£48"][choice]}</strong>
                </div>
                <p>Room for the detail. A clear route to your shop.</p>
                <Link
                  href="/inspiration/form-objects"
                  className="feature-demo-action"
                >
                  Explore the maker’s page
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "vehicles" ? (
              <>
                <div className="feature-demo-top">
                  <Car size={20} aria-hidden="true" />
                  <span>HARRIS CARS</span>
                  <span className="feature-stock-status" data-status={choice}>
                    {labels[choice]}
                  </span>
                </div>
                <div className="feature-car-image">
                  <Image
                    src="/taplo-demo/brookfield-golf.png"
                    alt="Illustrative Volkswagen Golf on a forecourt"
                    fill
                    sizes="(min-width:768px) 500px, 90vw"
                  />
                </div>
                <h2>Volkswagen Golf.</h2>
                <p>2018 · Petrol · Automatic</p>
                <div className="feature-car-specs">
                  <span>
                    42,800<small>Miles</small>
                  </span>
                  <span>
                    1.4 L<small>Engine</small>
                  </span>
                  <span>
                    £12,495<small>Asking price</small>
                  </span>
                </div>
                <Link
                  href="/inspiration/harris-cars"
                  className="feature-demo-action"
                >
                  {choice === 0 ? "Explore the showroom" : "Browse other stock"}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "gallery-reviews" ? (
              <>
                <div className="feature-demo-top">
                  <span>A closer look.</span>
                  <span>0{choice + 1} / 03</span>
                </div>
                <div className="feature-gallery-main">
                  <Image
                    src={gallery[choice]}
                    alt={labels[choice] + ": illustrative showroom photography"}
                    fill
                    sizes="(min-width:768px) 500px, 90vw"
                  />
                </div>
                <div className="feature-gallery-thumbs" aria-hidden="true">
                  {gallery.map((src) => (
                    <div key={src}>
                      <Image src={src} alt="" fill sizes="100px" />
                    </div>
                  ))}
                </div>
                <h2>
                  Work worth
                  <br />
                  seeing.
                </h2>
                <Link
                  href="/inspiration/harris-cars"
                  className="feature-demo-action"
                >
                  Open the full gallery
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </>
            ) : slug === "booking" ? (
              <>
                <div className="feature-demo-top">
                  <CalendarDays size={18} aria-hidden="true" />
                  <span>Make a little time.</span>
                </div>
                <h2>{labels[choice]}.</h2>
                <p>A service. The right person. A time that works.</p>
                <div className="feature-calendar-strip" aria-hidden="true">
                  {["M", "T", "W", "T", "F"].map((day, n) => (
                    <span key={n} data-active={n === choice + 1}>
                      {day}
                      <b>{24 + n}</b>
                    </span>
                  ))}
                </div>
                <div className="feature-mini-block">
                  <Clock3 size={18} aria-hidden="true" />
                  <span>{choice === 0 ? "45" : "30"} minutes</span>
                  <span>Illustration</span>
                </div>
                <a href="#try-booking" className="feature-demo-action">
                  Try the actual booking flow
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </>
            ) : null}
          </motion.article>
        </AnimatePresence>
        <span className="feature-demo-shadow" aria-hidden="true" />
      </div>
    </div>
  );
}
