"use client";
import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneChrome } from "@/features/preview/PhoneChrome";
import { ScrollReveal } from "./ScrollReveal";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia("(min-width:1024px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const snapshot = () => window.matchMedia("(min-width:1024px)").matches;
const PAGES = [
  {
    name: "Detail Dept.",
    file: "detail-dept-hero.png",
    href: "/inspiration/detail-dept",
  },
  {
    name: "Maya Builds",
    file: "maya-page-hd.png",
    href: "/inspiration/maya-builds",
  },
  {
    name: "Marlowe & Finch",
    file: "barber-page-hd.png",
    href: "/inspiration/marlowe-and-finch",
  },
];
/** Desktop-only real page captures, kept in the shared handset geometry. */
export function ProductSnapshots() {
  const desktop = useSyncExternalStore(subscribe, snapshot, () => false);
  if (!desktop) return null;
  return (
    <aside
      className="product-snapshots"
      aria-label="Example pages"
      data-testid="product-snapshots"
    >
      <ScrollReveal className="product-snapshot-fan" distance={45}>
        {PAGES.map((p) => (
          <Link
            key={p.file}
            href={p.href}
            aria-label={`Open ${p.name} example`}
            className="product-snapshot"
          >
            <div className="phone-shell" data-phone-static>
              <div className="phone-screen">
                <Image
                  src={`/marketing/${p.file}`}
                  alt={`${p.name} actual Taplo page`}
                  width={1170}
                  height={2532}
                  unoptimized
                  loading="lazy"
                />
              </div>
              <PhoneChrome />
            </div>
          </Link>
        ))}
      </ScrollReveal>
    </aside>
  );
}
