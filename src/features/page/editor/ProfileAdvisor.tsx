"use client";
import { Check, Palette, Sparkles } from "lucide-react";
import { PROFILE_CHOICES } from "../contracts/style";
import {
  profileDirection,
  withSuggestedColours,
} from "../themes/profile-direction";
import { ChoicePreview } from "@/features/preview/ChoicePreview";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import * as React from "react";
import type { Editor } from "./useEditor";
/** One clear suggestion, with reasons and a comparison before colours are accepted. */
export function ProfileAdvisor({
  ed,
  notify,
}: {
  ed: Editor;
  notify: (m: string, undoable?: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const i = ed.state.content.identity;
  const advice = profileDirection(
    i,
    ed.vm?.style.attrs["data-tone"] === "dark",
  );
  const name = PROFILE_CHOICES.find(
    (v) => v.id === advice.arrangement.id,
  )?.name;
  const current = ed.vm?.style.spec.colors;
  const active = ed.vm?.style.spec.header.layout === advice.arrangement.id;
  const applyLayout = () => {
    ed.setAppearance((a) => ({
      ...a,
      header: {
        ...a.header,
        layout: advice.arrangement.id,
        align: ["bento", "identity"].includes(advice.arrangement.id)
          ? "center"
          : "left",
      },
    }));
    notify("Suggested profile applied. Your content is unchanged.", true);
  };
  return (
    <div className="profile-advisor" data-assets={advice.assets}>
      <div className="profile-advisor-picture">
        <ChoicePreview
          src={`/demo/preview?header=${advice.arrangement.id}`}
          title={`${name} suggestion for your business`}
          height={420}
        />
      </div>
      <div className="profile-advisor-copy">
        <span>
          <Sparkles aria-hidden="true" />
          Suggested for your profile
        </span>
        <h3>{name}</h3>
        <p>{advice.arrangement.why}</p>
        {advice.note ? (
          <p className="profile-advisor-note">{advice.note}</p>
        ) : null}
        <div>
          {active ? (
            <span className="profile-advisor-current">
              <Check />
              In use
            </span>
          ) : (
            <button type="button" onClick={applyLayout}>
              Try this layout
            </button>
          )}
          <button type="button" onClick={() => setOpen(true)}>
            <Palette />
            Colour direction
          </button>
        </div>
      </div>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        title="A colour direction for you"
        description={advice.colourReason}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Keep mine
            </Button>
            <Button
              onClick={() => {
                ed.setAppearance((a) =>
                  withSuggestedColours(a, advice.palette),
                );
                setOpen(false);
                notify("Suggested colours applied.", true);
              }}
            >
              Use these colours
            </Button>
          </div>
        }
      >
        <div className="profile-colour-comparison">
          {[
            { label: "Now", colours: current ?? advice.palette },
            { label: "Suggested", colours: advice.palette },
          ].map(({ label, colours }) => (
            <figure key={label}>
              <div
                style={{
                  background: colours.background,
                  color: colours.text,
                  borderColor: colours.border,
                }}
              >
                <i
                  style={{
                    background: colours.surface,
                    borderColor: colours.border,
                  }}
                />
                <b>{i.name || "Your business"}</b>
                <span
                  style={{
                    background: colours.accent,
                    color: colours.accentText,
                  }}
                >
                  Get in touch
                </span>
              </div>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-neutral-500">
          You can adjust any colour afterwards. An existing photo or gradient
          wallpaper is kept; check the live page with your own content.
        </p>
      </Overlay>
    </div>
  );
}
