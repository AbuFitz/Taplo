import { describe, expect, it } from "vitest";
import type { Booking } from "@/features/booking/types";
import { todayWork, pageTasks } from "./today-model";
import { applyIndustry, setName } from "../actions";
import { initialState } from "../store";
const now = Date.parse("2026-11-05T10:00:00Z");
const work = (
  id: string,
  start: string,
  status: Booking["status"] = "confirmed",
  extra = {},
): Booking => ({
  id,
  startsAt: Date.parse(start),
  endsAt: Date.parse(start) + 3600000,
  status,
  serviceName: "Lesson",
  serviceId: "svc_one",
  staffId: "",
  blockStart: Date.parse(start),
  blockEnd: Date.parse(start) + 3600000,
  mode: "request",
  customer: { name: "Example learner" },
  durationMinutes: 60,
  priceLabel: "£30",
  createdAt: now - 1000,
  idempotencyKey: id,
  manageToken: "test-only",
  history: [],
  ...extra,
});
describe("Today's real work", () => {
  it("shows ongoing/today work and valid requests; excludes expired, cancelled and completed work", () => {
    const list = [
      work("later", "2026-11-05T14:00:00Z"),
      work("ongoing", "2026-11-05T09:30:00Z"),
      work("request", "2026-11-05T11:00:00Z", "pending", {
        expiresAt: now + 1000,
      }),
      work("expired", "2026-11-05T12:00:00Z", "pending", {
        expiresAt: now - 1,
      }),
      work("cancelled", "2026-11-05T13:00:00Z", "cancelled"),
      work("completed", "2026-11-05T08:00:00Z", "completed"),
      work("tomorrow", "2026-11-06T11:00:00Z"),
    ];
    const before = list.map((b) => b.id);
    const result = todayWork(list, now, "Europe/London");
    expect(result.today.map((b) => b.id)).toEqual([
      "ongoing",
      "request",
      "later",
    ]);
    expect(result.awaiting.map((b) => b.id)).toEqual(["request"]);
    expect(result.upcoming.map((b) => b.id)).toEqual([
      "ongoing",
      "request",
      "later",
      "tomorrow",
    ]);
    expect(list.map((b) => b.id)).toEqual(before);
  });
  it("uses the business's local day, including across the date boundary", () => {
    const result = todayWork(
      [
        work("local-today", "2026-11-05T08:00:00Z", "confirmed", {
          endsAt: Date.parse("2026-11-05T12:00:00Z"),
        }),
        work("local-tomorrow", "2026-11-05T12:00:00Z"),
      ],
      Date.parse("2026-11-05T10:00:00Z"),
      "Pacific/Auckland",
    );
    expect(result.today.map((b) => b.id)).toEqual(["local-today"]);
  });
  it("does not guess appointment times when the configured zone is invalid", () => {
    expect(
      todayWork([work("one", "2026-11-05T14:00:00Z")], now, "Wrong/Zone"),
    ).toMatchObject({ timezone: null, today: [], upcoming: [] });
  });
  it("ignores corrupted timestamps without crashing the workspace", () => {
    expect(
      todayWork(
        [
          work("one", "2026-11-05T14:00:00Z", "confirmed", {
            startsAt: Infinity,
          }),
          work("two", "2026-11-05T14:00:00Z", "confirmed", { startsAt: 9e18 }),
        ],
        now,
        "Europe/London",
      ).upcoming,
    ).toEqual([]);
  });
  it("does not count labelled examples as an owner's real first offer", () => {
    const state = setName(applyIndustry(initialState(), "barber"), "Chapter");
    state.content.services = [
      {
        id: "example",
        name: "Example haircut",
        priceMode: "quote",
        currency: "GBP",
        delivery: [],
        bookingMode: "contact",
        sortOrder: 0,
        archived: false,
        example: true,
      },
    ];
    expect(pageTasks(state)).toMatchObject({ hasOffer: false, services: 0 });
  });
});
