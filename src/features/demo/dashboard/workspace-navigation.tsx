"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { StudioIcons } from "@/features/platform/icons";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import { resolveEntitlements } from "@/features/subscriptions/entitlements";
import { useDemo } from "../store";

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  note?: string;
};

/** The one list of Studio destinations, so every screen (dock, rail, More sheet, editor menu) names and orders them the same. */
export function useStudioItems() {
  const path = usePathname();
  const { state } = useDemo();
  const { state: bk } = useOwner();
  const terms = getIndustryPreset(
    state?.content.identity.industryKey ?? "other",
  ).terminology;
  const dealer = state?.content.identity.industryKey === "car-dealer";
  const ent = resolveEntitlements(state?.plan ?? "free", "active");
  const [now] = React.useState(() => Date.now());
  const attention =
    bk.bookings.filter((b) => b.status === "pending" && b.endsAt > now).length +
    bk.enquiries.filter((e) => e.status === "new").length;
  const primary: Item[] = [
    { href: "/dashboard", label: "Home", Icon: StudioIcons.home },
    { href: "/dashboard/page", label: "Page", Icon: StudioIcons.page },
    { href: "/dashboard/services", label: terms.services, Icon: StudioIcons.services },
    {
      href: "/dashboard/bookings",
      label: "Bookings",
      Icon: StudioIcons.bookings,
      badge: attention,
    },
  ];
  const secondary: Item[] = [
    { href: "/dashboard/reviews", label: "Reviews", Icon: StudioIcons.reviews },
    { href: "/dashboard/team", label: "Team", Icon: StudioIcons.team },
    {
      href: "/dashboard/products",
      label: dealer ? "Vehicle stock" : "Products",
      Icon: StudioIcons.products,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      Icon: StudioIcons.analytics,
      note: ent.analytics ? undefined : "Not on your plan",
    },
    { href: "/dashboard/settings", label: "Settings", Icon: StudioIcons.settings },
  ];
  const isActive = (href: string) =>
    href === "/dashboard"
      ? path === href
      : path === href || path.startsWith(href + "/");
  return { primary, secondary, isActive };
}

export function RouteSkeleton() {
  return (
    <div className="ws-loading" aria-busy="true" data-testid="route-skeleton">
      <span />
      <span />
      <span />
    </div>
  );
}
