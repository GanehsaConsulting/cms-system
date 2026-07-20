import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareTextAsc,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getPriceCategories } from "@/lib/db/price-categories";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "prices")) {
    return publicJson([]);
  }

  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "label-asc";
  const categories = await getPriceCategories();
  const data = categories
    .filter((category) => matchesSearch(query, [category.id, category.label]))
    .sort((left, right) => {
      switch (sort) {
        case "label-desc":
          return compareTextAsc(right.label, left.label);
        default:
          return compareTextAsc(left.label, right.label);
      }
    });

  return publicJson(data);
}
