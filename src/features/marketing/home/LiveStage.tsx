"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PhoneChrome } from "@/features/preview/PhoneChrome";
import "./hero-showcase.css";

/** Purpose-built marketing artwork, using the same hardware as the real demos. */
export function LiveStage() {
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
        <div className="hero-showcase-offer">
          <span className="hero-showcase-offer-label">Your work, clearly.</span>
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
        </div>
      </motion.div>
    </figure>
  );
}
