"use client";
import * as React from "react";
import Link from "next/link";
import { motion, useSpring, useReducedMotion } from "motion/react";
import { RotateCcw, ArrowUpRight } from "lucide-react";
/** A real vector code on a tactile plaque/pass concept. Ordering and wallet export remain planned. */
export function PlaqueScene({ code }: { code: string }) {
  const [format, setFormat] = React.useState<"plaque" | "wallet">("plaque"),
    [angle, setAngle] = React.useState(-14);
  const reduce = useReducedMotion(),
    yaw = useSpring(-14, { stiffness: 220, damping: 24, mass: 0.8 }),
    pitch = useSpring(8, { stiffness: 220, damping: 24, mass: 0.8 });
  const drag = React.useRef<{ x: number; y: number; angle: number } | null>(
      null,
    ),
    target = React.useRef(-14);
  const turn = (v: number) => {
    const n = Math.max(-45, Math.min(45, v));
    target.current = n;
    if (reduce) yaw.jump(n);
    else yaw.set(n);
  };
  const end = () => {
    drag.current = null;
    setAngle(target.current);
  };
  const download = () => {
    const blob = new Blob([code], { type: "image/svg+xml" }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "taplo-example-qr.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="plaque-experience" data-testid="plaque-experience">
      <div
        role="group"
        aria-label="Choose a sharing format"
        className="plaque-formats"
      >
        {(["plaque", "wallet"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={format === f}
            onClick={() => setFormat(f)}
          >
            {f === "plaque" ? "Counter plaque" : "Wallet card"}
          </button>
        ))}
      </div>
      <div
        className="plaque-stage"
        data-format={format}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { x: e.clientX, y: e.clientY, angle: target.current };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          turn(drag.current.angle + (e.clientX - drag.current.x) * 0.35);
          const tilt = Math.max(
            -18,
            Math.min(18, 8 - (e.clientY - drag.current.y) * 0.12),
          );
          if (reduce) pitch.jump(tilt);
          else pitch.set(tilt);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div className="plaque-ground" />
        <motion.div
          className="plaque-object"
          data-angle={angle}
          style={{
            rotateY: yaw,
            rotateX: pitch,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="plaque-back" aria-hidden="true" />
          <div className="plaque-front">
            <p className="plaque-brand">
              No. 6 <span>Coffee</span>
            </p>
            <p className="plaque-invitation">
              {format === "plaque"
                ? "Good coffee. A little closer."
                : "Keep us close."}
            </p>
            <div
              className="plaque-code"
              aria-label="Scannable code for the No. 6 Coffee demo"
              dangerouslySetInnerHTML={{ __html: code }}
            />
            <p className="plaque-foot">Menu · Opening times · Find us</p>
            <p className="plaque-signature">Made with Taplo</p>
          </div>
        </motion.div>
      </div>
      <div className="plaque-tools">
        <label className="flex min-h-11 flex-1 items-center gap-3 text-xs font-medium">
          Turn the {format === "plaque" ? "plaque" : "card"}
          <input
            type="range"
            min={-45}
            max={45}
            step={1}
            value={angle}
            aria-label="Plaque rotation"
            onChange={(e) => {
              const n = Number(e.target.value);
              turn(n);
              setAngle(n);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            turn(0);
            setAngle(0);
            if(reduce)pitch.jump(0);else pitch.set(0);
          }}
          aria-label="Reset plaque view"
        >
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <p className="text-center text-xs text-neutral-600">
        Drag to turn. Reset to view and scan it straight on.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={download}
          className="min-h-11 text-sm font-semibold underline underline-offset-4"
        >
          Save example QR
        </button>
        <Link
          href="/product/sharing"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          Explore sharing
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <p className="mx-auto mt-3 max-w-sm text-center text-xs leading-relaxed text-neutral-600">
        Plaque design and wallet preview. Physical plaque ordering and
        Apple/Google Wallet export are planned; QR downloads are available now.
      </p>
    </div>
  );
}
