"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shot } from "./Shot";
import { MonoField } from "./MonoField";
const TASKS = [
  {
    label: "Take a booking",
    title: "From a service to a time.",
    detail: "Service detail, availability and a clear request or confirmation.",
    shot: "bk-request-review",
    href: "/product/booking",
  },
  {
    label: "Show your stock",
    title: "Keep the car in the conversation.",
    detail:
      "Photos, specifications, asking price and an enquiry about that vehicle.",
    shot: "veh-detail",
    href: "/product/vehicles",
  },
  {
    label: "Share your menu",
    title: "The useful details, before the visit.",
    detail:
      "A readable menu with prices, opening hours and a way to get in touch.",
    shot: "cafe-menu",
    href: "/inspiration/no-6-coffee",
  },
] as const;
export function ProductLead() {
  const [selected, select] = useState(0);
  const task = TASKS[selected];
  return (
    <MonoField className="product-lead">
      <div
        role="group"
        aria-label="Choose a customer journey"
        className="product-lead-choices"
      >
        {TASKS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            aria-pressed={selected === i}
            onClick={() => select(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="product-lead-body">
        <div>
          <h2>{task.title}</h2>
          <p>{task.detail}</p>
          <Link href={task.href}>
            Explore this experience
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="product-lead-art" key={task.shot}>
          <Shot
            id={task.shot}
            alt={task.title}
            width={460}
            fluid
            frame="none"
          />
        </div>
      </div>
    </MonoField>
  );
}
