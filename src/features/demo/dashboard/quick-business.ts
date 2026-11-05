import { z } from "zod";
import { normalizePhone, safeUrl } from "@/lib/validation";
import { newWidget } from "@/features/page/starter";
import type { DemoState } from "../store";

export type ContactDraft = {
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
};
export const contactDraft = (state: DemoState): ContactDraft => ({
  phone: state.content.contacts.phone ?? "",
  whatsapp: state.content.contacts.whatsapp ?? "",
  email: state.content.contacts.email ?? "",
  website: state.content.contacts.website ?? "",
});
export const contactStamp = (state: DemoState) =>
  JSON.stringify(contactDraft(state));

export function contactErrors(input: ContactDraft) {
  const errors: Partial<Record<keyof ContactDraft, string>> = {};
  for (const key of ["phone", "whatsapp"] as const)
    if (
      input[key].trim() &&
      (!/^\+?[\d\s().-]+$/.test(input[key]) || !normalizePhone(input[key]))
    )
      errors[key] =
        "Enter a phone number, including the country code where needed.";
  if (
    input.email.trim() &&
    !z.email().max(254).safeParse(input.email.trim()).success
  )
    errors.email = "Enter an email address like hello@example.com.";
  if (
    input.website.trim() &&
    !safeUrl.safeParse(websiteValue(input.website)).success
  )
    errors.website = "Use a website address starting with https://.";
  return errors;
}
function websiteValue(value: string) {
  const v = value.trim();
  return /^[a-z][a-z\d+.-]*:/i.test(v) ? v : `https://${v}`;
}
const normalContacts = (input: ContactDraft) => ({
  phone: input.phone.trim() ? normalizePhone(input.phone)! : "",
  whatsapp: input.whatsapp.trim() ? normalizePhone(input.whatsapp)! : "",
  email: input.email.trim(),
  website: input.website.trim() ? websiteValue(input.website) : "",
});
export function applyContacts(
  state: DemoState,
  input: ContactDraft,
  expected: string,
): { state: DemoState; conflict?: true } {
  if (Object.keys(contactErrors(input)).length) return { state };
  const value = normalContacts(input);
  if (
    contactStamp(state) !== expected &&
    contactStamp(state) !== JSON.stringify(value)
  )
    return { state, conflict: true };
  return {
    state: {
      ...state,
      content: {
        ...state.content,
        contacts: {
          ...state.content.contacts,
          phone: value.phone || undefined,
          whatsapp: value.whatsapp || undefined,
          email: value.email || undefined,
          website: value.website || undefined,
        },
      },
    },
  };
}

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const DAY_LABEL = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
export type HoursDay = {
  day: (typeof DAYS)[number];
  open: boolean;
  opens: string;
  closes: string;
  additional?: { opens: string; closes: string }[];
};
export const hoursDraft = (state: DemoState): HoursDay[] =>
  DAYS.map((day) => {
    const entries = (state.content.hours ?? []).filter(
      (h) => h.day === day && (h.opens || h.closes),
    );
    const row = entries[0];
    return {
      day,
      open: Boolean(row?.opens || row?.closes),
      opens: row?.opens ?? "",
      closes: row?.closes ?? "",
      additional: entries
        .slice(1)
        .map((h) => ({ opens: h.opens ?? "", closes: h.closes ?? "" })),
    };
  });
export const hoursShown = (state: DemoState) =>
  state.page.widgets.some((w) => w.type === "hours" && !w.hidden);
export const hoursStamp = (state: DemoState) =>
  JSON.stringify({ hours: state.content.hours, shown: hoursShown(state) });
export function hoursErrors(rows: HoursDay[]) {
  const errors: Partial<Record<(typeof DAYS)[number], string>> = {};
  for (const row of rows)
    if (row.open) {
      const windows = [
        { opens: row.opens, closes: row.closes },
        ...(row.additional ?? []),
      ];
      for (const window of windows) {
        if (
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(window.opens) ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(window.closes)
        ) {
          errors[row.day] =
            "Add a valid opening and closing time for each period.";
          break;
        }
        if (window.opens >= window.closes) {
          errors[row.day] = "Closing time must be later than opening time.";
          break;
        }
      }
      if (!errors[row.day]) {
        const sorted = [...windows].sort((a, b) =>
          a.opens.localeCompare(b.opens),
        );
        if (sorted.some((w, i) => i > 0 && sorted[i - 1]!.closes > w.opens))
          errors[row.day] = "Opening periods must not overlap.";
      }
    }
  return errors;
}
export function copyMonday(rows: HoursDay[]) {
  const monday = rows.find((row) => row.day === "mon");
  if (!monday?.open || hoursErrors([monday]).mon) return rows;
  return rows.map((row) =>
    ["tue", "wed", "thu", "fri"].includes(row.day)
      ? {
          ...row,
          open: true,
          opens: monday.opens,
          closes: monday.closes,
          additional: monday.additional?.map((w) => ({ ...w })),
        }
      : row,
  );
}
export function applyOpeningHours(
  state: DemoState,
  rows: HoursDay[],
  shown: boolean,
  expected: string,
): { state: DemoState; conflict?: true } {
  if (
    rows.length !== 7 ||
    new Set(rows.map((r) => r.day)).size !== 7 ||
    rows.some((row) => !DAYS.includes(row.day)) ||
    Object.keys(hoursErrors(rows)).length
  )
    return { state };
  const hours = rows.flatMap((row) =>
    row.open
      ? [{ opens: row.opens, closes: row.closes }, ...(row.additional ?? [])]
          .sort((a, b) => a.opens.localeCompare(b.opens))
          .map((w) => ({ day: row.day, ...w }))
      : [{ day: row.day }],
  );
  const desired = JSON.stringify({ hours, shown });
  if (hoursStamp(state) !== expected && hoursStamp(state) !== desired)
    return { state, conflict: true };
  const exists = state.page.widgets.some((w) => w.type === "hours");
  const widgets = exists
    ? state.page.widgets.map((w) =>
        w.type === "hours" ? { ...w, hidden: !shown } : w,
      )
    : shown
      ? [...state.page.widgets, newWidget("hours")]
      : state.page.widgets;
  return {
    state: {
      ...state,
      content: { ...state.content, hours },
      page: { ...state.page, widgets },
    },
  };
}
