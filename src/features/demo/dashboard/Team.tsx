"use client";
import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/taplo/overlay";
import {
  blankFor,
  commitRecord,
  RecordForm,
  validate,
} from "@/features/page/editor/RecordForms";
import {
  staffSchema,
  type BusinessContentInput,
} from "@/features/businesses/content";
import { useDraft } from "../hooks";
import { PageHeader } from "./Panel";

type Person = NonNullable<BusinessContentInput["staff"]>[number];
export function Team() {
  const { c, ent, setContent } = useDraft();
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<{
    draft: Person;
    before: string;
    isNew: boolean;
  } | null>(null);
  const [showErrors, setShowErrors] = React.useState(false);
  const [removing, setRemoving] = React.useState<Person | null>(null);
  const [removed, setRemoved] = React.useState<Person | null>(null);
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  if (!c || !ent) return null;
  const staff = c.staff ?? [];
  const filtered = staff.filter((p) =>
    `${p.name} ${p.role ?? ""} ${(p.subjects ?? []).join(" ")}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const edit = (draft: Person, isNew: boolean, button: HTMLButtonElement) => {
    trigger.current = button;
    setShowErrors(false);
    setEditing({
      draft: structuredClone(draft),
      before: JSON.stringify(draft),
      isNew,
    });
  };
  const save = () => {
    if (!editing) return;
    if (Object.keys(validate("staff", editing.draft)).length) {
      setShowErrors(true);
      return;
    }
    const person = staffSchema.safeParse({
      ...editing.draft,
      name: editing.draft.name.trim(),
    });
    if (!person.success && !editing.isNew) {
      setShowErrors(true);
      return;
    }
    setContent((current) =>
      editing.isNew
        ? commitRecord("staff", editing.draft, current)
        : {
            ...current,
            staff: (current.staff ?? []).map((p) =>
              p.id === editing.draft.id
                ? {
                    ...editing.draft,
                    name: editing.draft.name.trim(),
                    role: editing.draft.role?.trim() || undefined,
                    bio: editing.draft.bio?.trim() || undefined,
                  }
                : p,
            ),
          },
    );
    setEditing(null);
  };
  const restore = () => {
    if (removed)
      setContent((current) => ({
        ...current,
        staff: [
          ...(current.staff ?? []).filter((p) => p.id !== removed.id),
          removed,
        ],
      }));
    setRemoved(null);
  };
  return (
    <>
      <PageHeader
        title="Team"
        description="Give people a face, a speciality and the right work."
        actions={
          <Button
            data-testid="team-add"
            onClick={(e) =>
              edit(blankFor("staff", c) as Person, true, e.currentTarget)
            }
          >
            <Plus />
            Add team member
          </Button>
        }
      />
      {!ent.teamPages ? (
        <p role="status" className="workspace-notice">
          Profiles are saved here. Show them on your page with Pro; offer
          several bookable people with Business.
        </p>
      ) : null}
      {removed ? (
        <div role="status" className="workspace-toast">
          <span>{removed.name} removed from your team.</span>
          <Button size="sm" variant="ghost" onClick={restore}>
            Undo removal
          </Button>
        </div>
      ) : null}
      {staff.length > 0 ? (
        <div className="workspace-list-toolbar">
          <label className="workspace-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Find a team member"
              placeholder="Find a person or speciality"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <span>
            {staff.length} {staff.length === 1 ? "person" : "people"}
          </span>
        </div>
      ) : null}
      {staff.length === 0 ? (
        <section className="workspace-empty">
          <Users size={30} strokeWidth={1.5} aria-hidden="true" />
          <h2>Introduce your people.</h2>
          <p>
            Add a profile, choose the services they provide, then set their
            hours.
          </p>
          <Button
            onClick={(e) =>
              edit(blankFor("staff", c) as Person, true, e.currentTarget)
            }
          >
            <Plus />
            Add your first person
          </Button>
        </section>
      ) : (
        <ul className="team-person-grid">
          {filtered.map((p) => (
            <li key={p.id} className="team-person" data-testid="team-person">
              <div className="team-person-top">
                {p.photo ? (
                  // Owner-uploaded images stay in this browser.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo.src} alt="" />
                ) : (
                  <span aria-hidden="true">
                    {p.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                )}
                <div>
                  <h2>{p.name}</h2>
                  <p>{p.role || "Team member"}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Edit ${p.name}`}
                  onClick={(e) => edit(p, false, e.currentTarget)}
                >
                  <Pencil size={17} />
                </button>
              </div>
              {p.bio ? <p className="team-person-bio">{p.bio}</p> : null}
              <div className="team-person-services">
                {p.serviceIds === null || p.serviceIds === undefined
                  ? "Every service"
                  : p.serviceIds.length
                    ? `${p.serviceIds.length} selected ${p.serviceIds.length === 1 ? "service" : "services"}`
                    : "No services assigned"}
                <span>
                  {p.bookable === false
                    ? "Profile only"
                    : "Available for booking"}
                </span>
              </div>
              <div className="team-person-footer">
                <Link
                  href={`/dashboard/bookings?section=availability&staff=${encodeURIComponent(p.id)}`}
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Working hours
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={(e) => {
                    trigger.current = e.currentTarget;
                    setRemoving(p);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {staff.length > 0 && !filtered.length ? (
        <p className="workspace-empty" role="status">
          No matching people. Try another name or speciality.
        </p>
      ) : null}
      <p className="workspace-footnote">
        Profiles and schedules are managed here. Team sign-in invitations and
        account permissions need the connected account service.
      </p>
      <Overlay
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        dirty={Boolean(
          editing && JSON.stringify(editing.draft) !== editing.before,
        )}
        title={editing?.isNew ? "Add a team member" : "Edit team member"}
        kind="detail"
        testId="team-person-editor"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          if (trigger.current?.isConnected) trigger.current.focus();
          else
            document
              .querySelector<HTMLElement>('[data-testid="team-add"]')
              ?.focus();
        }}
        footer={
          <Button className="w-full" onClick={save}>
            Save team member
          </Button>
        }
      >
        {editing ? (
          <RecordForm
            kind="staff"
            content={c}
            value={editing.draft}
            onChange={(draft) =>
              setEditing({ ...editing, draft: draft as Person })
            }
            showErrors={showErrors}
          />
        ) : null}
      </Overlay>
      <Overlay
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove team profile?"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          if (trigger.current?.isConnected) trigger.current.focus();
          else
            document
              .querySelector<HTMLElement>('[data-testid="team-add"]')
              ?.focus();
        }}
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setRemoving(null)}>
              Keep profile
            </Button>
            <Button
              onClick={() => {
                if (!removing) return;
                setRemoved(removing);
                setContent((current) => ({
                  ...current,
                  staff: (current.staff ?? []).filter(
                    (p) => p.id !== removing.id,
                  ),
                }));
                setRemoving(null);
              }}
            >
              Remove profile
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed">
          {removing?.name} will leave your team list and page. Existing booking
          records stay saved. You can undo this removal here.
        </p>
      </Overlay>
    </>
  );
}
