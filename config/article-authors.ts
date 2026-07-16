/**
 * Legacy helpers — authors now come from Better Auth users.
 * Kept for list/filter fallbacks on older article rows.
 */
export const DEFAULT_ARTICLE_AUTHOR = "CMS Admin";

export function resolveArticleAuthorName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_ARTICLE_AUTHOR;
}
