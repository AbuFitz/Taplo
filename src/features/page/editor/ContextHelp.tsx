"use client";
import { SectionSetup } from "@/features/experience/SectionSetup";
export type HelpTopic = "blocks" | "order" | "design" | "booking" | "sharing";
/** Shared task-based walkthroughs, available again after dismissal. */
export function ContextHelp({ topic }: { topic: HelpTopic }) {
  return (
    <SectionSetup
      topic={
        topic === "booking"
          ? "bookings"
          : topic === "order"
            ? "order"
            : topic === "sharing"
              ? "sharing"
              : topic === "design"
                ? "design"
                : "page"
      }
      launcher={
        topic === "order"
          ? "Reordering guide"
          : topic === "sharing"
            ? "Page & sharing guide"
            : topic === "booking"
              ? "Booking setup"
              : "Page walkthrough"
      }
    />
  );
}
