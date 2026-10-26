import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/features/marketing/Site";
import { DesignGallery } from "@/features/inspiration/DesignGallery";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description: "Explore Taplo designs on a page like yours. Open one, try it on phone and computer, then make it your own.",
};

export default function InspirationPage() {
  return (
    <div className="design-library bg-[#080808] text-white [--foreground:#ffffff] [--background:#080808] [--muted:#242424] [--muted-foreground:#aaaaaa]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[100rem] px-4 pb-12 pt-3 sm:px-7 sm:pt-5">
        <DesignGallery />
      </main>
      <SiteFooter />
    </div>
  );
}
