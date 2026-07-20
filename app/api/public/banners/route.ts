import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareIsoDesc,
  compareTextAsc,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getBanners } from "@/lib/db/banners";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "banners")) {
    return publicJson([]);
  }

  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "updatedAt-desc";
  const key = searchParams.get("key")?.trim() || null;

  const banners = await getBanners(result.brand.id);
  const data = banners
    .filter((banner) => banner.isActive)
    .filter((banner) => (key ? banner.key === key : true))
    .filter((banner) =>
      matchesSearch(query, [banner.name, banner.key, banner.redirectUrl]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "name-asc":
          return compareTextAsc(left.name, right.name);
        case "key-asc":
          return compareTextAsc(left.key, right.key);
        default:
          return compareIsoDesc(left.updatedAt, right.updatedAt);
      }
    });

  return publicJson(data);
}
