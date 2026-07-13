import { formatCategoryLabelFromSlug } from "@/lib/articles/categories";

export type ArticleCategoryId =
  | "finance"
  | "investment"
  | "education"
  | "business"
  | "general";

export interface ArticleCategoryStyle {
  id: string;
  label: string;
  badgeClassName: string;
}

export const ARTICLE_CATEGORIES: Record<
  ArticleCategoryId,
  ArticleCategoryStyle
> = {
  finance: {
    id: "finance",
    label: "Finance",
    badgeClassName: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  investment: {
    id: "investment",
    label: "Investment",
    badgeClassName: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  education: {
    id: "education",
    label: "Education",
    badgeClassName: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  business: {
    id: "business",
    label: "Business",
    badgeClassName: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  general: {
    id: "general",
    label: "General",
    badgeClassName: "bg-muted text-muted-foreground",
  },
};

export function getArticleCategory(categoryId: string): ArticleCategoryStyle {
  if (categoryId in ARTICLE_CATEGORIES) {
    return ARTICLE_CATEGORIES[categoryId as ArticleCategoryId];
  }

  return {
    id: categoryId,
    label: formatCategoryLabelFromSlug(categoryId),
    badgeClassName: "bg-muted text-muted-foreground",
  };
}
