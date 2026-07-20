import {
  getRelatedPublicArticles,
  parseRelatedLimit,
} from "@/lib/api/public-articles";
import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getArticleBySlug, getArticles } from "@/lib/db/articles";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "articles")) {
    return publicJson([]);
  }

  const { slug } = await context.params;
  const decodedSlug = decodeURIComponent(slug);
  const source = await getArticleBySlug(result.brand.id, decodedSlug);

  if (!source || source.status !== "published") {
    return publicError("Article not found", 404);
  }

  const limit = parseRelatedLimit(searchParams);
  const articles = await getArticles(result.brand.id);
  const related = getRelatedPublicArticles(articles, source, limit);

  return publicJson(related);
}
