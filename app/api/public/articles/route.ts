import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareIsoAsc,
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
import { getArticles } from "@/lib/db/articles";

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

  const highlighted = getBooleanFlag(searchParams, "highlighted");
  const category = searchParams.get("category")?.trim() || null;
  const tag = searchParams.get("tag")?.trim().toLowerCase() || null;
  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "publishedAt-desc";

  const articles = await getArticles();
  const data = articles
    .filter((article) => article.status === "published")
    .filter((article) =>
      highlighted === null ? true : article.highlighted === highlighted,
    )
    .filter((article) => (category ? article.category === category : true))
    .filter((article) =>
      tag
        ? article.tags.some((item) => item.toLowerCase() === tag)
        : true,
    )
    .filter((article) =>
      matchesSearch(query, [
        article.title,
        article.slug,
        article.excerpt,
        article.authorName,
        article.category,
        ...article.tags,
      ]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "publishedAt-asc":
          return compareIsoAsc(left.publishedAt, right.publishedAt);
        case "title-asc":
          return compareTextAsc(left.title, right.title);
        case "title-desc":
          return compareTextAsc(right.title, left.title);
        case "updatedAt-desc":
          return compareIsoDesc(left.updatedAt, right.updatedAt);
        default:
          return compareIsoDesc(left.publishedAt, right.publishedAt);
      }
    });

  return publicJson(data);
}
