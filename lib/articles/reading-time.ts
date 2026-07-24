/** Average adult reading speed used for public article readingTimeMinutes. */
export const ARTICLE_WORDS_PER_MINUTE = 200;

/** Strip HTML tags and collapse whitespace for word counting. */
export function getPlainTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

/**
 * Estimated reading time in whole minutes (minimum 1 when there is any text).
 * Prefer full HTML body; fall back to excerpt when body is empty.
 */
export function getArticleReadingTimeMinutes(
  content: string,
  excerpt = "",
  wordsPerMinute = ARTICLE_WORDS_PER_MINUTE,
): number {
  const bodyWords = countWords(getPlainTextFromHtml(content));
  const excerptWords =
    bodyWords > 0 ? 0 : countWords(getPlainTextFromHtml(excerpt));
  const words = bodyWords + excerptWords;

  if (words === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
