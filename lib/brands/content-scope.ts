export interface BrandScoped {
  brandId: string;
}

export function hasBrandId(value: { brandId?: string | null | undefined }): value is BrandScoped {
  return typeof value.brandId === "string" && value.brandId.length > 0;
}

export function filterByBrand<T extends { brandId?: string | null | undefined }>(
  items: T[],
  brandId: string,
): Array<T & BrandScoped> {
  return items.filter(
    (item): item is T & BrandScoped => item.brandId === brandId,
  );
}

export function assertBrandMatch(
  item: { brandId?: string | null | undefined },
  brandId: string,
  notFoundMessage = "Not found",
): asserts item is BrandScoped {
  if (!hasBrandId(item) || item.brandId !== brandId) {
    throw new Error(notFoundMessage);
  }
}
