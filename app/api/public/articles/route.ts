import {
  emptyPublicArticleList,
  filterPublicArticles,
  paginatePublicArticleSummaries,
  parsePublicArticleListQuery,
} from "@/lib/api/public-articles";
import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicListJson,
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

  const query = parsePublicArticleListQuery(searchParams);

  if (!brandHasFeature(result.brand, "articles")) {
    const empty = emptyPublicArticleList(query.limit);
    return publicListJson(empty.items, empty.pagination);
  }

  const articles = await getArticles(result.brand.id);
  const filtered = filterPublicArticles(articles, query);
  const page = paginatePublicArticleSummaries(
    filtered,
    query.page ?? 1,
    query.limit ?? 20,
  );

  return publicListJson(page.items, page.pagination);
}
