"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
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
    if (!el || !active || reduced) return;
    let frame = 0,
      last = 0;
    let mobile = false,
      spreadX = 100,
      spreadY = 180;
    const measure = () => {
      mobile = el.clientWidth < 600;
      spreadX = mobile
        ? Math.max(0, el.clientWidth / 2 - 82)
        : Math.min(310, el.clientWidth * 0.29);
      spreadY = mobile ? 200 : 175;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const draw = (now: number) => {
      if (last) elapsed.current += Math.min(now - last, 40);
      last = now;
      const turn = (elapsed.current / 18000) * Math.PI * 2;
      const anchors = mobile
        ? [
            [-0.82, -1.08, -5],
            [0.85, -0.95, 5],
            [0.78, 1.03, 4],
            [-0.92, 0.64, -5],
          ]
        : [
            [-0.95, -0.5, -7],
            [0.85, -0.9, 6],
            [0.9, 0.75, 5],
            [-0.8, 0.9, -6],
          ];
      items.current.forEach((item, i) => {
        if (!item) return;
        const phase = turn + (i * Math.PI) / 2;
        const [ax, ay, tilt] = anchors[i];
        const x = ax * spreadX + Math.cos(phase) * (mobile ? 6 : 16);
        const y = ay * spreadY + Math.sin(phase) * (mobile ? 9 : 13);
        item.style.transform = `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),0) rotateY(${i % 2 ? -7 : 7}deg) rotateZ(${tilt + Math.sin(phase) * 1.5}deg)`;
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active, reduced]);
  return (
    <div
      ref={host}
      className="widget-orbit"
      data-testid="widget-orbit"
      data-active={active && !reduced}
    >
      <Link
        href="/product"
        className="widget-orbit-link"
      >
        <div ref={world} className="widget-orbit-world" aria-hidden="true">
          <div className="widget-orbit-core">
            <div className="orbit-profile-mark">
              f<span>.</span>
            </div>
            <span className="orbit-profile-name">
              FORM
              <br />
              <em>Studio.</em>
            </span>
            <span className="orbit-profile-bio">
              Independent work. All together.
            </span>
            <div className="orbit-profile-action">
              Book a time
              <ArrowUpRight />
            </div>
            <div className="orbit-profile-secondary">
              Services & prices
              <ArrowUpRight />
            </div>

            <span className="orbit-profile-signature">Made with Taplo</span>
          </div>
          <div
            ref={(el) => {
              items.current[0] = el;
            }}
            className="widget-orbit-item orbit-service"
            data-phase="0"
          >
            <div className="orbit-mini-heading">
              <span>The first step</span>
              <ArrowUpRight />
            </div>
            <strong>Consultation.</strong>
            <span className="orbit-price">£45</span>
            <span className="orbit-duration">
              <Clock3 />
              45 minutes
            </span>
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
              <span>Make time.</span>
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
            <SocialIcon platform="instagram" />
            <span className="orbit-social-mark">f.</span>
            <strong>form.studio</strong>
            <span>
              Behind the scenes
              <ArrowUpRight />
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
        <span className="widget-orbit-cta">
          Explore the blocks
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}
