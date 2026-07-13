export type ArticleStatus = "draft" | "published" | "archived";

import type { ArticleCategoryId } from "@/config/article-categories";

export interface Article {
  id: string;
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
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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
}
