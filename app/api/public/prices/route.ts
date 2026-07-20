import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareIsoDesc,
  compareTextAsc,
  getBooleanFlag,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getPrices } from "@/lib/db/prices";

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

  const category =
    searchParams.get("category")?.trim() ||
    searchParams.get("serviceSlug")?.trim() ||
    null;
  const highlighted = getBooleanFlag(searchParams, "highlighted");
  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "updatedAt-desc";

  const prices = await getPrices(result.brand.id);
  const data = prices
    .filter((price) => price.isActive)
    .filter((price) =>
      category
        ? price.category === category || price.serviceSlug === category
        : true,
    )
    .filter((price) =>
      highlighted === null ? true : price.highlighted === highlighted,
    )
    .filter((price) =>
      matchesSearch(query, [
        price.slug,
        price.serviceSlug,
        price.category,
        price.packageName.id,
        price.packageName.en,
        price.packageName.zh,
        price.service.id,
        price.service.en,
        price.service.zh,
        price.description.id,
        price.description.en,
        price.description.zh,
      ]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "price-asc":
          return left.price - right.price;
        case "price-desc":
          return right.price - left.price;
        case "packageName-asc":
          return compareTextAsc(
            left.packageName.en || left.packageName.id,
            right.packageName.en || right.packageName.id,
          );
        default:
          return compareIsoDesc(left.updatedAt, right.updatedAt);
      }
    });

  return publicJson(data);
}
