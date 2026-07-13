import type { ArticleListSort, ArticleStatusFilter } from "@/config/article-list";
import { ARTICLE_LIST_PAGE_SIZE } from "@/config/article-list";
import { getArticleCategory } from "@/config/article-categories";
import { paginateList } from "@/lib/list/pagination";
import type { Article, ArticleStatus } from "@/types/article";

const DATE_LOCALE = "en-US";

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatArticleDateParts(value: string) {
  const date = new Date(value);

  return {
    date: new Intl.DateTimeFormat(DATE_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat(DATE_LOCALE, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

export function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function countArticlesByStatus(articles: Article[]) {
  const counts: Record<ArticleStatusFilter, number> = {
    all: articles.length,
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const article of articles) {
    counts[article.status] += 1;
  }

  return counts;
}

export function filterArticles(
  articles: Article[],
  status: ArticleStatusFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesStatus = status === "all" || article.status === status;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.slug.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.authorName.toLowerCase().includes(normalizedQuery) ||
      article.category.toLowerCase().includes(normalizedQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    );
  });
}

export function sortArticles(articles: Article[], sort: ArticleListSort) {
  const next = [...articles];

  next.sort((left, right) => {
    switch (sort) {
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()
        );
      case "title-asc":
        return left.title.localeCompare(right.title, "en");
      case "title-desc":
        return right.title.localeCompare(left.title, "en");
      case "author-asc":
        return left.authorName.localeCompare(right.authorName, "en");
      case "author-desc":
        return right.authorName.localeCompare(left.authorName, "en");
      case "category-asc":
        return getArticleCategory(left.category).label.localeCompare(
          getArticleCategory(right.category).label,
          "en",
        );
      case "category-desc":
        return getArticleCategory(right.category).label.localeCompare(
          getArticleCategory(left.category).label,
          "en",
        );
      case "status-asc":
        return statusLabels[left.status].localeCompare(
          statusLabels[right.status],
          "en",
        );
      case "status-desc":
        return statusLabels[right.status].localeCompare(
          statusLabels[left.status],
          "en",
        );
      case "created-desc":
        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
      case "updated-desc":
      default:
        return (
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
    }
  });

  return next;
}

export function paginateArticles<T>(
  items: T[],
  page: number,
  pageSize = ARTICLE_LIST_PAGE_SIZE,
) {
  return paginateList(items, page, pageSize);
}

export function getArticleThumbnailGradient(id: string) {
  const gradients = [
    "from-sky-400 via-blue-500 to-indigo-500",
    "from-violet-400 via-purple-500 to-fuchsia-500",
    "from-rose-400 via-pink-500 to-orange-400",
    "from-emerald-400 via-green-500 to-teal-500",
    "from-amber-400 via-orange-500 to-red-400",
  ] as const;

  const index =
    id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    gradients.length;

  return gradients[index];
}

export function normalizeArticle(article: Article): Article {
  return {
    ...article,
    authorName: article.authorName ?? "Admin",
    category: article.category ?? "general",
    tags: article.tags ?? [],
    metaTitle: article.metaTitle ?? "",
    metaDescription: article.metaDescription ?? "",
    highlighted: article.highlighted ?? false,
    gallery: article.gallery ?? [],
    thumbnail: article.thumbnail ?? "",
  };
}

export const statusLabels: Record<ArticleStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};
