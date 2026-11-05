import { afterEach, describe, expect, it, vi } from "vitest";
import { applyIndustry, setName } from "../actions";
import { initialState, parseContent } from "../store";
import {
  applyContacts,
  applyOpeningHours,
  contactDraft,
  contactErrors,
  contactStamp,
  copyMonday,
  hoursDraft,
  hoursErrors,
  hoursShown,
  hoursStamp,
} from "./quick-business";
import { writeConfig } from "@/features/booking/demo-adapter";
import { schedulingConfig } from "@/features/booking/types";

const business = () =>
  setName(applyIndustry(initialState(), "maker"), "Moss Studio");
afterEach(() => vi.unstubAllGlobals());

describe("quick contact updates", () => {
  it("normalises entered details while preserving social links, identity and publication", () => {
    const before = business();
    before.content.contacts.social = [
      { platform: "instagram", url: "https://instagram.com/example" },
    ];
    const after = applyContacts(
      before,
      {
        ...contactDraft(before),
        phone: "+44 (7700) 900123",
        email: " hello@example.com ",
        website: "example.com",
      },
      contactStamp(before),
    ).state;
    expect(after.content.contacts).toMatchObject({
      phone: "+447700900123",
      email: "hello@example.com",
      website: "https://example.com",
      social: before.content.contacts.social,
    });
    expect(after.content.identity).toBe(before.content.identity);
    expect(after.published).toBe(before.published);
    expect(parseContent(after.content).success).toBe(true);
  });
  it.each([
    { phone: "call 07700900123" },
    { phone: "++447700900123" },
    { whatsapp: "123" },
    { email: "broken" },
    { website: "javascript:alert(1)" },
  ])("does not apply malformed public details %j", (patch) => {
    const before = business(),
      draft = { ...contactDraft(before), ...patch };
    expect(Object.keys(contactErrors(draft)).length).toBeGreaterThan(0);
    expect(applyContacts(before, draft, contactStamp(before)).state).toBe(
      before,
    );
  });
  it("protects another tab's changes, but allows an exact retry after a failed persistence write", () => {
    const before = business(),
      stamp = contactStamp(before);
    const first = { ...contactDraft(before), email: "one@example.com" };
    const after = applyContacts(before, first, stamp).state;
    expect(
      applyContacts(after, { ...first, email: "two@example.com" }, stamp),
    ).toMatchObject({ state: after, conflict: true });
    expect(applyContacts(after, first, stamp).conflict).toBeUndefined();
  });
});

describe("public opening hours", () => {
  it("never fills opening times with invented defaults", () => {
    const rows = hoursDraft(business());
    expect(rows).toHaveLength(7);
    expect(rows.every((day) => !day.open && !day.opens && !day.closes)).toBe(
      true,
    );
  });
  it("retains split hours and copies the owner's explicit periods to weekdays only", () => {
    const before = business();
    before.content.hours = [
      { day: "mon", opens: "09:00", closes: "12:00" },
      { day: "mon", opens: "13:00", closes: "17:00" },
      { day: "sat", opens: "10:00", closes: "14:00" },
    ];
    const rows = copyMonday(hoursDraft(before));
    expect(rows[1]).toMatchObject({
      open: true,
      opens: "09:00",
      closes: "12:00",
      additional: [{ opens: "13:00", closes: "17:00" }],
    });
    expect(rows[5]).toMatchObject({ opens: "10:00", closes: "14:00" });
    expect(rows[6]?.open).toBe(false);
    expect(rows[1]?.additional).not.toBe(rows[0]?.additional);
    const after = applyOpeningHours(
      before,
      rows,
      true,
      hoursStamp(before),
    ).state;
    expect(after.content.hours?.filter((h) => h.day === "mon")).toHaveLength(2);
    expect(hoursShown(after)).toBe(true);
    expect(parseContent(after.content).success).toBe(true);
    expect(after.content.booking).toBe(before.content.booking);
    expect(after.published).toBe(before.published);
  });
  it.each([
    { opens: "24:00", closes: "25:00" },
    { opens: "17:00", closes: "09:00" },
    { opens: "09:00", closes: "09:00" },
    { opens: "", closes: "17:00" },
  ])("requires valid ordered wall-clock times %j", (patch) => {
    const before = business(),
      rows = hoursDraft(before);
    rows[0] = { ...rows[0]!, open: true, ...patch };
    expect(hoursErrors(rows).mon).toBeTruthy();
    expect(
      applyOpeningHours(before, rows, true, hoursStamp(before)).state,
    ).toBe(before);
  });
  it("rejects overlapping periods and permits a real gap or adjacent periods", () => {
    const rows = hoursDraft(business());
    rows[0] = {
      ...rows[0]!,
      open: true,
      opens: "09:00",
      closes: "12:00",
      additional: [{ opens: "11:30", closes: "17:00" }],
    };
    expect(hoursErrors(rows).mon).toContain("overlap");
    rows[0].additional = [{ opens: "12:00", closes: "17:00" }];
    expect(hoursErrors(rows)).toEqual({});
  });
  it("does not overwrite another tab or duplicate a block when retrying", () => {
    const before = business(),
      stamp = hoursStamp(before),
      rows = hoursDraft(before);
    rows[0] = { ...rows[0]!, open: true, opens: "09:00", closes: "17:00" };
    const after = applyOpeningHours(before, rows, true, stamp).state;
    const replay = applyOpeningHours(after, rows, true, stamp);
    expect(replay.conflict).toBeUndefined();
    expect(
      replay.state.page.widgets.filter((w) => w.type === "hours"),
    ).toHaveLength(1);
    const different = rows.map((row) =>
      row.day === "mon" ? { ...row, closes: "18:00" } : row,
    );
    expect(applyOpeningHours(after, different, true, stamp).conflict).toBe(
      true,
    );
  });
  it("allows explicit closure without removing services or schedules", () => {
    const before = business();
    before.content.hours = [{ day: "mon", opens: "09:00", closes: "17:00" }];
    const rows = hoursDraft(before).map((row) => ({ ...row, open: false }));
    const after = applyOpeningHours(
      before,
      rows,
      false,
      hoursStamp(before),
    ).state;
    expect(after.content.hours?.every((day) => !day.opens && !day.closes)).toBe(
      true,
    );
    expect(hoursShown(after)).toBe(false);
    expect(after.content.services).toBe(before.content.services);
  });
});

describe("scheduling persistence acknowledgement", () => {
  it("reports a refused write instead of pretending a booking-hours snapshot was saved", () => {
    vi.stubGlobal("window", {
      localStorage: {
        setItem: () => {
          throw new Error("quota");
        },
      },
    });
    expect(writeConfig("moss", schedulingConfig.parse({}))).toBe(false);
  });
});
