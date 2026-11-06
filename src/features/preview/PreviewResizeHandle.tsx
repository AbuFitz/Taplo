"use client";
import * as React from "react";
import { clampPreviewHeight, previewLimits } from "./preview-size";
import "./preview-resize.css";

/** A visible, keyboard-operable divider. Resizing never remounts the page document. */
export function PreviewResizeHandle({
  onResize,
  stageId,
  containerId,
}: {
  onResize: (height: number) => void;
  stageId: string;
  containerId?: string;
}) {
  const drag = React.useRef<{ id: number; y: number; height: number } | null>(
    null,
  );
  const [measurement, setMeasurement] = React.useState({
    height: 140,
    min: 140,
    max: 140,
  });
  const callback = React.useEffectEvent(onResize);
  const viewport = React.useCallback(() => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const container = containerId ? document.getElementById(containerId) : null;
    return container
      ? Math.min(viewportHeight, container.getBoundingClientRect().height)
      : viewportHeight;
  }, [containerId]);
  const current = () =>
    document.getElementById(stageId)?.getBoundingClientRect().height ??
    measurement.height;
  const resize = (value: number) =>
    onResize(clampPreviewHeight(value, viewport()));

  React.useEffect(() => {
    const stage = document.getElementById(stageId);
    if (!stage) return;
    const sync = () => {
      const bounds = previewLimits(viewport());
      const actual = Math.round(stage.getBoundingClientRect().height);
      setMeasurement({
        height: actual,
        min: Math.min(bounds.min, actual),
        max: Math.max(bounds.max, actual),
      });
      // Rotation/browser chrome changes must not leave a previously enlarged preview crowding the task.
      if (actual > bounds.max) callback(bounds.max);
    };
    const observer = new ResizeObserver(sync);
    observer.observe(stage);
    window.visualViewport?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    sync();
    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
    };
  }, [stageId, viewport]);

  return (
    <div
      className="preview-resize"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize page preview"
      aria-controls={stageId}
      aria-valuemin={measurement.min}
      aria-valuemax={measurement.max}
      aria-valuenow={measurement.height}
      aria-valuetext={`${measurement.height} pixels`}
      tabIndex={0}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        drag.current = { id: e.pointerId, y: e.clientY, height: current() };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current?.id === e.pointerId)
          resize(drag.current.height + e.clientY - drag.current.y);
      }}
      onPointerUp={(e) => {
        if (drag.current?.id === e.pointerId) drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onLostPointerCapture={() => {
        drag.current = null;
      }}
      onKeyDown={(e) => {
        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
          e.preventDefault();
          const bounds = previewLimits(viewport());
          resize(
            e.key === "Home"
              ? bounds.min
              : e.key === "End"
                ? bounds.max
                : current() + (e.key === "ArrowDown" ? 40 : -40),
          );
        }
      }}
    >
      <span aria-hidden="true" />
      <small aria-hidden="true">Drag to resize</small>
    </div>
  );
}
