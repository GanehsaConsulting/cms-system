import { and, asc, eq } from "drizzle-orm";
import { slugify } from "@/lib/articles/slug";
import { db } from "@/lib/db/client";
import { priceCategories, prices } from "@/lib/db/schema";
import type { PriceCategory, PriceCategoryInput } from "@/types/price-category";

function rowToCategory(
  row: typeof priceCategories.$inferSelect,
): PriceCategory {
  return {
    id: row.id,
    brandId: row.brandId,
    label: row.label,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getPriceCategories(
  brandId: string,
): Promise<PriceCategory[]> {
  const rows = await db
    .select()
    .from(priceCategories)
    .where(eq(priceCategories.brandId, brandId))
    .orderBy(asc(priceCategories.label));

  return rows.map(rowToCategory);
}

export async function getPriceCategoryById(
  brandId: string,
  id: string,
): Promise<PriceCategory | null> {
  const rows = await db
    .select()
    .from(priceCategories)
    .where(
      and(eq(priceCategories.id, id), eq(priceCategories.brandId, brandId)),
    )
    .limit(1);

  return rows[0] ? rowToCategory(rows[0]) : null;
}

export async function createPriceCategory(
  brandId: string,
  input: PriceCategoryInput,
): Promise<PriceCategory> {
  const label = input.label.trim();
  const id = slugify(label);

  if (!id) {
    throw new Error("Category name is invalid");
  }

  const existing = await getPriceCategories(brandId);
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
    .insert(priceCategories)
    .values({
      id,
      brandId,
      label,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToCategory(row);
}

export async function updatePriceCategory(
  brandId: string,
  id: string,
  input: PriceCategoryInput,
): Promise<PriceCategory> {
  const label = input.label.trim();

  if (!label) {
    throw new Error("Category name is invalid");
  }

  const existing = await getPriceCategories(brandId);
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
    .update(priceCategories)
    .set({
      label,
      updatedAt: new Date(),
    })
    .where(
      and(eq(priceCategories.id, id), eq(priceCategories.brandId, brandId)),
    )
    .returning();

  if (!row) {
    throw new Error("Category not found");
  }

  return rowToCategory(row);
}

export async function deletePriceCategory(
  brandId: string,
  id: string,
): Promise<void> {
  const existing = await getPriceCategoryById(brandId, id);

  if (!existing) {
    throw new Error("Category not found");
  }

  const inUse = await db
    .select({ id: prices.id })
    .from(prices)
    .where(and(eq(prices.brandId, brandId), eq(prices.serviceSlug, id)))
    .limit(1);

  if (inUse.length > 0) {
    throw new Error(
      "Category is in use by one or more price plans. Reassign those plans first.",
    );
  }

  await db
    .delete(priceCategories)
    .where(
      and(eq(priceCategories.id, id), eq(priceCategories.brandId, brandId)),
    );
}
