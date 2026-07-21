export type ArticleStatus = "draft" | "scheduled" | "published" | "archived";

import type { ArticleCategoryId } from "@/config/article-categories";

export interface Article {
  id: string;
  brandId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: ArticleStatus;
  authorName: string;
  category: ArticleCategoryId | string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  highlighted: boolean;
  gallery: string[];
  thumbnail: string;
  /** Publish time when published, or scheduled go-live time when scheduled. */
  publishedAt: string | null;
  /** CMS display — resolved from linked author profile when available. */
  authorImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight article row for dashboard / list summaries (no body content). */
export type ArticleSummary = Pick<
  Article,
  | "id"
  | "title"
  | "slug"
  | "status"
  | "thumbnail"
  | "authorName"
  | "updatedAt"
  | "publishedAt"
> & {
  authorImage?: string | null;
};

export interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: ArticleStatus;
  authorName: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  highlighted: boolean;
  gallery: string[];
  thumbnail: string;
  /** Required when status is `scheduled`; ignored for other statuses (DB owns it). */
  publishedAt: string | null;
}
