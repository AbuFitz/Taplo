import type { BlockOf } from "../contracts/blocks"
import { cn } from "@/lib/utils"
import { Section, ProfileImage, type BlockProps } from "./shared"

function Caption({ text }: { text?: string }) {
  return text ? <figcaption className="mt-2 text-sm text-tp-muted">{text}</figcaption> : null
}

/** Grid: uniform square tiles, practical and compact. */
function GridGallery({ vm }: BlockProps<BlockOf<"gallery">>) {
  return (
    <Section id="gallery" title="Our work">
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {vm.business.gallery.map((g) => (
          <li key={g.id}>
            <figure>
              <div className="relative aspect-square overflow-hidden rounded-tp"><ProfileImage image={g.image} sizes="(min-width: 1024px) 25vw, 50vw" /></div>
              <Caption text={g.caption} />
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Editorial: asymmetric, image-first composition with no heading chrome. */
const EDITORIAL_SPANS = [
  "col-span-2 row-span-2 aspect-[4/5] md:col-span-2",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-square",
  "col-span-2 aspect-[16/9] md:col-span-2",
  "aspect-[3/4]",
] as const

function EditorialGallery({ vm }: BlockProps<BlockOf<"gallery">>) {
  return (
    <section id="gallery" aria-label="Gallery" className="pb-[var(--tp-section-y)]">
      <div className="tp-container">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {vm.business.gallery.map((g, i) => (
            <li key={g.id} className={cn("relative overflow-hidden rounded-tp", EDITORIAL_SPANS[i % EDITORIAL_SPANS.length])}>
              <ProfileImage image={g.image} sizes="(min-width: 768px) 25vw, 50vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Before/after: paired images where supplied; single images fall back to the grid look. */
function BeforeAfterGallery({ vm }: BlockProps<BlockOf<"gallery">>) {
  return (
    <Section id="gallery" title="Before and after">
      <ul className="grid gap-8 md:grid-cols-2">
        {vm.business.gallery.map((g) => (
          <li key={g.id}>
            <figure>
              {g.beforeImage ? (
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-l-tp"><ProfileImage image={g.beforeImage} sizes="25vw" /><span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">Before</span></div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-r-tp"><ProfileImage image={g.image} sizes="25vw" /><span className="absolute left-2 top-2 rounded bg-tp-accent px-2 py-0.5 text-xs font-semibold text-tp-accent-fg">After</span></div>
                </div>
              ) : (
                <div className="relative aspect-[8/5] overflow-hidden rounded-tp"><ProfileImage image={g.image} sizes="50vw" /></div>
              )}
              <Caption text={g.caption} />
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function GalleryBlock(props: BlockProps<BlockOf<"gallery">>) {
  switch (props.config.variant) {
    case "grid": return <GridGallery {...props} />
    case "editorial": return <EditorialGallery {...props} />
    case "beforeAfter": return <BeforeAfterGallery {...props} />
  }
}
