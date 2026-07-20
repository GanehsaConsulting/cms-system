import { and, asc, eq } from "drizzle-orm";
import { ARTICLE_CATEGORIES } from "@/config/article-categories";
import { getCustomCategoryBadgeClass } from "@/config/article-category-styles";
import { slugify } from "@/lib/articles/slug";
import { db } from "@/lib/db/client";
import { articles, articleCategories } from "@/lib/db/schema";
import type {
  CustomArticleCategory,
  CustomArticleCategoryInput,
} from "@/types/category";

function rowToCategory(
  row: typeof articleCategories.$inferSelect,
): CustomArticleCategory {
  return {
    id: row.id,
    brandId: row.brandId,
    label: row.label,
    badgeClassName: row.badgeClassName,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getCustomCategories(
  brandId: string,
): Promise<CustomArticleCategory[]> {
  const rows = await db
    .select()
    .from(articleCategories)
    .where(eq(articleCategories.brandId, brandId))
    .orderBy(asc(articleCategories.label));

  return rows.map(rowToCategory);
}

export async function getCustomCategoryById(
  brandId: string,
  id: string,
): Promise<CustomArticleCategory | null> {
  const rows = await db
    .select()
    .from(articleCategories)
    .where(
      and(eq(articleCategories.id, id), eq(articleCategories.brandId, brandId)),
    )
    .limit(1);

  return rows[0] ? rowToCategory(rows[0]) : null;
}

export async function createCustomCategory(
  brandId: string,
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

  const existing = await getCustomCategories(brandId);
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
      brandId,
      label,
      badgeClassName: getCustomCategoryBadgeClass(existing.length),
      createdAt: now,
    })
    .returning();

  return rowToCategory(row);
}

export async function updateCustomCategory(
  brandId: string,
  id: string,
  input: CustomArticleCategoryInput,
): Promise<CustomArticleCategory> {
  if (id in ARTICLE_CATEGORIES) {
    throw new Error("Built-in categories cannot be renamed");
  }

  const label = input.label.trim();

  if (!label) {
    throw new Error("Category name is invalid");
  }

  const existing = await getCustomCategories(brandId);
  const current = existing.find((category) => category.id === id);

  if (!current) {
    throw new Error("Category not found");
  }

  const duplicate = existing.find(
    (category) =>
      category.id !== id &&
      category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const [row] = await db
    .update(articleCategories)
    .set({ label })
    .where(
      and(eq(articleCategories.id, id), eq(articleCategories.brandId, brandId)),
    )
    .returning();

  if (!row) {
    throw new Error("Category not found");
  }

  return rowToCategory(row);
}

export async function deleteCustomCategory(
  brandId: string,
  id: string,
): Promise<void> {
  if (id in ARTICLE_CATEGORIES) {
    throw new Error("Built-in categories cannot be deleted");
  }

  const existing = await getCustomCategoryById(brandId, id);

  if (!existing) {
    throw new Error("Category not found");
  }

  const inUse = await db
    .select({ id: articles.id })
    .from(articles)
    .where(
      and(
        eq(articles.brandId, brandId),
        eq(articles.category, id),
      ),
    )
    .limit(1);

  if (inUse.length > 0) {
    throw new Error(
      "Category is in use by one or more articles. Reassign those articles first.",
    );
  }

  await db
    .delete(articleCategories)
    .where(
      and(eq(articleCategories.id, id), eq(articleCategories.brandId, brandId)),
    );
}
