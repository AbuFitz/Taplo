"use client";

import * as React from "react";
import Link from "next/link";
import { StudioIcons } from "@/features/platform/icons";
import { AppearanceSelect } from "@/features/platform/OperationalTheme";
import { Overlay } from "@/components/taplo/overlay";
import { useStudioItems, type StudioItem } from "./workspace-navigation";

const { next: ChevronRight, help: CircleHelp, menu: Menu, settings: Settings } = StudioIcons;

function displayName(label: string) {
  return label === "Home" ? "Today" : label === "Page" ? "Your page" : label;
}

function NavigationLink({ item, active, onNavigate, detailed = false }: {
  item: StudioItem;
  active: boolean;
  onNavigate?: () => void;
  detailed?: boolean;
}) {
  const { Icon, href, label, badge, note } = item;
  return (
    <Link href={href} aria-current={active ? "page" : undefined} onClick={onNavigate}>
      <Icon aria-hidden="true" />
      <span className="studio-destination-copy">
        <span>{displayName(label)}</span>
        {detailed && note ? <small>{note}</small> : null}
      </span>
      {badge ? <b aria-label={`${badge} need attention`}>{badge}</b> : null}
      {detailed ? <ChevronRight className="studio-destination-arrow" aria-hidden="true" /> : null}
    </Link>
  );
}

function SectionLinks({ detailed = false, onNavigate }: { detailed?: boolean; onNavigate?: () => void }) {
  const { sections, isActive } = useStudioItems();
  return sections.map(({ title, items }) => (
    <div className="studio-section" key={title}>
      <h2>{title}</h2>
      {items.map((item) => (
        <NavigationLink key={item.href} item={item} active={isActive(item.href)} onNavigate={onNavigate} detailed={detailed} />
      ))}
    </div>
  ));
}

function UtilityLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { isActive } = useStudioItems();
  return (
    <div className="studio-section studio-utility-links">
      <Link href="/dashboard/help" aria-current={isActive("/dashboard/help") ? "page" : undefined} onClick={onNavigate}>
        <CircleHelp aria-hidden="true" /><span className="studio-destination-copy">Help & feedback</span>
      </Link>
      <Link href="/dashboard/settings" aria-current={isActive("/dashboard/settings") ? "page" : undefined} onClick={onNavigate}>
        <Settings aria-hidden="true" /><span className="studio-destination-copy">Settings</span>
      </Link>
    </div>
  );
}

/** Every destination is visible on desktop. Mobile keeps three frequent actions and a grouped directory. */
export function WorkspaceNav({ variant }: { variant: "rail" | "mobile" }) {
  const { mobileWork, isActive, sections } = useStudioItems();
  const [open, setOpen] = React.useState(false);
  const opener = React.useRef<HTMLButtonElement | null>(null);
  const openDirectory = (event: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = event.currentTarget;
    setOpen(true);
  };
  const closeForNavigation = () => { opener.current = null; setOpen(false); };

  if (variant === "rail") {
    return (
      <nav className="studio-desktop-nav" aria-label="Studio navigation">
        <SectionLinks />
        <UtilityLinks />
      </nav>
    );
  }

  const dockPaths = ["/dashboard", "/dashboard/page", mobileWork?.href].filter((href): href is string => Boolean(href));
  const otherActive = !dockPaths.some(isActive);
  return (
    <>
      <nav className="ws-mobile-nav" aria-label="Studio">
        <NavigationLink item={sections[0].items[0]} active={isActive("/dashboard")} />
        <NavigationLink item={sections[1].items[0]} active={isActive("/dashboard/page")} />
        {mobileWork ? <NavigationLink item={mobileWork} active={isActive(mobileWork.href)} /> : null}
        <button type="button" onClick={openDirectory} aria-expanded={open} aria-haspopup="dialog" aria-current={otherActive ? "page" : undefined}>
          <Menu aria-hidden="true" /><span>Tools</span>
        </button>
      </nav>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Studio sections"
        kind="dialog"
        onCloseAutoFocus={(event) => {
          if (!opener.current) { event.preventDefault(); return; }
          const active = document.activeElement;
          if (!active || active === document.body || active.closest('[role="dialog"]')) {
            event.preventDefault(); opener.current?.focus();
          }
        }}
      >
        <nav className="studio-directory" aria-label="All Studio sections">
          <SectionLinks detailed onNavigate={closeForNavigation} />
          <UtilityLinks onNavigate={closeForNavigation} />
          <div className="studio-directory-preferences"><AppearanceSelect /></div>
        </nav>
      </Overlay>
    </>
  );
}

/** The full-page editor has its own canvas navigation; this opens the same Studio directory. */
export function WorkspaceMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" className="ws-editor-menu" aria-label="Open Studio sections" aria-expanded={open} onClick={() => setOpen(true)}>
        <Menu aria-hidden="true" />
        <span>Studio</span>
      </button>
      <Overlay open={open} onOpenChange={setOpen} title="Studio sections">
        <nav className="studio-directory" aria-label="All Studio sections">
          <SectionLinks detailed onNavigate={() => setOpen(false)} />
          <UtilityLinks onNavigate={() => setOpen(false)} />
          <div className="studio-directory-preferences"><AppearanceSelect /></div>
        </nav>
      </Overlay>
    </>
  );
}
