"use client";
import * as React from "react";
import {
  Check,
  GripVertical,
  Pause,
  Play,
  RotateCcw,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import type { JourneyId } from "./journeys";
const FRAMES: Record<JourneyId, readonly [string, string, string]> = {
  page: [
    "Start with your identity",
    "Put your main action in reach",
    "Move your most useful section first",
  ],
  services: [
    "Add a service once",
    "Set its price and duration",
    "Reuse it on your page",
  ],
  bookings: [
    "Choose a service",
    "Offer suitable appointment times",
    "Review the request in your calendar",
  ],
  products: [
    "Show a clear product photo",
    "Let visitors inspect the details",
    "Send them to an enquiry or your shop",
  ],
  team: [
    "Introduce the person",
    "Show their specialities",
    "Connect the right services",
  ],
  reviews: [
    "Use a genuine review source",
    "Put trust beside your main action",
    "Let visitors verify the original",
  ],
  analytics: [
    "Someone opens the page",
    "They choose an action",
    "Review reach and intent separately",
  ],
  profile: [
    "Your name leads without a photo",
    "A picture gets its own space",
    "A cover frames the introduction",
  ],
  design: [
    "Start with a coordinated palette",
    "See the change across the page",
    "Keep your content in place",
  ],
  order: [
    "Press and hold the dotted handle",
    "Move the section above its neighbour",
    "Release to save; Undo restores it",
  ],
  sharing: [
    "Check your public destination",
    "Choose a business-branded asset",
    "Scan the actual exported file",
  ],
  settings: [
    "Choose the tools you need",
    "Review the connection status",
    "Enable a service only when it is ready",
  ],
};
/** An explicit, controllable product demonstration. It never edits customer data or pretends to be footage. */
export function TaskDemo({ topic }: { topic: JourneyId }) {
  const [frame, setFrame] = React.useState(0),
    [playing, setPlaying] = React.useState(false);
  const reduced = React.useSyncExternalStore(
    (cb) => {
      const m = matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  React.useEffect(() => {
    if (!playing || reduced) return;
    const t = window.setTimeout(() => {
      if (frame < 2) setFrame(frame + 1);
      else setPlaying(false);
    }, 3500);
    return () => clearTimeout(t);
  }, [playing, frame, reduced]);
  const jump = (n: number) => {
    setPlaying(false);
    setFrame(n);
  };
  return (
    <div
      className="task-demo"
      data-topic={topic}
      data-frame={frame}
      data-playing={playing && !reduced}
    >
      <div className="task-demo-canvas" aria-hidden="true">
        <span className="task-demo-example">Illustrative example</span>
        {topic === "sharing" ? (
          <div className="demo-share">
            <span className="demo-share-mark">n.</span>
            <b>North Studio</b>
            <span>Business link · Share card · QR</span>
            <div data-reveal={frame > 0}>
              <span>Link</span>
              <span>Card</span>
              <span>QR</span>
            </div>
            <small>
              {frame === 2
                ? "Scan and check the destination."
                : "A draft needs public publishing first."}
            </small>
          </div>
        ) : topic === "profile" ? (
          <div className="demo-profile-layout" data-layout-frame={frame}>
            <div className="demo-profile-cover" />
            <span className="demo-profile-avatar">n.</span>
            <b>North Studio</b>
            <small>A little time for yourself.</small>
            <span className="demo-black">
              Get in touch
              <ArrowUpRight />
            </span>
          </div>
        ) : topic === "bookings" ? (
          <div className="demo-booking">
            <div className="demo-service">
              <CalendarDays />
              <span>
                Consultation<small>30 min · £35</small>
              </span>
              <Check />
            </div>
            <div className="demo-date">
              <b>Wednesday</b>
              <span>Choose a time</span>
            </div>
            <div className="demo-slots">
              {["09:30", "10:15", "11:00"].map((v, i) => (
                <span key={v} data-chosen={frame > 0 && i === 1}>
                  {v}
                </span>
              ))}
            </div>
            <div className="demo-ticket" data-reveal={frame === 2}>
              <Check />
              <span>
                Request received
                <small>Waiting for the business to review</small>
              </span>
            </div>
          </div>
        ) : topic === "products" ? (
          <div className="demo-products">
            <div className="demo-product-object">
              <i />
              <i />
              <span>
                Everyday
                <br />
                care.
              </span>
            </div>
            <div className="demo-product-info">
              <small>From the shop</small>
              <b>Styling cream</b>
              <span>£16</span>
              {frame > 0 ? (
                <p>
                  Soft hold. Natural finish.
                  <br />
                  100 ml · Available
                </p>
              ) : null}
              <span className="demo-black">
                {frame === 2 ? "Ask about this item" : "View details"}
                <ArrowUpRight />
              </span>
            </div>
          </div>
        ) : topic === "team" ? (
          <div className="demo-team">
            <div className="demo-person">
              <span>AM</span>
              <b>Alex Morgan</b>
              <small>Stylist</small>
            </div>
            <div className="demo-specialities" data-reveal={frame > 0}>
              <span>Cut & finish</span>
              <span>Colour consultation</span>
            </div>
            <div className="demo-black" data-reveal={frame === 2}>
              Book with Alex
              <ArrowUpRight />
            </div>
          </div>
        ) : topic === "reviews" ? (
          <div className="demo-review">
            <div className="demo-source">
              G
              <span>
                Google reviews<small>Open the original source</small>
              </span>
              <ArrowUpRight />
            </div>
            <div className="demo-review-lines">
              <i />
              <i />
              <i />
            </div>
            <span className="demo-black">
              {frame === 2 ? "Read on Google" : "Read our reviews"}
              <ArrowUpRight />
            </span>
            <small>Real reviews keep their source.</small>
          </div>
        ) : topic === "analytics" ? (
          <div className="demo-analytics">
            <div>
              <span>Page visit</span>
              <i data-active={frame >= 0} />
            </div>
            <div>
              <span>Action chosen</span>
              <i data-active={frame > 0} />
            </div>
            <div>
              <span>Customer enquiry</span>
              <i data-active={frame > 1} />
            </div>
            <small>Concept illustration. No live statistics.</small>
          </div>
        ) : topic === "settings" ? (
          <div className="demo-connections">
            <div>
              <span className="demo-plan">Pro</span>
              <span>
                Your tools<small>Appointments · Team profiles</small>
              </span>
            </div>
            <div>
              <CalendarDays />
              <span>
                Appointment messages
                <small>
                  {frame === 2
                    ? "Requires a verified provider"
                    : "Not connected"}
                </small>
              </span>
              <span className="demo-status">○</span>
            </div>
            <p>
              {frame > 0
                ? "A plan unlocks a tool. A connection makes the service work."
                : "Choose what your business actually needs."}
            </p>
          </div>
        ) : (
          <div
            className="demo-compose"
            data-colour={topic === "design" && frame > 0}
          >
            <div className="demo-profile">
              <span>n.</span>
              <b>North Studio</b>
              <small>A little time for yourself.</small>
            </div>
            <span className="demo-black">
              {topic === "services" ? "Book a consultation" : "Get in touch"}
              <ArrowUpRight />
            </span>
            <div
              className="demo-blocks"
              data-reordered={frame === 2}
              data-held={topic === "order" && frame === 1}
            >
              <div>
                <GripVertical />
                <span>
                  {topic === "services" ? "Consultation" : "Services"}
                  <small>
                    {topic === "services" && frame > 0
                      ? "30 min · £35"
                      : "Explore what we offer"}
                  </small>
                </span>
                <Check />
              </div>
              <div>
                <GripVertical />
                <span>
                  Our work<small>See the details</small>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="task-demo-caption" aria-live="polite">
        <b>{FRAMES[topic][frame]}</b>
        <span>{frame + 1} / 3</span>
      </div>
      <div className="task-demo-controls">
        <button
          type="button"
          aria-label={
            reduced
              ? "Show next demonstration scene"
              : playing
                ? "Pause demonstration"
                : frame === 2
                  ? "Replay demonstration"
                  : "Play demonstration"
          }
          onClick={() => {
            if (playing) setPlaying(false);
            else {
              if (reduced) setFrame((n) => (n + 1) % 3);
              else {
                if (frame === 2) setFrame(0);
                setPlaying(true);
              }
            }
          }}
        >
          {playing ? <Pause /> : frame === 2 ? <RotateCcw /> : <Play />}
          <span>
            {reduced
              ? "Next scene"
              : playing
                ? "Pause"
                : frame === 2
                  ? "Replay"
                  : "Play walkthrough"}
          </span>
        </button>
        <div role="group" aria-label="Demonstration scenes">
          {FRAMES[topic].map((v, i) => (
            <button
              key={v}
              type="button"
              aria-label={v}
              aria-pressed={i === frame}
              onClick={() => jump(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
      <details className="task-demo-transcript">
        <summary>Read the walkthrough</summary>
        <ol>
          {FRAMES[topic].map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
