import type { PriceCategory } from "@/types/price-category";

export function getPriceCategoryLabel(
  categoryId: string,
  categories: PriceCategory[] = [],
) {
  const match = categories.find((category) => category.id === categoryId);
  if (match) {
    return match.label;
  }

  return categoryId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildPriceCategoryLabelMap(categories: PriceCategory[]) {
  return Object.fromEntries(
    categories.map((category) => [category.id, category.label]),
  ) as Record<string, string>;
}
