import type { BusinessContentInput } from "@/features/businesses/content";
import { formatMoney } from "@/features/services/format";
import type { ContentChoice } from "./content-model";
import { ContentIllustration } from "./ContentIllustration";
import { ProfileImage } from "../renderer/ProfileImage";

/** Small, read-only choices built from the owner's content. Never writes a sample into their page. */
export function ContentPicture({
  choice,
  content,
}: {
  choice: ContentChoice;
  content: BusinessContentInput;
}) {
  const kind = choice.needs;
  const services = (content.services ?? [])
    .filter((s) => !s.archived)
    .slice(0, 2);
  if (kind === "service" && services.length)
    return (
      <span
        className="grid h-full content-center gap-1 p-2.5"
        aria-hidden="true"
      >
        {services.map((s) => (
          <span
            key={s.id}
            className="flex items-center justify-between gap-2 rounded-md bg-white px-2 py-1.5 text-[10px] text-neutral-900"
          >
            <span className="truncate font-medium">{s.name}</span>
            <span className="shrink-0">
              {s.priceMode === "free"
                ? "Free"
                : s.priceMinor !== undefined
                  ? formatMoney(s.priceMinor, s.currency ?? "GBP")
                  : "Ask us"}
            </span>
          </span>
        ))}
      </span>
    );
  const images =
    kind === "staff"
      ? (content.staff ?? [])
          .filter((s) => s.photo)
          .slice(0, 3)
          .map((s) => ({ image: s.photo!, label: s.name }))
      : kind === "photo"
        ? (content.gallery ?? [])
            .slice(0, 3)
            .map((s) => ({ image: s.image, label: "" }))
        : kind === "product" || kind === "vehicle"
          ? (content.products ?? [])
              .filter(
                (s) =>
                  !s.archived &&
                  (kind === "vehicle"
                    ? s.kind === "vehicle"
                    : s.kind !== "vehicle") &&
                  (s.image || s.images?.[0]),
              )
              .slice(0, 2)
              .map((s) => ({ image: s.image ?? s.images![0]!, label: s.name }))
          : [];
  if (images.length)
    return (
      <span aria-hidden="true" className="flex h-full gap-1.5 p-2">
        {images.map(({ image, label }, i) => (
          <span
            key={i}
            className="relative min-w-0 flex-1 overflow-hidden rounded-md bg-white"
          >
            <ProfileImage image={{ ...image, alt: "" }} sizes="100px" />
            {label ? (
              <span className="absolute inset-x-0 bottom-0 truncate bg-white/95 px-1.5 py-1 text-[9px] font-medium text-neutral-900">
                {label}
              </span>
            ) : null}
          </span>
        ))}
      </span>
    );
  if (kind === "faq" && content.faqs?.length)
    return (
      <span
        aria-hidden="true"
        className="grid h-full content-center gap-1 p-2.5"
      >
        {content.faqs.slice(0, 2).map((f) => (
          <span
            key={f.id}
            className="truncate rounded-md bg-white p-2 text-[10px] font-medium text-neutral-900"
          >
            {f.question}
          </span>
        ))}
      </span>
    );
  return <ContentIllustration choice={choice} />;
}

const NOUNS: Partial<
  Record<NonNullable<ContentChoice["needs"]>, [string, string]>
> = {
  service: ["service", "services"],
  product: ["product", "products"],
  vehicle: ["vehicle", "vehicles"],
  staff: ["team member", "team members"],
  photo: ["photo", "photos"],
  review: ["review", "reviews"],
  faq: ["answer", "answers"],
  social: ["social link", "social links"],
  credential: ["credential", "credentials"],
  offer: ["offer", "offers"],
};
export function contentReuseLabel(
  kind: NonNullable<ContentChoice["needs"]>,
  n: number,
) {
  const noun = NOUNS[kind];
  return noun
    ? `Uses your ${n} ${noun[n === 1 ? 0 : 1]}`
    : "Uses your saved details";
}
