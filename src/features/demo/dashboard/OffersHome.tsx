"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  ArrowUpRight,
  Package,
  Scissors,
  ChevronDown,
} from "lucide-react";
import { useDraft } from "../hooks";
import { normProduct, normService } from "../actions";
import { workspaceModel } from "./workspace-model";
import {
  formatDuration,
  formatMoney,
  formatPrice,
} from "@/features/services/format";
import { PageHeader } from "./Panel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Filter = "all" | "services" | "products";
export function OffersHome() {
  const { c, ent } = useDraft();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [archived, setArchived] = React.useState(false);
  if (!c || !ent) return null;
  const terms = workspaceModel(
    c.identity.industryKey,
    c.identity.industryLabel,
  ).terms;
  const services = (c.services ?? [])
    .map(normService)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const products = (c.products ?? []).map(normProduct);
  const activeServices = services.filter((item) => !item.archived);
  const serviceRows = services.map((item) => ({
    id: item.id,
    name: item.name || "Untitled service",
    kind: "services" as const,
    type: terms.services,
    price: formatPrice(item),
    detail: formatDuration(item.durationMinutes) || "Enquiry",
    status: item.archived
      ? "Archived"
      : item.example
        ? "Example"
        : ent.maxServices !== null &&
            activeServices.findIndex((s) => s.id === item.id) >= ent.maxServices
          ? "Hidden on your plan"
          : "Saved",
    archived: item.archived,
    image: undefined as string | undefined,
  }));
  const productRows = products.map((item) => ({
    id: item.id,
    name: item.name || "Untitled item",
    kind: "products" as const,
    type: item.kind === "vehicle" ? "Vehicle" : "Product",
    price:
      item.priceMinor === undefined
        ? "Price on enquiry"
        : formatMoney(item.priceMinor, item.currency),
    detail: item.collection || "Item",
    status: item.archived
      ? "Archived"
      : item.example
        ? "Example"
        : item.availability === "available"
          ? "Saved"
          : item.availability === "unavailable"
            ? "Unavailable"
            : item.availability === "reserved"
              ? "Reserved"
              : "Sold",
    archived: item.archived,
    image: item.image?.src ?? item.images[0]?.src,
  }));
  const all = ["maker", "car-dealer"].includes(c.identity.industryKey ?? "")
    ? [...productRows, ...serviceRows]
    : [...serviceRows, ...productRows];
  const visible = all.filter(
    (item) =>
      (archived ? item.archived : !item.archived) &&
      (filter === "all" || item.kind === filter) &&
      `${item.name} ${item.type} ${item.detail}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="ts-offers-page">
      <PageHeader
        scene="services"
        title="What you offer"
        description="The things you do. The things you sell. All in one place."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus />
                Add offer
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/services?new=1">
                  <Scissors />
                  Add a service
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/products?new=1">
                  <Package />
                  {c.identity.industryKey === "car-dealer"
                    ? "Add a vehicle"
                    : "Add a product"}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <div className="ts-offer-navigation">
        <div className="ts-filter-tabs" role="group" aria-label="Offer type">
          {(
            [
              ["all", "All offers"],
              ["services", terms.services],
              ["products", terms.products],
            ] as [Filter, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
            >
              {label}
              <span>
                {
                  all.filter(
                    (item) =>
                      !item.archived && (id === "all" || item.kind === id),
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
        <label className="ts-archive-toggle">
          <input
            type="checkbox"
            checked={archived}
            onChange={(event) => setArchived(event.target.checked)}
          />
          Show archived
        </label>
      </div>
      <div className="ts-list-toolbar">
        <label className="ts-input-search">
          <Search aria-hidden="true" />
          <input
            type="search"
            aria-label="Search what you offer"
            placeholder="Find a service or product"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <p aria-live="polite">
          {visible.length} {visible.length === 1 ? "offer" : "offers"}
        </p>
      </div>
      <div className="ts-offer-list">
        <div className="ts-offer-list-head" aria-hidden="true">
          <span>Offer</span>
          <span>Price</span>
          <span>Status</span>
          <span />
        </div>
        {visible.length ? (
          <ul>
            {visible.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <Link
                  href={`/dashboard/${item.kind}?edit=${encodeURIComponent(item.id)}`}
                >
                  <span className="ts-offer-record">
                    <span className="ts-offer-image">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          width={48}
                          height={48}
                          unoptimized
                        />
                      ) : item.kind === "services" ? (
                        <Scissors aria-hidden="true" />
                      ) : (
                        <Package aria-hidden="true" />
                      )}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>
                        {item.type} · {item.detail}
                      </small>
                    </span>
                  </span>
                  <span className="ts-offer-price">{item.price}</span>
                  <span className="ts-status" data-status={item.status}>
                    {item.status}
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ts-empty-state">
            <Package aria-hidden="true" />
            <h2>
              {query
                ? "No matches this time."
                : archived
                  ? "Nothing archived."
                  : "Make your first offer."}
            </h2>
            <p>
              {query
                ? `Nothing matches “${query}”. Try another name.`
                : archived
                  ? "Offers you archive stay here, ready to bring back."
                  : "Start with one service or product. Give it a name, set a price, and make it yours."}
            </p>
            {!query && !archived ? (
              <Link
                href={
                  filter === "products"
                    ? "/dashboard/products?new=1"
                    : "/dashboard/services?new=1"
                }
              >
                Add your first offer
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        )}
      </div>
      <div className="ts-offer-bottom">
        <p>
          Your offers and page stay connected. Editing an offer updates its
          details wherever it’s used.
        </p>
        <Link href="/dashboard/page?task=content">
          Arrange on your page
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
