import {
  compareIsoDesc,
  compareTextAsc,
  getBooleanFlag,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import { paginateList } from "@/lib/list/pagination";
import type { Price } from "@/types/price";
import type { PublicPaginatedList } from "@/types/public-article";
import type { PublicPriceSummary } from "@/types/public-price";
import { toPublicPriceSummary } from "@/types/public-price";

export const PUBLIC_PRICE_DEFAULT_LIMIT = 20;
export const PUBLIC_PRICE_MAX_LIMIT = 100;

export type PublicPriceSort =
  | "updatedAt-desc"
  | "price-asc"
  | "price-desc"
  | "packageName-asc";

export interface PublicPriceListQuery {
  category?: string | null;
  highlighted?: boolean | null;
  search?: string;
  sort?: PublicPriceSort;
  page?: number;
  limit?: number;
}

export function parsePublicPriceListQuery(
  searchParams: URLSearchParams,
): PublicPriceListQuery {
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(
    searchParams.get("limit") ?? String(PUBLIC_PRICE_DEFAULT_LIMIT),
    10,
  );

  const sortRaw = searchParams.get("sort")?.trim() || "updatedAt-desc";
  const sort: PublicPriceSort =
    sortRaw === "price-asc" ||
    sortRaw === "price-desc" ||
    sortRaw === "packageName-asc"
      ? sortRaw
      : "updatedAt-desc";

  return {
    category:
      searchParams.get("category")?.trim() ||
      searchParams.get("serviceSlug")?.trim() ||
      null,
    highlighted: getBooleanFlag(searchParams, "highlighted"),
    search: getSearchQuery(searchParams),
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    limit:
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, PUBLIC_PRICE_MAX_LIMIT)
        : PUBLIC_PRICE_DEFAULT_LIMIT,
  };
}

function sortPrices(prices: Price[], sort: PublicPriceSort): Price[] {
  return [...prices].sort((left, right) => {
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
}

export function filterPublicPrices(
  prices: Price[],
  query: PublicPriceListQuery,
): Price[] {
  return sortPrices(
    prices
      .filter((price) => price.isActive)
      .filter((price) =>
        query.category
          ? price.category === query.category || price.serviceSlug === query.category
          : true,
      )
      .filter((price) =>
        query.highlighted === null || query.highlighted === undefined
          ? true
          : price.highlighted === query.highlighted,
      )
      .filter((price) =>
        matchesSearch(query.search ?? "", [
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
      ),
    query.sort ?? "updatedAt-desc",
  );
}

export function paginatePublicPriceSummaries(
  prices: Price[],
  page: number,
  limit: number,
): PublicPaginatedList<PublicPriceSummary> {
  const paginated = paginateList(prices, page, limit);

  return {
    items: paginated.items.map(toPublicPriceSummary),
    pagination: {
      page: paginated.page,
      limit: paginated.pageSize,
      total: paginated.total,
      totalPages: paginated.totalPages,
    },
  };
}

export function emptyPublicPriceList(
  limit = PUBLIC_PRICE_DEFAULT_LIMIT,
): PublicPaginatedList<PublicPriceSummary> {
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
