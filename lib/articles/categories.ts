import {
  ARTICLE_CATEGORIES,
  type ArticleCategoryStyle,
} from "@/config/article-categories";
import { getCustomCategoryBadgeClass } from "@/config/article-category-styles";
import type { CustomArticleCategory } from "@/types/category";

export function formatCategoryLabelFromSlug(categoryId: string): string {
  return categoryId
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function mergeArticleCategories(
  customCategories: CustomArticleCategory[],
): ArticleCategoryStyle[] {
  const builtin = Object.values(ARTICLE_CATEGORIES);
  const custom = customCategories.map((category, index) => ({
    id: category.id,
    label: category.label,
    badgeClassName:
      category.badgeClassName ?? getCustomCategoryBadgeClass(index),
  }));

  return [...builtin, ...custom];
}

export function findArticleCategory(
  categoryId: string,
  categories: ArticleCategoryStyle[],
): ArticleCategoryStyle {
  const match = categories.find((category) => category.id === categoryId);

  if (match) {
    return match;
  }

  if (categoryId in ARTICLE_CATEGORIES) {
    return ARTICLE_CATEGORIES[categoryId as keyof typeof ARTICLE_CATEGORIES];
  }

  return {
    id: categoryId,
    label: formatCategoryLabelFromSlug(categoryId),
    badgeClassName: "bg-muted text-muted-foreground",
  };
}

export function isKnownArticleCategory(
  categoryId: string,
  customCategories: CustomArticleCategory[],
): boolean {
  if (categoryId in ARTICLE_CATEGORIES) {
    return true;
  }

  return customCategories.some((category) => category.id === categoryId);
}
