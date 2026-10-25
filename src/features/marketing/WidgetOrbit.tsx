"use client";
import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { SocialIcon } from "@/features/page/widgets/social-icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import "./widget-orbit.css";

/** Purpose-designed illustrative blocks. The product's complete pages are demonstrated elsewhere. */
export function WidgetOrbit() {
  const host = React.useRef<HTMLDivElement>(null);
  const world = React.useRef<HTMLDivElement>(null);
  const items = React.useRef<(HTMLDivElement | null)[]>([]);
  const elapsed = React.useRef(0);
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(
      ([e]) => {
        visible = Boolean(e?.isIntersecting);
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  React.useEffect(() => {
    const el = world.current;
    if (reduced) {
      items.current.forEach((item) => {
        item?.style.removeProperty("translate");
        item?.style.removeProperty("rotate");
      });
    }
    if (!el || !active || reduced) return;
    let frame = 0,
      last = 0;
    const draw = (now: number) => {
      if (last) elapsed.current += Math.min(now - last, 40);
      last = now;
      const turn = (elapsed.current / 18000) * Math.PI * 2;
      const mobile = el.clientWidth < 900;
      items.current.forEach((item, i) => {
        if (!item) return;
        const phase = turn + (i * Math.PI) / 2;
        // Keep the authored arrangement intact; orbit only within its own space.
        item.style.translate = `${Math.cos(phase) * (mobile ? 4 : 10)}px ${Math.sin(phase) * (mobile ? 6 : 12)}px`;
        item.style.rotate = `y ${Math.sin(phase) * 5}deg`;
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [active, reduced]);
  return (
    <div
      ref={host}
      className="widget-orbit"
      data-testid="widget-orbit"
      data-active={active && !reduced}
    >
      <div
        className="widget-orbit-art"
        role="img"
        aria-label="Animated illustration of a ceramics studio, workshop, calendar, work and social links"
      >
        <div ref={world} className="widget-orbit-world" aria-hidden="true">
          <div className="orbit-sculpture" />
          <div className="widget-orbit-core">
            <div className="orbit-profile-mark">f.</div>
            <span className="orbit-profile-name">
              FORM
              <br />
              <em>Studio.</em>
            </span>
            <span className="orbit-profile-bio">
              Small groups. Something handmade.
            </span>
            <div className="orbit-profile-action">
              Book a workshop
              <ArrowUpRight />
            </div>

            <span className="orbit-profile-signature">Powered by Taplo</span>
          </div>
          <div
            ref={(el) => {
              items.current[0] = el;
            }}
            className="widget-orbit-item orbit-service"
            data-phase="0"
          >
            <strong>Clay workshop.</strong>
            <div className="orbit-service-line">
              <span className="orbit-price">£45</span>
              <ArrowUpRight />
            </div>
            <span className="orbit-duration">Materials included</span>
          </div>
          <div
            ref={(el) => {
              items.current[1] = el;
            }}
            className="widget-orbit-item orbit-booking"
            data-phase="1"
          >
            <div className="orbit-mini-heading">
              <CalendarDays />
              <span>Workshop dates</span>
            </div>
            <div className="orbit-date-strip">
              <span>
                MON<b>26</b>
              </span>
              <span className="orbit-date-selected">
                TUE<b>27</b>
              </span>
              <span>
                WED<b>28</b>
              </span>
            </div>
            <div className="orbit-slot-strip">
              <span>09:00</span>
              <span>11:30</span>
              <span>14:00</span>
            </div>
          </div>
          <div
            ref={(el) => {
              items.current[2] = el;
            }}
            className="widget-orbit-item orbit-social"
            data-phase="2"
          >
            <span>
              <SocialIcon platform="instagram" />
            </span>
            <span>
              <SocialIcon platform="tiktok" />
            </span>
            <span>
              <SocialIcon platform="youtube" />
            </span>
          </div>
          <div
            ref={(el) => {
              items.current[3] = el;
            }}
            className="widget-orbit-item orbit-place"
            data-phase="3"
          >
            <Image
              src="/showcase/originals/pottery-studio.webp"
              alt=""
              fill
              sizes="200px"
            />
            <span className="orbit-photo-caption">
              From the studio.
              <ArrowUpRight />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
