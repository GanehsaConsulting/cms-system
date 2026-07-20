import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import { getPublicArticleCategories } from "@/lib/api/public-article-categories";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "articles")) {
    return publicJson([]);
  }

  const categories = await getPublicArticleCategories();
  return publicJson(categories);
}
