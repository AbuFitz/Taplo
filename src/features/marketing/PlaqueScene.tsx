"use client";
import * as React from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

/** A physical sharing concept. Pointer and touch exploration settle naturally, without a control panel. */
export function PlaqueScene({ code }: { code: string }) {
  const reduce = useReducedMotion();
  const yaw = useSpring(0, { stiffness: 340, damping: 29, mass: 0.55 });
  const pitch = useSpring(0, { stiffness: 340, damping: 29, mass: 0.55 });
  const host = React.useRef<HTMLDivElement>(null);
  const resting = () => {
    yaw.set(0);
    pitch.set(0);
    if (host.current) host.current.dataset.engaged = "false";
  };
  React.useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) {
        yaw.set(0);
        pitch.set(0);
        element.dataset.engaged = "false";
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [yaw, pitch]);
  const pose = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    yaw.set((x - 0.5) * 44);
    pitch.set(-(y - 0.5) * 32);
    e.currentTarget.dataset.engaged = "true";
  };
  return (
    <div
      className="plaque-experience"
      onDragStart={(event) => event.preventDefault()}
      data-testid="plaque-experience"
    >
      <div
        ref={host}
        className="plaque-stage"
        role="group"
        tabIndex={0}
        aria-label="No. 6 Coffee counter plaque, interactive preview"
        aria-describedby="plaque-keyboard-help"
        data-engaged="false"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") {
            e.currentTarget.setPointerCapture(e.pointerId);
            pose(e);
          }
        }}
        onPointerMove={(e) => {
          if (
            reduce ||
            (e.pointerType !== "mouse" &&
              !e.currentTarget.hasPointerCapture(e.pointerId))
          )
            return;
          pose(e);
        }}
        onPointerLeave={resting}
        onPointerCancel={resting}
        onPointerUp={(e) => {
          if (e.pointerType !== "mouse") resting();
        }}
        onBlur={resting}
        onKeyDown={(e) => {
          if (
            ![
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Escape",
            ].includes(e.key)
          )
            return;
          e.preventDefault();
          if (e.key === "Escape") return resting();
          if (reduce) return;
          yaw.set(
            e.key === "ArrowLeft" ? -14 : e.key === "ArrowRight" ? 14 : 0,
          );
          pitch.set(e.key === "ArrowUp" ? -10 : e.key === "ArrowDown" ? 10 : 0);
          e.currentTarget.dataset.engaged = "true";
        }}
      >
        <div className="plaque-ground" aria-hidden="true" />
        <motion.div
          className="plaque-object"
          style={{
            rotateY: yaw,
            rotateX: pitch,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="plaque-stack-layer plaque-stack-layer-far"
            aria-hidden="true"
          >
            <span>Taplo</span>
          </div>
          <div
            className="plaque-stack-layer plaque-stack-layer-near"
            aria-hidden="true"
          >
            <span>No. 6 Coffee</span>
          </div>
          <div className="plaque-back" aria-hidden="true" />
          <div className="plaque-front">
            <p className="plaque-brand">
              No. 6 <span>Coffee</span>
            </p>
            <p className="plaque-invitation">Your next visit starts here.</p>
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
      <p id="plaque-keyboard-help" className="sr-only">
        Arrow keys tilt the preview. Escape or moving away returns it to the
        front.
      </p>
    </div>
  );
}
