"use client";
import * as React from "react";
/** A restrained tonal light field. Pointer values stay outside React's render loop. */
export function MonoField({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const host = React.useRef<HTMLDivElement>(null),
    frame = React.useRef(0);
  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    let visible = false;
    const sync = () =>
      (el.dataset.moving = String(visible && !document.hidden));
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(frame.current);
    };
  }, []);
  const locate = (x: number, y: number) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      host.current?.style.setProperty("--field-x", `${x}%`);
      host.current?.style.setProperty("--field-y", `${y}%`);
    });
  };
  return (
    <div
      ref={host}
      className={`mono-field ${className}`}
      data-testid="mono-field"
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        locate(
          ((e.clientX - r.left) / r.width) * 100,
          ((e.clientY - r.top) / r.height) * 100,
        );
      }}
      onPointerLeave={() => locate(50, 40)}
      onFocusCapture={(e) => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = e.currentTarget.getBoundingClientRect(),
          t = e.target.getBoundingClientRect();
        locate(
          ((t.x + t.width / 2 - r.x) / r.width) * 100,
          ((t.y + t.height / 2 - r.y) / r.height) * 100,
        );
      }}
    >
      <div className="mono-field-light" aria-hidden="true" />
      {children}
    </div>
  );
}
