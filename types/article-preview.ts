import type { ArticleCategoryId } from "@/config/article-categories";

export interface ArticlePreviewData {
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategoryId | string;
  tags: string[];
  authorName: string;
  authorImage?: string | null;
  slug: string;
  thumbnail?: string;
}
