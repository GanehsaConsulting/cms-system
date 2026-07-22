import { and, desc, eq, ne } from "drizzle-orm";
import { PRICE_FORM_LIMITS } from "@/config/price-form";
import { slugify, slugifyArticleTitle } from "@/lib/articles/slug";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { db } from "@/lib/db/client";
import { prices } from "@/lib/db/schema";
import {
  isLocalizedTextComplete,
  trimLocalized,
} from "@/lib/locale";
import { normalizePrice } from "@/lib/prices/normalize";
import type { LocalizedText } from "@/types/locale";
import type { Price, PriceFeature, PriceInput } from "@/types/price";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToPrice(row: typeof prices.$inferSelect): Price {
  return normalizePrice({
    id: row.id,
    brandId: row.brandId,
    slug: row.slug,
    serviceSlug: row.serviceSlug,
    category: row.category,
    highlighted: row.highlighted,
    description: row.description,
    service: row.service,
    packageName: row.packageName,
    price: row.price,
    strikethroughPrice: row.strikethroughPrice,
    whatsappPhone: row.whatsappPhone,
    whatsappMessage: row.whatsappMessage,
    isActive: row.isActive,
    features: Array.isArray(row.features) ? row.features : [],
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  });
}

function trimOptionalLocalized(text: LocalizedText): LocalizedText {
  return {
    id: text.id.trim(),
    en: text.en.trim(),
    zh: text.zh.trim(),
  };
}

function normalizeFeatures(features: PriceFeature[]): PriceFeature[] {
  return features
    .map((feature, index) => ({
      id: feature.id || crypto.randomUUID(),
      name: trimLocalized(feature.name),
      sortOrder: index,
    }))
    .filter((feature) => isLocalizedTextComplete(feature.name))
    .map(({ sortOrder: _sortOrder, ...feature }) => feature);
}

function normalizeInput(input: PriceInput): PriceInput {
  const packageName = trimLocalized(input.packageName);
  const service = trimLocalized(input.service);

  return {
    slug:
      input.slug.trim() ||
      slugifyArticleTitle(
        packageName.en.trim() || packageName.id.trim(),
        PRICE_FORM_LIMITS.slug,
      ),
    serviceSlug: input.serviceSlug.trim() || slugify(service.id),
    category: input.category.trim(),
    highlighted: input.highlighted,
    description: trimOptionalLocalized(input.description),
    service,
    packageName,
    price: Math.max(0, Math.trunc(input.price)),
    strikethroughPrice: Math.max(0, Math.trunc(input.strikethroughPrice)),
    whatsappPhone: input.whatsappPhone.trim(),
    whatsappMessage: trimLocalized(input.whatsappMessage),
    isActive: input.isActive,
    features: normalizeFeatures(input.features),
  };
}

export async function getPrices(brandId: string): Promise<Price[]> {
  const rows = await db
    .select()
    .from(prices)
    .where(eq(prices.brandId, brandId))
    .orderBy(desc(prices.updatedAt));

  return rows.map(rowToPrice);
}

export async function getPriceById(
  brandId: string,
  id: string,
): Promise<Price | null> {
  const rows = await db
    .select()
    .from(prices)
    .where(eq(prices.id, id))
    .limit(1);

  const price = rows[0] ? rowToPrice(rows[0]) : null;
  if (!price) {
    return null;
  }

  try {
    assertBrandMatch(price, brandId, "Price plan not found");
    return price;
  } catch {
    return null;
  }
}

export async function getPriceBySlug(
  brandId: string,
  slug: string,
): Promise<Price | null> {
  const rows = await db
    .select()
    .from(prices)
    .where(and(eq(prices.brandId, brandId), eq(prices.slug, slug)))
    .limit(1);

  return rows[0] ? rowToPrice(rows[0]) : null;
}

export async function createPrice(
  brandId: string,
  input: PriceInput,
): Promise<Price> {
  const normalized = normalizeInput(input);
  const existing = await getPriceBySlug(brandId, normalized.slug);

  if (existing) {
    throw new Error("Slug is already in use");
  }

  const now = new Date();
  const [row] = await db
    .insert(prices)
    .values({
      id: crypto.randomUUID(),
      brandId,
      ...normalized,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToPrice(row);
}

export async function updatePrice(
  brandId: string,
  id: string,
  input: PriceInput,
): Promise<Price> {
  const current = await getPriceById(brandId, id);

  if (!current) {
    throw new Error("Price plan not found");
  }

  const normalized = normalizeInput(input);
  const slugTaken = await db
    .select({ id: prices.id })
    .from(prices)
    .where(
      and(
        eq(prices.brandId, brandId),
        eq(prices.slug, normalized.slug),
        ne(prices.id, id),
      ),
    )
    .limit(1);

  if (slugTaken.length > 0) {
    throw new Error("Slug is already in use");
  }

  const [row] = await db
    .update(prices)
    .set({
      ...normalized,
      brandId,
      updatedAt: new Date(),
    })
    .where(and(eq(prices.id, id), eq(prices.brandId, brandId)))
    .returning();

  if (!row) {
    throw new Error("Price plan not found");
  }

  return rowToPrice(row);
}

export async function deletePrice(brandId: string, id: string): Promise<void> {
  const current = await getPriceById(brandId, id);

  if (!current) {
    throw new Error("Price plan not found");
  }

  await db
    .delete(prices)
    .where(and(eq(prices.id, id), eq(prices.brandId, brandId)));
}
