"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Home,
  LayoutTemplate,
  Menu,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { TaploLogo } from "@/components/taplo/brand";
import { Overlay } from "@/components/taplo/overlay";
import { useStudioItems } from "./workspace-navigation";
import { useDemo } from "../store";

export function WorkspaceNav() {
  const { primary, secondary, isActive } = useStudioItems();
  const { state } = useDemo();
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const groups = [
    { name: "Workspace", items: primary },
    {
      name: "Business",
      items: secondary.filter((i) => i.href !== "/dashboard/settings"),
    },
  ];
  const links = (
    <>
      {groups.map((g) => (
        <div className="ws-nav-group" key={g.name}>
          <p>{g.name}</p>
          {g.items.map(({ href, label, Icon, badge }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <Icon aria-hidden="true" />
              <span>
                {label === "Home"
                  ? "Overview"
                  : label === "Page"
                    ? "Page builder"
                    : label}
              </span>
              {badge ? <b>{badge}</b> : null}
            </Link>
          ))}
        </div>
      ))}
    </>
  );
  return (
    <>
      <aside className="ws-sidebar" aria-label="Workspace navigation">
        <Link href="/dashboard" className="ws-brand" aria-label="Taplo Studio">
          <TaploLogo className="h-6" />
          <span>Studio</span>
        </Link>
        <div className="ws-business">
          <span>
            {(state?.content.identity.name || "T").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <b>{state?.content.identity.name || "Your business"}</b>
            <small>
              {state?.published ? "Published page" : "Your workspace"}
            </small>
          </div>
        </div>
        <nav>{links}</nav>
        <div className="ws-nav-bottom">
          <Link
            href="/dashboard/settings"
            aria-current={path === "/dashboard/settings" ? "page" : undefined}
          >
            <Settings aria-hidden="true" />
            Settings
          </Link>
          <Link href="/" className="ws-back-site">
            Taplo website
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </aside>
      <button
        className="ws-mobile-menu"
        type="button"
        aria-label="Open workspace navigation"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" />
      </button>
      <nav className="ws-mobile-nav" aria-label="Studio">
        <Link
          href="/dashboard"
          aria-current={path === "/dashboard" ? "page" : undefined}
        >
          <Home />
          Overview
        </Link>
        <Link
          href="/dashboard/page"
          aria-current={path === "/dashboard/page" ? "page" : undefined}
        >
          <LayoutTemplate />
          Build
        </Link>
        <Link
          href="/dashboard/bookings"
          aria-current={
            path.startsWith("/dashboard/bookings") ? "page" : undefined
          }
        >
          <CalendarDays />
          Bookings
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          <MoreHorizontal />
          More
        </button>
      </nav>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Your workspace"
        kind="dialog"
      >
        <nav className="ws-sheet-nav">
          {links}
          <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
            <Settings />
            Settings
            <ChevronRight />
          </Link>
        </nav>
      </Overlay>
    </>
  );
}

export function WorkspaceMenu() {
  const { primary, secondary, isActive } = useStudioItems();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="ws-editor-menu"
        aria-label="Open workspace navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" />
      </button>
      <Overlay open={open} onOpenChange={setOpen} title="Your workspace">
        <nav className="ws-sheet-nav">
          <div className="ws-nav-group">
            {[...primary, ...secondary].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon aria-hidden="true" />
                <span>
                  {label === "Home"
                    ? "Overview"
                    : label === "Page"
                      ? "Page builder"
                      : label}
                </span>
                <ChevronRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </nav>
      </Overlay>
    </>
  );
}
