import { hhmm, type TimeWindow } from "../../types";
export function hoursError(windows: TimeWindow[]) {
  if (
    windows.some(
      (w) => !hhmm.safeParse(w.start).success || !hhmm.safeParse(w.end).success,
    )
  )
    return "Choose a start and end time for every period.";
  if (windows.some((w) => w.start >= w.end))
    return "Each period must end after it starts.";
  const ordered = [...windows].sort((a, b) => a.start.localeCompare(b.start));
  if (ordered.some((w, i) => i > 0 && w.start < ordered[i - 1]!.end))
    return "These periods overlap. Leave a gap for a break.";
  return null;
}
export function sortedHours(windows: TimeWindow[]) {
  return [...windows]
    .map((w) => ({ ...w }))
    .sort((a, b) => a.start.localeCompare(b.start));
}
export function dateError(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Choose a date.";
  const d = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date
    ? "Choose a valid date."
    : null;
}
export function withBreak(windows: TimeWindow[]): TimeWindow[] {
  if (windows.length !== 1) return windows;
  const w = windows[0]!;
  const minute = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const start = minute(w.start),
    end = minute(w.end);
  if (end - start < 120) return windows;
  const mid = Math.floor((start + end - 60) / 2 / 15) * 15;
  const clock = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return [
    { start: w.start, end: clock(mid) },
    { start: clock(mid + 60), end: w.end },
  ];
}
