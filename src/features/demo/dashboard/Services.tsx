"use client";

import * as React from "react";
import { useSetupIntent } from "@/features/experience/useSetupIntent";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Overlay } from "@/components/taplo/overlay";
import { getIndustryPreset } from "@/features/themes/presets/industries";
import { formatDuration, formatPrice } from "@/features/services/format";
import type { ServiceContent } from "@/features/businesses/content";
import { blankService, normService } from "../actions";
import { useDraft } from "../hooks";
import { ServiceForm, serviceErrors } from "../ServiceForm";
import { Offers } from "./Offers";
import { PageHeader } from "./Panel";

export function Services() {
  const { c, ent, setContent } = useDraft();
  const [editing, setEditing] = React.useState<{
    svc: ServiceContent;
    isNew: boolean;
  } | null>(null);
  const [query, setQuery] = React.useState("");
  const [before, setBefore] = React.useState("");
  const begin = (svc: ServiceContent, isNew: boolean) => {
    setBefore(JSON.stringify(svc));
    setShowErrors(false);
    setEditing({ svc, isNew });
  };
  const [showErrors, setShowErrors] = React.useState(false);
  useSetupIntent("new", () => begin(blankService(c?.services?.length ?? 0), true), Boolean(c));
  if (!c || !ent) return null;

  const all = (c.services ?? [])
    .map(normService)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const active = all.filter((s) => !s.archived);
  const archived = all.filter((s) => s.archived);
  const hidden =
    ent.maxServices === null ? 0 : Math.max(0, active.length - ent.maxServices);

  const commit = (list: ServiceContent[]) =>
    setContent((x) => ({
      ...x,
      services: list.map((s, i) => ({ ...s, sortOrder: i })),
    }));
  const move = (id: string, dir: -1 | 1) => {
    const list = [...active];
    const i = list.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j]!, list[i]!];
    commit([...list, ...archived]);
  };
  const toggleArchive = (id: string) =>
    commit(all.map((s) => (s.id === id ? { ...s, archived: !s.archived } : s)));
  const save = () => {
    if (!editing) return;
    if (Object.keys(serviceErrors(editing.svc)).length)
      return setShowErrors(true);
    commit(
      editing.isNew
        ? [...all, editing.svc]
        : all.map((s) => (s.id === editing.svc.id ? editing.svc : s)),
    );
    setEditing(null);
    setShowErrors(false);
  };

  return (
    <>
      <PageHeader scene="services"
        title={getIndustryPreset(c.identity.industryKey).terminology.services}
        description="Manage your prices, durations and bookable services."
        actions={
          <Button
            onClick={() => {
              begin(blankService(all.length), true);
            }}
          >
            <Plus /> Add service
          </Button>
        }
      />
      {hidden > 0 ? (
        <p
          role="status"
          className="mb-4 max-w-2xl rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950"
        >
          Your plan shows the first {ent.maxServices} services publicly.{" "}
          {hidden} more {hidden === 1 ? "is" : "are"} saved but hidden. Upgrade
          to Core for unlimited services. Nothing is deleted.
        </p>
      ) : null}
      <div className="ws-record-toolbar" data-empty={!all.length}><label><Search aria-hidden="true" /><input aria-label="Search services" placeholder="Find a service…" value={query} onChange={e=>setQuery(e.target.value)} /></label><span>{active.length} active</span></div>
      {active.length === 0 ? (
        <div className="max-w-xl rounded-xl border border-dashed p-6">
          <h2 className="font-semibold">No services yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first service so customers can see what you offer. Your
            page hides this section until you do.
          </p>
        </div>
      ) : (
        <ul className="ws-record-list">
          {active.filter(s => `${s.name} ${s.group ?? ""}`.toLowerCase().includes(query.toLowerCase())).map((s) => { const i = active.findIndex(v=>v.id===s.id); return (
            <li key={s.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {s.name || "Untitled service"}{" "}
                    {ent.maxServices !== null && i >= ent.maxServices ? (
                      <span className="ml-2 rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">
                        Hidden on your plan
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[
                      formatPrice(s),
                      formatDuration(s.durationMinutes),
                      s.group,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      begin(s, false);
                    }}
                  >
                    <Pencil /> Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" aria-label={`More actions for ${s.name || "service"}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-44">
                      <DropdownMenuItem disabled={i === 0} onSelect={() => move(s.id, -1)}>
                        <ArrowUp /> Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={i === active.length - 1} onSelect={() => move(s.id, 1)}>
                        <ArrowDown /> Move down
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toggleArchive(s.id)}>
                        <Archive /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          )})}
          {active.length > 0 && !active.some(s => `${s.name} ${s.group ?? ""}`.toLowerCase().includes(query.toLowerCase())) ? <li className="text-sm text-muted-foreground">No services match your search.</li> : null}
        </ul>
      )}
      {archived.length ? (
        <section className="mt-8 max-w-3xl">
          <h2 className="mb-2 text-sm font-semibold">Archived</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Hidden from your page. Kept so past bookings still make sense.
          </p>
          <ul className="grid gap-2">
            {archived.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2 text-sm"
              >
                <span>{s.name || "Untitled service"}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleArchive(s.id)}
                >
                  <ArchiveRestore /> Restore
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <details className="ws-secondary-task"><summary>Offers and promotions</summary><Offers /></details>

      <Overlay
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        title={editing?.isNew ? "Add a service" : "Edit service"}
        kind="detail"
        dirty={Boolean(editing && JSON.stringify(editing.svc) !== before)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save}>Save service</Button>
          </div>
        }
      >
        {editing ? (
          <ServiceForm
            key={editing.svc.id}
            service={editing.svc}
            showErrors={showErrors}
            onChange={(svc) => setEditing({ ...editing, svc })}
          />
        ) : null}
      </Overlay>
    </>
  );
}
