import {
  compareIsoDesc,
  compareTextAsc,
  getBooleanFlag,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import { paginateList } from "@/lib/list/pagination";
import type { Portfolio, PortfolioWorkType } from "@/types/portfolio";
import type { PublicPaginatedList } from "@/types/public-article";
import type { PublicPortfolioSummary } from "@/types/public-portfolio";
import { toPublicPortfolioSummary } from "@/types/public-portfolio";

export const PUBLIC_PORTFOLIO_DEFAULT_LIMIT = 20;
export const PUBLIC_PORTFOLIO_MAX_LIMIT = 100;

const WORK_TYPES = new Set<PortfolioWorkType>(["social-media", "website"]);

export type PublicPortfolioSort =
  | "updatedAt-desc"
  | "title-asc"
  | "featured-first";

export interface PublicPortfolioListQuery {
  featured?: boolean | null;
  workType?: PortfolioWorkType | null;
  clientId?: string | null;
  search?: string;
  sort?: PublicPortfolioSort;
  page?: number;
  limit?: number;
  /** Exclude one work id (e.g. current detail page). */
  excludeId?: string | null;
}

export function parsePublicPortfolioListQuery(
  searchParams: URLSearchParams,
): PublicPortfolioListQuery {
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(
    searchParams.get("limit") ?? String(PUBLIC_PORTFOLIO_DEFAULT_LIMIT),
    10,
  );

  const workTypeRaw = searchParams.get("workType")?.trim() || null;
  const workType =
    workTypeRaw && WORK_TYPES.has(workTypeRaw as PortfolioWorkType)
      ? (workTypeRaw as PortfolioWorkType)
      : null;

  const sortRaw = searchParams.get("sort")?.trim() || "updatedAt-desc";
  const sort: PublicPortfolioSort =
    sortRaw === "title-asc" || sortRaw === "featured-first"
      ? sortRaw
      : "updatedAt-desc";

  return {
    featured: getBooleanFlag(searchParams, "featured"),
    workType,
    clientId: searchParams.get("clientId")?.trim() || null,
    search: getSearchQuery(searchParams),
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    limit:
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, PUBLIC_PORTFOLIO_MAX_LIMIT)
        : PUBLIC_PORTFOLIO_DEFAULT_LIMIT,
    excludeId: searchParams.get("excludeId")?.trim() || null,
  };
}

function sortPortfolioItems(
  items: Portfolio[],
  sort: PublicPortfolioSort,
): Portfolio[] {
  return [...items].sort((left, right) => {
    switch (sort) {
      case "title-asc":
        return compareTextAsc(left.title, right.title);
      case "featured-first":
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }
        return compareIsoDesc(left.updatedAt, right.updatedAt);
      default:
        return compareIsoDesc(left.updatedAt, right.updatedAt);
    }
  });
}

export function filterPublicPortfolioItems(
  items: Portfolio[],
  query: PublicPortfolioListQuery,
): Portfolio[] {
  return sortPortfolioItems(
    items
      .filter((item) =>
        query.excludeId ? item.id !== query.excludeId : true,
      )
      .filter((item) =>
        query.featured === null || query.featured === undefined
          ? true
          : item.featured === query.featured,
      )
      .filter((item) => (query.workType ? item.workType === query.workType : true))
      .filter((item) => (query.clientId ? item.clientId === query.clientId : true))
      .filter((item) =>
        matchesSearch(query.search ?? "", [
          item.title,
          item.description,
          item.url,
          item.workType,
          item.clientId,
        ]),
      ),
    query.sort ?? "updatedAt-desc",
  );
}

export function paginatePublicPortfolioSummaries(
  items: Portfolio[],
  page: number,
  limit: number,
): PublicPaginatedList<PublicPortfolioSummary> {
  const paginated = paginateList(items, page, limit);

  return {
    items: paginated.items.map(toPublicPortfolioSummary),
    pagination: {
      page: paginated.page,
      limit: paginated.pageSize,
      total: paginated.total,
      totalPages: paginated.totalPages,
    },
  };
}

export function emptyPublicPortfolioList(
  limit = PUBLIC_PORTFOLIO_DEFAULT_LIMIT,
): PublicPaginatedList<PublicPortfolioSummary> {
  return {
    items: [],
    pagination: {
      page: 1,
      limit,
      total: 0,
      totalPages: 1,
    },
  };
}
