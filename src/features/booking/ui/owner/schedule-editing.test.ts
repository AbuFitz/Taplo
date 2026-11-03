import { describe, expect, it } from "vitest";
import {
  dateError,
  hoursError,
  sortedHours,
  withBreak,
} from "./schedule-editing";

describe("working-hours drafts", () => {
  it("allows closed days and adjacent periods but rejects invalid and overlapping times", () => {
    expect(hoursError([])).toBeNull();
    expect(
      hoursError([
        { start: "09:00", end: "12:00" },
        { start: "12:00", end: "17:00" },
      ]),
    ).toBeNull();
    expect(hoursError([{ start: "25:00", end: "26:00" }])).toBeTruthy();
    expect(hoursError([{ start: "17:00", end: "09:00" }])).toContain("after");
    expect(
      hoursError([
        { start: "12:00", end: "17:00" },
        { start: "09:00", end: "13:00" },
      ]),
    ).toContain("overlap");
  });
  it("sorts a copy and leaves the original draft unchanged", () => {
    const draft = [
      { start: "14:00", end: "17:00" },
      { start: "09:00", end: "12:00" },
    ];
    const sorted = sortedHours(draft);
    expect(sorted[0].start).toBe("09:00");
    sorted[0].start = "08:00";
    expect(draft[1].start).toBe("09:00");
  });
  it("inserts a real one-hour gap only when a period can accommodate it", () => {
    const split = withBreak([{ start: "09:00", end: "17:00" }]);
    expect(split).toEqual([
      { start: "09:00", end: "12:30" },
      { start: "13:30", end: "17:00" },
    ]);
    expect(hoursError(split)).toBeNull();
    expect(withBreak([{ start: "09:00", end: "10:00" }])).toHaveLength(1);
  });
  it("rejects nonexistent dates while allowing leap days", () => {
    expect(dateError("2026-02-29")).toBeTruthy();
    expect(dateError("2028-02-29")).toBeNull();
    expect(dateError("2026-04-31")).toBeTruthy();
    expect(dateError("")).toBeTruthy();
  });
});
