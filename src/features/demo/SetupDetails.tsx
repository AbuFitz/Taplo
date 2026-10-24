"use client";
import * as React from "react";
import { Clock3, ArrowRight } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { TaploInput } from "@/components/taplo/taplo-input";
import { safeUrl } from "@/lib/validation";
import { newWidget } from "@/features/page/starter";
import { useDemo, initialState } from "./store";
import type { WidgetType } from "@/features/page/contracts/widgets";
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
/** Optional business essentials are edited in one focused popup, then committed together. */
export function SetupDetails() {
  const { state, update } = useDemo();
  const s = state ?? initialState();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({
    tagline: "",
    town: "",
    website: "",
    instagram: "",
    days: [] as { day: (typeof DAYS)[number]; opens: string; closes: string }[],
  });
  const [error, setError] = React.useState("");
  const show = () => {
    setDraft({
      tagline: s.content.identity.tagline ?? "",
      town: s.content.location.locality ?? "",
      website: s.content.contacts.website ?? "",
      instagram:
        s.content.contacts.social?.find((x) => x.platform === "instagram")
          ?.url ?? "",
      days: (s.content.hours ?? [])
        .filter((h) => h.opens && h.closes)
        .map((h) => ({ day: h.day, opens: h.opens!, closes: h.closes! })),
    });
    setError("");
    setOpen(true);
  };
  const web = (v: string) =>
    v.trim()
      ? v.trim().startsWith("http")
        ? v.trim()
        : `https://${v.trim()}`
      : undefined;
  const save = () => {
    const website = web(draft.website),
      instagram = web(draft.instagram);
    if (
      (website && !safeUrl.safeParse(website).success) ||
      (instagram && !safeUrl.safeParse(instagram).success)
    ) {
      setError("Add a valid web address, such as https://example.co.uk.");
      return;
    }
    if (draft.days.some((x) => !x.opens || !x.closes || x.opens >= x.closes)) {
      setError("Each closing time must be later than its opening time.");
      return;
    }
    update((st) => {
      const content = {
        ...st.content,
        identity: {
          ...st.content.identity,
          tagline: draft.tagline.trim() || undefined,
        },
        location: {
          ...st.content.location,
          locality: draft.town.trim() || undefined,
        },
        contacts: {
          ...st.content.contacts,
          website,
          social: [
            ...(st.content.contacts.social ?? []).filter(
              (x) => x.platform !== "instagram",
            ),
            ...(instagram
              ? [{ platform: "instagram" as const, url: instagram }]
              : []),
          ],
        },
        hours: draft.days,
      };
      const widgets = [...st.page.widgets];
      const add = (type: WidgetType) => {
        if (!widgets.some((w) => w.type === type))
          widgets.push(newWidget(type));
      };
      if (draft.days.length) add("hours");
      if (website || instagram) add("social");
      if (draft.town.trim())
        add(
          content.location.mode === "service_area" ? "serviceArea" : "location",
        );
      return { ...st, content, page: { ...st.page, widgets } };
    });
    setOpen(false);
  };
  return (
    <>
      <button type="button" className="setup-edit-row w-full" onClick={show}>
        <Clock3 aria-hidden="true" className="size-4" />
        <span>
          Business details
          <span className="block text-xs font-normal text-muted-foreground">
            Description, location, hours and links
          </span>
        </span>
        <ArrowRight aria-hidden="true" className="ml-auto size-4" />
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="The details customers need"
        testId="setup-business-details"
        footer={
          <Button className="min-h-11 w-full" onClick={save}>
            Save details
          </Button>
        }
      >
        <div className="grid gap-5">
          <TaploInput
            label="Short description"
            value={draft.tagline}
            maxLength={160}
            onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
          />
          <TaploInput
            label="Town or area"
            value={draft.town}
            maxLength={120}
            onChange={(e) => setDraft({ ...draft, town: e.target.value })}
          />
          <TaploInput
            label="Website"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            value={draft.website}
            onChange={(e) => setDraft({ ...draft, website: e.target.value })}
          />
          <TaploInput
            label="Instagram address"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            value={draft.instagram}
            onChange={(e) => setDraft({ ...draft, instagram: e.target.value })}
          />
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm font-semibold">
              Opening hours
            </legend>
            {DAYS.map((day, i) => {
              const h = draft.days.find((x) => x.day === day);
              return (
                <div
                  key={day}
                  className="grid gap-2 rounded-2xl bg-neutral-50 p-3"
                >
                  <label className="flex min-h-8 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      aria-label={LABELS[i]}
                      className="size-5 accent-black"
                      checked={Boolean(h)}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          days: e.target.checked
                            ? [
                                ...draft.days,
                                { day, opens: "09:00", closes: "17:00" },
                              ]
                            : draft.days.filter((x) => x.day !== day),
                        })
                      }
                    />
                    {LABELS[i]}
                    {!h ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Closed
                      </span>
                    ) : null}
                  </label>
                  {h ? (
                    <div className="grid grid-cols-2 gap-2">
                      <TaploInput
                        label={`${LABELS[i]} opens`}
                        type="time"
                        value={h.opens}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            days: draft.days.map((x) =>
                              x.day === day
                                ? { ...x, opens: e.target.value }
                                : x,
                            ),
                          })
                        }
                      />
                      <TaploInput
                        label={`${LABELS[i]} closes`}
                        type="time"
                        value={h.closes}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            days: draft.days.map((x) =>
                              x.day === day
                                ? { ...x, closes: e.target.value }
                                : x,
                            ),
                          })
                        }
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </fieldset>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Only details you add appear on the page. More complex schedules
            remain available in the editor.
          </p>
        </div>
      </Overlay>
    </>
  );
}
