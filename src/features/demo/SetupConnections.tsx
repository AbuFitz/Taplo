"use client";
import * as React from "react";
import {
  CalendarDays,
  MessageSquare,
  Phone,
  MessagesSquare,
  Globe,
  X,
} from "lucide-react";
import { TaploInput } from "@/components/taplo/taplo-input";
import { safeUrl, normalizePhone } from "@/lib/validation";
import { useDemo, initialState } from "./store";
import { newWidget } from "@/features/page/starter";
import { SOCIAL_PLATFORMS, socialUrl } from "@/features/page/social-platforms";
import { SocialIcon } from "@/features/page/widgets/social-icons";

type Draft = {
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  instagram: string;
  socials: Record<string, string>;
};
const emailValid = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const websiteUrl = (value: string) => {
  const text = value.trim();
  return text
    ? /^[a-z][a-z0-9+.-]*:/i.test(text)
      ? text
      : `https://${text}`
    : undefined;
};
export function SetupConnections({
  part,
  goal,
  onGoalChange,
  onValidity,
}: {
  /** On a phone the step is two screens: 0 chooses the main button, 1 takes the details. Undefined shows everything. */
  part?: number;
  goal: "book" | "enquire" | "call" | "message";
  onGoalChange: (goal: "book" | "enquire" | "call" | "message") => void;
  onValidity: (valid: boolean) => void;
}) {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [draft, setDraft] = React.useState<Draft>(() => {
    const saved = s.setupDrafts?.connections;
    return {
      email: saved?.email ?? s.content.contacts.email ?? "",
      phone: saved?.phone ?? s.content.contacts.phone ?? "",
      whatsapp: saved?.whatsapp ?? s.content.contacts.whatsapp ?? "",
      website: saved?.website ?? s.content.contacts.website ?? "",
      instagram: "",
      socials: saved?.socials ?? {
        ...Object.fromEntries(
          (s.content.contacts.social ?? []).map((p) => [p.platform, p.url]),
        ),
        ...(saved?.instagram ? { instagram: saved.instagram } : {}),
      },
    };
  });
  const [more, setMore] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [chosen, setChosen] = React.useState<string[]>(() => [
    ...Object.keys(draft.socials),
    ...(draft.whatsapp ? ["whatsapp"] : []),
  ]);
  const errors: Record<string, string> = {
    email:
      draft.email && !emailValid(draft.email)
        ? "Enter a valid email address."
        : "",
    phone:
      draft.phone && !normalizePhone(draft.phone)
        ? "Enter a valid phone number."
        : "",
    whatsapp:
      draft.whatsapp && !normalizePhone(draft.whatsapp)
        ? "Include a valid number with the country code."
        : "",
    website:
      draft.website && !safeUrl.safeParse(websiteUrl(draft.website)).success
        ? "Enter a valid website or booking address."
        : "",
    ...Object.fromEntries(
      SOCIAL_PLATFORMS.map((p) => [
        p.id,
        draft.socials[p.id] && !socialUrl(p.id, draft.socials[p.id])
          ? `Use your ${p.label} profile address or username.`
          : "",
      ]),
    ),
  };
  const any = [
    draft.email,
    draft.phone,
    draft.whatsapp,
    draft.website,
    ...Object.values(draft.socials),
  ].some((v) => v.trim());
  const valid =
    any &&
    !Object.values(errors).some(Boolean) &&
    (goal !== "call" || Boolean(normalizePhone(draft.phone))) &&
    (goal !== "message" ||
      Boolean(
        (draft.email && !errors.email) || (draft.whatsapp && !errors.whatsapp),
      ));
  React.useEffect(() => onValidity(valid), [valid, onValidity]);
  const commit = (next: Draft, key: string) => {
    setDraft(next);
    update(
      (st) => {
        const website = websiteUrl(next.website);
        const social = SOCIAL_PLATFORMS.flatMap((p) => {
          const url = socialUrl(p.id, next.socials[p.id] ?? "");
          return url ? [{ platform: p.id, url }] : [];
        });
        const contacts = {
          ...st.content.contacts,
          email: emailValid(next.email) ? next.email.trim() : undefined,
          phone: normalizePhone(next.phone) ?? undefined,
          whatsapp: normalizePhone(next.whatsapp) ?? undefined,
          website:
            website && safeUrl.safeParse(website).success ? website : undefined,
          social,
        };
        const widgets = [...st.page.widgets];
        if (
          (contacts.website || social.length) &&
          !widgets.some((w) => w.type === "social")
        )
          widgets.push(newWidget("social"));
        return {
          ...st,
          setupDrafts: { ...st.setupDrafts, connections: next },
          content: { ...st.content, contacts },
          page: {
            ...st.page,
            meta: {
              ...st.page.meta,
              primaryAction:
                goal === "message"
                  ? contacts.whatsapp
                    ? "whatsapp"
                    : "email"
                  : st.page.meta.primaryAction,
            },
            widgets,
          },
        };
      },
      { coalesce: `connection-${key}` },
    );
  };
  const change = (
    key: "email" | "phone" | "whatsapp" | "website",
    value: string,
  ) => commit({ ...draft, [key]: value }, key);
  const remove = (id: string) => {
    setChosen((v) => v.filter((p) => p !== id));
    setEditing(null);
    if (id === "whatsapp") change("whatsapp", "");
    else {
      const social = { ...draft.socials };
      delete social[id];
      commit({ ...draft, socials: social }, id);
    }
  };
  const field = (
    key: "email" | "phone" | "whatsapp" | "website",
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <TaploInput
      label={label}
      placeholder={placeholder}
      type={type}
      inputMode={
        type === "tel"
          ? "tel"
          : type === "email"
            ? "email"
            : key === "website"
              ? "url"
              : undefined
      }
      autoCapitalize="none"
      autoCorrect="off"
      value={draft[key]}
      onChange={(e) => change(key, e.target.value)}
      onBlur={() => setTouched((t) => ({ ...t, [key]: true }))}
      error={touched[key] ? errors[key] : undefined}
    />
  );
  const count = chosen.length;
  return (
    <div className="setup-connections" data-testid="reach">
      <p className="setup-connection-note" hidden={part === 1}>
        Pick your main button. It shows on your page as you choose.
      </p>
      <fieldset hidden={part === 1} data-testid="goal-intent">
        <legend className="setup-layout-heading">What would you like customers to do?</legend>
        <p className="setup-connection-note">Choose any. This only shapes what we suggest next; nothing is switched on until you set it up.</p>
        <div className="setup-primary-choices">
          {([
            { id: "book", label: "Book with me" },
            { id: "call", label: "Call me" },
            { id: "message", label: "Message me" },
            { id: "browse", label: "See my work" },
            { id: "buy", label: "Buy from me" },
          ] as const).map(({ id, label }) => {
            const on = (s.setupDrafts?.goals ?? []).includes(id);
            return (
              <button type="button" key={id} aria-pressed={on} onClick={() => update((x) => { const cur = x.setupDrafts?.goals ?? []; const goals = on ? cur.filter((g) => g !== id) : [...cur, id]; return { ...x, setupDrafts: { ...x.setupDrafts, goals } }; })}>
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset hidden={part === 1}>
        <legend className="setup-layout-heading">Main button</legend>
        <div className="setup-primary-choices">
          {(
            [
              { id: "book", label: "Booking requests", Icon: CalendarDays },
              { id: "enquire", label: "Links & enquiries", Icon: Globe },
              { id: "call", label: "Phone calls", Icon: Phone },
              { id: "message", label: "Messages", Icon: MessageSquare },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              type="button"
              key={id}
              aria-pressed={goal === id}
              onClick={() => onGoalChange(id)}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5" hidden={part === 0}>
        {field(
          "website",
          "Website or booking link (optional)",
          "yourbusiness.co.uk",
        )}
        <p className="setup-connection-note -mt-3">Taplo links to it. It doesn’t copy your website or sync bookings made there.</p>
        {field("email", "Email", "hello@yourbusiness.co.uk", "email")}
        {field("phone", "Phone", "07700 900123", "tel")}
        <fieldset className="setup-social" data-testid="social-links">
          <legend className="setup-layout-heading">Social profiles</legend>
          <div
            className="setup-social-grid"
            role="group"
            aria-label="Social platforms"
          >
            {[{ id: "whatsapp", label: "WhatsApp" }, ...SOCIAL_PLATFORMS]
              .slice(0, more ? undefined : 6)
              .map((p) => {
                const filled =
                  p.id === "whatsapp"
                    ? Boolean(draft.whatsapp)
                    : Boolean(draft.socials[p.id]);
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={editing === p.id}
                    data-filled={filled || undefined}
                    onClick={() => {
                      if (!chosen.includes(p.id))
                        setChosen((v) => [...v, p.id]);
                      setEditing(editing === p.id ? null : p.id);
                    }}
                  >
                    <SocialIcon platform={p.id} className="size-6" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            <button
              type="button"
              className="setup-social-more"
              aria-expanded={more}
              onClick={() => setMore((v) => !v)}
            >
              <MessagesSquare aria-hidden="true" />
              <span>{more ? "Fewer" : "More"}</span>
            </button>
          </div>
          {editing ? (
            <div className="setup-social-field" key={editing}>
              <span className="setup-social-glyph">
                <SocialIcon platform={editing} />
              </span>
              <div>
                {editing === "whatsapp" ? (
                  field("whatsapp", "WhatsApp number", "+44 7700 900123", "tel")
                ) : (
                  <TaploInput
                    label={`${SOCIAL_PLATFORMS.find((p) => p.id === editing)!.label} profile`}
                    placeholder={`${SOCIAL_PLATFORMS.find((p) => p.id === editing)!.host}/${SOCIAL_PLATFORMS.find((p) => p.id === editing)!.prefix}yourbusiness`}
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoFocus
                    value={draft.socials[editing] ?? ""}
                    onChange={(e) =>
                      commit(
                        {
                          ...draft,
                          socials: {
                            ...draft.socials,
                            [editing]: e.target.value,
                          },
                        },
                        editing,
                      )
                    }
                    onBlur={() =>
                      setTouched((t) => ({ ...t, [editing]: true }))
                    }
                    error={touched[editing] ? errors[editing] : undefined}
                  />
                )}
              </div>
              <button
                type="button"
                aria-label={`Remove ${editing === "whatsapp" ? "WhatsApp" : SOCIAL_PLATFORMS.find((p) => p.id === editing)!.label}`}
                onClick={() => remove(editing)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </fieldset>
      </div>
    </div>
  );
}
