"use client";
import { useEffect, useRef, useState } from "react";
import { PagePreview } from "@/features/preview/PagePreview";
import { businessAddress } from "@/lib/domains";

/** Live renderer thumbnails only exist near the viewport, using the same hardware as Studio. */
export function MarketingPreview({
  scenario,
  slug,
  name,
  view = "phone",
}: {
  scenario: string;
  slug: string;
  name: string;
  view?: "phone" | "desktop";
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={host}
      className="marketing-live-preview"
      data-view={view}
      aria-hidden="true"
      style={{
        aspectRatio: view === "phone" ? "402 / 856" : "1.5",
        width: "100%",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      {visible ? (
        <PagePreview
          src={`/appearance/frame?scenario=${scenario}`}
          title={`${name}, ${view}`}
          mode={view === "phone" ? "device" : "desktop"}
          chrome
          interactive={false}
          url={businessAddress(slug)}
        />
      ) : (
        <div
          className={
            view === "phone"
              ? "marketing-phone-placeholder"
              : "marketing-browser-placeholder"
          }
        />
      )}
    </div>
  );
}
