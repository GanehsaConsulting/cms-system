import {
  compareTextAsc,
  getBooleanFlag,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import { paginateList } from "@/lib/list/pagination";
import type { Client } from "@/types/client";
import type { PublicClientSummary } from "@/types/public-client";
import { toPublicClientSummary } from "@/types/public-client";
import type { PublicPaginatedList } from "@/types/public-article";

export const PUBLIC_CLIENT_DEFAULT_LIMIT = 20;
export const PUBLIC_CLIENT_MAX_LIMIT = 100;

export type PublicClientSort = "name-asc" | "name-desc" | "featured-first";

export interface PublicClientListQuery {
  featured?: boolean | null;
  search?: string;
  sort?: PublicClientSort;
  page?: number;
  limit?: number;
}

export function parsePublicClientListQuery(
  searchParams: URLSearchParams,
): PublicClientListQuery {
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(
    searchParams.get("limit") ?? String(PUBLIC_CLIENT_DEFAULT_LIMIT),
    10,
  );

  const sortRaw = searchParams.get("sort")?.trim() || "name-asc";
  const sort: PublicClientSort =
    sortRaw === "name-desc" || sortRaw === "featured-first"
      ? sortRaw
      : "name-asc";

  return {
    featured: getBooleanFlag(searchParams, "featured"),
    search: getSearchQuery(searchParams),
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    limit:
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, PUBLIC_CLIENT_MAX_LIMIT)
        : PUBLIC_CLIENT_DEFAULT_LIMIT,
  };
}

function sortClients(clients: Client[], sort: PublicClientSort): Client[] {
  return [...clients].sort((left, right) => {
    switch (sort) {
      case "name-desc":
        return compareTextAsc(right.name, left.name);
      case "featured-first":
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }
        return compareTextAsc(left.name, right.name);
      default:
        return compareTextAsc(left.name, right.name);
    }
  });
}

export function filterPublicClients(
  clients: Client[],
  query: PublicClientListQuery,
): Client[] {
  return sortClients(
    clients
      .filter((client) =>
        query.featured === null || query.featured === undefined
          ? true
          : client.featured === query.featured,
      )
      .filter((client) =>
        matchesSearch(query.search ?? "", [
          client.name,
          client.website,
          client.description,
          ...client.testimonials.flatMap((item) => [
            item.quote,
            item.authorName,
            item.authorTitle,
          ]),
        ]),
      ),
    query.sort ?? "name-asc",
  );
}

export function paginatePublicClientSummaries(
  clients: Client[],
  page: number,
  limit: number,
): PublicPaginatedList<PublicClientSummary> {
  const paginated = paginateList(clients, page, limit);

  return {
    items: paginated.items.map(toPublicClientSummary),
    pagination: {
      page: paginated.page,
      limit: paginated.pageSize,
      total: paginated.total,
      totalPages: paginated.totalPages,
    },
  };
}

export function emptyPublicClientList(
  limit = PUBLIC_CLIENT_DEFAULT_LIMIT,
): PublicPaginatedList<PublicClientSummary> {
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
