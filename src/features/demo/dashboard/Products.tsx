"use client";

import * as React from "react";
import { useSetupIntent } from "@/features/experience/useSetupIntent";
import {
  Archive,
  ArchiveRestore,
  Pencil,
  Plus,
  Search,
  Car,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/taplo/overlay";
import { formatMoney } from "@/features/services/format";
import type { ProductContent } from "@/features/businesses/content";
import { newId, normProduct } from "../actions";
import {
  ProductForm,
  VEHICLE_FACTS,
  productErrors,
  AVAILABILITY_LABEL,
} from "../ProductForm";
import { useDraft } from "../hooks";
import { EmptyPanel } from "@/components/taplo/illustrations";
import { ProfileImage } from "@/features/page/renderer/ProfileImage";
import { PageHeader } from "./Panel";

export const blankProduct = (
  kind: ProductContent["kind"] = "product",
): ProductContent => ({
  id: newId("prod"),
  name: "",
  currency: "GBP",
  mode: "enquire",
  archived: false,
  facts:
    kind === "vehicle"
      ? VEHICLE_FACTS.map((label) => ({ label, value: "" }))
      : [],
  kind,
  availability: "available",
  images: [],
  affiliate: false,
});

/** Products are business records. Product widgets reference them; nothing is copied onto the page. */
export function Products() {
  const { c, setContent } = useDraft();
  const [editing, setEditing] = React.useState<{
    p: ProductContent;
    isNew: boolean;
  } | null>(null);
  const [query, setQuery] = React.useState("");
  const [before, setBefore] = React.useState("");
  const [showErr, setShowErr] = React.useState(false);
  useSetupIntent("new", () => { const p=blankProduct(c?.identity.industryKey === "car-dealer" ? "vehicle" : "product"); setBefore(JSON.stringify(p)); setShowErr(false); setEditing({p,isNew:true}); }, Boolean(c));
  if (!c) return null;
  const all = (c.products ?? []).map(normProduct);
  const active = all.filter((p) => !p.archived);
  const archived = all.filter((p) => p.archived);
  const commit = (list: ProductContent[]) =>
    setContent((x) => ({ ...x, products: list }));
  const open = (p: ProductContent, isNew: boolean) => {
    setBefore(JSON.stringify(p));
    setShowErr(false);
    setEditing({ p, isNew });
  };
  const save = () => {
    if (!editing) return;
    if (Object.keys(productErrors(editing.p)).length) return setShowErr(true);
    commit(
      editing.isNew
        ? [...all, editing.p]
        : all.map((x) => (x.id === editing.p.id ? editing.p : x)),
    );
    setEditing(null);
  };
  return (
    <>
      <PageHeader
        scene="products"
        title={
          c.identity.industryKey === "car-dealer" ? "Vehicle stock" : "Products"
        }
        description="Manage the items you sell, recommend or have in stock."
        actions={
          <Button
            onClick={() =>
              open(
                blankProduct(
                  c.identity.industryKey === "car-dealer"
                    ? "vehicle"
                    : "product",
                ),
                true,
              )
            }
          >
            <Plus /> Add item
          </Button>
        }
      />
      <div className="ws-record-toolbar">
        <label>
          <Search aria-hidden="true" />
          <input
            aria-label="Search products"
            placeholder="Find an item…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <span>{active.length} active</span>
      </div>
      <div className="grid max-w-3xl gap-6">
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6">
            <h2 className="font-semibold">No products yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an item here, then choose a Products block in Page builder →
              Content. Until you do, that block stays hidden.
            </p>
          </div>
        ) : (
          <ul className="ws-record-list">
            {active
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                >
                  <div className="ws-product-record">
                    <div className="ws-product-picture">
                      {p.image || p.images?.[0] ? (
                        <ProfileImage
                          image={p.image ?? p.images![0]!}
                          sizes="100px"
                        />
                      ) : p.kind === "vehicle" ? (
                        <Car aria-hidden="true" />
                      ) : (
                        <Package aria-hidden="true" />
                      )}
                    </div>
                    <div className="ws-product-copy">
                      <p>{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.priceMinor !== undefined
                          ? formatMoney(p.priceMinor, p.currency)
                          : "No price shown"}{" "}
                        ·{" "}
                        {p.mode === "link"
                          ? p.affiliate
                            ? "Opens an affiliate link"
                            : "Opens your own link"
                          : "Customers enquire"}{" "}
                      </p>
                      <div className="ws-product-badges">
                        <span>
                          {p.kind === "vehicle" ? "Vehicle" : "Product"}
                        </span>
                        <span data-available={p.availability === "available"}>
                          {AVAILABILITY_LABEL[p.availability]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => open(p, false)}
                    >
                      <Pencil /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        commit(
                          all.map((x) =>
                            x.id === p.id ? { ...x, archived: true } : x,
                          ),
                        )
                      }
                    >
                      <Archive /> Archive
                    </Button>
                  </div>
                </li>
              ))}
            {active.length > 0 &&
            !active.some((p) =>
              p.name.toLowerCase().includes(query.toLowerCase()),
            ) ? (
              <li className="text-sm text-muted-foreground">
                No items match your search.
              </li>
            ) : null}
          </ul>
        )}
        {archived.length ? (
          <section>
            <h2 className="mb-2 text-sm font-semibold">Archived</h2>
            <ul className="grid gap-2">
              {archived.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2 text-sm"
                >
                  <span>{p.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      commit(
                        all.map((x) =>
                          x.id === p.id ? { ...x, archived: false } : x,
                        ),
                      )
                    }
                  >
                    <ArchiveRestore /> Restore
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <EmptyPanel
          illustration="connect"
          title="Checkout and NFC products are not built yet"
        >
          <p>
            Today a product opens an enquiry (call, WhatsApp or email) or a link
            to your own shop. Cart, payments, orders and optional NFC cards,
            stickers and keyrings come later.
          </p>
        </EmptyPanel>
      </div>
      <Overlay
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        kind="detail"
        title={
          editing?.isNew
            ? editing.p.kind === "vehicle"
              ? "Add a vehicle"
              : "Add a product"
            : "Edit product"
        }
        dirty={Boolean(editing && JSON.stringify(editing.p) !== before)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save}>Save product</Button>
          </div>
        }
      >
        {editing ? (
          <ProductForm
            product={editing.p}
            onChange={(p) => setEditing({ ...editing, p })}
            showErrors={showErr}
          />
        ) : null}
      </Overlay>
    </>
  );
}
