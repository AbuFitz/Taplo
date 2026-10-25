"use client";

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./design-rail.css";
export interface DesignRailHandle {
  goTo: (index: number) => void;
}
interface Props {
  children: ReactNode;
  label: string;
  view?: "phone" | "desktop";
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
  testId?: string;
}

/** Native scrolling and snapping remain the spine; depth is a progressive visual enhancement. */
export const DesignRail = forwardRef<DesignRailHandle, Props>(
  function DesignRail(
    {
      children,
      label,
      view = "phone",
      initialIndex = 0,
      onIndexChange,
      className = "",
      testId,
    },
    ref,
  ) {
    const rail = useRef<HTMLUListElement>(null);
    const count = Children.count(children);
    const [active, setActive] = useState(Math.min(initialIndex, count - 1));
    const current = useRef(active);
    const notify = useRef(onIndexChange);
    const frame = useRef(0);
    const drag = useRef<{
      id: number;
      x: number;
      scroll: number;
      moved: boolean;
    } | null>(null);
    const suppressClick = useRef(false);
    const uid = useId();
    useEffect(() => {
      notify.current = onIndexChange;
    }, [onIndexChange]);
    const measure = useCallback(() => {
      const element = rail.current;
      if (!element) return;
      const center = element.scrollLeft + element.clientWidth / 2;
      let nearest = 0,
        distance = Infinity;
      Array.from(element.children).forEach((node, index) => {
        const card = node as HTMLElement;
        const delta =
          (card.offsetLeft + card.offsetWidth / 2 - center) /
          Math.max(1, card.offsetWidth);
        card.style.setProperty(
          "--design-distance",
          String(Math.max(-1.5, Math.min(1.5, delta))),
        );
        card.style.setProperty(
          "--design-scale",
          String(1 - Math.min(1.5, Math.abs(delta)) * 0.085),
        );
        card.style.setProperty(
          "--design-blur",
          `${Math.max(0, Math.min(1.2, Math.abs(delta) - 0.25))}px`,
        );
        if (Math.abs(delta) < distance) {
          distance = Math.abs(delta);
          nearest = index;
        }
      });
      if (nearest !== current.current) {
        current.current = nearest;
        setActive(nearest);
        notify.current?.(nearest);
      }
    }, []);
    const schedule = () => {
      if (!frame.current)
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          measure();
        });
    };
    const goTo = useCallback(
      (index: number, immediate = false) => {
        const element = rail.current;
        if (!element) return;
        const next = Math.max(0, Math.min(count - 1, index));
        const card = element.children[next] as HTMLElement | undefined;
        if (!card) return;
        element.scrollTo({
          left:
            card.offsetLeft - element.clientWidth / 2 + card.offsetWidth / 2,
          behavior:
            immediate || matchMedia("(prefers-reduced-motion:reduce)").matches
              ? "instant"
              : "smooth",
        });
        current.current = next;
        setActive(next);
        notify.current?.(next);
        if (immediate) measure();
      },
      [count, measure],
    );
    useImperativeHandle(ref, () => ({ goTo }), [goTo]);
    useEffect(() => {
      const element = rail.current;
      if (!element) return;
      goTo(initialIndex, true);
      const observer = new ResizeObserver(() => goTo(current.current, true));
      observer.observe(element);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame.current);
      };
    }, [goTo, initialIndex]);
    const stopDrag = () => {
      const gesture = drag.current;
      drag.current = null;
      if (rail.current) delete rail.current.dataset.dragging;
      if (gesture?.moved) {
        suppressClick.current = true;
        measure();
        goTo(current.current);
      }
    };
    return (
      <div
        className={`design-rail-shell ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
      >
        <ul
          ref={rail}
          id={uid}
          tabIndex={0}
          aria-label={label}
          className="design-gallery design-frost-rail"
          data-view={view}
          data-testid={testId}
          onScroll={schedule}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            const to =
              event.key === "ArrowRight"
                ? active + 1
                : event.key === "ArrowLeft"
                  ? active - 1
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? count - 1
                      : null;
            if (to !== null) {
              event.preventDefault();
              goTo(to);
            }
          }}
          onPointerDown={(event) => {
            if (
              event.pointerType !== "mouse" ||
              event.button !== 0 ||
              (event.target as HTMLElement).closest("button,input,select")
            )
              return;
            drag.current = {
              id: event.pointerId,
              x: event.clientX,
              scroll: event.currentTarget.scrollLeft,
              moved: false,
            };
            suppressClick.current = false;
          }}
          onPointerMove={(event) => {
            const gesture = drag.current;
            if (!gesture || gesture.id !== event.pointerId) return;
            const distance = event.clientX - gesture.x;
            if (Math.abs(distance) > 7 && !gesture.moved) {
              gesture.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = "true";
            }
            if (gesture.moved) {
              event.preventDefault();
              event.currentTarget.scrollLeft = gesture.scroll - distance;
            }
          }}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={() => {
            if (drag.current) stopDrag();
          }}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (suppressClick.current) {
              suppressClick.current = false;
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          style={{ "--design-count": count } as CSSProperties}
        >
          {children}
        </ul>
        <div className="design-rail-controls">
          <button
            type="button"
            disabled={active === 0}
            aria-label="Previous design"
            aria-controls={uid}
            onClick={() => goTo(active - 1)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <div className="design-rail-track" aria-hidden="true">
            <span
              style={{
                width: `${100 / Math.max(1, count)}%`,
                transform: `translateX(${active * 100}%)`,
              }}
            />
          </div>
          <span className="sr-only" aria-live="polite">
            Design {active + 1} of {count}
          </span>
          <button
            type="button"
            disabled={active >= count - 1}
            aria-label="Next design"
            aria-controls={uid}
            onClick={() => goTo(active + 1)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  },
);
