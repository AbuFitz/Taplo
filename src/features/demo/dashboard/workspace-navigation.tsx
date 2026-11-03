"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  Home,
  Package,
  Palette,
  Settings,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import { resolveEntitlements } from "@/features/subscriptions/entitlements";
import { useDemo } from "../store";

type Item = {
  href: string;
  label: string;
  Icon: typeof Home;
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
    { href: "/dashboard", label: "Home", Icon: Home },
    { href: "/dashboard/page", label: "Page", Icon: Palette },
    { href: "/dashboard/services", label: terms.services, Icon: Wrench },
    {
      href: "/dashboard/bookings",
      label: "Bookings",
      Icon: CalendarDays,
      badge: attention,
    },
  ];
  const secondary: Item[] = [
    { href: "/dashboard/reviews", label: "Reviews", Icon: Star },
    { href: "/dashboard/team", label: "Team", Icon: Users },
    {
      href: "/dashboard/products",
      label: dealer ? "Vehicle stock" : "Products",
      Icon: Package,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      Icon: BarChart3,
      note: ent.analytics ? undefined : "Not on your plan",
    },
    { href: "/dashboard/settings", label: "Settings", Icon: Settings },
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
