"use client";
import * as React from "react";
import { PagePreview } from "@/features/preview/PagePreview";
const subscribe = (changed: () => void) => {
  const query = window.matchMedia("(max-width:1023px)");
  query.addEventListener("change", changed);
  return () => query.removeEventListener("change", changed);
};
/** One real mobile page. The short setup canvas crops the handset, not the page's responsive width. */
export function SetupCanvas({ src, expanded }: { src: string; expanded: boolean }) {
  const mobile = React.useSyncExternalStore(subscribe, () => window.matchMedia("(max-width:1023px)").matches, () => true);
  return <PagePreview src={src} title="Your page, live" mode={expanded ? "fill" : "device"} chrome={!expanded} cropDevice={!expanded && mobile} resizeKey={expanded} testId="setup-live-page" />;
}
