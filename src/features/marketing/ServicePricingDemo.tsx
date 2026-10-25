"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import "./service-pricing-demo.css";

const MODES = [
  {
    id: "fixed",
    label: "Fixed",
    price: "£85",
    detail: "One price for the service you describe.",
  },
  {
    id: "from",
    label: "From",
    price: "From £65",
    detail: "A starting price, with room to explain what affects it.",
  },
  {
    id: "quote",
    label: "Quote",
    price: "Let’s talk",
    detail: "Agree the work and the price before a visit.",
  },
] as const;

/** A small interactive illustration, separate from real booking/submission actions. */
export function ServicePricingDemo() {
  const [selected, setSelected] =
    React.useState<(typeof MODES)[number]["id"]>("fixed");
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const uid = React.useId();
  const trigger = React.useRef<HTMLButtonElement>(null);
  const mode = MODES.find((m) => m.id === selected)!;
  return (
    <div className="service-pricing-demo" data-testid="service-pricing-demo">
      <fieldset className="service-pricing-switch">
        <legend>Try the pricing</legend>
        <div>
          {MODES.map((m) => (
            <label key={m.id}>
              <input
                type="radio"
                name={uid}
                value={m.id}
                checked={m.id === selected}
                onChange={() => setSelected(m.id)}
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="service-pricing-stage">
        <article className="service-pricing-card">
          <div className="service-pricing-identity">
            <span aria-hidden="true">D.</span>
            <div>
              Detail Studio<small>Illustrative business</small>
            </div>
            <span className="service-pricing-type">{mode.label} price</span>
          </div>
          <div className="service-pricing-line" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <h2>
            Inside. Outside.
            <br />
            Taken care of.
          </h2>
          <p>A full valet, with the detail up front.</p>
          <ul>
            <li>Exterior wash and wheels</li>
            <li>Interior vacuum and surfaces</li>
            <li>Finishing touches</li>
          </ul>
          <div className="service-pricing-price" aria-live="polite">
            <motion.strong
              key={mode.id}
              initial={reduced ? false : { y: 5 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {mode.price}
            </motion.strong>
            <span>
              <Clock3 size={14} aria-hidden="true" />
              Around 2 hours
            </span>
          </div>
          <button ref={trigger} type="button" onClick={() => setOpen(true)}>
            {mode.id === "quote" ? "View the enquiry" : "View the service"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        </article>
        <motion.div
          className="service-pricing-caption"
          key={mode.id}
          initial={reduced ? false : { y: 6 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span aria-hidden="true" />
          <p>{mode.detail}</p>
        </motion.div>
      </div>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus();
        }}
        title={
          mode.id === "quote"
            ? "An enquiry with context"
            : "Everything before they book"
        }
      >
        <div className="grid gap-4 text-sm leading-relaxed">
          <p className="font-semibold">Full valet · {mode.price}</p>
          <p>
            {mode.id === "quote"
              ? "The service name stays with the enquiry. Customers can explain the car, its condition and what they need before a price is agreed."
              : "Customers can open the service, see what is included and check the time and price before choosing their next step."}
          </p>
          <p className="text-neutral-500">
            Interactive example. No booking or enquiry has been submitted.
          </p>
        </div>
      </Overlay>
    </div>
  );
}
