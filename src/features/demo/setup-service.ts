export interface SetupServiceRow {
  id: string;
  name: string;
  price: string;
  minutes: string;
  priceMode?: "fixed" | "from" | "quote" | "free";
}

export function serviceRowErrors(row: SetupServiceRow) {
  const errors: { name?: string; price?: string; minutes?: string } = {};
  if (!row.name.trim()) errors.name = "Give this service a name.";
  if (
    row.priceMode !== "quote" &&
    row.priceMode !== "free" &&
    !/^\d{1,6}(\.\d{1,2})?$/.test(row.price.trim())
  )
    errors.price = "Enter a price, or choose quote or free.";
  if (
    row.minutes &&
    (!/^\d+$/.test(row.minutes) ||
      Number(row.minutes) < 1 ||
      Number(row.minutes) > 1440)
  )
    errors.minutes = "Use 1 to 1,440 minutes, or leave this blank.";
  return errors;
}
export const serviceRowEmpty = (row: SetupServiceRow) =>
  !row.name.trim() && !row.price && !row.minutes;
export const serviceRowValid = (row: SetupServiceRow) =>
  Object.keys(serviceRowErrors(row)).length === 0;
