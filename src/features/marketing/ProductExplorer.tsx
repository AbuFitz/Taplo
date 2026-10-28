"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
const STORIES = [
  {
    id: "work",
    label: "Show your work",
    title: "Show your projects and photos.",
    detail:
      "Let visitors browse your work and open photographs for a closer look.",
    href: "/product/gallery-reviews",
    link: "Photos and reviews",
  },
  {
    id: "booking",
    label: "Take bookings",
    title: "Let customers choose a time.",
    detail:
      "Let customers choose an appointment or send a request for you to approve.",
    href: "/product/booking",
    link: "Booking tools",
  },
  {
    id: "stock",
    label: "List what you sell",
    title: "Show what’s for sale.",
    detail:
      "Show products or vehicles with their photos and information. Keep enquiries attached to the right item.",
    href: "/product/vehicles",
    link: "Vehicle stock",
  },
  {
    id: "contact",
    label: "Stay in touch",
    title: "Make it easy to contact you.",
    detail:
      "Add an enquiry form, your phone number and links to the apps you use.",
    href: "/product/enquiries",
    link: "Contact and enquiries",
  },
] as const;
export function ProductExplorer() {
  const [selected, select] = useState(0);
  const uid = useId();
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const cancel = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  const story = STORIES[selected];
  return (
    <section
      className="product-explorer"
      data-testid="product-experience"
      aria-label="Explore Taplo's tools"
    >
      <div
        role="tablist"
        aria-label="What your page can do"
        className="product-story-tabs"
        onPointerLeave={cancel}
      >
        {STORIES.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`${uid}-${s.id}-tab`}
            role="tab"
            type="button"
            aria-selected={selected === i}
            aria-controls={`${uid}-${s.id}-panel`}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => {
              cancel();
              select(i);
            }}
            onPointerEnter={(e) => {
              if (
                e.pointerType === "mouse" &&
                window.matchMedia("(hover:hover)").matches
              ) {
                cancel();
                timer.current = setTimeout(() => select(i), 140);
              }
            }}
            onFocus={() => {
              cancel();
              select(i);
            }}
            onKeyDown={(e) => {
              const next =
                e.key === "ArrowRight"
                  ? (i + 1) % STORIES.length
                  : e.key === "ArrowLeft"
                    ? (i + STORIES.length - 1) % STORIES.length
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? STORIES.length - 1
                        : null;
              if (next !== null) {
                e.preventDefault();
                buttons.current[next]?.focus();
              }
            }}
          >
            {s.label}
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="product-story-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={story.id}
            id={`${uid}-${story.id}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-${story.id}-tab`}
            className="product-story-panel"
            data-scene={story.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <div
              className="product-scene"
              role="img"
              aria-label={`${story.label} illustration`}
            >
              {story.id === "work" ? (
                <>
                  <div className="product-work-photo">
                    <Image
                      src="/showcase/originals/illustration-studio.webp"
                      alt=""
                      fill
                      sizes="(min-width:900px) 540px, 80vw"
                    />
                  </div>
                  <span className="product-work-label">
                    Selected projects
                    <ArrowUpRight />
                  </span>
                  <div className="product-work-caption">
                    Brand identity
                    <br />
                    & illustration.
                  </div>
                </>
              ) : story.id === "booking" ? (
                <div className="product-calendar-card">
                  <span>
                    <CalendarDays />
                    Choose an appointment
                  </span>
                  <strong>Cut & finish</strong>
                  <div className="product-calendar-days">
                    <span>
                      MON<b>26</b>
                    </span>
                    <span>
                      TUE<b>27</b>
                    </span>
                    <span>
                      WED<b>28</b>
                    </span>
                  </div>
                  <div className="product-calendar-times">
                    <span>09:00</span>
                    <span>11:30</span>
                    <span>14:00</span>
                  </div>
                  <small>45 minutes</small>
                </div>
              ) : story.id === "stock" ? (
                <div className="product-car-card">
                  <div>
                    <Image
                      src="/taplo-demo/brookfield-golf.png"
                      alt=""
                      fill
                      sizes="(min-width:900px) 540px, 80vw"
                    />
                  </div>
                  <span>Volkswagen Golf</span>
                  <p>View photos and vehicle details.</p>
                  <strong>
                    Ask about this car
                    <ArrowUpRight />
                  </strong>
                </div>
              ) : (
                <div className="product-enquiry-card">
                  <Mail />
                  <strong>Ask about a project</strong>
                  <span>Your name</span>
                  <span>Email</span>
                  <span className="product-enquiry-message">
                    What would you like to know?
                  </span>
                  <b>
                    Send an enquiry
                    <ArrowUpRight />
                  </b>
                </div>
              )}
            </div>
            <div className="product-story-copy">
              <h2>{story.title}</h2>
              <p>{story.detail}</p>
              <Link href={story.href}>
                {story.link}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
