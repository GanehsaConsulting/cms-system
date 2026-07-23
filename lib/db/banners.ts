import { and, desc, eq, ne } from "drizzle-orm";
import { slugify } from "@/lib/articles/slug";
import { isRequiredBannerPlacementKey } from "@/config/banner-placements";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { getBannerImages } from "@/lib/banners/images";
import { resolveImageAssets } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";
import type { Banner, BannerInput } from "@/types/banner";

const IMAGE_FOLDER = "cms-system/banners";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToBanner(row: typeof banners.$inferSelect): Banner {
  return {
    id: row.id,
    brandId: row.brandId,
    name: row.name,
    key: row.key,
    images: getBannerImages({ images: Array.isArray(row.images) ? row.images : [] }),
    redirectUrl: row.redirectUrl,
    isActive: row.isActive,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function normalizeInput(input: BannerInput): BannerInput {
  return {
    name: input.name.trim(),
    key: slugify(input.key.trim()),
    images: input.images.map((item) => item.trim()).filter(Boolean),
    redirectUrl: input.redirectUrl.trim(),
    isActive: input.isActive,
  };
}

async function resolveBannerImages(images: string[]): Promise<string[]> {
  return resolveImageAssets(images, IMAGE_FOLDER);
}

export async function getBanners(brandId: string): Promise<Banner[]> {
  const rows = await db
    .select()
    .from(banners)
    .where(eq(banners.brandId, brandId))
    .orderBy(desc(banners.updatedAt));

  return rows.map(rowToBanner);
}

export async function getBannerById(
  brandId: string,
  id: string,
): Promise<Banner | null> {
  const rows = await db
    .select()
    .from(banners)
    .where(eq(banners.id, id))
    .limit(1);

  const banner = rows[0] ? rowToBanner(rows[0]) : null;
  if (!banner) {
    return null;
  }

  try {
    assertBrandMatch(banner, brandId, "Banner not found");
    return banner;
  } catch {
    return null;
  }
}

/** Public lookup — prefer active banners; returns null if missing or inactive. */
export async function getBannerByKey(
  brandId: string,
  key: string,
): Promise<Banner | null> {
  const normalizedKey = slugify(key.trim());
  if (!normalizedKey) {
    return null;
  }

  const rows = await db
    .select()
    .from(banners)
    .where(
      and(eq(banners.brandId, brandId), eq(banners.key, normalizedKey)),
    )
    .limit(1);

  const banner = rows[0] ? rowToBanner(rows[0]) : null;
  if (!banner || !banner.isActive) {
    return null;
  }

  return banner;
}

export async function createBanner(
  brandId: string,
  input: BannerInput,
): Promise<Banner> {
  const normalized = normalizeInput(input);

  if (!normalized.key) {
    throw new Error("Key is invalid");
  }

  if (normalized.images.length === 0) {
    throw new Error("At least one image is required");
  }

  const images = await resolveBannerImages(normalized.images);
  if (images.length === 0) {
    throw new Error("At least one image is required");
  }

  const existing = await db
    .select({ id: banners.id })
    .from(banners)
    .where(and(eq(banners.brandId, brandId), eq(banners.key, normalized.key)))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("A banner with this key already exists");
  }

  const now = new Date();
  const [row] = await db
    .insert(banners)
    .values({
      id: crypto.randomUUID(),
      brandId,
      ...normalized,
      images,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToBanner(row);
}

export async function updateBanner(
  brandId: string,
  id: string,
  input: BannerInput,
): Promise<Banner> {
  const current = await getBannerById(brandId, id);
  if (!current) {
    throw new Error("Banner not found");
  }

  const normalized = normalizeInput(input);

  if (!normalized.key) {
    throw new Error("Key is invalid");
  }

  if (normalized.images.length === 0) {
    throw new Error("At least one image is required");
  }

  const images = await resolveBannerImages(normalized.images);
  if (images.length === 0) {
    throw new Error("At least one image is required");
  }

  const duplicate = await db
    .select({ id: banners.id })
    .from(banners)
    .where(
      and(
        eq(banners.brandId, brandId),
        eq(banners.key, normalized.key),
        ne(banners.id, id),
      ),
    )
    .limit(1);

  if (duplicate.length > 0) {
    throw new Error("A banner with this key already exists");
  }

  const [row] = await db
    .update(banners)
    .set({
      ...normalized,
      images,
      brandId,
      updatedAt: new Date(),
    })
    .where(and(eq(banners.id, id), eq(banners.brandId, brandId)))
    .returning();

  if (!row) {
    throw new Error("Banner not found");
  }

  return rowToBanner(row);
}

export async function deleteBanner(brandId: string, id: string): Promise<void> {
  const current = await getBannerById(brandId, id);
  if (!current) {
    throw new Error("Banner not found");
  }

  if (isRequiredBannerPlacementKey(current.key)) {
    throw new Error(
      "This website placement is required and cannot be deleted. Keep at least one image.",
    );
  }

  await db
    .delete(banners)
    .where(and(eq(banners.id, id), eq(banners.brandId, brandId)));
}
