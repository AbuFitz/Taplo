import type { DemoState } from "../store";
import { newWidget } from "@/features/page/starter";

export interface QuickOffer {
  kind: "service" | "product";
  name: string;
  priceMode: "fixed" | "quote" | "free";
  price: string;
  minutes: string;
}

export function quickOfferErrors(input: QuickOffer) {
  const errors: Partial<Record<"name" | "price" | "minutes", string>> = {};
  if (!input.name.trim() || input.name.trim().length > 120)
    errors.name = "Use a name of up to 120 characters.";
  if (
    input.priceMode === "fixed" &&
    !/^\d{1,6}(\.\d{1,2})?$/.test(input.price.trim())
  )
    errors.price = "Enter an amount with up to two decimal places.";
  if (
    input.kind === "service" &&
    input.minutes &&
    (!/^\d+$/.test(input.minutes) ||
      Number(input.minutes) < 1 ||
      Number(input.minutes) > 1440)
  )
    errors.minutes = "Use 1 to 1,440 minutes, or leave this blank.";
  return errors;
}

/** One record and its existing block reference, without changing publication or booking readiness. */
export function addQuickOffer(
  state: DemoState,
  input: QuickOffer,
  id: string,
): DemoState {
  if (Object.keys(quickOfferErrors(input)).length) return state;
  const goods = input.kind === "product";
  const records = goods ? state.content.products : state.content.services;
  if (records?.some((record) => record.id === id)) return state;
  const priceMinor =
    input.priceMode === "fixed"
      ? Math.round(Number(input.price.trim()) * 100)
      : input.priceMode === "free"
        ? 0
        : undefined;
  const content = goods
    ? {
        ...state.content,
        products: [
          ...(state.content.products ?? []),
          {
            id,
            name: input.name.trim(),
            currency: "GBP" as const,
            priceMinor,
            kind: "product" as const,
            mode: "enquire" as const,
            archived: false,
            availability: "available" as const,
            facts: [],
            images: [],
            affiliate: false,
          },
        ],
      }
    : {
        ...state.content,
        services: [
          ...(state.content.services ?? []),
          {
            id,
            name: input.name.trim(),
            currency: "GBP" as const,
            priceMode: input.priceMode,
            priceMinor,
            durationMinutes: input.minutes ? Number(input.minutes) : undefined,
            bookingMode: "contact" as const,
            delivery: [],
            archived: false,
            sortOrder: state.content.services?.length ?? 0,
          },
        ],
      };
  const target = state.page.widgets.find((w) =>
    goods
      ? w.type === "products"
      : ["serviceList", "priceMenu"].includes(w.type),
  );
  const selectionKey = goods ? "productIds" : "serviceIds";
  const widgets = target
    ? state.page.widgets.map((w) =>
        w.id === target.id
          ? {
              ...w,
              hidden: false,
              settings: {
                ...w.settings,
                ...(Array.isArray(w.settings[selectionKey])
                  ? {
                      [selectionKey]: [
                        ...(w.settings[selectionKey] as string[]),
                        id,
                      ],
                    }
                  : {}),
              },
            }
          : w,
      )
    : [...state.page.widgets, newWidget(goods ? "products" : "serviceList")];
  return { ...state, content, page: { ...state.page, widgets } };
}
