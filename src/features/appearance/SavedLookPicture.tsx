"use client";

import { useEffect, useRef, useState } from "react";
import { PagePreview } from "@/features/preview/PagePreview";
import type { StyleOverrides } from "@/features/page/contracts/style";
import { resolveStyle } from "@/features/page/themes/resolve";
import { backgroundPreview } from "./previews";

/** Mount only visible decorative previews; a shelf of saved looks must not run twelve pages at once. */
export function SavedLookPicture({
  name,
  src,
  themeId,
  overrides,
  kind = "look",
}: {
  name: string;
  src?: string;
  themeId?: string;
  overrides?: StyleOverrides;
  kind?: "look" | "style";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: "96px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);
  const spec = resolveStyle(themeId ?? "clean", overrides ?? {}).spec;
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-lg"
      style={{
        aspectRatio: kind === "style" ? "390/300" : "390/480",
        background: backgroundPreview(spec.background, spec.colors.background),
      }}
      aria-hidden="true"
    >
      {src && visible ? (
        <PagePreview
          src={src}
          title={`${name} saved ${kind} preview`}
          mode="device"
          device={{ w: 390, h: kind === "style" ? 300 : 480 }}
          interactive={false}
        />
      ) : (
        <div
          className="grid h-full content-start justify-items-center gap-3 px-4 py-7"
          style={{ color: spec.colors.text }}
        >
          <span
            className="size-8 rounded-lg"
            style={{
              background: spec.colors.surface,
              border: `1px solid ${spec.colors.border}`,
            }}
          />
          <span className="text-lg font-semibold">Aa</span>
          <span
            className="h-1.5 w-4/5 rounded-full opacity-50"
            style={{ background: spec.colors.text }}
          />
          <span
            className="h-6 w-full rounded-lg"
            style={{ background: spec.colors.accent }}
          />
          <span
            className="h-8 w-full rounded-lg"
            style={{ background: spec.colors.surface }}
          />
        </div>
      )}
    </div>
  );
}
