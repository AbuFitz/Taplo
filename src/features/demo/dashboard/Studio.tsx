"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProductContent } from "@/features/businesses/content";
import { formatMoney } from "@/features/services/format";
import { StudioIcons as Icon } from "@/features/platform/icons";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import { nowMs } from "@/features/booking/clock";
import { TAPLO_DOMAINS } from "@/lib/domains";
import { hasUnpublishedChanges, readiness, normProduct } from "../actions";
import { useDraft } from "../hooks";
import { resolveStyle } from "@/features/page/themes/resolve";
import { FirstOfferSetup } from "./FirstOfferSetup";
import { QuickBusinessEditor, type BusinessEdit } from "./QuickBusinessEditor";
import { todayWork, pageTasks } from "./today-model";
import { workspaceModel } from "./workspace-model";

export function Studio() {
  const { state: s } = useDraft();
  const owner = useOwner();
  const [now, setNow] = React.useState(nowMs);
  const [editing, setEditing] = React.useState<BusinessEdit | null>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const [notice, setNotice] = React.useState("");
  const [snapshotOpen, setSnapshotOpen] = React.useState(false);
  React.useEffect(() => {
    const refresh = () => setNow(nowMs());
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  if (!s) return <StudioSkeleton />;
  const model = workspaceModel(
    s.content.identity.industryKey,
    s.content.identity.industryLabel,
  );
  const facts = pageTasks(s);
  const work = todayWork(
    owner.state.bookings,
    now,
    owner.ctx?.timezone ?? s.content.location.timezone ?? "Europe/London",
  );
  const enquiries = owner.state.enquiries.filter(
    (e) => e.status === "new",
  ).length;
  const missing = readiness(s).filter((check) => check.required && !check.done);
  const changed = hasUnpublishedChanges(s);
  const publicStatus = s.published
    ? changed
      ? "Unpublished changes"
      : "Published"
    : "Draft";
  const productsFirst = model.mobileWork === "products";
  const actualProducts = (s.content.products ?? [])
    .map(normProduct)
    .filter((p) => !p.archived && !p.example);
  const openEditor = (
    mode: BusinessEdit,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    opener.current = event.currentTarget;
    setEditing(mode);
  };
  const time = (at: number, includeDate = false) =>
    work.timezone
      ? new Intl.DateTimeFormat("en-GB", {
          timeZone: work.timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          ...(includeDate
            ? ({ weekday: "short", day: "numeric", month: "short" } as const)
            : {}),
        }).format(at)
      : "Check time zone";
  const next = work.today.length ? work.today : work.upcoming.slice(0, 3);

  const palette = resolveStyle(s.page.themeId, s.page.appearance).spec.colors;
  const snapshotStyle = Object.fromEntries(
    Object.entries(palette).map(([key, value]) => [`--snapshot-${key}`, value]),
  ) as React.CSSProperties;
  const quickView = (
    <section className="ts-quick-details">
      <div className="ts-section-heading">
        <h2>Quick changes</h2>
        <span>Right here.</span>
      </div>
      <button onClick={(event) => openEditor("contact", event)}>
        <Icon.external />
        <span>
          <strong>Contact details</strong>
          <small>
            {facts.contact
              ? "Keep your details up to date"
              : "Add a way to reach you"}
          </small>
        </span>
        <Icon.next />
      </button>
      <button onClick={(event) => openEditor("hours", event)}>
        <Icon.clock />
        <span>
          <strong>Opening hours</strong>
          <small>
            {facts.hasHours
              ? "Review your public opening times"
              : "Let people know when you’re open"}
          </small>
        </span>
        <Icon.next />
      </button>
      {!productsFirst || facts.services > 0 ? (
        <Link href="/dashboard/bookings?section=availability">
          <Icon.bookings />
          <span>
            <strong>Booking availability</strong>
            <small>Working time, breaks and days off</small>
          </span>
          <Icon.next />
        </Link>
      ) : null}
    </section>
  );
  const setupView = (
    <aside
      className="ts-home-side studio-today-secondary"
      aria-label="Your business page and setup"
    >
      <section
        className="ts-page-preview-card"
        data-snapshot-open={snapshotOpen}
      >
        <div className="ts-section-heading">
          <h2>Your page</h2>
          <span className="ts-status" data-status={publicStatus}>
            {publicStatus}
          </span>
        </div>
        <h3 className="ts-page-card-name">{s.content.identity.name}</h3>
        <div
          id="studio-page-snapshot"
          className="ts-mini-page"
          style={snapshotStyle}
        >
          <div className="ts-mini-page-content">
            {s.content.identity.logo ? (
              <Image
                src={s.content.identity.logo.src}
                alt=""
                width={56}
                height={40}
                unoptimized
              />
            ) : null}
            <strong>{s.content.identity.name}</strong>
            <span>
              {s.content.identity.tagline || "Your business, ready to share."}
            </span>
            <i>
              Discover what we do <Icon.next />
            </i>
            {(s.content.services ?? [])
              .filter((item) => !item.archived)
              .slice(0, 2)
              .map((item) => (
                <div key={item.id}>
                  {item.name}
                  <Icon.next />
                </div>
              ))}
          </div>
        </div>
        <p className="ts-page-url">
          {TAPLO_DOMAINS.host}/{s.content.identity.slug}
        </p>
        <div className="ts-page-card-actions">
          <Link href="/dashboard/page">
            {s.published && !changed ? "Edit your page" : "Review your page"}
            <Icon.next />
          </Link>
          <Link
            href="/demo/preview"
            target="_blank"
            aria-label="Preview your page"
          >
            <Icon.external />
          </Link>
        </div>
        <button
          type="button"
          className="ts-preview-toggle"
          aria-expanded={snapshotOpen}
          aria-controls="studio-page-snapshot"
          onClick={() => setSnapshotOpen((value) => !value)}
        >
          {snapshotOpen ? "Hide design" : "Show design"}
          <Icon.next />
        </button>
        {missing.length ? (
          <p className="ts-page-readiness">
            {missing[0]?.id === "contact"
              ? "Add a contact method before sharing your page."
              : missing[0]?.label}
          </p>
        ) : null}
      </section>

      <Link className="ts-home-help" href="/dashboard/help">
        <Icon.help />
        <span>
          Something on your mind?
          <strong>We’ll help you find the answer.</strong>
        </span>
        <Icon.next />
      </Link>
    </aside>
  );
  const workView = (
    <>
      {productsFirst && work.timezone && !work.upcoming.length ? (
        actualProducts.length ? (
          <CatalogueWork
            products={actualProducts}
            vehicles={s.content.identity.industryKey === "car-dealer"}
          />
        ) : null
      ) : (
        <section
          className="studio-work"
          aria-labelledby="studio-work-heading"
          data-testid="upcoming-bookings"
        >
          <div className="studio-section-heading">
            <h2 id="studio-work-heading">
              {work.today.length
                ? "On the day"
                : work.upcoming.length
                  ? "Coming up"
                  : "Your time"}
            </h2>
            <Link href="/dashboard/bookings">
              Open calendar
              <Icon.external />
            </Link>
          </div>
          {!work.timezone ? (
            <div className="studio-quiet-state">
              <Icon.clock />
              <h3>Check your business time zone</h3>
              <p>
                Choose a valid time zone before reviewing appointment times.
              </p>
              <Link href="/dashboard/profile">
                Review business details
                <Icon.next />
              </Link>
            </div>
          ) : next.length ? (
            <ul className="studio-agenda">
              {next.slice(0, 5).map((booking) => (
                <li key={booking.id}>
                  <Link
                    href={`/dashboard/bookings?booking=${encodeURIComponent(booking.id)}`}
                  >
                    <time dateTime={new Date(booking.startsAt).toISOString()}>
                      {time(booking.startsAt, !work.today.length)}
                    </time>
                    <div>
                      <strong>{booking.serviceName}</strong>
                      <span>{booking.customer.name}</span>
                    </div>
                    <span
                      className="studio-work-status"
                      data-pending={booking.status === "pending"}
                    >
                      {booking.status === "pending"
                        ? "Needs a reply"
                        : "Confirmed"}
                    </span>
                    <Icon.next />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="studio-quiet-state">
              <Icon.bookings />
              <h3>
                {productsFirst
                  ? "Make room for the work you do."
                  : "Your diary is clear."}
              </h3>
              <p>
                {productsFirst
                  ? "Add appointments when they’re part of your business. Your products have their own home."
                  : "Your upcoming appointments will appear here. Choose your working times when you’re ready."}
              </p>
              <Link href="/dashboard/bookings?section=availability">
                Manage booking availability
                <Icon.next />
              </Link>
            </div>
          )}
          {work.today.length && work.upcoming.length > work.today.length ? (
            <p className="studio-work-following">
              {work.upcoming.length - work.today.length} more upcoming ·{" "}
              <Link href="/dashboard/bookings">See your calendar</Link>
            </p>
          ) : null}
        </section>
      )}
    </>
  );

  return (
    <div className="studio-today" data-testid="studio">
      <header className="ts-home-heading">
        <div>
          <p className="ts-overline">{work.dateLabel}</p>
          <h1>Today, in one place.</h1>
          <p>Your work, your page, your next move.</p>
        </div>
      </header>
      {work.today.length || work.awaiting.length || enquiries ? (
        <div className="ts-home-pulse" aria-label="Business at a glance">
          <Link href="/dashboard/bookings">
            <span>On the day</span>
            <strong>
              {work.today.length}
              <small>
                {work.today.length === 1 ? "appointment" : "appointments"}
              </small>
            </strong>
            <Icon.next />
          </Link>
          <Link href="/dashboard/bookings?section=enquiries">
            <span>Needs your reply</span>
            <strong>
              {work.awaiting.length + enquiries}
              <small>
                {work.awaiting.length + enquiries === 1
                  ? "request"
                  : "requests"}
              </small>
            </strong>
            <Icon.next />
          </Link>
          <Link href="/dashboard/offers">
            <span>What you offer</span>
            <strong>
              {facts.services + actualProducts.length}
              <small>services & items</small>
            </strong>
            <Icon.next />
          </Link>
        </div>
      ) : (
        <div className="ts-home-status-line">
          <span>Nothing waiting for a reply.</span>
          <Link href="/dashboard/offers">
            {facts.services + actualProducts.length} offers
            <Icon.next />
          </Link>
        </div>
      )}

      {work.awaiting.length || enquiries ? (
        <section className="studio-attention" aria-labelledby="attention-title">
          <div>
            <span className="studio-attention-dot" />
            <h2 id="attention-title">A reply is needed</h2>
          </div>
          <ul>
            {work.awaiting.length ? (
              <li>
                <Link href="/dashboard/bookings">
                  {work.awaiting.length} booking{" "}
                  {work.awaiting.length === 1 ? "request" : "requests"}
                  <Icon.next />
                </Link>
              </li>
            ) : null}
            {enquiries ? (
              <li>
                <Link href="/dashboard/bookings?section=enquiries">
                  {enquiries} new {enquiries === 1 ? "enquiry" : "enquiries"}
                  <Icon.next />
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      <div className="ts-home-grid studio-today-columns">
        <div className="ts-home-first-offer studio-today-start">
          <FirstOfferSetup />
        </div>

        {workView}
        {quickView}
        {setupView}
      </div>
      <p className="studio-save-notice" role="status">
        {notice}
      </p>
      {editing ? (
        <QuickBusinessEditor
          mode={editing}
          initial={s}
          restoreFocus={() => {
            if (!opener.current?.isConnected) return false;
            opener.current.focus();
            return true;
          }}
          onClose={() => setEditing(null)}
          onSaved={(mode) =>
            setNotice(
              mode === "contact"
                ? "Contact details updated."
                : "Opening hours updated.",
            )
          }
        />
      ) : null}
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <div
      className="studio-today-loading"
      aria-label="Loading Studio"
      aria-busy="true"
      data-testid="studio-loading"
    >
      <span />
      <span />
      <span />
    </div>
  );
}

/** The primary work surface follows the business's actual work, without inventing orders or stock quantities. */
function CatalogueWork({
  products,
  vehicles,
}: {
  products: ProductContent[];
  vehicles: boolean;
}) {
  const vehicleCount = products.filter(
    (product) => product.kind === "vehicle",
  ).length;
  const productCount = products.length - vehicleCount;
  const countLabel = [
    vehicleCount
      ? `${vehicleCount} ${vehicleCount === 1 ? "vehicle" : "vehicles"}`
      : "",
    productCount
      ? `${productCount} ${productCount === 1 ? "product" : "products"}`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const labels = {
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    unavailable: "Not available",
  };
  return (
    <section
      className="studio-work"
      aria-labelledby="catalogue-work-heading"
      data-testid="catalogue-work"
    >
      <div className="studio-section-heading">
        <h2 id="catalogue-work-heading">
          {vehicles
            ? productCount
              ? "Your stock"
              : "Your vehicle stock"
            : "Your products"}
        </h2>
        <Link href="/dashboard/products">
          {vehicles ? "Manage stock" : "Open catalogue"}
          <Icon.external />
        </Link>
      </div>
      <ul className="studio-product-summary">
        {products.slice(0, 3).map((product) => (
          <li key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <span>{labels[product.availability ?? "available"]}</span>
            </div>
            <span>
              {product.priceMinor !== undefined
                ? formatMoney(product.priceMinor, product.currency ?? "GBP")
                : "Price on enquiry"}
            </span>
          </li>
        ))}
      </ul>
      <p className="studio-section-note">{countLabel} in your catalogue</p>
      <Link className="studio-inline-link" href="/dashboard/products?new=1">
        {vehicles ? "Add a vehicle" : "Add a product"}
        <Icon.next />
      </Link>
    </section>
  );
}
