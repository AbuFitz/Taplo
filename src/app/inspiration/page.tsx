import type { Metadata } from "next";
import { DesignGallery } from "@/features/inspiration/DesignGallery";
import { InspirationFrame } from "@/features/inspiration/InspirationFrame";

export const metadata: Metadata = {
  title: "Designs | Taplo",
  description: "Explore Taplo designs on a page like yours. Open one, try it on phone and computer, then make it your own.",
};

export default function InspirationPage() {
  return (
    <InspirationFrame>
      <DesignGallery />
    </InspirationFrame>
  );
}
