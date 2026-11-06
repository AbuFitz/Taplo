"use client";
import Link from "next/link";
import { ArrowUpRight, Check, Star, ShieldCheck } from "lucide-react";
import {
  googleReviewUrl,
  isGoogleReviewUrl,
} from "@/features/page/widgets/google-reviews";
import { useDraft } from "../hooks";
import { UrlField } from "../ui";
import { PageHeader, Panel } from "./Panel";
export function Reviews() {
  const { c, ent, setContent } = useDraft();
  if (!c || !ent) return null;
  const url = googleReviewUrl(c);
  return (
    <div className="ts-reviews-page">
      <PageHeader
        scene="reviews"
        title="Good work. Real feedback."
        description="Make it easy for people to see the experiences behind your business."
      />
      <div className="ts-reviews-grid">
        <Panel
          title="Your Google review link"
          description="A familiar place for customers to read and leave a review."
        >
          {ent.reviewLinks ? (
            <div className="grid gap-5">
              <div className="ts-source-status">
                <span className="ts-source-mark">G</span>
                <span>
                  <strong>Google reviews</strong>
                  <small>
                    {url ? "Review link added" : "Add your business link"}
                  </small>
                </span>
                {url ? <Check aria-label="Link added" /> : null}
              </div>
              <UrlField
                label="Google Maps or review link"
                value={url}
                validate={isGoogleReviewUrl}
                onCommit={(value) =>
                  setContent((current) => ({
                    ...current,
                    reviewLinks: [
                      ...(current.reviewLinks ?? []).filter(
                        (item) => item.platform !== "google",
                      ),
                      ...(value
                        ? [{ platform: "google" as const, url: value }]
                        : []),
                    ],
                  }))
                }
                help="In Google Maps, open your business, choose Share and copy the link."
              />
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ts-text-action"
                >
                  Open on Google
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Google review links are included with Core.
              </p>
              <Link
                className="ts-text-action"
                href="/dashboard/settings?section=plan"
              >
                Compare plans
                <ArrowUpRight />
              </Link>
            </div>
          )}
        </Panel>
        <div className="ts-review-guidance">
          <Star aria-hidden="true" />
          <h2>Let your reputation do the talking.</h2>
          <p>
            Place reviews beside your services, photos or team so customers can
            feel confident about the next step.
          </p>
          <Link href="/dashboard/page?task=content">
            Arrange your page
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <div>
            <ShieldCheck aria-hidden="true" />
            <p>
              Keep review sources clear. A link to Google stays a link to
              Google; ratings and individual reviews come from a verified
              source.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
