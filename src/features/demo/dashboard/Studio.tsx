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
import { FirstOfferSetup } from "./FirstOfferSetup";
import { QuickBusinessEditor, type BusinessEdit } from "./QuickBusinessEditor";
import { todayWork, pageTasks } from "./today-model";
import { workspaceModel } from "./workspace-model";
import "./studio-today.css";

export function Studio() {
  const { state: s } = useDraft();
  const owner = useOwner();
  const [now, setNow] = React.useState(nowMs);
  const [editing, setEditing] = React.useState<BusinessEdit | null>(null);
  const opener = React.useRef<HTMLElement | null>(null);
  const [notice, setNotice] = React.useState("");
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
  const catalogue = [
    {
      key: "services",
      label: model.terms.services,
      detail: "Prices, durations and service details",
      count: facts.services,
      Glyph: Icon.services,
    },
    {
      key: "products",
      label: model.terms.products,
      detail: "Items, photos and availability",
      count: facts.products,
      Glyph: Icon.products,
    },
    {
      key: "team",
      label: "Team",
      detail: "People and public profiles",
      count: facts.team,
      Glyph: Icon.team,
    },
  ].sort((a, b) =>
    productsFirst
      ? Number(b.key === "products") - Number(a.key === "products")
      : 0,
  );
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

  return (
    <div className="studio-today" data-testid="studio">
      <header className="studio-today-heading">
        <div>
          <p className="studio-eyebrow">{work.dateLabel}</p>
          <h1>Today</h1>
          <p>
            {productsFirst
              ? "Your business, ready for what’s next."
              : "A little clarity for the day ahead."}
          </p>
        </div>
        <Link
          className="studio-button studio-button-secondary"
          href="/demo/preview"
          target="_blank"
        >
          View page
          <Icon.external />
        </Link>
      </header>

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

      <div className="studio-today-columns">
        <div className="studio-today-start">
          <FirstOfferSetup />
        </div>
        <aside
          className="studio-today-secondary"
          aria-label="Your business page and setup"
        >
          <section
            className="studio-setup"
            aria-labelledby="studio-setup-heading"
          >
            <div className="studio-section-heading">
              <h2 id="studio-setup-heading">The useful details</h2>
            </div>
            <p className="studio-section-note">
              Quick changes here. Full control whenever you need it.
            </p>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={(event) => openEditor("contact", event)}
                >
                  <span
                    className="studio-task-indicator"
                    data-done={facts.contact}
                  >
                    {facts.contact ? <Icon.check /> : <span />}
                  </span>
                  <span>
                    <strong>Contact details</strong>
                    <small>
                      {facts.contact
                        ? "Review how customers reach you"
                        : "Add a way to get in touch"}
                    </small>
                  </span>
                  <Icon.next />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(event) => openEditor("hours", event)}
                >
                  <span
                    className="studio-task-indicator"
                    data-done={facts.hasHours}
                  >
                    {facts.hasHours ? <Icon.check /> : <span />}
                  </span>
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
              </li>
              <li>
                <Link href="/dashboard/bookings?section=availability">
                  <span className="studio-task-indicator">
                    <Icon.clock />
                  </span>
                  <span>
                    <strong>Booking availability</strong>
                    <small>Working times, breaks and booking rules</small>
                  </span>
                  <Icon.next />
                </Link>
              </li>
            </ul>
          </section>
          <section
            className="studio-page-status"
            aria-labelledby="your-page-heading"
          >
            <div className="studio-section-heading">
              <h2 id="your-page-heading">Your page</h2>
              <span className="studio-page-state">
                <i />
                {publicStatus}
              </span>
            </div>
            <div className="studio-business-identity">
              {s.content.identity.logo ? (
                <Image
                  src={s.content.identity.logo.src}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                />
              ) : null}
              <h3>{s.content.identity.name}</h3>
            </div>
            <p className="studio-page-address">
              {TAPLO_DOMAINS.host}/{s.content.identity.slug}
            </p>
            <div className="studio-page-tools">
              <Link className="studio-button" href="/dashboard/page">
                Edit your page
                <Icon.page />
              </Link>
              <Link href="/demo/preview" target="_blank">
                Preview
                <Icon.external />
              </Link>
            </div>
            <p className="studio-page-note">
              {missing.length
                ? missing[0]?.id === "contact"
                  ? "Add a contact method before sharing your page."
                  : `${missing[0]?.label}.`
                : changed && s.published
                  ? "Review your latest changes before publishing them."
                  : s.published
                    ? "Your published version is ready to share."
                    : "Your draft is ready for a final look. You choose when to publish."}
            </p>
            <Link className="studio-inline-link" href="/dashboard/page">
              Review & publish
              <Icon.next />
            </Link>
          </section>
          <Link className="studio-help-link" href="/dashboard/help">
            <Icon.help />
            <span>
              Need a hand?<small>Find a guide or get in touch.</small>
            </span>
            <Icon.next />
          </Link>
        </aside>
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
                    : "Space for your next appointment."}
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
        <section
          className="studio-catalogue"
          aria-labelledby="studio-catalogue-heading"
        >
          <div className="studio-section-heading">
            <h2 id="studio-catalogue-heading">Your business</h2>
            <span>Keep the essentials in reach</span>
          </div>
          <ul>
            {catalogue.map(({ key, label, detail, count, Glyph }) => (
              <li key={key}>
                <Link href={`/dashboard/${key}`}>
                  <Glyph />
                  <span>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </span>
                  <b aria-label={`${count} ${label.toLowerCase()}`}>{count}</b>
                  <Icon.next />
                </Link>
              </li>
            ))}
          </ul>
        </section>
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
          {vehicles ? "Your vehicle stock" : "Your products"}
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
      <p className="studio-section-note">
        {products.length}{" "}
        {vehicles
          ? products.length === 1
            ? "vehicle"
            : "vehicles"
          : products.length === 1
            ? "product"
            : "products"}{" "}
        in your catalogue
      </p>
      <Link className="studio-inline-link" href="/dashboard/products?new=1">
        {vehicles ? "Add a vehicle" : "Add a product"}
        <Icon.next />
      </Link>
    </section>
  );
}
