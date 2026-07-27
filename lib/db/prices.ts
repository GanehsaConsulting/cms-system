import { and, desc, eq, inArray, isNotNull, isNull, ne } from "drizzle-orm";
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
import {
  fromTrashUniqueValue,
  toTrashUniqueValue,
} from "@/lib/trash/unique-value";
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
    deletedAt: row.deletedAt ? toIso(row.deletedAt) : null,
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
    .where(and(eq(prices.brandId, brandId), isNull(prices.deletedAt)))
    .orderBy(desc(prices.updatedAt));

  return rows.map(rowToPrice);
}

export async function getTrashedPrices(brandId: string): Promise<Price[]> {
  const rows = await db
    .select()
    .from(prices)
    .where(and(eq(prices.brandId, brandId), isNotNull(prices.deletedAt)))
    .orderBy(desc(prices.deletedAt));

  return rows.map(rowToPrice);
}

export async function getPriceById(
  brandId: string,
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<Price | null> {
  const rows = await db
    .select()
    .from(prices)
    .where(
      options?.includeDeleted
        ? and(eq(prices.id, id), eq(prices.brandId, brandId))
        : and(
            eq(prices.id, id),
            eq(prices.brandId, brandId),
            isNull(prices.deletedAt),
          ),
    )
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
    .where(
      and(
        eq(prices.brandId, brandId),
        eq(prices.slug, slug),
        isNull(prices.deletedAt),
      ),
    )
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
        isNull(prices.deletedAt),
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
    .where(
      and(
        eq(prices.id, id),
        eq(prices.brandId, brandId),
        isNull(prices.deletedAt),
      ),
    )
    .returning();

  if (!row) {
    throw new Error("Price plan not found");
  }

  return rowToPrice(row);
}

/** Soft-delete — moves price plan to Trash and frees the slug. */
export async function softDeletePrice(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPriceById(brandId, id);
  if (!current) {
    throw new Error("Price plan not found");
  }

  const now = new Date();
  await db
    .update(prices)
    .set({
      slug: toTrashUniqueValue(current.slug, id),
      deletedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(prices.id, id),
        eq(prices.brandId, brandId),
        isNull(prices.deletedAt),
      ),
    );
}

export async function softDeletePrices(
  brandId: string,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .select({ id: prices.id, slug: prices.slug })
    .from(prices)
    .where(
      and(
        eq(prices.brandId, brandId),
        isNull(prices.deletedAt),
        inArray(prices.id, ids),
      ),
    );

  if (rows.length === 0) {
    return 0;
  }

  const now = new Date();
  for (const row of rows) {
    await db
      .update(prices)
      .set({
        slug: toTrashUniqueValue(row.slug, row.id),
        deletedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(prices.id, row.id),
          eq(prices.brandId, brandId),
          isNull(prices.deletedAt),
        ),
      );
  }

  return rows.length;
}

export async function setPricesHighlighted(
  brandId: string,
  ids: string[],
  highlighted: boolean,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .update(prices)
    .set({
      highlighted,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(prices.brandId, brandId),
        isNull(prices.deletedAt),
        inArray(prices.id, ids),
      ),
    )
    .returning({ id: prices.id });

  return rows.length;
}

export async function setPricesActive(
  brandId: string,
  ids: string[],
  isActive: boolean,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const rows = await db
    .update(prices)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(prices.brandId, brandId),
        isNull(prices.deletedAt),
        inArray(prices.id, ids),
      ),
    )
    .returning({ id: prices.id });

  return rows.length;
}

export async function restorePrice(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getPriceById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Price plan not found in Trash");
  }

  const restoredSlug = fromTrashUniqueValue(current.slug, id);
  const slugTaken = await db
    .select({ id: prices.id })
    .from(prices)
    .where(
      and(
        eq(prices.brandId, brandId),
        eq(prices.slug, restoredSlug),
        ne(prices.id, id),
        isNull(prices.deletedAt),
      ),
    )
    .limit(1);

  if (slugTaken.length > 0) {
    throw new Error(
      "Cannot restore: slug is already in use by another price plan",
    );
  }

  const now = new Date();
  await db
    .update(prices)
    .set({
      slug: restoredSlug,
      deletedAt: null,
      updatedAt: now,
    })
    .where(
      and(
        eq(prices.id, id),
        eq(prices.brandId, brandId),
        isNotNull(prices.deletedAt),
      ),
    );
}

/** Permanently remove a trashed price plan. */
export async function purgePrice(brandId: string, id: string): Promise<void> {
  const current = await getPriceById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Price plan not found in Trash");
  }

  await db
    .delete(prices)
    .where(and(eq(prices.id, id), eq(prices.brandId, brandId)));
}

export async function purgeAllTrashedPrices(brandId: string): Promise<number> {
  const rows = await db
    .delete(prices)
    .where(and(eq(prices.brandId, brandId), isNotNull(prices.deletedAt)))
    .returning({ id: prices.id });

  return rows.length;
}

/** Hard-delete a price row (any state). Prefer softDeletePrice for CMS deletes. */
export async function deletePrice(brandId: string, id: string): Promise<void> {
  const current = await getPriceById(brandId, id, { includeDeleted: true });

  if (!current) {
    throw new Error("Price plan not found");
  }

  await db
    .delete(prices)
    .where(and(eq(prices.id, id), eq(prices.brandId, brandId)));
}
