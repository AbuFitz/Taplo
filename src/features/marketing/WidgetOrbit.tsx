"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { SocialIcon } from "@/features/page/widgets/social-icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import "./widget-orbit.css";

/** Purpose-designed illustrative widgets. The product's complete pages are demonstrated elsewhere. */
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
    const observer = new IntersectionObserver(([e]) => { visible = Boolean(e?.isIntersecting); sync(); }, { threshold: 0.1 });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  React.useEffect(() => {
    const el = world.current;
    if (!el || !active || reduced) return;
    let frame = 0, last = 0;
    let radiusX = 100, radiusY = 150;
    const measure = () => { radiusX = Math.min(315, el.clientWidth * 0.29); radiusY = Math.min(el.clientWidth <= 640 ? 220 : 185, el.clientHeight * 0.36); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const draw = (now: number) => {
      if (last) elapsed.current += Math.min(now - last, 40);
      last = now;
      const turn = elapsed.current / 34000 * Math.PI * 2 - 2.45;
      items.current.forEach((item, i) => {
        if (!item) return;
        const angle = turn + i * Math.PI / 2;
        const x = Math.cos(angle) * radiusX, y = Math.sin(angle) * radiusY;
        const depth = Math.cos(angle + Math.PI / 4);
        item.style.zIndex = depth >= 0 ? "3" : "1";
        item.style.transform = `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${depth * 75}px) rotate(${Math.sin(angle) * 5}deg) scale(${0.94 + depth * 0.06})`;
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [active, reduced]);
  return <div ref={host} className="widget-orbit" data-testid="widget-orbit" data-active={active && !reduced}>
    <Link href="/product" className="widget-orbit-link" aria-label="Explore Taplo widgets">
      <div ref={world} className="widget-orbit-world" aria-hidden="true">
        <div className="widget-orbit-core">
          <div className="orbit-profile-mark">f<span>.</span></div>
          <span className="orbit-profile-name">FORM<br /><em>Studio.</em></span>
          <span className="orbit-profile-bio">A little space for good work.</span>
          <div className="orbit-profile-action">Book a time<ArrowUpRight /></div>
          <div className="orbit-profile-secondary">Services & prices<ArrowUpRight /></div>
          <div className="orbit-profile-secondary">Visit the studio<ArrowUpRight /></div>
          <span className="orbit-profile-signature">Made with Taplo</span>
        </div>
        <div ref={el => { items.current[0] = el; }} className="widget-orbit-item orbit-service" data-phase="0">
          <div className="orbit-mini-heading"><span>The first step</span><ArrowUpRight /></div>
          <strong>Consultation.</strong><span className="orbit-price">£45</span><span className="orbit-duration"><Clock3 />45 minutes</span>
        </div>
        <div ref={el => { items.current[1] = el; }} className="widget-orbit-item orbit-booking" data-phase="1">
          <div className="orbit-mini-heading"><CalendarDays /><span>Make time.</span></div>
          <div className="orbit-date-strip"><span>MON<b>26</b></span><span className="orbit-date-selected">TUE<b>27</b></span><span>WED<b>28</b></span></div>
          <div className="orbit-slot-strip"><span>09:00</span><span>11:30</span><span>14:00</span></div>
        </div>
        <div ref={el => { items.current[2] = el; }} className="widget-orbit-item orbit-social" data-phase="2">
          <SocialIcon platform="instagram" /><span className="orbit-social-mark">f.</span><strong>form.studio</strong><span>Behind the scenes<ArrowUpRight /></span>
        </div>
        <div ref={el => { items.current[3] = el; }} className="widget-orbit-item orbit-place" data-phase="3">
          <MapPin className="orbit-place-pin" /><span>Come on in.</span><strong>St Albans.</strong><span className="orbit-place-action">Find the studio<ArrowUpRight /></span>
        </div>
      </div>
      <span className="sr-only">Illustrative business profile, service, calendar, social and location blocks.</span>
    </Link>
    <Link href="/product" className="widget-orbit-cta">Explore the widgets<ArrowUpRight size={16} aria-hidden="true" /></Link>
  </div>;
}
