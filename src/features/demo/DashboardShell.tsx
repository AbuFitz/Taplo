"use client";
import "@/features/page/editor/portal-workspace.css";
import "./dashboard/workspace-tools.css";

import { TaploLogo } from "@/components/taplo/brand";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Package,
  Paintbrush,
  Settings,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Welcome } from "./Welcome";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { useDemo } from "./store";

const NAV = [
  {
    href: "/dashboard/page",
    label: "My page",
    icon: Paintbrush,
    primary: true,
  },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as {
  href: string;
  label: string;
  icon: typeof Paintbrush;
  primary?: boolean;
}[];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const { state } = useDemo();
  const terms = getIndustryPreset(
    state?.content.identity.industryKey ?? "other",
  ).terminology;
  return (
    <nav aria-label="Dashboard" className="grid gap-1">
      {NAV.map(({ href, label: originalLabel, icon: Icon, primary }) => {
        const label =
          originalLabel === "Services"
            ? terms.services
            : originalLabel === "Products" &&
                state?.content.identity.industryKey === "car-dealer"
              ? "Vehicle stock"
              : originalLabel;
        const active =
          href === "/dashboard" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm hover:bg-muted",
              active && "bg-muted font-semibold",
              primary &&
                !active &&
                "bg-primary/10 font-semibold text-primary hover:bg-primary/15",
              primary && active && "bg-primary text-primary-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** The dashboard menu on its own, for screens that supply their own top bar (the page editor). */
export function DashboardMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-11", className)}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>
            <TaploLogo />
          </SheetTitle>
        </SheetHeader>
        <div className="px-2">
          <NavList onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, state } = useDemo();
  const path = usePathname();
  const focus = path === "/dashboard/page";
  const empty =
    ready && (!state || (!state.onboarded && !state.content.identity.name));
  const label = NAV.find((n) => n.href === path)?.label ?? "Dashboard";
  return (
    <div
      className="portal-workspace"
      data-workspace-section={focus ? "editor" : "manage"}
    >
      <div className="portal-main">
        {!focus ? (
          <header className="portal-toolbar" aria-label="Workspace navigation">
            <DashboardMenu />
            <div className="portal-toolbar-identity">
              <p>{state?.content.identity.name || "Taplo"}</p>
              <span>{label}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {state ? (
                <Link href="/dashboard/settings" className="portal-plan-link">
                  {state.plan} plan
                </Link>
              ) : null}
              {state?.content.identity.name ? (
                <Link
                  href="/demo/preview"
                  target="_blank"
                  className="portal-preview-link"
                >
                  View page
                </Link>
              ) : (
                <Link href="/" aria-label="Taplo home">
                  <TaploLogo className="h-5" />
                </Link>
              )}
            </div>
          </header>
        ) : null}
        <main
          className={cn("portal-content", focus && "portal-content-editor")}
        >
          {!ready ? (
            <div className="portal-loading" role="status">
              Loading your workspace…
            </div>
          ) : empty ? (
            <Welcome />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
