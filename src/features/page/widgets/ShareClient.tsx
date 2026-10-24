"use client";
import * as React from "react";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import { Button } from "@/components/ui/button";
import { loadQrLogo, svgToPng } from "@/features/qr/browser";
import { qrSvg, qrFilename, type QrLogo } from "@/features/qr/render";
export { renderShareImage, SHARE_FORMATS, type ShareImageInput, type ShareFormat } from "./share-image";
export interface ShareData { name: string; tagline?: string; slug: string; logo?: string; action?: string }
const noopSubscribe = () => () => {};

export function ShareButton({ data, label = "Share this page", variant = "button" }: { data: ShareData; label?: string; variant?: "button" | "card" }) {
  return <SharePanel data={data} trigger={<button type="button" className="tp-btn" data-variant={variant === "card" ? "card" : "button"}><Share2 aria-hidden="true" className="size-5" /><span className="tp-btn-main"><span className="tp-btn-label">{label}</span></span></button>} />;
}
export function SharePanel({ data, trigger, open, onOpenChange }: { data: ShareData; trigger?: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  return <Overlay tone="page" kind="dialog" trigger={trigger} open={open} onOpenChange={onOpenChange} title={`Share ${data.name}`} testId="share-panel"><ShareBody data={data} /></Overlay>;
}
function ShareBody({ data }: { data: ShareData }) {
  const where = React.useSyncExternalStore(noopSubscribe, () => `${window.location.origin}|${window.location.pathname}|${new URLSearchParams(window.location.search).get("scenario") ?? ""}|${typeof navigator.share === "function"}`, () => "");
  const [origin = "", pathname = "", scenario = "", native = ""] = where.split("|");
  const example = pathname === "/appearance/frame" && Boolean(scenario);
  const preview = !example && (pathname.startsWith("/demo") || pathname.startsWith("/dashboard") || pathname.startsWith("/appearance"));
  const url = !origin ? "" : example ? `${origin}/appearance/frame?scenario=${encodeURIComponent(scenario)}` : preview ? `${origin}${pathname.startsWith("/demo/p/") ? pathname : "/demo/preview"}` : `${origin}/${data.slug}`;
  const [mark, setMark] = React.useState<QrLogo | null>(null);
  const [note, setNote] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { let active = true; void loadQrLogo("/logo/taplo-symbol-black-tight.svg").then((logo) => { if (active) setMark(logo); }); return () => { active = false; }; }, []);
  const svg = React.useMemo(() => url ? qrSvg(url, { dots: "rounded", corners: "rounded", fg: "#111111", bg: "#ffffff", logo: mark }, 280, `QR code for ${data.name}`) : "", [url, mark, data.name]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setNote("Link copied"); }
    catch { input.current?.focus(); input.current?.select(); setNote("Select and copy the link"); }
  };
  const share = async () => {
    try { await navigator.share({ title: data.name, url }); }
    catch (error) { if ((error as Error).name !== "AbortError") setNote("Use Copy link on this device"); }
  };
  const save = async () => {
    const blob = await svgToPng(svg, 1600);
    if (!blob) return setNote("Could not save the QR code. Try again.");
    const address = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = address; a.download = qrFilename(data.slug, "qr", "png", { px: 1600, preview }); a.click();
    setTimeout(() => URL.revokeObjectURL(address), 1000);
    setNote("QR code saved");
  };
  return <div className="grid gap-4 py-1">
    <div className="mx-auto w-[min(100%,13rem)] rounded-[1.5rem] bg-white p-4 text-black [&_svg]:h-auto [&_svg]:w-full" data-testid="qr-preview" dangerouslySetInnerHTML={{ __html: svg }} />
    <input ref={input} id="share-url" aria-label="Page link" value={url} readOnly onFocus={(e) => e.currentTarget.select()} className="min-h-11 w-full min-w-0 rounded-lg bg-transparent px-2 text-center text-sm text-tp-muted outline-none focus-visible:ring-2 focus-visible:ring-tp-accent" />
    <div className="grid gap-2">
      <Button type="button" className="min-h-12 rounded-full shadow-none bg-tp-accent text-tp-accent-fg hover:bg-tp-accent/90" onClick={copy}><Copy aria-hidden="true" />Copy link</Button>
      {native === "true" ? <Button type="button" variant="outline" className="min-h-12 rounded-full" onClick={share}><Share2 aria-hidden="true" />Share from this device</Button> : null}
      <Button type="button" variant="ghost" className="min-h-11 rounded-full" onClick={save}><Download aria-hidden="true" />Save QR code</Button>
    </div>
    {preview ? <p className="text-center text-xs text-tp-muted" data-testid="share-demo-note">Preview link. This page opens in this browser only.</p> : null}
    <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">{note ? <span className="inline-flex items-center gap-2">{note === "Link copied" || note === "QR code saved" ? <Check aria-hidden="true" className="size-4" /> : null}{note}</span> : null}</p>
  </div>;
}
