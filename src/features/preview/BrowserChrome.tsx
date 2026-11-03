import { LockKeyhole } from "lucide-react";
import { businessAddress } from "@/lib/domains";
import "./browser-chrome.css";

/** Decorative browser chrome. It never masquerades as working browser controls. */
export function BrowserChrome({ url = businessAddress(), height }: { url?: string; height?: number }) {
  return <div className="browser-chrome" data-browser-chrome aria-hidden="true" style={height ? { height } : undefined}>
    <span className="browser-chrome-dots"><i /><i /><i /></span>
    <span className="browser-chrome-address"><LockKeyhole aria-hidden="true" /><span>{url.replace(/^https?:\/\//, "")}</span></span>
    <span className="browser-chrome-balance" />
  </div>;
}
