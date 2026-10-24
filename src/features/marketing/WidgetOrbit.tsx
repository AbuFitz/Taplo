"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "./Shot";
import "./widget-orbit.css";
/** Original spatial composition of real Taplo widgets; no video decode, slideshow or opaque backdrop. */
export function WidgetOrbit() {
  const host = React.useRef<HTMLDivElement>(null);
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
  const items = [
    { id: "cafe-menu", phase: 0 },
    { id: "bk-2-time", phase: 1 },
    { id: "team-swipe", phase: 2 },
    { id: "cap-vehicles", phase: 3 },
  ] as const;
  return (
    <div
      ref={host}
      className="widget-orbit"
      data-testid="widget-orbit"
      data-active={active}
    >
      <Link
        href="/product"
        className="widget-orbit-link"
        aria-label="Explore Taplo widgets"
      >
        <div className="widget-orbit-world" aria-hidden="true">
          <div className="widget-orbit-core">
            <Shot
              id="ex-corner-table-cafe-phone"
              alt=""
              width={390}
              frame="none"
              fluid
            />
          </div>
          {items.map((item) => (
            <div
              className="widget-orbit-item"
              data-phase={item.phase}
              key={item.id}
            >
              <div className="widget-orbit-capture">
                <Shot id={item.id} alt="" width={320} frame="none" fluid />
              </div>

            </div>
          ))}
        </div>
        <span className="sr-only">
          Menus, booking, people and vehicle stock, brought together on a
          business page.
        </span>
      </Link>
      <Link href="/product" className="widget-orbit-cta">
        Explore the widgets
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
