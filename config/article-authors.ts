export const ARTICLE_AUTHORS = [
  "Rafly Pratama",
  "Sarah Chen",
  "Michael Torres",
] as const;

export type ArticleAuthorName = (typeof ARTICLE_AUTHORS)[number];

export const DEFAULT_ARTICLE_AUTHOR: ArticleAuthorName = "Rafly Pratama";

export function isArticleAuthorName(name: string): name is ArticleAuthorName {
  return ARTICLE_AUTHORS.includes(name as ArticleAuthorName);
}

export function resolveArticleAuthorName(name: string): ArticleAuthorName {
  if (isArticleAuthorName(name)) {
    return name;
  }

  return DEFAULT_ARTICLE_AUTHOR;
}
