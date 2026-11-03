"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import "./gallery-photo-picker.css";

export interface PhotoRow {
  id: string;
  name: string;
  thumb?: string;
}

/** A gallery owns its order. Reordering never moves or deletes another block's photos. */
export function photoSelection(rows: PhotoRow[], value: unknown): string[] {
  const existing = new Set(rows.map((row) => row.id));
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string => typeof id === "string" && existing.has(id),
          ),
        ),
      ]
    : rows.map((row) => row.id);
}
export function movePhoto(
  ids: string[],
  id: string,
  direction: -1 | 1,
): string[] {
  const at = ids.indexOf(id),
    next = at + direction;
  if (at < 0 || next < 0 || next >= ids.length) return ids;
  const result = [...ids];
  [result[at], result[next]] = [result[next]!, result[at]!];
  return result;
}

export function GalleryPhotoPicker({
  rows,
  value,
  onChange,
  onEdit,
}: {
  rows: PhotoRow[];
  value: unknown;
  onChange: (ids: string[] | null) => void;
  onEdit: (id: string) => void;
}) {
  const selected = photoSelection(rows, value);
  const all = !Array.isArray(value);
  const [announcement, announce] = useState("");
  const ordered = [
    ...selected.map((id) => rows.find((row) => row.id === id)!),
    ...rows.filter((row) => !selected.includes(row.id)),
  ];
  const move = (id: string, direction: -1 | 1) => {
    const next = movePhoto(selected, id, direction);
    onChange(next);
    announce(
      `Photo moved to position ${next.indexOf(id) + 1} of ${next.length}.`,
    );
  };
  return (
    <div className="gallery-photo-picker" data-testid="gallery-photo-picker">
      <label className="gallery-auto-selection">
        <Checkbox
          checked={all}
          onCheckedChange={(checked) => onChange(checked ? null : selected)}
        />{" "}
        Include new photos automatically
      </label>
      <ul aria-label="Gallery photos">
        {ordered.map((photo) => {
          const position = selected.indexOf(photo.id),
            included = position !== -1;
          return (
            <li
              key={photo.id}
              data-record-id={photo.id}
              data-included={included}
            >
              <button
                type="button"
                className="gallery-photo-edit"
                onClick={() => onEdit(photo.id)}
                aria-label={`Edit ${photo.name}`}
                data-testid="record-edit"
              >
                {/* Owner-uploaded images are already local image data. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumb} alt="" />
                <span className="gallery-photo-edit-mark">
                  <Pencil size={16} aria-hidden="true" />
                </span>
              </button>
              <p className="gallery-photo-name">{photo.name}</p>
              <div className="gallery-photo-tools">
                <button
                  type="button"
                  aria-label={`Include ${photo.name}, ${included ? "On page" : "Hidden"}`}
                  aria-pressed={included}
                  className="gallery-photo-inclusion"
                  onClick={() =>
                    onChange(
                      included
                        ? selected.filter((id) => id !== photo.id)
                        : [...selected, photo.id],
                    )
                  }
                >
                  {included ? "On page" : "Hidden"}
                </button>
                <span className="gallery-photo-moves">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!included || position === 0}
                    aria-label={`Move ${photo.name} earlier`}
                    onClick={() => move(photo.id, -1)}
                  >
                    <ArrowLeft aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!included || position === selected.length - 1}
                    aria-label={`Move ${photo.name} later`}
                    onClick={() => move(photo.id, 1)}
                  >
                    <ArrowRight aria-hidden="true" />
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
