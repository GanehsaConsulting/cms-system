import { ARTICLE_CATEGORIES } from "@/config/article-categories";
import { getCustomCategories } from "@/lib/db/categories";
import type { PublicArticleCategory } from "@/types/public-article";

export async function getPublicArticleCategories(
  brandId: string,
): Promise<PublicArticleCategory[]> {
  const custom = await getCustomCategories(brandId);
  const builtIn: PublicArticleCategory[] = Object.values(ARTICLE_CATEGORIES).map(
    (category) => ({
      id: category.id,
      label: category.label,
      source: "built-in" as const,
    }),
  );

  const customMapped: PublicArticleCategory[] = custom.map((category) => ({
    id: category.id,
    label: category.label,
    source: "custom" as const,
  }));

  const byId = new Map<string, PublicArticleCategory>();
  for (const category of [...builtIn, ...customMapped]) {
    byId.set(category.id, category);
  }

  return Array.from(byId.values()).sort((left, right) =>
    left.label.localeCompare(right.label, undefined, { sensitivity: "base" }),
  );
}
