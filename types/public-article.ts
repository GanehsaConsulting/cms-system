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
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  const { content: _content, ...summary } = article;
  return summary;
}
