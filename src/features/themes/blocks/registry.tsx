import type { BlockConfig } from "../contracts/blocks"
import type { PublicProfileViewModel } from "../renderer/view-model"
import { AboutBlock } from "./about"
import { BookingBlock } from "./booking"
import { CaseStudiesBlock } from "./case-studies"
import { ContactBlock } from "./contact"
import { FaqBlock } from "./faq"
import { GalleryBlock } from "./gallery"
import { HeroBlock } from "./hero"
import { ReviewsBlock } from "./reviews"
import { ServicesBlock } from "./services"
import { TeamBlock } from "./team"

/**
 * Trusted block registry. Stored configuration refers to blocks by type +
 * variant; this switch is the only place those references become components.
 * Adding a block = new contract member + new component here.
 */
export function renderBlock(config: BlockConfig, vm: PublicProfileViewModel) {
  switch (config.type) {
    case "hero": return <HeroBlock config={config} vm={vm} />
    case "services": return <ServicesBlock config={config} vm={vm} />
    case "reviews": return <ReviewsBlock config={config} vm={vm} />
    case "gallery": return <GalleryBlock config={config} vm={vm} />
    case "team": return <TeamBlock config={config} vm={vm} />
    case "booking": return <BookingBlock config={config} vm={vm} />
    case "contact": return <ContactBlock config={config} vm={vm} />
    case "about": return <AboutBlock config={config} vm={vm} />
    case "faq": return <FaqBlock config={config} vm={vm} />
    case "caseStudies": return <CaseStudiesBlock config={config} vm={vm} />
  }
}
