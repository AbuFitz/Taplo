import type { Metadata } from "next";
import { DesignGallery } from "@/features/inspiration/DesignGallery";
import { SiteFooter, SiteHeader } from "@/features/marketing/Site";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description: "Explore Taplo designs on a page like yours. Open one, try it on phone and computer, then make it your own.",
};

export default function InspirationPage() {
  return (
    <div className="inspo-shell">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[88rem] px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <DesignGallery />
      </main>
      <SiteFooter />
    </div>
  );
}
