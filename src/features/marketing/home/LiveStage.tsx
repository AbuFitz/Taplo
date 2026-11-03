import Image from "next/image";

import { PhoneChrome } from "@/features/preview/PhoneChrome";
import "./hero-showcase.css";

/** High-resolution capture of the actual renderer, using the shared handset hardware. */
export function LiveStage() {
  return (
    <figure
      className="hero-showcase"
      aria-label="Detail Dept. page made with Taplo"
      data-testid="hero-showcase"
    >
      <div className="hero-showcase-canvas">
        <div className="hero-showcase-phone">
          <div
            className="phone-shell"
            data-phone-static
            data-testid="hero-phone-illustration"
          >
            <div className="phone-screen hero-capture-screen">
              <Image
                src="/marketing/detail-dept-hero.png"
                alt="The actual Detail Dept. Taplo page, showing its profile and booking action"
                width={1170}
                height={2532}
                unoptimized
                priority
                sizes="(min-width:1200px) 390px, (min-width:900px) 360px, 290px"
              />
            </div>
            <PhoneChrome />
          </div>
        </div>
      </div>
    </figure>
  );
}
