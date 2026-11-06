"use client";
import * as React from "react";
import Link from "next/link";
import { StudioIcons } from "@/features/platform/icons";
import { AppearanceSelect } from "@/features/platform/OperationalTheme";
import { Overlay } from "@/components/taplo/overlay";
import { useStudioItems, type StudioItem } from "./workspace-navigation";

function title(label: string) {
  return label === "Home" ? "Today" : label === "Page" ? "Your page" : label;
}
function Destination({
  item,
  active,
  close,
}: {
  item: StudioItem;
  active: boolean;
  close?: () => void;
}) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={close}
    >
      <item.Icon />
      <span>{title(item.label)}</span>
      {item.badge ? <b>{item.badge}</b> : null}
    </Link>
  );
}
function Index({
  close,
  compact = false,
}: {
  close?: () => void;
  compact?: boolean;
}) {
  const { sections, isActive } = useStudioItems();
  const groups = [
    { title: "Workspace", items: [...sections[0].items, ...sections[1].items] },
    { title: "Business", items: [...sections[2].items, ...sections[3].items] },
  ];
  return (
    <>
      {groups.map((group) => (
        <div className="ts-nav-group" key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <Destination
              key={item.href}
              item={item}
              active={isActive(item.href)}
              close={close}
            />
          ))}
        </div>
      ))}
      <div className="ts-nav-utilities">
        <Destination
          item={{
            href: "/dashboard/help",
            label: "Help & support",
            Icon: StudioIcons.help,
          }}
          active={isActive("/dashboard/help")}
          close={close}
        />
        <Destination
          item={{
            href: "/dashboard/settings",
            label: "Settings",
            Icon: StudioIcons.settings,
          }}
          active={isActive("/dashboard/settings")}
          close={close}
        />
      </div>
      {compact ? (
        <div className="ts-directory-appearance">
          <span>Appearance</span>
          <AppearanceSelect />
        </div>
      ) : null}
    </>
  );
}
export function WorkspaceNav({ variant }: { variant: "rail" | "mobile" }) {
  const { sections, mobileWork, isActive } = useStudioItems();
  const [open, setOpen] = React.useState(false);
  if (variant === "rail")
    return (
      <nav className="ts-navigation" aria-label="Studio navigation">
        <Index />
      </nav>
    );
  const today = sections[0].items[0],
    page = sections[1].items[0];
  const paths = [today.href, page.href, mobileWork?.href].filter(
    Boolean,
  ) as string[];
  return (
    <>
      <nav
        data-testid="studio-dock"
        className="ts-mobile-dock"
        aria-label="Studio"
      >
        <Destination item={today} active={isActive(today.href)} />
        <Destination item={page} active={isActive(page.href)} />
        {mobileWork ? (
          <Destination item={mobileWork} active={isActive(mobileWork.href)} />
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Studio menu"
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-current={!paths.some(isActive) ? "page" : undefined}
        >
          <StudioIcons.menu />
          <span>Menu</span>
        </button>
      </nav>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Your Studio"
        kind="dialog"
        className="ts-directory"
      >
        <nav aria-label="All Studio sections">
          <Index compact close={() => setOpen(false)} />
        </nav>
      </Overlay>
    </>
  );
}
/** Also available from the focused page editor. The main Studio dock remains visible. */
export function WorkspaceMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="ts-editor-sections"
        aria-label="Open Studio sections"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <StudioIcons.menu />
        <span>Studio</span>
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Your Studio"
        className="ts-directory"
      >
        <nav aria-label="All Studio sections">
          <Index compact close={() => setOpen(false)} />
        </nav>
      </Overlay>
    </>
  );
}
