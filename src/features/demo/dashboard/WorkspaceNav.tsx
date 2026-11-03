"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Home,
  CircleHelp,
  LayoutTemplate,
  Menu,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { useStudioItems } from "./workspace-navigation";

export function WorkspaceNav() {
  const { primary, secondary, isActive } = useStudioItems();
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const opener = React.useRef<HTMLButtonElement | null>(null);
  const closeForNavigation = () => { opener.current = null; setOpen(false); };
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => { opener.current = event.currentTarget; setOpen(true); };
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
              onClick={closeForNavigation}
            >
              <Icon aria-hidden="true" />
              <span>
                {label === "Home"
                  ? "Today"
                  : label === "Page"
                    ? "Your page"
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
      <nav className="studio-desktop-nav" aria-label="Studio navigation">
        {primary.map(({href,label,Icon,badge}) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined}><Icon aria-hidden="true" /><span>{label === "Home" ? "Today" : label === "Page" ? "Your page" : label}</span>{badge ? <b>{badge}</b> : null}</Link>)}
        <button type="button" onClick={openMenu} aria-expanded={open} aria-haspopup="dialog"><MoreHorizontal aria-hidden="true" />More</button>
      </nav>
      <button
        className="ws-mobile-menu"
        type="button"
        aria-label="Open workspace navigation"
        onClick={openMenu}
      >
        <Menu aria-hidden="true" />
      </button>
      <nav className="ws-mobile-nav" aria-label="Studio">
        <Link
          href="/dashboard"
          aria-current={path === "/dashboard" ? "page" : undefined}
        >
          <Home />
          Today
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
          onClick={openMenu}
          aria-expanded={open}
          aria-current={
            !["/dashboard", "/dashboard/page", "/dashboard/bookings"].includes(
              path,
            )
              ? "page"
              : undefined
          }
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
        onCloseAutoFocus={(event) => {
          if (!opener.current) { event.preventDefault(); return; }
          const active = document.activeElement;
          if (!active || active === document.body || active.closest('[role="dialog"]')) { event.preventDefault(); opener.current?.focus(); }
        }}
      >
        <nav className="ws-sheet-nav">
          {links}
          <Link href="/" onClick={closeForNavigation}>Taplo website</Link>
          <Link href="/dashboard/help" onClick={closeForNavigation}>
            <CircleHelp />
            Help & feedback
            <ChevronRight />
          </Link>
          <Link href="/dashboard/settings" onClick={closeForNavigation}>
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
            <Link href="/dashboard/help" onClick={() => setOpen(false)}>
              <CircleHelp />
              <span>Help & feedback</span>
            </Link>
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
                    ? "Today"
                    : label === "Page"
                      ? "Your page"
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
