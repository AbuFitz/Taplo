"use client";
import { PagePreview } from "@/features/preview/PagePreview";
/** Setup always crops the same handset at readable scale. Full-size opens the actual responsive page. */
export function SetupCanvas({ src, expanded }: { src: string; expanded: boolean }) {
  return <PagePreview src={src} title="Your page, live" mode={expanded ? "fill" : "device"} chrome={!expanded} cropDevice={!expanded} resizeKey={expanded} testId="setup-live-page" />;
}
