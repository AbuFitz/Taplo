"use client";
import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  CalendarDays,
  Check,
  Layers3,
  Package,
  Users,
} from "lucide-react";
import { SharePanel } from "@/features/page/widgets/ShareClient";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import {
  canPublish,
  hasUnpublishedChanges,
  publish,
  readiness,
} from "../actions";
import { useDraft } from "../hooks";
import { ContextHelp } from "@/features/page/editor/ContextHelp";
import { StudioArt } from "./art/StudioArt";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { UpcomingBookings } from "./UpcomingBookings";

export function Studio() {
  const { state: s, patch } = useDraft();
  const { state: bk } = useOwner();
  const [now] = React.useState(() => Date.now());
  const [notice, setNotice] = React.useState("");
  if (!s) return <StudioSkeleton />;
  const missing = readiness(s).filter((c) => c.required && !c.done);
  const ready = canPublish(s);
  const changed = hasUnpublishedChanges(s);
  const pending = bk.bookings.filter(
    (b) =>
      b.status === "pending" &&
      b.endsAt > now &&
      (!b.expiresAt || b.expiresAt > now),
  ).length;
  const enquiries = bk.enquiries.filter((e) => e.status === "new").length;
  const counts = {
    services: (s.content.services ?? []).filter((v) => !v.archived).length,
    products: (s.content.products ?? []).filter((v) => !v.archived).length,
    team: (s.content.staff ?? []).length,
  };
  return (
    <div className="ws-overview" data-testid="studio">
      <div className="ws-welcome">
        <div>
          <h1>Welcome back.</h1>
          <p>Your page and your business, in one place.</p>
        </div>
      </div>
      <section
        className="ws-page-hub ws-page-hub-colour"
        aria-label="Your page"
      >
        <StudioArt scene="design" className="ws-hub-art" />
        <div className="ws-page-hub-info">
          <span className="ws-status">
            {s.published ? "Published" : "Draft"}
          </span>
          <h2>{s.content.identity.name}</h2>
          <p className="ws-handle">mytaplo.com/{s.content.identity.slug}</p>

          <div className="ws-page-actions">
            <Link className="ws-action" href="/dashboard/page">
              Edit your page
              <ArrowRight />
            </Link>
            {s.published ? (
              <SharePanel
                tone="admin"
                data={{
                  name: s.published.content.identity.name,
                  slug: s.published.content.identity.slug,
                  logo: s.published.content.identity.logo?.src,
                  url: `${window.location.origin}/demo/p/${s.published.content.identity.slug}`,
                }}
                trigger={
                  <button type="button" className="ws-text-link">
                    Share & QR
                    <ArrowUpRight />
                  </button>
                }
              />
            ) : null}
          </div>
          <details className="ws-next-step" data-testid="studio-next">
            <summary>
              {missing.length
                ? `${missing.length} ${missing.length === 1 ? "step" : "steps"} before publishing`
                : changed && s.published
                  ? "Changes ready to publish"
                  : s.published
                    ? "Your page is up to date"
                    : "Ready to publish"}
              <ChevronRight />
            </summary>
            <span>
              {missing.length
                ? "Next up"
                : changed && s.published
                  ? "Ready to update"
                  : "Page status"}
            </span>
            <h3>
              {missing[0]?.label ||
                (s.published
                  ? changed
                    ? "You have unpublished changes"
                    : "Your page is up to date"
                  : "Ready for a final check")}
            </h3>
            {missing[0] ? (
              <Link href={missing[0].href}>
                Finish this step
                <ArrowRight />
              </Link>
            ) : ready && (!s.published || changed) ? (
              <button
                type="button"
                onClick={() => {
                  patch(publish);
                  setNotice(
                    "This version is published in this browser. Public publishing is not connected yet.",
                  );
                }}
              >
                Publish this version
                <ArrowRight />
              </button>
            ) : (
              <span>
                <Check />
                Saved
              </span>
            )}
          </details>
          <p role="status" className="ws-inline-notice">
            {notice}
          </p>
        </div>
      </section>
      <div className="ws-experience-guides" aria-label="Studio guides">
        <span>Make more of your page</span>
        <ContextHelp topic="blocks" />
        <ContextHelp topic="design" />
        <ContextHelp topic="booking" />
      </div>
      <div className="ws-home-columns">
        <section className="ws-business-work">
          <div className="ws-section-title">
            <h2>Manage your business</h2>
          </div>
          <div className="ws-management-links">
            {[
              {
                href: "services",
                Icon: Layers3,
                label: getIndustryPreset(s.content.identity.industryKey)
                  .terminology.services,
                line: "Prices, durations and what you offer",
                n: counts.services,
              },
              {
                href: "products",
                Icon: Package,
                label:
                  s.content.identity.industryKey === "car-dealer"
                    ? "Vehicle stock"
                    : "Products",
                line: "Items, recommendations and listings",
                n: counts.products,
              },
              {
                href: "team",
                Icon: Users,
                label: "Team",
                line: "People, profiles and bookable services",
                n: counts.team,
              },
            ].map(({ href, Icon, label, line, n }) => (
              <Link href={`/dashboard/${href}`} key={href}>
                <span className="ws-line-icon" data-area={href}>
                  <Icon />
                </span>
                <span>
                  <strong>{label}</strong>
                  <small>{line}</small>
                </span>
                <b>{n}</b>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="ws-day">
          <div className="ws-section-title">
            <h2>Bookings & enquiries</h2>
            <Link href="/dashboard/bookings">
              Open
              <ArrowUpRight />
            </Link>
          </div>
          <div className="ws-inbox-summary">
            <CalendarDays />
            <div>
              <strong>
                {pending + enquiries
                  ? `${pending + enquiries} waiting for you`
                  : "You’re all caught up"}
              </strong>
              <p>
                {pending} booking requests · {enquiries} new enquiries
              </p>
            </div>
          </div>
          <UpcomingBookings />
          <Link
            href="/dashboard/bookings?section=availability"
            className="ws-text-link"
          >
            Manage your availability
            <ArrowRight />
          </Link>
        </section>
      </div>
      <details className="ws-checklist" data-testid="studio-checklist">
        <summary>
          Finish setting up your business
          <ArrowRight />
        </summary>
        <ul>
          {readiness(s)
            .filter((c) => c.id !== "published")
            .map((c) => (
              <li key={c.id}>
                <Link href={c.href}>
                  <span data-done={c.done}>{c.done ? <Check /> : null}</span>
                  {c.label}
                  <small>
                    {c.done ? "Done" : c.required ? "Required" : "Optional"}
                  </small>
                </Link>
              </li>
            ))}
        </ul>
      </details>
    </div>
  );
}
export function StudioSkeleton() {
  return (
    <div className="ws-loading" aria-busy="true" data-testid="studio-loading">
      <span />
      <span />
      <span />
    </div>
  );
}
