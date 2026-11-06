"use client";
import * as React from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { useDemo } from "@/features/demo/store";
import { useStudioItems } from "@/features/demo/dashboard/workspace-navigation";
import { JOURNEY_META } from "@/features/experience/journeys";

export function StudioSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { state } = useDemo();
  const { sections } = useStudioItems();
  React.useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const records = [
    ...sections.flatMap((section) =>
      section.items.map((item) => ({
        title:
          item.label === "Home"
            ? "Today"
            : item.label === "Page"
              ? "Your page"
              : item.label,
        detail: "Studio section",
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
          {results.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
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
    </>
  );
}
