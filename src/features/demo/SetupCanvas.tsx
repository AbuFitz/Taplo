"use client";
import { PagePreview } from "@/features/preview/PagePreview";
/** Shared handset; revealing the page fits its entire height above the mobile controls. */
export function SetupCanvas({
  src,
  expanded,
  fit = false,
  onOverlayOpen,
}: {
  src: string;
  expanded: boolean;
  fit?: boolean;
  onOverlayOpen?: () => void;
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
      testId="setup-live-page"
    />
  );
}
