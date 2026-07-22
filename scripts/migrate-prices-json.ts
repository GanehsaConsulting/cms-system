/**
 * Import legacy price JSON into Postgres.
 *
 * Usage:
 *   npx tsx scripts/migrate-prices-json.ts
 *
 * Safe to re-run — existing ids are skipped.
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { priceCategories, prices } from "../lib/db/schema";
import { normalizePrice } from "../lib/prices/normalize";
import type { Price } from "../types/price";
import type { PriceCategory } from "../types/price-category";

async function readJson<T>(relativePath: string): Promise<T[]> {
  try {
    const raw = await readFile(path.join(process.cwd(), relativePath), "utf-8");
    return JSON.parse(raw) as T[];
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

async function main() {
  const categories = await readJson<PriceCategory>("data/price-categories.json");
  const priceRows = (await readJson<Price>("data/prices.json")).map(
    normalizePrice,
  );

  let categoriesInserted = 0;
  let pricesInserted = 0;

  for (const category of categories) {
    const existing = await db
      .select({ id: priceCategories.id })
      .from(priceCategories)
      .where(
        and(
          eq(priceCategories.brandId, category.brandId),
          eq(priceCategories.id, category.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(priceCategories).values({
      id: category.id,
      brandId: category.brandId,
      label: category.label,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    });
    categoriesInserted += 1;
  }

  for (const price of priceRows) {
    const existing = await db
      .select({ id: prices.id })
      .from(prices)
      .where(eq(prices.id, price.id))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(prices).values({
      id: price.id,
      brandId: price.brandId,
      slug: price.slug,
      serviceSlug: price.serviceSlug,
      category: price.category,
      highlighted: price.highlighted,
      description: price.description,
      service: price.service,
      packageName: price.packageName,
      price: price.price,
      strikethroughPrice: price.strikethroughPrice,
      whatsappPhone: price.whatsappPhone,
      whatsappMessage: price.whatsappMessage,
      isActive: price.isActive,
      features: price.features,
      createdAt: new Date(price.createdAt),
      updatedAt: new Date(price.updatedAt),
    });
    pricesInserted += 1;
  }

  console.log(
    `Prices migrate done. categories=${categoriesInserted} prices=${pricesInserted}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
