import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/articles/slug";
import { assertBrandMatch, filterByBrand } from "@/lib/brands/content-scope";
import { getPrices } from "@/lib/db/prices";
import type { PriceCategory, PriceCategoryInput } from "@/types/price-category";

const DATA_PATH = path.join(process.cwd(), "data/price-categories.json");

async function readCategories(): Promise<PriceCategory[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as PriceCategory[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }
}

async function writeCategories(categories: PriceCategory[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(categories, null, 2)}\n`, "utf-8");
}

export async function getPriceCategories(
  brandId: string,
): Promise<PriceCategory[]> {
  const categories = filterByBrand(await readCategories(), brandId);
  return categories.sort((left, right) => left.label.localeCompare(right.label));
}

export async function getPriceCategoryById(
  brandId: string,
  id: string,
): Promise<PriceCategory | null> {
  const categories = await readCategories();
  const category = categories.find((item) => item.id === id) ?? null;

  if (!category) {
    return null;
  }

  try {
    assertBrandMatch(category, brandId, "Category not found");
    return category;
  } catch {
    return null;
  }
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

  const categories = await readCategories();
  const scoped = filterByBrand(categories, brandId);
  const duplicate = scoped.find(
    (category) =>
      category.id === id || category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const now = new Date().toISOString();
  const category: PriceCategory = {
    id,
    brandId,
    label,
    createdAt: now,
    updatedAt: now,
  };

  categories.push(category);
  await writeCategories(categories);
  return category;
}

export async function updatePriceCategory(
  brandId: string,
  id: string,
  input: PriceCategoryInput,
): Promise<PriceCategory> {
  const categories = await readCategories();
  const index = categories.findIndex((category) => category.id === id);

  if (index === -1) {
    throw new Error("Category not found");
  }

  assertBrandMatch(categories[index], brandId, "Category not found");

  const label = input.label.trim();

  if (!label) {
    throw new Error("Category name is invalid");
  }

  const scoped = filterByBrand(categories, brandId);
  const duplicate = scoped.find(
    (category) =>
      category.id !== id &&
      category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const updated: PriceCategory = {
    ...categories[index],
    label,
    brandId,
    updatedAt: new Date().toISOString(),
  };

  categories[index] = updated;
  await writeCategories(categories);
  return updated;
}

export async function deletePriceCategory(
  brandId: string,
  id: string,
): Promise<void> {
  const categories = await readCategories();
  const target = categories.find((category) => category.id === id);

  if (!target) {
    throw new Error("Category not found");
  }

  assertBrandMatch(target, brandId, "Category not found");

  const prices = await getPrices(brandId);
  const inUse = prices.some((price) => price.serviceSlug === id);

  if (inUse) {
    throw new Error(
      "Category is in use by one or more price plans. Reassign those plans first.",
    );
  }

  await writeCategories(categories.filter((category) => category.id !== id));
}
