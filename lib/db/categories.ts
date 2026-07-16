import { asc, eq } from "drizzle-orm";
import { ARTICLE_CATEGORIES } from "@/config/article-categories";
import { getCustomCategoryBadgeClass } from "@/config/article-category-styles";
import { slugify } from "@/lib/articles/slug";
import { db } from "@/lib/db/client";
import { articleCategories } from "@/lib/db/schema";
import type {
  CustomArticleCategory,
  CustomArticleCategoryInput,
} from "@/types/category";

function rowToCategory(
  row: typeof articleCategories.$inferSelect,
): CustomArticleCategory {
  return {
    id: row.id,
    label: row.label,
    badgeClassName: row.badgeClassName,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getCustomCategories(): Promise<CustomArticleCategory[]> {
  const rows = await db
    .select()
    .from(articleCategories)
    .orderBy(asc(articleCategories.label));

  return rows.map(rowToCategory);
}

export async function getCustomCategoryById(
  id: string,
): Promise<CustomArticleCategory | null> {
  const rows = await db
    .select()
    .from(articleCategories)
    .where(eq(articleCategories.id, id))
    .limit(1);

  return rows[0] ? rowToCategory(rows[0]) : null;
}

export async function createCustomCategory(
  input: CustomArticleCategoryInput,
): Promise<CustomArticleCategory> {
  const label = input.label.trim();
  const id = slugify(label);

  if (!id) {
    throw new Error("Category name is invalid");
  }

  if (id in ARTICLE_CATEGORIES) {
    throw new Error("Category already exists");
  }

  const existing = await getCustomCategories();
  const duplicate = existing.find(
    (category) =>
      category.id === id ||
      category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const now = new Date();
  const [row] = await db
    .insert(articleCategories)
    .values({
      id,
      label,
      badgeClassName: getCustomCategoryBadgeClass(existing.length),
      createdAt: now,
    })
    .returning();

  return rowToCategory(row);
}
