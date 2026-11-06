"use client";
import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { BusinessEdit } from "@/features/demo/dashboard/QuickBusinessEditor";
import { Search, ArrowUpRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { useDemo } from "@/features/demo/store";
import { useStudioItems } from "@/features/demo/dashboard/workspace-navigation";
import { JOURNEY_META } from "@/features/experience/journey-meta";

const QuickBusinessEditor = dynamic(
  () =>
    import("@/features/demo/dashboard/QuickBusinessEditor").then(
      (module) => module.QuickBusinessEditor,
    ),
  {
    loading: () => (
      <div className="ts-feedback" role="status">
        Opening quick edit…
      </div>
    ),
  },
);
type SearchResult = {
  title: string;
  detail: string;
  href?: string;
  quick?: BusinessEdit;
};
export function StudioSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<BusinessEdit | null>(null);
  const [notice, setNotice] = React.useState("");
  const trigger = React.useRef<HTMLButtonElement>(null);
  const { state } = useDemo();
  const { sections } = useStudioItems();
  React.useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        if (document.querySelector('[role="dialog"]') && !open) return;
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);
  const records: SearchResult[] = [
    {
      title: "Opening hours",
      detail: "Quick edit · stay on this page",
      quick: "hours",
    },
    {
      title: "Contact details",
      detail: "Quick edit · phone, email and website",
      quick: "contact",
    },
    {
      title: "Booking availability",
      detail: "Working time, breaks and blocked dates",
      href: "/dashboard/bookings?section=availability",
    },
    {
      title: "Plan & features",
      detail: "Your package and included features",
      href: "/dashboard/settings?section=plan",
    },
    {
      title: "Connections",
      detail: "Payments, domain and emails",
      href: "/dashboard/settings?section=connections",
    },
    ...sections.flatMap((section) =>
      section.items.map((item) => ({
        title:
          item.label === "Home"
            ? "Today"
            : item.label === "Page"
              ? "Your page"
              : item.label,
        detail:
          item.href === "/dashboard/bookings"
            ? "Calendar, appointments and requests"
            : "Studio section",
        href: item.href,
      })),
    ),
    {
      title: "Settings",
      detail: "Preferences, plan and connections",
      href: "/dashboard/settings",
    },
    {
      title: "Help & support",
      detail: "Guides and problem solving",
      href: "/dashboard/help",
    },
    ...(state?.content.services ?? []).map((item) => ({
      title: item.name || "Untitled service",
      detail: item.archived ? "Archived service" : "Service",
      href: `/dashboard/services?edit=${encodeURIComponent(item.id)}`,
    })),
    ...(state?.content.products ?? []).map((item) => ({
      title: item.name || "Untitled product",
      detail: item.archived ? "Archived product" : "Product",
      href: `/dashboard/products?edit=${encodeURIComponent(item.id)}`,
    })),
  ];
  const term = query.trim().toLowerCase();
  const results = records
    .filter((item) =>
      `${item.title} ${item.detail}`.toLowerCase().includes(term),
    )
    .slice(0, 12);
  const guides = Object.entries(JOURNEY_META)
    .filter(([id, meta]) =>
      `${id} ${meta.join(" ")}`.toLowerCase().includes(term),
    )
    .slice(0, 3);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="ts-search-trigger"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        aria-label="Search Studio"
      >
        <Search aria-hidden="true" />
        <span>Search anything</span>
        <kbd>⌘ K</kbd>
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="Search Studio"
        kind="dialog"
        className="ts-search-dialog"
      >
        <label className="ts-search-field">
          <Search aria-hidden="true" />
          <input
            autoFocus
            type="search"
            aria-label="Search sections, services and products"
            placeholder="A service, a setting, a question…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <p className="ts-result-label">{term ? "Results" : "Jump to"}</p>
        <div className="ts-search-results">
          {results.map((item, index) =>
            item.quick ? (
              <button
                key={item.quick}
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditing(item.quick!);
                }}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ) : (
              <Link
                key={`${item.href}-${index}`}
                href={item.href!}
                onClick={() => setOpen(false)}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ),
          )}
        </div>
        {term && !results.length ? (
          <p className="ts-search-empty">
            No matches. Try a service name or a section such as availability.
          </p>
        ) : null}
        {term && guides.length ? (
          <>
            <p className="ts-result-label">Guides</p>
            <div className="ts-search-results">
              {guides.map(([id, meta]) => (
                <Link
                  key={id}
                  href={`/dashboard/help?topic=${id}`}
                  onClick={() => setOpen(false)}
                >
                  <span>
                    <strong>{meta[0]}</strong>
                    <small>Step-by-step guide</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </Overlay>
      {editing && state ? (
        <QuickBusinessEditor
          mode={editing}
          initial={state}
          onClose={() => setEditing(null)}
          onSaved={(mode) =>
            setNotice(
              mode === "hours"
                ? "Opening hours updated."
                : "Contact details updated.",
            )
          }
          restoreFocus={() => {
            trigger.current?.focus();
            return Boolean(trigger.current?.isConnected);
          }}
        />
      ) : null}
      {notice ? (
        <div className="ts-feedback" role="status">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss confirmation"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
