import { describe, it, expect } from "vitest";
import { mergeProductEdit } from "./product-edit";
import { normProduct } from "../actions";
const item = normProduct({ id: "one", name: "Ceramic cup", priceMinor: 1200 });
describe("product save concurrency and retry", () => {
  it("adds an item once and retries the identical save without duplicating its id", () => {
    const first = mergeProductEdit([], item, null);
    const retry = mergeProductEdit(first.products, item, null);
    expect(retry.conflict).toBeUndefined();
    expect(retry.products).toEqual([item]);
  });
  it("preserves unrelated items when replacing one product", () => {
    const other = { ...item, id: "two", name: "Plate" };
    expect(
      mergeProductEdit(
        [item, other],
        { ...item, priceMinor: 1500 },
        JSON.stringify(item),
      ).products,
    ).toEqual([{ ...item, priceMinor: 1500 }, other]);
  });
  it("rejects a concurrent price change instead of overwriting it", () => {
    const newer = { ...item, priceMinor: 1800 };
    expect(
      mergeProductEdit(
        [newer],
        { ...item, name: "My cup" },
        JSON.stringify(item),
      ),
    ).toEqual({ products: [newer], conflict: true });
  });
  it("does not resurrect a product removed elsewhere", () =>
    expect(mergeProductEdit([], item, JSON.stringify(item))).toEqual({
      products: [],
      conflict: true,
    }));
  it("does not overwrite a different item that already has the new item's id", () => {
    const other = { ...item, name: "Other cup" };
    expect(mergeProductEdit([other], item, null)).toEqual({
      products: [other],
      conflict: true,
    });
  });
  it("accepts an identical committed result as an idempotent edit retry", () => {
    const changed = { ...item, priceMinor: 1600 };
    expect(mergeProductEdit([changed], changed, JSON.stringify(item))).toEqual({
      products: [changed],
    });
  });
});
