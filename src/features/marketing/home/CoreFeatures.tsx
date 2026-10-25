import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "../ScrollReveal";

/** Work-first editorial composition; service-pricing controls belong on the service page. */
export function CoreFeatures() {
  return (
    <section
      className="home-work"
      aria-labelledby="work-title"
      data-testid="home-work"
    >
      <div className="home-work-inner">
        <ScrollReveal className="home-work-title">
          <h2 id="work-title">
            Show what
            <br />
            <span>you can do.</span>
          </h2>
        </ScrollReveal>
        <div
          className="home-work-composition"
          role="img"
          aria-label="Illustration of an interior studio presenting its work and an enquiry link"
        >
          <ScrollReveal className="home-work-main" delay={0.08}>
            <div className="home-work-photo">
              <Image
                src="/showcase/originals/interior-studio.webp"
                alt=""
                fill
                sizes="(min-width:900px) 720px, 85vw"
              />
              <span className="home-work-wordmark">
                TWELVE
                <br />
                ROOMS
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal className="home-work-detail" delay={0.18}>
            <div className="home-work-sample">
              <Image
                src="/showcase/originals/brand-stilllife.webp"
                alt=""
                fill
                sizes="(min-width:900px) 300px, 40vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal className="home-work-enquiry" delay={0.25}>
            <span>
              Discuss a project
              <ArrowUpRight />
            </span>
          </ScrollReveal>
        </div>
        <p className="home-work-note">
          Give customers a closer look at your projects, photos and services
          before they get in touch.
        </p>
      </div>
    </section>
  );
}
