"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { StudioIcons } from "@/features/platform/icons";
import { workspaceModel } from "./workspace-model";
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
  const model = workspaceModel(
    state?.content.identity.industryKey,
    state?.content.identity.industryLabel,
  );
  const terms = model.terms;
  const ent = resolveEntitlements(state?.plan ?? "free", "active");
  const [now] = React.useState(() => Date.now());
  const attention =
    bk.bookings.filter((b) => b.status === "pending" && b.endsAt > now).length +
    bk.enquiries.filter((e) => e.status === "new").length;
  const work: Item[] = [
    {
      href: "/dashboard/services",
      label: terms.services,
      Icon: StudioIcons.services,
    },
    {
      href: "/dashboard/bookings",
      label: "Bookings",
      Icon: StudioIcons.bookings,
      badge: attention,
    },
    {
      href: "/dashboard/products",
      label: terms.products,
      Icon: StudioIcons.products,
    },
  ];
  const primary: Item[] = [
    { href: "/dashboard", label: "Home", Icon: StudioIcons.home },
    { href: "/dashboard/page", label: "Page", Icon: StudioIcons.page },
    ...work.filter((item) =>
      model.primaryWork.includes(item.href.split("/").pop()!),
    ),
  ];
  const secondary: Item[] = [
    ...work.filter((item) => !primary.some((p) => p.href === item.href)),
    { href: "/dashboard/reviews", label: "Reviews", Icon: StudioIcons.reviews },
    { href: "/dashboard/team", label: terms.team, Icon: StudioIcons.team },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      Icon: StudioIcons.analytics,
      note: ent.analytics ? undefined : "Not on your plan",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      Icon: StudioIcons.settings,
    },
  ];
  const mobileWork = work.find(
    (item) => item.href === `/dashboard/${model.mobileWork}`,
  );
  const isActive = (href: string) =>
    href === "/dashboard"
      ? path === href
      : path === href || path.startsWith(href + "/");
  return { primary, secondary, mobileWork, isActive };
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
