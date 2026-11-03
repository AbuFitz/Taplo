"use client";
import * as React from "react";
import "./preview-resize.css";

/** A visible, keyboard-operable divider. Resizing never remounts the page document. */
export function PreviewResizeHandle({ onResize, stageId }: { onResize: (height: number) => void; stageId: string }) {
  const drag = React.useRef<{ y: number; height: number } | null>(null);
  const [height, setHeight] = React.useState(220);
  const resize = (value: number) => {
    const next = Math.round(Math.max(140, Math.min(600, (window.visualViewport?.height ?? window.innerHeight) * .58, value)));
    setHeight(next); onResize(next);
  };
  const current = () => document.getElementById(stageId)?.getBoundingClientRect().height ?? height;
  return <div className="preview-resize" role="separator" aria-orientation="horizontal" aria-label="Resize page preview" aria-controls={stageId} aria-valuemin={140} aria-valuemax={600} aria-valuenow={height} tabIndex={0}
    onPointerDown={(e) => { drag.current = { y: e.clientY, height: current() }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={(e) => { if (drag.current) resize(drag.current.height + e.clientY - drag.current.y); }}
    onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
    onKeyDown={(e) => { if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) { e.preventDefault(); resize(e.key === "Home" ? 140 : e.key === "End" ? 600 : current() + (e.key === "ArrowDown" ? 40 : -40)); } }}
  ><span aria-hidden="true" /><small aria-hidden="true">Drag to resize</small></div>;
}
