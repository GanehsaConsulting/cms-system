import {
  compareIsoAsc,
  compareIsoDesc,
  compareTextAsc,
  matchesSearch,
} from "@/lib/api/public-query";
import { paginateList } from "@/lib/list/pagination";
import type { Article } from "@/types/article";
import type {
  PublicArticleSummary,
  PublicPaginatedList,
} from "@/types/public-article";
import { toPublicArticleSummary } from "@/types/public-article";

export const PUBLIC_ARTICLE_DEFAULT_LIMIT = 20;
export const PUBLIC_ARTICLE_MAX_LIMIT = 100;

export type PublicArticleSort =
  | "publishedAt-desc"
  | "publishedAt-asc"
  | "title-asc"
  | "title-desc"
  | "updatedAt-desc";

export interface PublicArticleListQuery {
  highlighted?: boolean | null;
  category?: string | null;
  tag?: string | null;
  search?: string;
  sort?: PublicArticleSort;
  page?: number;
  limit?: number;
  /** Exclude one slug (e.g. current detail page). */
  excludeSlug?: string | null;
}

export function parsePublicArticleListQuery(
  searchParams: URLSearchParams,
): PublicArticleListQuery {
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(
    searchParams.get("limit") ?? String(PUBLIC_ARTICLE_DEFAULT_LIMIT),
    10,
  );

  const highlightedRaw = searchParams.get("highlighted");
  let highlighted: boolean | null = null;
  if (highlightedRaw === "true" || highlightedRaw === "1") {
    highlighted = true;
  } else if (highlightedRaw === "false" || highlightedRaw === "0") {
    highlighted = false;
  }

  const sortRaw = searchParams.get("sort")?.trim() || "publishedAt-desc";
  const sort: PublicArticleSort =
    sortRaw === "publishedAt-asc" ||
    sortRaw === "title-asc" ||
    sortRaw === "title-desc" ||
    sortRaw === "updatedAt-desc"
      ? sortRaw
      : "publishedAt-desc";

  return {
    highlighted,
    category: searchParams.get("category")?.trim() || null,
    tag: searchParams.get("tag")?.trim().toLowerCase() || null,
    search: (searchParams.get("q") ?? searchParams.get("search") ?? "")
      .trim()
      .toLowerCase(),
    sort,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    limit:
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, PUBLIC_ARTICLE_MAX_LIMIT)
        : PUBLIC_ARTICLE_DEFAULT_LIMIT,
    excludeSlug: searchParams.get("excludeSlug")?.trim() || null,
  };
}

function sortArticles(articles: Article[], sort: PublicArticleSort): Article[] {
  return [...articles].sort((left, right) => {
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
}

export function filterPublicArticles(
  articles: Article[],
  query: PublicArticleListQuery,
  options: { publishedOnly?: boolean } = {},
): Article[] {
  const { publishedOnly = true } = options;

  return sortArticles(
    articles
      .filter((article) =>
        publishedOnly ? article.status === "published" : true,
      )
      .filter((article) =>
        query.excludeSlug ? article.slug !== query.excludeSlug : true,
      )
      .filter((article) =>
        query.highlighted === null || query.highlighted === undefined
          ? true
          : article.highlighted === query.highlighted,
      )
      .filter((article) =>
        query.category ? article.category === query.category : true,
      )
      .filter((article) =>
        query.tag
          ? article.tags.some((item) => item.toLowerCase() === query.tag)
          : true,
      )
      .filter((article) =>
        matchesSearch(query.search ?? "", [
          article.title,
          article.slug,
          article.excerpt,
          article.authorName,
          article.category,
          ...article.tags,
        ]),
      ),
    query.sort ?? "publishedAt-desc",
  );
}

export function paginatePublicArticleSummaries(
  articles: Article[],
  page: number,
  limit: number,
): PublicPaginatedList<PublicArticleSummary> {
  const paginated = paginateList(articles, page, limit);

  return {
    items: paginated.items.map(toPublicArticleSummary),
    pagination: {
      page: paginated.page,
      limit: paginated.pageSize,
      total: paginated.total,
      totalPages: paginated.totalPages,
    },
  };
}

export function emptyPublicArticleList(
  limit = PUBLIC_ARTICLE_DEFAULT_LIMIT,
): PublicPaginatedList<PublicArticleSummary> {
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

function scoreRelatedArticle(source: Article, candidate: Article): number {
  let score = 0;

  if (candidate.category === source.category) {
    score += 10;
  }

  const sourceTags = new Set(source.tags.map((tag) => tag.toLowerCase()));
  for (const tag of candidate.tags) {
    if (sourceTags.has(tag.toLowerCase())) {
      score += 3;
    }
  }

  return score;
}

export function getRelatedPublicArticles(
  articles: Article[],
  source: Article,
  limit: number,
): PublicArticleSummary[] {
  const safeLimit = Math.min(Math.max(limit, 1), PUBLIC_ARTICLE_MAX_LIMIT);
  const candidates = articles.filter(
    (article) =>
      article.status === "published" && article.slug !== source.slug,
  );

  const ranked = candidates
    .map((article) => ({
      article,
      score: scoreRelatedArticle(source, article),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return compareIsoDesc(
        left.article.publishedAt,
        right.article.publishedAt,
      );
    });

  return ranked
    .slice(0, safeLimit)
    .map(({ article }) => toPublicArticleSummary(article));
}

export function parseRelatedLimit(searchParams: URLSearchParams): number {
  const raw = Number.parseInt(searchParams.get("limit") ?? "3", 10);
  if (!Number.isFinite(raw) || raw <= 0) {
    return 3;
  }

  return Math.min(raw, PUBLIC_ARTICLE_MAX_LIMIT);
}