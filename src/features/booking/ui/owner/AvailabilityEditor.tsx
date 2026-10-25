"use client";
import * as React from "react";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Overlay } from "@/components/taplo/overlay";
import { newId } from "../../demo-adapter";
import { formatDay } from "../../time";
import {
  weekdayEnum,
  schedulingConfig,
  type SchedulingConfig,
  type TimeWindow,
  type WeekdayKey,
} from "../../types";
import type { BookingContext } from "../../model";
import {
  dateError,
  hoursError,
  sortedHours,
  withBreak,
} from "./schedule-editing";
import "./scheduling-workspace.css";
const DAYS = weekdayEnum.options;
const NAME: Record<WeekdayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
const ZONES = [
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];
const input = "schedule-input";
const number = (v: string, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(Number(v) || 0)));
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="schedule-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Windows({
  value,
  onChange,
}: {
  value: TimeWindow[];
  onChange: (v: TimeWindow[]) => void;
}) {
  return (
    <div className="schedule-windows">
      <label className="schedule-toggle">
        <Switch
          aria-label="Unavailable all day"
          checked={!value.length}
          onCheckedChange={(off) =>
            onChange(off ? [] : [{ start: "09:00", end: "17:00" }])
          }
        />
        Unavailable all day
      </label>
      {value.map((w, i) => (
        <div key={i} className="schedule-window">
          <Field label={`From ${i + 1}`}>
            <input
              className={input}
              type="time"
              value={w.start}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, start: e.target.value } : x,
                  ),
                )
              }
            />
          </Field>
          <Field label={`Until ${i + 1}`}>
            <input
              className={input}
              type="time"
              value={w.end}
              onChange={(e) =>
                onChange(
                  value.map((x, j) =>
                    j === i ? { ...x, end: e.target.value } : x,
                  ),
                )
              }
            />
          </Field>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove period ${i + 1}`}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {value.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange([...value, { start: value.at(-1)!.end, end: "19:00" }])
            }
          >
            <Plus />
            Add period
          </Button>
        ) : null}
        {value.length === 1 && withBreak(value).length === 2 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(withBreak(value))}
          >
            Add a one-hour break
          </Button>
        ) : null}
      </div>
    </div>
  );
}
export function AvailabilityEditor({
  ctx,
  config,
  setConfig,
  online,
  setOnline,
  entitled,
  initialStaffId,
}: {
  ctx: BookingContext;
  config: SchedulingConfig;
  setConfig: (fn: (c: SchedulingConfig) => SchedulingConfig) => void;
  online: boolean;
  setOnline: (v: boolean) => void;
  entitled: boolean;
  initialStaffId?: string;
}) {
  const people = ctx.staff.length
    ? ctx.staff.map((p) => ({ id: p.id, name: p.name }))
    : [{ id: "", name: ctx.businessName }];
  const [selected, setSelected] = React.useState(
    initialStaffId ?? people[0]!.id,
  );
  const who = people.some((p) => p.id === selected) ? selected : people[0]!.id;
  const hours = config.staff.find((s) => s.staffId === who)?.hours ?? {};
  const [day, setDay] = React.useState<{
    day: WeekdayKey;
    windows: TimeWindow[];
    targets: WeekdayKey[];
    copy: boolean;
  } | null>(null);
  const [exception, setException] = React.useState<{
    id: string;
    date: string;
    who: string;
    windows: TimeWindow[];
  } | null>(null);
  const [serviceRule, setServiceRule] = React.useState<{
    id: string;
    before: string;
    after: string;
    capacity: number;
  } | null>(null);
  const [removedDate, setRemovedDate] = React.useState<
    SchedulingConfig["exceptions"][number] | null
  >(null);
  const [originals, setOriginals] = React.useState({
    day: "",
    exception: "",
    rules: "",
    service: "",
  });
  const [rules, setRules] = React.useState<SchedulingConfig["rules"] | null>(
    null,
  );
  const [error, setError] = React.useState("");
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  const focusBack = (e: Event) => {
    e.preventDefault();
    trigger.current?.focus();
  };
  const beginDay = (d: WeekdayKey, button: HTMLButtonElement) => {
    trigger.current = button;
    setError("");
    setOriginals((o) => ({
      ...o,
      day: JSON.stringify({ windows: hours[d] ?? [], targets: [d] }),
    }));
    setDay({
      day: d,
      windows: structuredClone(hours[d] ?? []),
      targets: [d],
      copy: false,
    });
  };
  const saveDay = () => {
    if (!day) return;
    const issue = hoursError(day.windows);
    if (issue) {
      setError(issue);
      return;
    }
    setConfig((c) => {
      const next = { ...(c.staff.find((s) => s.staffId === who)?.hours ?? {}) };
      for (const d of day.targets) next[d] = sortedHours(day.windows);
      return {
        ...c,
        staff: [
          ...c.staff.filter((s) => s.staffId !== who),
          { staffId: who, hours: next },
        ],
      };
    });
    setDay(null);
  };
  const saveException = () => {
    if (!exception) return;
    const issue = dateError(exception.date) || hoursError(exception.windows);
    if (issue) {
      setError(issue);
      return;
    }
    setConfig((c) => ({
      ...c,
      exceptions: [
        ...c.exceptions.filter(
          (x) =>
            x.id !== exception.id &&
            !(
              x.date === exception.date &&
              x.staffId === (exception.who === "all" ? null : exception.who)
            ),
        ),
        {
          id: exception.id,
          date: exception.date,
          staffId: exception.who === "all" ? null : exception.who,
          windows: sortedHours(exception.windows),
        },
      ],
    }));
    setException(null);
  };
  const beginException = (button: HTMLButtonElement, id?: string) => {
    trigger.current = button;
    setError("");
    const x = config.exceptions.find((e) => e.id === id);
    setOriginals((o) => ({
      ...o,
      exception: JSON.stringify({
        date: x?.date ?? "",
        who: x?.staffId ?? "all",
        windows: x?.windows ?? [],
      }),
    }));
    setException(
      x
        ? {
            id: x.id,
            date: x.date,
            who: x.staffId ?? "all",
            windows: structuredClone(x.windows),
          }
        : { id: newId("ex"), date: "", who: "all", windows: [] },
    );
  };
  const rule = <K extends keyof SchedulingConfig["rules"]>(
    key: K,
    value: SchedulingConfig["rules"][K],
  ) => setRules((r) => (r ? { ...r, [key]: value } : r));
  return (
    <div className="scheduling-workspace" data-testid="availability">
      <section className="schedule-status">
        <div>
          <h2>Online booking</h2>
          <p>
            {entitled
              ? "Let customers choose a time from your page."
              : "Prepare your calendar here. Online booking is included with Pro."}
          </p>
        </div>
        <Switch
          aria-label="Accept online bookings"
          checked={online}
          onCheckedChange={setOnline}
        />
      </section>
      <div className="schedule-context">
        {people.length > 1 ? (
          <Field label="Whose hours">
            <select
              className={input}
              value={who}
              onChange={(e) => setSelected(e.target.value)}
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <p>{people[0]?.name}</p>
        )}
        <Field label="Your time zone">
          <select
            className={input}
            value={config.timezone}
            onChange={(e) =>
              setConfig((c) => ({ ...c, timezone: e.target.value }))
            }
          >
            {[...new Set([...ZONES, config.timezone])].map((z) => (
              <option key={z} value={z}>
                {z.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <section className="schedule-section">
        <div className="schedule-section-title">
          <div>
            <h2>Weekly hours</h2>
            <p>Keep breaks between working periods.</p>
          </div>
        </div>
        <ul className="schedule-week">
          {DAYS.map((d) => (
            <li key={d} data-day={d}>
              <span>{NAME[d]}</span>
              <div>
                {hours[d]?.length ? (
                  hours[d]!.map((w, i) => (
                    <span key={i}>
                      {w.start}
                      <i aria-hidden="true">→</i>
                      {w.end}
                    </span>
                  ))
                ) : (
                  <span className="schedule-closed">Unavailable</span>
                )}
              </div>
              <button
                type="button"
                aria-label={`Edit ${NAME[d]} hours`}
                onClick={(e) => beginDay(d, e.currentTarget)}
              >
                <Pencil size={16} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      {removedDate ? (
        <div className="workspace-toast" role="status">
          <span>Date change removed.</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setConfig((c) => ({
                ...c,
                exceptions: [
                  ...c.exceptions.filter((x) => x.id !== removedDate.id),
                  removedDate,
                ],
              }));
              setRemovedDate(null);
            }}
          >
            Undo
          </Button>
        </div>
      ) : null}
      <section className="schedule-section">
        <div className="schedule-section-title">
          <div>
            <h2>Dates that are different</h2>
            <p>A day off or special hours replaces the normal week.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => beginException(e.currentTarget)}
          >
            <Plus />
            Add date
          </Button>
        </div>
        {config.exceptions.length ? (
          <ul className="schedule-exceptions">
            {[...config.exceptions]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((x) => (
                <li key={x.id}>
                  <div>
                    <strong>{formatDay(x.date)}</strong>
                    <p>
                      {x.staffId === null
                        ? "Everyone"
                        : (people.find((p) => p.id === x.staffId)?.name ??
                          "Team member")}{" "}
                      ·{" "}
                      {x.windows.length
                        ? x.windows
                            .map((w) => `${w.start} to ${w.end}`)
                            .join(", ")
                        : "Unavailable"}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Edit hours for ${x.date}`}
                    onClick={(e) => beginException(e.currentTarget, x.id)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove hours for ${x.date}`}
                    onClick={() => {
                      setRemovedDate(x);
                      setConfig((c) => ({
                        ...c,
                        exceptions: c.exceptions.filter((e) => e.id !== x.id),
                      }));
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="schedule-empty">
            No date changes. Your weekly hours apply.
          </p>
        )}
      </section>
      <button
        type="button"
        className="schedule-rules-row"
        onClick={(e) => {
          trigger.current = e.currentTarget;
          setOriginals((o) => ({ ...o, rules: JSON.stringify(config.rules) }));
          setRules(structuredClone(config.rules));
          setError("");
        }}
      >
        <div>
          <h2>Booking rules</h2>
          <p>
            {config.rules.minNoticeMinutes / 60}h notice ·{" "}
            {config.rules.bufferAfterMinutes} min after each booking · up to{" "}
            {config.rules.maxAdvanceDays} days ahead
          </p>
        </div>
        <Pencil size={17} aria-hidden="true" />
      </button>
      {ctx.services.some((x) => x.durationMinutes) ? (
        <details className="schedule-service-rules">
          <summary>Rules for a specific service</summary>
          <ul>
            {ctx.services
              .filter((x) => x.durationMinutes)
              .map((svc) => {
                const current = config.serviceOverrides.find(
                  (x) => x.serviceId === svc.id,
                );
                return (
                  <li key={svc.id}>
                    <div>
                      <strong>{svc.name}</strong>
                      <p>
                        {svc.durationMinutes} min
                        {current
                          ? " · Custom rules"
                          : " · Uses your booking rules"}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Edit rules for ${svc.name}`}
                      onClick={(e) => {
                        trigger.current = e.currentTarget;
                        setError("");
                        setOriginals((o) => ({
                          ...o,
                          service: JSON.stringify({
                            id: svc.id,
                            before:
                              current?.bufferBeforeMinutes?.toString() ?? "",
                            after:
                              current?.bufferAfterMinutes?.toString() ?? "",
                            capacity: current?.capacity ?? 1,
                          }),
                        }));
                        setServiceRule({
                          id: svc.id,
                          before:
                            current?.bufferBeforeMinutes?.toString() ?? "",
                          after: current?.bufferAfterMinutes?.toString() ?? "",
                          capacity: current?.capacity ?? 1,
                        });
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                  </li>
                );
              })}
          </ul>
        </details>
      ) : null}
      <Overlay
        open={serviceRule !== null}
        dirty={Boolean(
          serviceRule && JSON.stringify(serviceRule) !== originals.service,
        )}
        onOpenChange={(open) => !open && setServiceRule(null)}
        title="Service booking rules"
        testId="service-rules-editor"
        onCloseAutoFocus={focusBack}
        footer={
          <Button
            className="w-full"
            onClick={() => {
              if (!serviceRule) return;
              setConfig((c) => ({
                ...c,
                serviceOverrides: [
                  ...c.serviceOverrides.filter(
                    (x) => x.serviceId !== serviceRule.id,
                  ),
                  {
                    serviceId: serviceRule.id,
                    bufferBeforeMinutes:
                      serviceRule.before === ""
                        ? undefined
                        : number(serviceRule.before, 0, 240),
                    bufferAfterMinutes:
                      serviceRule.after === ""
                        ? undefined
                        : number(serviceRule.after, 0, 240),
                    capacity: serviceRule.capacity,
                  },
                ],
              }));
              setServiceRule(null);
            }}
          >
            Save service rules
          </Button>
        }
      >
        {serviceRule ? (
          <div className="grid gap-4">
            <p className="font-medium">
              {ctx.services.find((x) => x.id === serviceRule.id)?.name}
            </p>
            <Field label="Buffer before (minutes)">
              <input
                className={input}
                type="number"
                min={0}
                max={240}
                placeholder={String(config.rules.bufferBeforeMinutes)}
                value={serviceRule.before}
                onChange={(e) =>
                  setServiceRule({ ...serviceRule, before: e.target.value })
                }
              />
            </Field>
            <Field label="Buffer after (minutes)">
              <input
                className={input}
                type="number"
                min={0}
                max={240}
                placeholder={String(config.rules.bufferAfterMinutes)}
                value={serviceRule.after}
                onChange={(e) =>
                  setServiceRule({ ...serviceRule, after: e.target.value })
                }
              />
            </Field>
            <Field label="People per time">
              <input
                className={input}
                type="number"
                min={1}
                max={200}
                value={serviceRule.capacity}
                onChange={(e) =>
                  setServiceRule({
                    ...serviceRule,
                    capacity: number(e.target.value, 1, 200),
                  })
                }
              />
            </Field>
            <Button
              variant="outline"
              onClick={() => {
                setConfig((c) => ({
                  ...c,
                  serviceOverrides: c.serviceOverrides.filter(
                    (x) => x.serviceId !== serviceRule.id,
                  ),
                }));
                setServiceRule(null);
              }}
            >
              Use default rules
            </Button>
          </div>
        ) : null}
      </Overlay>
      <Overlay
        open={day !== null}
        onOpenChange={(open) => !open && setDay(null)}
        dirty={Boolean(
          day &&
          JSON.stringify({ windows: day.windows, targets: day.targets }) !==
            originals.day,
        )}
        title={day ? `${NAME[day.day]} hours` : "Working hours"}
        onCloseAutoFocus={focusBack}
        testId="working-hours-editor"
        footer={
          <Button className="w-full" onClick={saveDay}>
            Save hours
          </Button>
        }
      >
        {day ? (
          <div className="grid gap-5">
            <p className="text-sm text-muted-foreground">
              {people.find((p) => p.id === who)?.name}
            </p>
            <Windows
              value={day.windows}
              onChange={(windows) => {
                setError("");
                setDay({ ...day, windows });
              }}
            />
            <button
              type="button"
              className="schedule-copy"
              aria-expanded={day.copy}
              onClick={() => setDay({ ...day, copy: !day.copy })}
            >
              <Copy size={16} />
              Also apply these hours to…
            </button>
            {day.copy ? (
              <fieldset className="schedule-copy-days">
                <legend className="sr-only">Copy hours to days</legend>
                {DAYS.map((d) => (
                  <label key={d}>
                    <Checkbox
                      checked={day.targets.includes(d)}
                      disabled={d === day.day}
                      onCheckedChange={(on) =>
                        setDay({
                          ...day,
                          targets: on
                            ? [...day.targets, d]
                            : day.targets.filter((x) => x !== d),
                        })
                      }
                    />
                    {NAME[d]}
                  </label>
                ))}
              </fieldset>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </Overlay>
      <Overlay
        open={exception !== null}
        onOpenChange={(open) => !open && setException(null)}
        dirty={Boolean(
          exception &&
          JSON.stringify({
            date: exception.date,
            who: exception.who,
            windows: exception.windows,
          }) !== originals.exception,
        )}
        title="Special date"
        onCloseAutoFocus={focusBack}
        testId="date-hours-editor"
        footer={
          <Button className="w-full" onClick={saveException}>
            Save date
          </Button>
        }
      >
        {exception ? (
          <div className="grid gap-5">
            <Field label="Date">
              <input
                className={input}
                type="date"
                value={exception.date}
                onChange={(e) =>
                  setException({ ...exception, date: e.target.value })
                }
              />
            </Field>
            <Field label="Who">
              <select
                className={input}
                value={exception.who}
                onChange={(e) =>
                  setException({ ...exception, who: e.target.value })
                }
              >
                <option value="all">Everyone</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Windows
              value={exception.windows}
              onChange={(windows) => setException({ ...exception, windows })}
            />
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </Overlay>
      <Overlay
        open={rules !== null}
        onOpenChange={(open) => !open && setRules(null)}
        dirty={Boolean(rules && JSON.stringify(rules) !== originals.rules)}
        title="Booking rules"
        kind="detail"
        onCloseAutoFocus={focusBack}
        testId="booking-rules-editor"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              if (!rules) return;
              if (!schedulingConfig.safeParse({ ...config, rules }).success) {
                setError("Check the booking limits and try again.");
                return;
              }
              setConfig((c) => ({ ...c, rules }));
              setRules(null);
            }}
          >
            Save booking rules
          </Button>
        }
      >
        {rules ? (
          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Minimum notice (hours)">
                <input
                  type="number"
                  className={input}
                  min={0}
                  max={720}
                  value={rules.minNoticeMinutes / 60}
                  onChange={(e) =>
                    rule(
                      "minNoticeMinutes",
                      number(e.target.value, 0, 720) * 60,
                    )
                  }
                />
              </Field>
              <Field label="Days ahead">
                <input
                  type="number"
                  className={input}
                  min={1}
                  max={730}
                  value={rules.maxAdvanceDays}
                  onChange={(e) =>
                    rule("maxAdvanceDays", number(e.target.value, 1, 730))
                  }
                />
              </Field>
              <Field label="Buffer before (minutes)">
                <input
                  type="number"
                  className={input}
                  min={0}
                  max={240}
                  value={rules.bufferBeforeMinutes}
                  onChange={(e) =>
                    rule("bufferBeforeMinutes", number(e.target.value, 0, 240))
                  }
                />
              </Field>
              <Field label="Buffer after (minutes)">
                <input
                  type="number"
                  className={input}
                  min={0}
                  max={240}
                  value={rules.bufferAfterMinutes}
                  onChange={(e) =>
                    rule("bufferAfterMinutes", number(e.target.value, 0, 240))
                  }
                />
              </Field>
            </div>
            <details>
              <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">
                More booking rules
              </summary>
              <div className="grid gap-4 pt-4">
                <Field label="Start times every (minutes)">
                  <select
                    className={input}
                    value={rules.slotIntervalMinutes}
                    onChange={(e) =>
                      rule("slotIntervalMinutes", Number(e.target.value))
                    }
                  >
                    {[10, 15, 20, 30, 45, 60].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Hold a chosen time (minutes)">
                  <input
                    type="number"
                    className={input}
                    min={1}
                    max={60}
                    value={rules.holdMinutes}
                    onChange={(e) =>
                      rule("holdMinutes", number(e.target.value, 1, 60))
                    }
                  />
                </Field>
                <Field label="Time to answer requests (hours)">
                  <input
                    type="number"
                    className={input}
                    min={1}
                    max={336}
                    value={rules.pendingExpiryHours}
                    onChange={(e) =>
                      rule("pendingExpiryHours", number(e.target.value, 1, 336))
                    }
                  />
                </Field>
                <Field label="Customers can cancel until (hours before)">
                  <input
                    type="number"
                    className={input}
                    min={0}
                    max={720}
                    value={rules.cancelUntilHours}
                    onChange={(e) =>
                      rule("cancelUntilHours", number(e.target.value, 0, 720))
                    }
                  />
                </Field>
                <Field label="Customers can reschedule until (hours before)">
                  <input
                    type="number"
                    className={input}
                    min={0}
                    max={720}
                    value={rules.rescheduleUntilHours}
                    onChange={(e) =>
                      rule(
                        "rescheduleUntilHours",
                        number(e.target.value, 0, 720),
                      )
                    }
                  />
                </Field>
              </div>
            </details>
            <Field label="Cancellation wording (optional)">
              <textarea
                rows={3}
                className={input}
                maxLength={300}
                value={rules.cancellationNote ?? ""}
                onChange={(e) =>
                  rule("cancellationNote", e.target.value || undefined)
                }
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </Overlay>
    </div>
  );
}
