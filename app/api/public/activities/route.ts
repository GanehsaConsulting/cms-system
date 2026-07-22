import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareIsoDesc,
  compareTextAsc,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import {
  publicError,
  publicListJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getContentActivities } from "@/lib/db/content-activities";
import { paginateList } from "@/lib/list/pagination";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "activities")) {
    return publicListJson([], {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
  }

  const query = getSearchQuery(searchParams);
  const kind = searchParams.get("kind")?.trim() || null;
  const showTitleParam = searchParams.get("showTitle")?.trim();
  const sort = searchParams.get("sort")?.trim() || "displayAt-desc";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10),
  );
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10)),
  );

  const activities = await getContentActivities(result.brand.id);
  const filtered = activities
    .filter((item) => item.status === "published")
    .filter((item) => (kind ? item.kind === kind : true))
    .filter((item) => {
      if (showTitleParam === "true") {
        return item.showTitle;
      }
      if (showTitleParam === "false") {
        return !item.showTitle;
      }
      return true;
    })
    .filter((item) =>
      matchesSearch(query, [
        item.title,
        item.excerpt,
        item.content,
        item.linkUrl,
      ]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "title-asc":
          return compareTextAsc(left.title, right.title);
        case "clicks-desc":
          return right.clickCount - left.clickCount;
        case "displayAt-asc":
          return (
            new Date(left.displayAt).getTime() -
            new Date(right.displayAt).getTime()
          );
        case "updatedAt-desc":
          return compareIsoDesc(left.updatedAt, right.updatedAt);
        default:
          return compareIsoDesc(left.displayAt, right.displayAt);
      }
    });

  const paginated = paginateList(filtered, page, limit);

  return publicListJson(paginated.items, {
    page: paginated.page,
    limit: paginated.pageSize,
    total: paginated.total,
    totalPages: paginated.totalPages,
  });
}
