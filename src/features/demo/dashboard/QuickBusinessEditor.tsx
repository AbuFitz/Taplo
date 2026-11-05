"use client";

import * as React from "react";
import Link from "next/link";
import { Overlay } from "@/components/taplo/overlay";
import { TaploInput } from "@/components/taplo/taplo-input";
import { Button } from "@/components/ui/button";
import { useOwner } from "@/features/booking/ui/owner/useOwner";
import { readConfig, writeConfig } from "@/features/booking/demo-adapter";
import { storageHasFailed, useDemo, type DemoState } from "../store";
import {
  applyContacts,
  applyOpeningHours,
  contactDraft,
  contactErrors,
  contactStamp,
  copyMonday,
  DAY_LABEL,
  hoursDraft,
  hoursErrors,
  hoursShown,
  hoursStamp,
  type ContactDraft,
  type HoursDay,
} from "./quick-business";

import "./quick-business.css";

export type BusinessEdit = "contact" | "hours";
export function QuickBusinessEditor({
  mode,
  initial,
  onClose,
  onSaved,
  restoreFocus,
}: {
  mode: BusinessEdit;
  initial: DemoState;
  onClose: () => void;
  onSaved: (mode: BusinessEdit) => void;
  restoreFocus?: () => boolean;
}) {
  const { state, update } = useDemo();
  const owner = useOwner();
  const [contacts, setContacts] = React.useState(() => contactDraft(initial));
  const [hours, setHours] = React.useState(() => hoursDraft(initial));
  const [shown, setShown] = React.useState(() => hoursShown(initial));
  const [baseline, setBaseline] = React.useState(() =>
    mode === "contact" ? contactStamp(initial) : hoursStamp(initial),
  );
  const [original, setOriginal] = React.useState(() =>
    JSON.stringify(
      mode === "contact"
        ? contactDraft(initial)
        : { rows: hoursDraft(initial), shown: hoursShown(initial) },
    ),
  );
  const [business] = React.useState(initial.content.identity.slug);
  const [contactIssues, setContactIssues] = React.useState<
    ReturnType<typeof contactErrors>
  >({});
  const [hourIssues, setHourIssues] = React.useState<
    ReturnType<typeof hoursErrors>
  >({});
  const [problem, setProblem] = React.useState("");
  const [conflict, setConflict] = React.useState(false);
  const form = React.useRef<HTMLFormElement>(null);
  const dirty =
    JSON.stringify(mode === "contact" ? contacts : { rows: hours, shown }) !==
    original;
  const formId = React.useId();
  function reload() {
    if (!state || state.content.identity.slug !== business) return;
    setContacts(contactDraft(state));
    setHours(hoursDraft(state));
    setShown(hoursShown(state));
    setBaseline(mode === "contact" ? contactStamp(state) : hoursStamp(state));
    setOriginal(
      JSON.stringify(
        mode === "contact"
          ? contactDraft(state)
          : { rows: hoursDraft(state), shown: hoursShown(state) },
      ),
    );
    setConflict(false);
    setProblem("");
    setContactIssues({});
    setHourIssues({});
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    const invalid =
      mode === "contact" ? contactErrors(contacts) : hoursErrors(hours);
    setContactIssues(mode === "contact" ? contactErrors(contacts) : {});
    setHourIssues(mode === "hours" ? hoursErrors(hours) : {});
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    let changedElsewhere = false,
      hoursNotSaved = false;
    update((current) => {
      if (current.content.identity.slug !== business) {
        changedElsewhere = true;
        return current;
      }
      const result =
        mode === "contact"
          ? applyContacts(current, contacts, baseline)
          : applyOpeningHours(current, hours, shown, baseline);
      if (result.conflict) {
        changedElsewhere = true;
        return current;
      }
      if (mode === "hours") {
        // Legacy booking fallback derives from opening hours. Freeze its CURRENT pattern first,
        // so editing public opening hours cannot silently open or close appointment slots.
        const schedule = readConfig(business) ?? owner.ctx?.config;
        if (!schedule || !writeConfig(business, schedule)) {
          hoursNotSaved = true;
          return current;
        }
      }
      return result.state;
    });
    if (changedElsewhere) {
      setConflict(true);
      setProblem(
        "These details changed elsewhere. Your entry is still here. Load the latest details before saving.",
      );
      return;
    }
    if (hoursNotSaved || storageHasFailed()) {
      setProblem(
        "We couldn’t save your changes. Your details are still here. Please try again before leaving.",
      );
      return;
    }
    onSaved(mode);
    onClose();
  }
  function editContact(key: keyof ContactDraft, value: string) {
    setContacts((c) => ({ ...c, [key]: value }));
    setContactIssues((e) => ({ ...e, [key]: undefined }));
  }
  function editHour(day: HoursDay["day"], patch: Partial<HoursDay>) {
    setHours((rows) =>
      rows.map((row) => (row.day === day ? { ...row, ...patch } : row)),
    );
    setHourIssues((e) => ({ ...e, [day]: undefined }));
  }
  return (
    <Overlay
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      dirty={dirty}
      title={
        mode === "contact"
          ? "How can customers reach you?"
          : "Your opening hours"
      }
      description={
        mode === "contact"
          ? "Choose the details you want customers to see on your page."
          : "Public opening times. Your appointment availability stays separate."
      }
      onCloseAutoFocus={(event) => {
        if (restoreFocus?.()) event.preventDefault();
      }}
      className="studio-quick-dialog"
      testId="quick-business-editor"
      footer={
        <div className="studio-quick-footer">
          <Button type="submit" form={formId}>
            Save {mode === "contact" ? "contact details" : "opening hours"}
          </Button>
          <Link
            href={
              mode === "contact"
                ? "/dashboard/profile"
                : "/dashboard/bookings?section=availability"
            }
          >
            {mode === "contact"
              ? "Full business settings"
              : "Booking availability"}
          </Link>
        </div>
      }
    >
      <form
        id={formId}
        ref={form}
        onSubmit={save}
        noValidate
        className="studio-quick-form"
      >
        {mode === "contact" ? (
          <>
            <TaploInput
              label="Email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={contacts.email}
              error={contactIssues.email}
              onChange={(e) => editContact("email", e.target.value)}
            />
            <TaploInput
              label="Phone"
              type="tel"
              autoComplete="tel"
              maxLength={32}
              value={contacts.phone}
              error={contactIssues.phone}
              onChange={(e) => editContact("phone", e.target.value)}
            />
            <TaploInput
              label="WhatsApp"
              type="tel"
              maxLength={32}
              hint="Include the country code, for example +44."
              value={contacts.whatsapp}
              error={contactIssues.whatsapp}
              onChange={(e) => editContact("whatsapp", e.target.value)}
            />
            <TaploInput
              label="Website"
              inputMode="url"
              autoComplete="url"
              maxLength={2048}
              placeholder="yourbusiness.com"
              value={contacts.website}
              error={contactIssues.website}
              onChange={(e) => editContact("website", e.target.value)}
            />
            <p className="studio-quick-hint">
              Keep the website you already use. Taplo gives customers another
              easy way to reach you.
            </p>
          </>
        ) : (
          <>
            <div className="studio-hours-intro">
              <span>{initial.content.location.timezone}</span>
              <button
                type="button"
                onClick={() => setHours(copyMonday(hours))}
                disabled={
                  !hours[0]?.open || Boolean(hoursErrors([hours[0]!]).mon)
                }
              >
                Copy Monday to weekdays
              </button>
            </div>
            <div className="studio-hours-list">
              {hours.map((row) => (
                <fieldset key={row.day} className="studio-hours-day">
                  <legend className="sr-only">{DAY_LABEL[row.day]}</legend>
                  <label className="studio-hours-toggle">
                    <input
                      type="checkbox"
                      checked={row.open}
                      onChange={(e) =>
                        editHour(row.day, { open: e.target.checked })
                      }
                      aria-label={`${DAY_LABEL[row.day]} open`}
                    />
                    <span>{DAY_LABEL[row.day]}</span>
                    <small>{row.open ? "Open" : "Closed"}</small>
                  </label>
                  {row.open ? (
                    <div className="studio-hours-times">
                      <TaploInput
                        label={`${DAY_LABEL[row.day]} opens`}
                        type="time"
                        value={row.opens}
                        error={hourIssues[row.day]}
                        onChange={(e) =>
                          editHour(row.day, { opens: e.target.value })
                        }
                      />
                      <span aria-hidden="true">—</span>
                      <TaploInput
                        label={`${DAY_LABEL[row.day]} closes`}
                        type="time"
                        value={row.closes}
                        aria-invalid={Boolean(hourIssues[row.day])}
                        onChange={(e) =>
                          editHour(row.day, { closes: e.target.value })
                        }
                      />
                    </div>
                  ) : null}
                  {row.open ? (
                    <>
                      {(row.additional ?? []).map((period, index) => (
                        <div key={index} className="studio-hours-extra">
                          <div className="studio-hours-times">
                            <TaploInput
                              label={`${DAY_LABEL[row.day]} period ${index + 2} opens`}
                              type="time"
                              value={period.opens}
                              aria-invalid={Boolean(hourIssues[row.day])}
                              onChange={(e) =>
                                editHour(row.day, {
                                  additional: row.additional!.map((w, i) =>
                                    i === index
                                      ? { ...w, opens: e.target.value }
                                      : w,
                                  ),
                                })
                              }
                            />
                            <span aria-hidden="true">—</span>
                            <TaploInput
                              label={`${DAY_LABEL[row.day]} period ${index + 2} closes`}
                              type="time"
                              value={period.closes}
                              aria-invalid={Boolean(hourIssues[row.day])}
                              onChange={(e) =>
                                editHour(row.day, {
                                  additional: row.additional!.map((w, i) =>
                                    i === index
                                      ? { ...w, closes: e.target.value }
                                      : w,
                                  ),
                                })
                              }
                            />
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${DAY_LABEL[row.day]} period ${index + 2}`}
                            onClick={() =>
                              editHour(row.day, {
                                additional: row.additional!.filter(
                                  (_, i) => i !== index,
                                ),
                              })
                            }
                          >
                            Remove period
                          </button>
                        </div>
                      ))}
                      <button
                        className="studio-hours-add"
                        type="button"
                        aria-label={`Add ${DAY_LABEL[row.day]} opening period`}
                        onClick={() =>
                          editHour(row.day, {
                            additional: [
                              ...(row.additional ?? []),
                              { opens: "", closes: "" },
                            ],
                          })
                        }
                      >
                        Add another opening period
                      </button>
                    </>
                  ) : null}
                </fieldset>
              ))}
            </div>
            <label className="studio-hours-display">
              <input
                type="checkbox"
                checked={shown}
                onChange={(e) => setShown(e.target.checked)}
              />
              <span>
                Show these hours on my page
                <small>
                  You can change their position and appearance in the page
                  editor.
                </small>
              </span>
            </label>
            <p className="studio-quick-hint">
              Team working hours, breaks and appointment rules are managed in
              Booking availability.
            </p>
          </>
        )}
        {problem ? (
          <div role="alert" className="studio-quick-error">
            <p>{problem}</p>
            {conflict && state?.content.identity.slug === business ? (
              <button type="button" onClick={reload}>
                Load latest details
              </button>
            ) : null}
          </div>
        ) : null}
      </form>
    </Overlay>
  );
}
