import type { ArticleCategoryId } from "@/config/article-categories";

export interface ArticlePreviewData {
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategoryId | string;
  tags: string[];
  authorName: string;
  slug: string;
  thumbnail?: string;
}
