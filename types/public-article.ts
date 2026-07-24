import { getArticleReadingTimeMinutes } from "@/lib/articles/reading-time";
import type { Article, ArticleStatus } from "@/types/article";

/** List/card payload — no HTML body. */
export interface PublicArticleSummary {
  id: string;
  brandId: string;
  title: string;
  slug: string;
  excerpt: string;
  status: ArticleStatus;
  authorName: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  highlighted: boolean;
  gallery: string[];
  thumbnail: string;
  clickCount: number;
  /** Estimated minutes to read (from body, or excerpt fallback). */
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Detail payload — includes HTML body. */
export interface PublicArticle extends PublicArticleSummary {
  content: string;
}

export interface PublicArticleCategory {
  id: string;
  label: string;
  source: "built-in" | "custom";
}

export interface PublicListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicPaginatedList<T> {
  items: T[];
  pagination: PublicListPagination;
}

export function toPublicArticleSummary(article: Article): PublicArticleSummary {
  return {
    id: article.id,
    brandId: article.brandId,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    status: article.status,
    authorName: article.authorName,
    category: article.category,
    tags: article.tags,
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    highlighted: article.highlighted,
    gallery: article.gallery,
    thumbnail: article.thumbnail,
    clickCount: article.clickCount ?? 0,
    readingTimeMinutes: getArticleReadingTimeMinutes(
      article.content,
      article.excerpt,
    ),
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

export function toPublicArticle(article: Article): PublicArticle {
  return {
    ...toPublicArticleSummary(article),
    content: article.content,
  };
}
