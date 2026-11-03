"use client";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { TaploInput } from "@/components/taplo/taplo-input";

/** Bounded package details on the service record, shared by every block that uses it. */
export function ServiceInclusions({
  items,
  onChange,
  error,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  error?: string;
}) {
  const errorId = useId();
  const host = useRef<HTMLDivElement>(null);
  const nextFocus = useRef<number | null>(null);
  const [notice, setNotice] = useState("");
  useLayoutEffect(() => {
    if (nextFocus.current === null) return;
    const input = host.current?.querySelector<HTMLInputElement>(
      `[data-inclusion-row="${nextFocus.current}"] input`,
    );
    (
      input ??
      host.current?.querySelector<HTMLButtonElement>("[data-add-inclusion]")
    )?.focus();
    nextFocus.current = null;
  }, [items]);
  const move = (index: number, offset: number) => {
    const next = [...items];
    const to = index + offset;
    if (to < 0 || to >= next.length) return;
    [next[index], next[to]] = [next[to], next[index]];
    nextFocus.current = to;
    onChange(next);
    setNotice(`Moved to position ${to + 1}.`);
  };
  return (
    <details className="px-1 py-2" open={items.length > 0 || undefined}>
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">
        What’s included (optional)
      </summary>
      <div
        ref={host}
        className="grid gap-3 py-2"
        data-testid="service-inclusions-editor"
      >
        <ol className="grid gap-3">
          {items.map((item, index) => (
            <li key={index} data-inclusion-row={index} className="grid gap-1">
              <TaploInput
                label={`Included item ${index + 1}`}
                aria-invalid={Boolean(error && !item.trim())}
                aria-describedby={error ? errorId : undefined}
                value={item}
                placeholder="e.g. Interior vacuum and windows"
                maxLength={140}
                onChange={(event) =>
                  onChange(
                    items.map((value, i) =>
                      i === index ? event.target.value : value,
                    ),
                  )
                }
              />
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-30"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Move included item ${index + 1} up`}
                >
                  <ArrowUp aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-30"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Move included item ${index + 1} down`}
                >
                  <ArrowDown aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={() => {
                    nextFocus.current = Math.min(index, items.length - 2);
                    onChange(items.filter((_, i) => i !== index));
                    setNotice("Included item removed.");
                  }}
                  aria-label={`Remove included item ${index + 1}`}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
        {items.length < 8 ? (
          <button
            type="button"
            data-add-inclusion
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => {
              nextFocus.current = items.length;
              onChange([...items, ""]);
            }}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add included item
          </button>
        ) : null}
        <p role="status" className="sr-only">
          {notice}
        </p>
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </details>
  );
}
