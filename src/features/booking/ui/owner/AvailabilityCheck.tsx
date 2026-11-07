import { useEffect, useState } from "react";
import Link from "next/link";
import {
  customerAvailabilityDays,
  getAvailability,
  type DayAvailability,
  type SlotConstraint,
} from "../../availability";
import { nowMs } from "../../clock";
import type { BookingState } from "../../engine";
import {
  eligibleStaff,
  isOnlineBookable,
  type BookingContext,
} from "../../model";
import { daysBetween, formatClock, localParts } from "../../time";
import { dateError } from "./schedule-editing";

const explanations: Record<SlotConstraint, string> = {
  unassigned:
    "No bookable team member offers this service. Check service assignments in Team.",
  duration: "The service is longer than the working periods on this date.",
  notice: "Some times have passed or are inside your minimum notice period.",
  blocked: "Blocked time on the calendar removes these times.",
  booked: "Existing appointments or their buffers take up these times.",
  held: "Customers are temporarily holding these times while they book.",
};

function reasons(day: DayAvailability) {
  if (day.reason === "past") return ["This date has already passed."];
  if (day.reason === "too_far")
    return ["This date is beyond your advance booking limit."];
  if (day.constraints?.length)
    return day.constraints.map((key) => explanations[key]);
  return [
    "There are no working hours for the selected team on this date. Check weekly hours and date changes.",
  ];
}

export function AvailabilityCheck({
  context,
  state,
  online,
  entitled,
}: {
  context: BookingContext;
  state: BookingState;
  online: boolean;
  entitled: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);
  const open = now !== null;
  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setNow(nowMs()), 15_000);
    return () => window.clearInterval(timer);
  }, [open]);
  const [serviceId, setServiceId] = useState("");
  const [personId, setPersonId] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>();
  const services = context.services.filter(isOnlineBookable);
  const service = services.find((item) => item.id === serviceId) ?? services[0];
  const eligible = service ? eligibleStaff(context, service) : [];
  const people = context.staff.filter((person) => eligible.includes(person.id));
  const person = people.find((item) => item.id === personId);
  const zone = context.config.timezone;
  const date = selectedDate ?? (now === null ? "" : localParts(now, zone).date);
  const outsideCalendar =
    now !== null &&
    daysBetween(localParts(now, zone).date, date) >=
      customerAvailabilityDays(context.config);
  const day =
    open &&
    entitled &&
    !outsideCalendar &&
    now !== null &&
    service?.durationMinutes &&
    !dateError(date)
      ? getAvailability({
          now,
          config: context.config,
          service: { id: service.id, durationMinutes: service.durationMinutes },
          eligible,
          staffPreference: person?.id,
          bookings: state.bookings,
          holds: state.holds,
          fromDate: date,
          days: 1,
        })[0]
      : undefined;

  return (
    <details
      className="schedule-check"
      onToggle={(event) => setNow(event.currentTarget.open ? nowMs() : null)}
    >
      <summary>Check customer availability</summary>
      {open && (
        <div className="schedule-check-body">
          <p>
            See which times your current working hours and booking rules allow.
          </p>
          {!entitled ? (
            <p>Online booking is unavailable on your current plan.</p>
          ) : !service ? (
            <p>
              <Link href="/dashboard/services">Set up a bookable service</Link>{" "}
              to check its times.
            </p>
          ) : (
            <>
              {!online && (
                <p>
                  Online booking is off. These times are a preview of your
                  setup.
                </p>
              )}
              <div className="schedule-check-fields">
                <label className="schedule-field">
                  <span>Service to check</span>
                  <select
                    className="schedule-input"
                    value={service.id}
                    onChange={(event) => {
                      setServiceId(event.target.value);
                      setPersonId("");
                    }}
                  >
                    {services.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                {people.length > 0 && (
                  <label className="schedule-field">
                    <span>Team member</span>
                    <select
                      className="schedule-input"
                      value={person?.id ?? ""}
                      onChange={(event) => setPersonId(event.target.value)}
                    >
                      <option value="">Anyone available</option>
                      {people.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="schedule-field">
                  <span>Date to check</span>
                  <input
                    className="schedule-input"
                    type="date"
                    value={date}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </label>
              </div>
              <p role="status">
                {day
                  ? day.slots.length
                    ? `${day.slots.length} available ${day.slots.length === 1 ? "time" : "times"} · ${zone.replaceAll("_", " ")}`
                    : "No times available."
                  : outsideCalendar
                    ? "This date is beyond your online booking window."
                    : "Choose a valid date."}
              </p>
              {day?.slots.length ? (
                <ul
                  className="schedule-check-times"
                  aria-label="Available times"
                >
                  {day.slots.map((slot) => (
                    <li key={slot.startsAt}>
                      <time dateTime={new Date(slot.startsAt).toISOString()}>
                        {formatClock(slot.startsAt, zone)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : day ? (
                <ul
                  className="schedule-check-reasons"
                  aria-label="Why times are unavailable"
                >
                  {reasons(day).map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      )}
    </details>
  );
}
