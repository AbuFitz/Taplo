"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PhoneChrome } from "@/features/preview/PhoneChrome";
import { BrowserChrome } from "@/features/preview/BrowserChrome";
import "./hero-showcase.css";

const subscribe = (notify: () => void) => {
  const query = window.matchMedia("(min-width: 900px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const desktopSnapshot = () => window.matchMedia("(min-width: 900px)").matches;
const serverSnapshot = () => false;

/** Purpose-built marketing artwork, using the same hardware as the real demos. */
export function LiveStage() {
  const desktop = useSyncExternalStore(
    subscribe,
    desktopSnapshot,
    serverSnapshot,
  );
  const reduced = useReducedMotion();
  return (
    <figure
      className="hero-showcase"
      aria-label="Illustrated business pages made with Taplo"
      data-testid="hero-showcase"
    >
      <motion.div
        className="hero-showcase-canvas"
        initial={reduced ? false : { y: 18 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {desktop ? (
          <div
            className="hero-showcase-browser browser-shell"
            data-testid="hero-browser-illustration"
          >
            <BrowserChrome url="mytaplo.com/marlowe-and-finch" />
            <div className="hero-barber-art">
              <span className="hero-art-wordmark">
                MARLOWE
                <br />& FINCH<span>BARBERING, DONE WELL.</span>
              </span>
              <div className="hero-art-barber-photo">
                <Image
                  src="/photography/barber.webp"
                  alt="A barber at work"
                  fill
                  sizes="650px"
                />
              </div>
              <div className="hero-art-cuts">
                <span>
                  Good hair.
                  <br />
                  No fuss.
                </span>
                <div>
                  <p>
                    A cut & finish<strong>£22</strong>
                  </p>
                  <p>
                    Skin fade<strong>£25</strong>
                  </p>
                  <span>
                    Find your chair
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="hero-showcase-phone">
          <div
            className="phone-shell"
            data-phone-static
            data-testid="hero-phone-illustration"
          >
            <div className="phone-screen hero-illustration-screen">
              <div className="hero-detailer-art">
                <span className="hero-art-detail-mark">
                  DETAIL
                  <br />
                  DEPT.
                </span>
                <strong>
                  A little more
                  <br />
                  attention.
                </strong>
                <p>Car care. Without the compromise.</p>
                <span className="hero-art-book">
                  <CalendarDays aria-hidden="true" />
                  Request a valet
                </span>
                <div className="hero-art-car-photo">
                  <Image
                    src="/photography/valet.webp"
                    alt="Careful detailing of a car"
                    fill
                    sizes="350px"
                    priority
                  />
                </div>
                <span className="hero-art-detail-footer">
                  Every detail. Taken care of.
                </span>
              </div>
            </div>
            <PhoneChrome />
          </div>
        </div>
        <Link className="hero-showcase-offer" href="/product/services">
          <span className="hero-showcase-offer-label">
            Your work, clearly.
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
          <strong>
            More than
            <br />a good look.
          </strong>
          <ul>
            <li>
              <span>Full valet</span>
              <span>From £85</span>
            </li>
            <li>
              <span>Paint protection</span>
              <span>Let’s talk</span>
            </li>
          </ul>
        </Link>
      </motion.div>
      <figcaption>
        <span>Your business. Your own identity.</span>
        <Link href="/inspiration">
          Find your look
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  );
}
