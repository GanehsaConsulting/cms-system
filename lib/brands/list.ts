import type {
  BrandListSort,
  BrandStatusFilter,
} from "@/config/brand-list";
import { getBrandFeatureLabel } from "@/config/brand";
import type { Brand } from "@/types/brand";

export function getBrandSearchText(brand: Brand): string {
  return [
    brand.id,
    brand.name,
    brand.slug,
    brand.description,
    ...brand.features.map((featureId) => getBrandFeatureLabel(featureId)),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterBrands(
  brands: Brand[],
  status: BrandStatusFilter,
  query: string,
): Brand[] {
  const normalizedQuery = query.trim().toLowerCase();

  return brands.filter((brand) => {
    if (status !== "all" && brand.status !== status) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getBrandSearchText(brand).includes(normalizedQuery);
  });
}

export function sortBrands(brands: Brand[], sort: BrandListSort): Brand[] {
  const next = [...brands];

  next.sort((left, right) => {
    switch (sort) {
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "name-desc":
        return right.name.localeCompare(left.name);
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()
        );
      default:
        return (
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
    }
  });

  return next;
}
