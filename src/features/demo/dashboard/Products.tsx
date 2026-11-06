"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { ProfileImage } from "@/features/page/renderer/ProfileImage";
import { PageHeader } from "./Panel";
import { storageHasFailed } from "../store";
import { mergeProductEdit } from "./product-edit";

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
  const searchParams = useSearchParams();
  const [editing, setEditing] = React.useState<{
    p: ProductContent;
    isNew: boolean;
  } | null>(null);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [before, setBefore] = React.useState("");
  const [showErr, setShowErr] = React.useState(false);
  const [saveProblem, setSaveProblem] = React.useState("");
  const [conflict, setConflict] = React.useState(false);
  const [formVersion, setFormVersion] = React.useState(0);
  const [openedFromLink, setOpenedFromLink] = React.useState(false);
  const addButton = React.useRef<HTMLButtonElement>(null);
  const [editingBusiness, setEditingBusiness] = React.useState<string | null>(
    null,
  );
  const editorFields = React.useRef<HTMLDivElement>(null);
  useSetupIntent(
    "new",
    () => {
      setOpenedFromLink(true);
      setEditingBusiness(c?.identity.slug ?? null);
      const p = blankProduct(
        c?.identity.industryKey === "car-dealer" ? "vehicle" : "product",
      );
      setBefore(JSON.stringify(p));
      setShowErr(false);
      setSaveProblem("");
      setConflict(false);
      setEditing({ p, isNew: true });
      setEditorOpen(true);
    },
    Boolean(c),
  );
  useSetupIntent("edit", () => {
    const item = (c?.products ?? []).map(normProduct).find((product) => product.id === searchParams.get("edit"));
    if (item && c) {
      setOpenedFromLink(true);
      setEditingBusiness(c.identity.slug);
      setBefore(JSON.stringify(item));
      setShowErr(false);
      setSaveProblem("");
      setConflict(false);
      setEditing({ p: item, isNew: false });
      setEditorOpen(true);
    }
  }, Boolean(c));
  if (!c) return null;
  const all = (c.products ?? []).map(normProduct);
  const active = all.filter((p) => !p.archived);
  const archived = all.filter((p) => p.archived);
  const commit = (list: ProductContent[]) =>
    setContent((x) => ({ ...x, products: list }));
  const open = (p: ProductContent, isNew: boolean) => {
    setOpenedFromLink(false);
    setEditingBusiness(c.identity.slug);
    setBefore(JSON.stringify(p));
    setShowErr(false);
    setSaveProblem("");
    setConflict(false);
    setEditing({ p, isNew });
    setEditorOpen(true);
  };
  const save = () => {
    if (!editing) return;
    if (Object.keys(productErrors(editing.p)).length) {
      setShowErr(true);
      requestAnimationFrame(() =>
        editorFields.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    let changedElsewhere = false;
    setContent((current) => {
      if (current.identity.slug !== editingBusiness) {
        changedElsewhere = true;
        return current;
      }
      const result = mergeProductEdit(
        current.products,
        editing.p,
        editing.isNew ? null : before,
      );
      if (result.conflict) {
        changedElsewhere = true;
        return current;
      }
      return { ...current, products: result.products };
    });
    if (changedElsewhere) {
      setConflict(true);
      setSaveProblem(
        "This item changed elsewhere or was removed. Your changes are still here. Load the latest item before saving.",
      );
      return;
    }
    if (storageHasFailed()) {
      setSaveProblem(
        "We couldn’t save your changes. Your details are still here. Please try again before leaving.",
      );
      return;
    }
    setEditorOpen(false);
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
            ref={addButton}
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
      <Link href="/dashboard/offers" className="ws-offers-back">← All offerings</Link>
      <div className="ws-record-toolbar" data-empty={!all.length}>
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
      </div>
      <Overlay
        open={editorOpen}
        onOpenChange={setEditorOpen}
        kind="detail"
        onCloseAutoFocus={(event) => {
          if (openedFromLink && addButton.current?.isConnected) {
            event.preventDefault();
            addButton.current.focus();
          }
        }}
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
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save product</Button>
          </div>
        }
      >
        {saveProblem ? (
          <div role="alert" className="mb-4 rounded-xl bg-muted p-4 text-sm">
            <p>{saveProblem}</p>
            {conflict &&
            editing &&
            c.identity.slug === editingBusiness &&
            all.some((p) => p.id === editing.p.id) ? (
              <Button
                type="button"
                variant="outline"
                className="mt-3 min-h-11"
                onClick={() => {
                  const latest = all.find((p) => p.id === editing.p.id)!;
                  setBefore(JSON.stringify(latest));
                  setEditing({ p: latest, isNew: false });
                  setSaveProblem("");
                  setConflict(false);
                  setFormVersion((v) => v + 1);
                }}
              >
                Load latest item
              </Button>
            ) : null}
          </div>
        ) : null}
        {editing ? (
          <div ref={editorFields}>
            <ProductForm
              key={formVersion}
              product={editing.p}
              onChange={(p) => setEditing({ ...editing, p })}
              showErrors={showErr}
            />
          </div>
        ) : null}
      </Overlay>
    </>
  );
}
