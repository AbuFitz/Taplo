import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import {
  SiteFooter,
  SiteHeader,
  primaryAction,
} from "@/features/marketing/Site";
import { ScrollReveal } from "@/features/marketing/ScrollReveal";
import "@/features/marketing/how-it-works.css";
export const metadata: Metadata = {
  title: "How it works | Taplo",
  description:
    "Add your business details, shape your page and see it as a customer. A visual way to build a page of your own.",
};
export const dynamic = "force-dynamic";
const FAQ = [
  {
    q: "Can I keep my existing website?",
    a: "Yes. Add a link to your website, shop or booking service. Use Taplo alongside the tools you already have.",
  },
  {
    q: "What should I add first?",
    a: "Your name, a way to get in touch and one thing you offer. Add more when you are ready.",
  },
  {
    q: "Can I change the design later?",
    a: "Yes. Your content stays in place while you change colours, type, backgrounds and profile arrangements.",
  },
  {
    q: "Do I have to fill everything in at once?",
    a: "No. Skip optional steps, come back to a section and keep editing your draft.",
  },
];
export default function HowItWorks() {
  const action = primaryAction();
  return (
    <div className="how-editorial">
      <SiteHeader />
      <main>
        <section className="how-opening" aria-labelledby="how-title">
          <div className="how-opening-copy">
            <h1 id="how-title">
              Set up your
              <br />
              <span>Taplo page.</span>
            </h1>
            <p>
              Add your details, choose a design and try your page before sharing
              it.
            </p>
            <Link data-brand-action href={action.href} className="how-start">
              {action.label}
              <ArrowRight />
            </Link>
          </div>
          <div
            className="how-opening-art"
            role="img"
            aria-label="Illustration of a business identity, project image and links coming together"
          >
            <ScrollReveal className="how-floating-photo" delay={0.08}>
              <div>
                <Image
                  src="/showcase/originals/brand-stilllife.webp"
                  alt=""
                  fill
                  sizes="(min-width:900px) 470px, 72vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal className="how-floating-profile" delay={0.18}>
              <div>
                <span className="how-monogram">n.</span>
                <strong>North Studio</strong>
                <p>Brand identity & graphic design.</p>
                <span className="how-art-action">
                  See the projects
                  <ArrowUpRight />
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal className="how-floating-url" delay={0.25}>
              <span>
                mytaplo.com/<b>northstudio</b>
                <LinkIcon />
              </span>
            </ScrollReveal>
          </div>
        </section>
        <section className="how-identity" aria-labelledby="how-identity-title">
          <ScrollReveal>
            <h2 id="how-identity-title">
              Add your
              <br />
              <em>business details.</em>
            </h2>
          </ScrollReveal>
          <div
            className="how-identity-fields"
            role="img"
            aria-label="Illustration of adding a logo, business name and description"
          >
            <span className="how-identity-avatar">n.</span>
            <div>
              <small>Business name</small>
              <strong>North Studio</strong>
            </div>
            <div>
              <small>Short description</small>
              <span>Brand identity & graphic design.</span>
            </div>
          </div>
          <p className="how-identity-note">
            Add your name, logo and a short description. Include your website
            and social links if you have them.
          </p>
        </section>
        <section className="how-design" aria-labelledby="how-design-title">
          <div className="how-design-intro">
            <h2 id="how-design-title">
              Choose
              <br />
              <span>your design.</span>
            </h2>
            <p>
              Choose your colours. Arrange your profile. Add the blocks that fit
              your business.
            </p>
          </div>
          <div
            className="how-design-art"
            role="img"
            aria-label="Illustration of gallery, profile and link blocks with a coordinated colour palette"
          >
            <ScrollReveal className="how-design-gallery">
              <div>
                <Image
                  src="/showcase/originals/brand-stilllife.webp"
                  alt=""
                  fill
                  sizes="(min-width:900px) 480px, 70vw"
                />
                <span>
                  Selected projects
                  <ImageIcon />
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal className="how-design-palette" delay={0.12}>
              <div>
                <span />
                <span />
                <span />
                <strong>Colour. Type. Layout.</strong>
              </div>
            </ScrollReveal>
            <ScrollReveal className="how-design-link" delay={0.2}>
              <span>
                Work with North
                <ArrowUpRight />
              </span>
            </ScrollReveal>
          </div>
        </section>
        <section className="how-preview" aria-labelledby="how-preview-title">
          <ScrollReveal>
            <h2 id="how-preview-title">
              See it as
              <br />a customer.
            </h2>
          </ScrollReveal>
          <p>
            Check your page on mobile and desktop. Test your links and booking
            flow, then make any changes you need.
          </p>
          <div
            className="how-preview-art"
            role="img"
            aria-label="Illustration of the same business identity arranged for a phone and a wider screen"
          >
            <div className="how-preview-wide">
              <span className="how-preview-address">
                mytaplo.com/northstudio
              </span>
              <div>
                <span className="how-monogram">n.</span>
                <strong>North Studio</strong>
                <span>Brand identity & graphic design.</span>
                <div className="how-preview-links">
                  <span>Selected projects</span>
                  <span>Get in touch</span>
                </div>
              </div>
            </div>
            <ScrollReveal className="how-preview-small" delay={0.16}>
              <div>
                <span className="how-monogram">n.</span>
                <strong>
                  North
                  <br />
                  Studio
                </strong>
                <span>
                  Selected projects
                  <ArrowUpRight />
                </span>
                <span>
                  Get in touch
                  <ArrowUpRight />
                </span>
              </div>
            </ScrollReveal>
          </div>
        </section>
        <section
          className="how-questions"
          aria-labelledby="how-questions-title"
        >
          <h2 id="how-questions-title">Before you start.</h2>
          <div>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <ChevronDown aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
