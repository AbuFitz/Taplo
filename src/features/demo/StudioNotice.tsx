"use client";
import * as React from "react";
import { Overlay } from "@/components/taplo/overlay";

/** One contextual explanation in the authoring workspace, instead of development-status walls on marketing pages. */
export function StudioNotice() {
  const [open, setOpen] = React.useState(false);
  const trigger = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label="About this Studio preview"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2 text-[10px] font-medium text-neutral-600 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-neutral-700"
      >
        <span
          className="size-1.5 rounded-full bg-emerald-600"
          aria-hidden="true"
        />
        <span className="hidden sm:inline">Interactive </span>preview
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus();
        }}
        title="Your Studio preview"
      >
        <div className="grid gap-4 text-sm leading-relaxed text-neutral-600">
          <p>
            Build and test your full page free in your browser, with your own
            content and no sign-up wall. Your draft and test bookings stay on
            this device.
          </p>
          <p>
            Saving a preview does not publish a public page, charge a card or
            send a message. Cloud publishing and checkout are planned for
            launch.
          </p>
          <p>
            Keep a copy of important content before clearing your browser data.
          </p>
        </div>
      </Overlay>
    </>
  );
}
