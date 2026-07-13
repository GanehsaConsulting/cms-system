import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/articles/slug";
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

export async function getPriceCategories(): Promise<PriceCategory[]> {
  const categories = await readCategories();
  return categories.sort((left, right) => left.label.localeCompare(right.label));
}

export async function getPriceCategoryById(
  id: string,
): Promise<PriceCategory | null> {
  const categories = await readCategories();
  return categories.find((category) => category.id === id) ?? null;
}

export async function createPriceCategory(
  input: PriceCategoryInput,
): Promise<PriceCategory> {
  const label = input.label.trim();
  const id = slugify(label);

  if (!id) {
    throw new Error("Category name is invalid");
  }

  const categories = await readCategories();
  const duplicate = categories.find(
    (category) =>
      category.id === id || category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const now = new Date().toISOString();
  const category: PriceCategory = {
    id,
    label,
    createdAt: now,
    updatedAt: now,
  };

  categories.push(category);
  await writeCategories(categories);
  return category;
}

export async function updatePriceCategory(
  id: string,
  input: PriceCategoryInput,
): Promise<PriceCategory> {
  const categories = await readCategories();
  const index = categories.findIndex((category) => category.id === id);

  if (index === -1) {
    throw new Error("Category not found");
  }

  const label = input.label.trim();

  if (!label) {
    throw new Error("Category name is invalid");
  }

  const duplicate = categories.find(
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
    updatedAt: new Date().toISOString(),
  };

  categories[index] = updated;
  await writeCategories(categories);
  return updated;
}

export async function deletePriceCategory(id: string): Promise<void> {
  const categories = await readCategories();
  const exists = categories.some((category) => category.id === id);

  if (!exists) {
    throw new Error("Category not found");
  }

  const prices = await getPrices();
  const inUse = prices.some((price) => price.serviceSlug === id);

  if (inUse) {
    throw new Error(
      "Category is in use by one or more price plans. Reassign those plans first.",
    );
  }

  await writeCategories(categories.filter((category) => category.id !== id));
}
