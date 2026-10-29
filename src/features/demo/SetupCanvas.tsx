"use client";
import { PagePreview } from "@/features/preview/PagePreview";
/** Shared handset; revealing the page fits its entire height above the mobile controls. */
export function SetupCanvas({
  src,
  expanded,
  fit = false,
  onOverlayOpen,
  focus,
  onSurface,
}: {
  src: string;
  expanded: boolean;
  fit?: boolean;
  onOverlayOpen?: () => void;
  /** Part of the page to bring into view (header, actions, offer). */
  focus?: string;
  onSurface?: (color: string) => void;
}) {
  return (
    <PagePreview
      src={src}
      title="Your page, live"
      mode={expanded ? "fill" : "device"}
      chrome={!expanded}
      cropDevice={!expanded && !fit}
      resizeKey={`${expanded}-${fit}`}
      onOverlayOpen={onOverlayOpen}
      focus={focus}
      onSurface={onSurface}
      testId="setup-live-page"
    />
  );
}
