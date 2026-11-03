import { SiteHeader, SiteFooter } from "@/features/marketing/Site";
import "./inspiration-scene.css";

/** Inspiration belongs to the public website, with normal document scrolling. */
export function InspirationFrame({ children }: { children: React.ReactNode }) {
  return <div className="inspiration-site"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}
