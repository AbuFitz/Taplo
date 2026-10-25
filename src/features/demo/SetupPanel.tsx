"use client";

import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
export type SetupSheetSize = "preview" | "edit" | "expanded";
const FRACTION = { preview: 92, edit: 0.68, expanded: 1 } as const;

/** Only the grip captures vertical gestures. Fields keep native scrolling and keyboard behaviour. */
export function SetupPanel({
  children,
  preview,
  size,
  onSizeChange,
}: {
  children: ReactNode;
  preview: boolean;
  size: SetupSheetSize;
  onSizeChange: (size: SetupSheetSize) => void;
}) {
  const panel = useRef<HTMLElement>(null);
  const gesture = useRef<{
    id: number;
    y: number;
    height: number;
    available: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const settle = (
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) => {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const height = Math.max(
      92,
      Math.min(drag.available, drag.height - (event.clientY - drag.y)),
    );
    const nearest = cancelled
      ? size
      : (Object.keys(FRACTION) as SetupSheetSize[]).reduce((a, b) => {
          const value = (key: SetupSheetSize) =>
            key === "preview" ? 92 : drag.available * FRACTION[key];
          return Math.abs(value(a) - height) < Math.abs(value(b) - height)
            ? a
            : b;
        });
    suppressClick.current = !cancelled && drag.moved;
    gesture.current = null;
    panel.current?.style.removeProperty("--setup-drag-height");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    onSizeChange(nearest);
  };
  return (
    <section
      ref={panel}
      aria-labelledby="step-title"
      className="setup-panel"
      data-sheet={size}
      data-sheet-enabled={preview}
      style={
        {
          "--setup-sheet-height":
            size === "preview" ? "92px" : size === "expanded" ? "100%" : "68%",
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="setup-sheet-grip"
        aria-label={
          size === "preview" ? "Return to editing" : "Show more of your page"
        }
        aria-expanded={size !== "preview"}
        aria-controls="setup-controls"
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          onSizeChange(size === "preview" ? "edit" : "preview");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onSizeChange(size === "preview" ? "edit" : "expanded");
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onSizeChange(size === "expanded" ? "edit" : "preview");
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onSizeChange("edit");
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const element = panel.current;
          if (!element?.parentElement) return;
          gesture.current = {
            id: event.pointerId,
            y: event.clientY,
            height: element.clientHeight,
            available: element.parentElement.clientHeight,
            moved: false,
          };
          suppressClick.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const drag = gesture.current;
          if (!drag || drag.id !== event.pointerId) return;
          if (Math.abs(event.clientY - drag.y) > 6) drag.moved = true;
          if (drag.moved)
            panel.current?.style.setProperty(
              "--setup-drag-height",
              `${Math.max(92, Math.min(drag.available, drag.height - (event.clientY - drag.y)))}px`,
            );
        }}
        onPointerUp={(event) => settle(event)}
        onPointerCancel={(event) => settle(event, true)}
      >
        <span aria-hidden="true" />
      </button>
      {children}
    </section>
  );
}
