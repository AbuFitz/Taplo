import Link from "next/link";
import { TaploLogo } from "@/components/taplo/brand";
import { SetupBackdrop } from "@/features/demo/SetupBackdrop";
import "./inspiration-scene.css";

/** The designs area has its own framed experience, like setup: one white panel on the moving backdrop, with its own scrolling. */
export function InspirationFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ig-scene">
      <SetupBackdrop />
      <div className="ig-frame">
        <header className="ig-top" aria-label="Taplo website">
          <Link href="/" aria-label="Taplo home" className="ig-logo"><TaploLogo className="h-9" /></Link>
          <nav className="ig-nav" aria-label="Primary">
            <Link href="/inspiration">Designs</Link>
            <Link href="/product">Product</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/onboarding" className="ig-cta" data-brand-action>Start free</Link>
          </nav>
        </header>
        <div className="ig-scroll">
          <main>{children}</main>
          <footer className="ig-foot"><Link href="/credits">Credits</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link></footer>
        </div>
      </div>
    </div>
  );
}
