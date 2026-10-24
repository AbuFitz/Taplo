"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Shot } from "@/features/marketing/Shot";
import type { StyleOverrides } from "@/features/page/contracts/style";
import { UseDesign } from "./UseDesign";
import { cn } from "@/lib/utils";
import {
  CAPABILITY_TAGS,
  STYLE_TAGS,
  type CapabilityTag,
  type StyleTag,
} from "./facets";

export interface GalleryItem {
  slug: string;
  assetSlug: string;
  name: string;
  hook: string;
  industry: string;
  industryLabel: string;
  scenario: string;
  lookId: string;
  lookName: string;
  overrides: StyleOverrides;
  heading: string;
  header: string;
  style: StyleTag[];
  capabilities: CapabilityTag[];
}
export interface GalleryProps {
  items: GalleryItem[];
  industries: { id: string; label: string }[];
  initialIndustry?: string;
}

const searchable = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const toggle = <T,>(list: T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

/**
 * The one place to explore designs. Every card is a composed page captured from the real renderer; the filters read the
 * design's own configuration. The example business is only the content a design is shown with: any design suits any business.
 */
export function Gallery({ items, industries, initialIndustry }: GalleryProps) {
  const [view, setView] = React.useState<"desktop" | "phone">("phone");
  const [query, setQuery] = React.useState("");
  const [style, setStyle] = React.useState<StyleTag[]>([]);
  const [caps, setCaps] = React.useState<CapabilityTag[]>([]);
  const [filtersOpen, setFiltersOpen] = React.useState(
    Boolean(initialIndustry),
  );
  const filterId = React.useId();
  const [biz, setBiz] = React.useState<string | null>(initialIndustry ?? null);
  const words = searchable(query.trim()).split(/\s+/).filter(Boolean);
  const shown = items.filter(
    (i) =>
      words.every((word) =>
        searchable([i.name, i.hook, i.industryLabel, i.scenario, ...i.capabilities].join(" ")).includes(word),
      ) &&
      style.every((s) => i.style.includes(s)) &&
      caps.every((c) => i.capabilities.includes(c)) &&
      (!biz || i.industry === biz),
  );
  const filtering = style.length + caps.length > 0 || biz !== null;
  return (
    <div>
      <div className="mb-5 flex min-h-12 items-center gap-3 rounded-2xl bg-foreground/[0.07] px-4 focus-within:ring-2 focus-within:ring-foreground/50">
        <Search
          aria-hidden="true"
          className="size-4 shrink-0 text-foreground/60"
        />
        <input
          aria-label="Find a business design"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try café, clinic, booking…"
          className="min-h-12 w-full min-w-0 appearance-none bg-transparent text-base outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="grid size-11 shrink-0 place-items-center rounded-full focus-visible:ring-2"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
      <div
        className="mb-5 border-b border-foreground/10 pb-5"
        data-testid="gallery-filters"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls={filterId}
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/20 px-4 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            Filters
            {filtering ? (
              <span className="grid size-5 place-items-center rounded-full bg-foreground text-xs text-background">
                {style.length + caps.length + (biz ? 1 : 0)}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "text-lg leading-none",
                  filtersOpen && "rotate-45",
                )}
              >
                +
              </span>
            )}
          </button>
          <div
            role="radiogroup"
            aria-label="Preview on"
            className="inline-flex rounded-full bg-foreground/[0.06] p-1"
          >
            {(["phone", "desktop"] as const).map((v) => (
              <label
                key={v}
                className={cn(
                  "min-h-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                  view === v ? "bg-background shadow-sm" : "text-foreground/65",
                )}
              >
                <input
                  type="radio"
                  name="view"
                  value={v}
                  checked={view === v}
                  onChange={() => setView(v)}
                  className="sr-only"
                />
                {v === "desktop" ? "Desktop" : "Phone"}
              </label>
            ))}
          </div>
        </div>
        <div id={filterId} hidden={!filtersOpen}>
          <div className="mt-4 grid gap-5 rounded-2xl bg-muted p-5">
            <Group
              label="Style"
              tags={[...STYLE_TAGS]}
              active={style}
              onToggle={(t) => setStyle((a) => toggle(a, t as StyleTag))}
            />
            <Group
              label="Page has"
              tags={[...CAPABILITY_TAGS]}
              active={caps}
              onToggle={(t) => setCaps((a) => toggle(a, t as CapabilityTag))}
            />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground/70">
                Shown with
                <select
                  value={biz ?? ""}
                  onChange={(e) => setBiz(e.target.value || null)}
                  className="min-h-11 max-w-full rounded-full border border-foreground/20 bg-background px-4 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                  aria-describedby="biz-note"
                >
                  <option value="">Any business</option>
                  {industries.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </label>
              {filtering ? (
                <button
                  type="button"
                  onClick={() => {
                    setStyle([]);
                    setCaps([]);
                    setBiz(null);
                  }}
                  className="min-h-11 text-sm font-medium underline underline-offset-4"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/60">
          <p id="biz-note" className="sr-only">Every design works for any business.</p>
          <p aria-live="polite" data-testid="gallery-count">
            {shown.length} of {items.length} designs
          </p>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-20 text-lg text-foreground/70">
          No matching designs. Try another search or remove a filter.
        </p>
      ) : (
        <ul
          className="design-gallery mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-14 md:grid-cols-2"
          data-testid="gallery-list"
          data-view={view}
        >
          {shown.map((d, n) => (
            <li key={d.slug} data-testid="design-card">
              <Link
                href={`/inspiration/${d.slug}`}
                aria-label={`${d.industryLabel}: ${d.name}, open this design`}
                className="design-stage group relative flex items-center justify-center overflow-hidden rounded-none outline-none focus-visible:ring-3 focus-visible:ring-black/70 focus-visible:ring-offset-4"
                data-tone={d.style.includes("Dark") ? "dark" : "light"}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-4 z-10 text-[11px] font-medium uppercase tracking-[.12em] text-foreground/65"
                >
                  {d.industryLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-3 z-10 grid size-9 place-items-center rounded-full bg-foreground/10 text-foreground transition-transform group-hover:rotate-45 motion-reduce:transition-none"
                >
                  <ArrowUpRight className="size-4" />
                </span>
                <div className="design-surface transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none">
                  {view === "desktop" ? (
                    <Shot
                      id={`ex-${d.assetSlug}-desk` as never}
                      alt={`${d.name}'s page on a desktop screen`}
                      width={720}
                      frame="none"
                      priority={n < 2}
                      className="w-full"
                    />
                  ) : (
                    <Shot
                      id={`ex-${d.assetSlug}-phone` as never}
                      alt={`${d.name}'s page on a phone`}
                      width={390}
                      cropTo={650}
                      fluid
                      frame="none"
                      priority={n < 2}
                      className="mx-auto"
                    />
                  )}
                </div>
              </Link>
              <div className="mt-5">
                <p className="text-xs font-medium text-foreground/60">
                  {d.header} · {d.lookName}
                </p>
                <h2 className="mt-1 font-display font-display-tight text-2xl sm:text-3xl">
                  <Link
                    href={`/inspiration/${d.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {d.name}
                  </Link>
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/65">
                  {d.hook}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Link
                    href={`/appearance/frame?scenario=${d.scenario}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-semibold underline underline-offset-4 focus-visible:ring-2"
                  >
                    Open demo
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span className="sr-only">
                      {" "}
                      for {d.name}, opens a new tab
                    </span>
                  </Link>
                  <UseDesign
                    slug={d.slug}
                    lookId={d.lookId}
                    lookName={d.lookName}
                    overrides={d.overrides}
                    size="sm"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Group({
  label,
  tags,
  active,
  onToggle,
}: {
  label: string;
  tags: string[];
  active: string[];
  onToggle: (t: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">{label}</legend>
      <span
        className="mr-1 text-sm font-medium text-foreground/70"
        aria-hidden="true"
      >
        {label}
      </span>
      {tags.map((t) => (
        <Chip key={t} on={active.includes(t)} onClick={() => onToggle(t)}>
          {t}
        </Chip>
      ))}
    </fieldset>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60",
        on
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/20 hover:border-foreground/50",
      )}
    >
      {children}
    </button>
  );
}
