"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { referencedRecords } from "../widgets/selection";
import "./service-picker.css";

export interface ServiceRow {
  id: string;
  name: string;
  meta?: string;
  duration?: number;
  group?: string;
}

/** Selection and order belong to this block, never to another block's service menu. */
export function ServicePicker({
  rows,
  value,
  onChange,
  onEdit,
}: {
  rows: ServiceRow[];
  value: unknown;
  onChange: (ids: string[] | null) => void;
  onEdit: (id: string) => void;
}) {
  const selected = referencedRecords(rows, value);
  const ids = selected.map((row) => row.id);
  const included = new Set(ids);
  const ordered = [...selected, ...rows.filter((row) => !included.has(row.id))];
  const [announcement, announce] = useState("");
  const move = (id: string, direction: -1 | 1) => {
    const at = ids.indexOf(id),
      to = at + direction;
    if (at < 0 || to < 0 || to >= ids.length) return;
    const next = [...ids];
    [next[at], next[to]] = [next[to]!, next[at]!];
    onChange(next);
    announce(
      `${rows.find((row) => row.id === id)?.name} moved to position ${to + 1} of ${ids.length}.`,
    );
  };
  return (
    <div className="service-picker" data-testid="service-picker">
      <label className="service-picker-auto">
        <Checkbox
          checked={!Array.isArray(value)}
          onCheckedChange={(checked) => onChange(checked ? null : ids)}
        />{" "}
        Include new services automatically
      </label>
      <ul aria-label="Services in this block">
        {ordered.map((service) => {
          const at = ids.indexOf(service.id),
            shown = at !== -1;
          return (
            <li
              key={service.id}
              data-record-id={service.id}
              data-included={shown}
            >
              <button
                type="button"
                className="service-picker-edit"
                data-testid="record-edit"
                onClick={() => onEdit(service.id)}
              >
                <span>
                  <strong>
                    <span className="sr-only">Edit </span>
                    {service.name}
                  </strong>{" "}
                  <small>
                    {[
                      service.meta,
                      service.duration ? `${service.duration} min` : undefined,
                      service.group,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </small>
                </span>
                <Pencil size={16} aria-hidden="true" />
              </button>
              <div className="service-picker-tools">
                <button
                  type="button"
                  className="service-picker-inclusion"
                  aria-label={`Include ${service.name}, ${shown ? "Included" : "Hidden"}`}
                  aria-pressed={shown}
                  onClick={() =>
                    onChange(
                      shown
                        ? ids.filter((id) => id !== service.id)
                        : [...ids, service.id],
                    )
                  }
                >
                  {shown ? "Included" : "Hidden"}
                </button>
                <span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${service.name} earlier`}
                    disabled={!shown || at === 0}
                    onClick={() => move(service.id, -1)}
                  >
                    <ArrowUp aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${service.name} later`}
                    disabled={!shown || at === ids.length - 1}
                    onClick={() => move(service.id, 1)}
                  >
                    <ArrowDown aria-hidden="true" />
                  </Button>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}
