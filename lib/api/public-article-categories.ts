import { ARTICLE_CATEGORIES } from "@/config/article-categories";
import { getCustomCategories } from "@/lib/db/categories";

export async function getPublicArticleCategories() {
  const custom = await getCustomCategories();
  const builtIn = Object.values(ARTICLE_CATEGORIES).map((category) => ({
    id: category.id,
    label: category.label,
    badgeClassName: category.badgeClassName,
    source: "built-in" as const,
  }));

  const customMapped = custom.map((category) => ({
    id: category.id,
    label: category.label,
    badgeClassName: category.badgeClassName,
    source: "custom" as const,
  }));

  const byId = new Map<string, (typeof builtIn)[number] | (typeof customMapped)[number]>();
  for (const category of [...builtIn, ...customMapped]) {
    byId.set(category.id, category);
  }

  return Array.from(byId.values()).sort((left, right) =>
    left.label.localeCompare(right.label, undefined, { sensitivity: "base" }),
  );
}
