import type {
  BusinessContentInput,
  ProductContent,
} from "@/features/businesses/content";
import { normProduct } from "../actions";

/** Compare the actual record at commit time; retries of the same save never duplicate an item. */
export function mergeProductEdit(
  current: BusinessContentInput["products"],
  draft: ProductContent,
  expected: string | null,
): { products: ProductContent[]; conflict?: true } {
  const products = (current ?? []).map(normProduct);
  const existing = products.find((product) => product.id === draft.id);
  const actual = existing ? JSON.stringify(existing) : null;
  if (
    (expected !== null && !existing) ||
    (actual !== expected && actual !== JSON.stringify(draft))
  )
    return { products, conflict: true };
  return {
    products: existing
      ? products.map((product) => (product.id === draft.id ? draft : product))
      : [...products, draft],
  };
}
