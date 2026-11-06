"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Package, Plus, Search, Scissors } from "lucide-react";
import { useDraft } from "../hooks";
import { normProduct, normService } from "../actions";
import { workspaceModel } from "./workspace-model";
import { formatDuration, formatMoney, formatPrice } from "@/features/services/format";
import { PageHeader } from "./Panel";

/** One inventory of the real offer records; the type-specific editors own validation and saving. */
export function OffersHome() {
  const { c, ent } = useDraft();
  const [query, setQuery] = React.useState("");
  if (!c || !ent) return null;

  const terms = workspaceModel(c.identity.industryKey, c.identity.industryLabel).terms;
  const productFirst = ["maker", "car-dealer"].includes(c.identity.industryKey ?? "");
  const services = (c.services ?? []).map(normService).sort((a, b) => a.sortOrder - b.sortOrder);
  const products = (c.products ?? []).map(normProduct);
  const find = query.trim().toLocaleLowerCase();
  const sections = [
    {
      key: "services",
      title: terms.services,
      description: "Prices, durations and how people request a time.",
      href: "/dashboard/services",
      Icon: Scissors,
      items: services.map((s) => ({
        id: s.id,
        name: s.name || "Untitled service",
        detail: [formatPrice(s), formatDuration(s.durationMinutes), s.group].filter(Boolean).join(" · "),
        status: s.archived ? "Archived" : ent.maxServices !== null && services.filter((item) => !item.archived).findIndex((item) => item.id === s.id) >= ent.maxServices ? "Hidden on your plan" : s.example ? "Example" : "Saved",
        archived: s.archived,
      })),
      add: "Add a service",
    },
    {
      key: "products",
      title: terms.products,
      description: "Items, stock details and ways to enquire or follow a link.",
      href: "/dashboard/products",
      Icon: Package,
      items: products.map((p) => ({
        id: p.id,
        name: p.name || "Untitled item",
        detail: [p.priceMinor === undefined ? "No price shown" : formatMoney(p.priceMinor, p.currency), p.collection].filter(Boolean).join(" · "),
        status: p.archived ? "Archived" : p.example ? "Example" : p.availability === "available" ? "Saved" : p.availability === "unavailable" ? "Unavailable" : p.availability === "reserved" ? "Reserved" : "Sold",
        archived: p.archived,
      })),
      add: c.identity.industryKey === "car-dealer" ? "Add a vehicle" : "Add a product",
    },
  ];
  if (productFirst) sections.reverse();
  const matches = sections.reduce((count, section) => count + section.items.filter((item) => `${item.name} ${item.detail}`.toLocaleLowerCase().includes(find)).length, 0);

  return (
    <div className="ws-offers-home">
      <PageHeader title="What you offer" description="A clear view of your services and items. Add something here, then decide how it appears on your page." />
      <div className="ws-offers-actions" aria-label="Add an offering">
        {sections.map(({ key, href, description, Icon, add }) => (
          <Link key={key} href={`${href}?new=1`} className="ws-offers-action">
            <span className="ws-offers-action-icon"><Icon aria-hidden="true" /></span>
            <span><strong>{add}</strong><small>{description}</small></span>
            <Plus aria-hidden="true" className="ws-offers-action-plus" />
          </Link>
        ))}
      </div>
      <div className="ws-offers-search">
        <label><Search aria-hidden="true" /><span className="sr-only">Search what you offer</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a service or item" type="search" /></label>
        <span aria-live="polite">{find ? `${matches} matching` : `${services.length + products.length} total`}</span>
      </div>
      {matches === 0 && find ? <p className="ws-offers-no-results">Nothing matches “{query}”. Try another name or detail.</p> : null}
      {sections.map(({ key, href, title, items }) => {
        const visible = items.filter((item) => `${item.name} ${item.detail}`.toLocaleLowerCase().includes(find));
        if (find && !visible.length) return null;
        return (
          <section key={key} className="ws-offers-section" aria-labelledby={`offers-${key}`}>
            <header><div><h2 id={`offers-${key}`}>{title}</h2><p>{items.length ? `${items.filter((item) => !item.archived).length} current · ${items.filter((item) => item.archived).length} archived` : "Nothing added yet"}</p></div><Link href={href}>Manage {title.toLocaleLowerCase()} <ArrowRight aria-hidden="true" /></Link></header>
            {visible.length ? <ul>{visible.map((item) => <li key={item.id}><Link href={`${href}?edit=${encodeURIComponent(item.id)}`}><span className="ws-offers-record-copy"><strong>{item.name}</strong><small>{item.detail}</small></span><span className="ws-offers-record-status" data-status={item.status}>{item.status}</span><ArrowRight aria-hidden="true" /></Link></li>)}</ul> : <div className="ws-offers-empty"><p>{key === "services" ? "Start with a service people can ask for or book." : "Add an item to show what you sell or have in stock."}</p><Link href={`${href}?new=1`}>{key === "services" ? "Add a service" : c.identity.industryKey === "car-dealer" ? "Add a vehicle" : "Add a product"} <ArrowRight aria-hidden="true" /></Link></div>}
          </section>
        );
      })}
    </div>
  );
}
