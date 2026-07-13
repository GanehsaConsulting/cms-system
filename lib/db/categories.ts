import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ARTICLE_CATEGORIES } from "@/config/article-categories";
import { getCustomCategoryBadgeClass } from "@/config/article-category-styles";
import type {
  CustomArticleCategory,
  CustomArticleCategoryInput,
} from "@/types/category";
import { slugify } from "@/lib/articles/slug";

const DATA_PATH = path.join(process.cwd(), "data/categories.json");

async function readCategories(): Promise<CustomArticleCategory[]> {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as CustomArticleCategory[];
}

async function writeCategories(categories: CustomArticleCategory[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(categories, null, 2)}\n`, "utf-8");
}

export async function getCustomCategories(): Promise<CustomArticleCategory[]> {
  const categories = await readCategories();
  return categories.sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

export async function getCustomCategoryById(
  id: string,
): Promise<CustomArticleCategory | null> {
  const categories = await readCategories();
  return categories.find((category) => category.id === id) ?? null;
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

  const categories = await readCategories();
  const duplicate = categories.find(
    (category) => category.id === id || category.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    throw new Error("Category already exists");
  }

  const category: CustomArticleCategory = {
    id,
    label,
    badgeClassName: getCustomCategoryBadgeClass(categories.length),
    createdAt: new Date().toISOString(),
  };

  categories.push(category);
  await writeCategories(categories);
  return category;
}
