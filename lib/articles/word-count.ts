import { ARTICLE_READING_WPM } from "@/config/article-form";
import type { ArticleFormValues } from "@/lib/validations/article";

export interface ArticleFormWordStats {
  title: number;
  excerpt: number;
  content: number;
  metaTitle: number;
  metaDescription: number;
  tags: number;
  total: number;
  readingWords: number;
  readingMinutes: number;
}

export function countWordsFromText(text: string): number {
  const normalized = text.trim();
  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).filter(Boolean).length;
}

export function countWordsFromHtml(html: string): number {
  return countWordsFromText(html.replace(/<[^>]*>/g, " "));
}

export function calculateReadingTimeMinutes(
  wordCount: number,
  wordsPerMinute = ARTICLE_READING_WPM,
): number {
  if (wordCount <= 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) {
    return "Less than 1 min read";
  }

  if (minutes === 1) {
    return "1 min read";
  }

  return `${minutes} min read`;
}

export function getArticleFormWordStats(
  values: Pick<
    ArticleFormValues,
    | "title"
    | "excerpt"
    | "content"
    | "metaTitle"
    | "metaDescription"
    | "tags"
  >,
): ArticleFormWordStats {
  const title = countWordsFromText(values.title);
  const excerpt = countWordsFromText(values.excerpt);
  const content = countWordsFromHtml(values.content);
  const metaTitle = countWordsFromText(values.metaTitle);
  const metaDescription = countWordsFromText(values.metaDescription);
  const tags = countWordsFromText(values.tags.join(" "));
  const total = title + excerpt + content + metaTitle + metaDescription + tags;
  const readingWords = title + excerpt + content;
  const readingMinutes = calculateReadingTimeMinutes(readingWords);

  return {
    title,
    excerpt,
    content,
    metaTitle,
    metaDescription,
    tags,
    total,
    readingWords,
    readingMinutes,
  };
}
