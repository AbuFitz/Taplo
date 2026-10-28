import type { Metadata } from "next";
import Link from "next/link";
import { TaploLogo } from "@/components/taplo/brand";
import { SetupBackdrop } from "@/features/demo/SetupBackdrop";
import { DesignGallery } from "@/features/inspiration/DesignGallery";
import "@/features/inspiration/inspiration-scene.css";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description: "Explore Taplo designs on a page like yours. Open one, try it on phone and computer, then make it your own.",
};

/** The designs page has its own framed experience, like setup: one white panel on the moving backdrop, with its own scrolling. */
export default function InspirationPage() {
  return (
    <div className="ig-scene">
      <SetupBackdrop />
      <div className="ig-frame">
        <header className="ig-top" aria-label="Taplo website">
          <Link href="/" aria-label="Taplo home" className="ig-logo"><TaploLogo className="h-9" /></Link>
          <nav className="ig-nav" aria-label="Primary">
            <Link href="/product">Product</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/onboarding" className="ig-cta" data-brand-action>Start free</Link>
          </nav>
        </header>
        <div className="ig-scroll">
          <main><DesignGallery /></main>
          <footer className="ig-foot"><Link href="/credits">Credits</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link></footer>
        </div>
      </div>
    </div>
  );
}
