import { buildPageViewModel } from "@/features/page/renderer/view-model";
import {
  initialConfig,
  toContent,
  toPage,
} from "@/features/showcase/lab-state";
import { getWidget } from "@/features/page/widgets/registry";
import { serviceListItems } from "@/features/page/widgets/service-list";
import { referencedRecords } from "@/features/page/widgets/selection";
import { formatMoney, formatPrice } from "@/features/services/format";
import type { Scenario } from "@/features/showcase/content";
import type { HeroScene } from "./hero-scene-types";

/** Public page anatomy is derived from the same validated engine model as the live preview. */
export function heroScenes(): HeroScene[] {
  return (
    [
      { label: "Appointments", scenario: "physio" },
      { label: "Stock", scenario: "brookfield" },
      { label: "Portfolios", scenario: "sora" },
      { label: "Cafés", scenario: "corner" },
    ] as { label: string; scenario: Scenario }[]
  ).map(({ label, scenario }) => {
    const config = initialConfig(scenario);
    const model = buildPageViewModel(toContent(config), toPage(config), {
      plan: "business",
    });
    const business = model.business;
    return {
      label,
      scenario,
      name: business.identity.name,
      slug: business.identity.slug,
      action: model.primary?.label ?? null,
      blocks: model.visible.slice(0, 4).map((block) => {
        let entries: HeroScene["blocks"][number]["entries"] = [];
        if (block.type === "serviceList" || block.type === "priceMenu")
          entries = serviceListItems(
            business.services,
            block.settings,
            model.ctx.featuredServiceIds,
          )
            .slice(0, 2)
            .map((service) => ({
              title: service.name,
              detail: formatPrice(service),
            }));
        else if (block.type === "products")
          entries = referencedRecords(
            business.products,
            block.settings.productIds,
          )
            .filter((product) => !product.archived)
            .slice(0, 2)
            .map((product) => ({
              title: product.name,
              detail:
                product.priceMinor === undefined
                  ? "Enquire"
                  : formatMoney(product.priceMinor, product.currency),
            }));
        else if (block.type === "team")
          entries = referencedRecords(business.staff, block.settings.staffIds)
            .slice(0, 2)
            .map((person) => ({
              title: person.name,
              detail: person.role ?? "",
            }));
        else if (block.type === "faq")
          entries = referencedRecords(business.faqs, block.settings.faqIds)
            .slice(0, 2)
            .map((question) => ({ title: question.question, detail: "" }));
        else if (block.type === "gallery")
          entries = referencedRecords(business.gallery, block.settings.itemIds)
            .slice(0, 2)
            .map((image) => ({
              title: image.caption ?? image.image.alt,
              detail: "",
            }));
        return {
          title:
            typeof block.settings.title === "string" && block.settings.title
              ? block.settings.title
              : (getWidget(block.type)?.label ?? block.type),
          kind: block.type,
          variant:
            typeof block.settings.variant === "string"
              ? block.settings.variant
              : "",
          entries,
        };
      }),
    };
  });
}
