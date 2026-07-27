import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { slugify } from "@/lib/articles/slug";
import { normalizeBrand } from "@/lib/brands/normalize";
import { resolveImageAsset } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import type { Brand, BrandInput } from "@/types/brand";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToBrand(row: typeof brands.$inferSelect): Brand {
  return normalizeBrand({
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo,
    description: row.description,
    status: row.status,
    features: Array.isArray(row.features) ? row.features : [],
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  });
}

async function normalizeInput(input: BrandInput): Promise<BrandInput> {
  return {
    name: input.name.trim(),
    slug: slugify(input.slug.trim() || input.name),
    logo: await resolveImageAsset(input.logo.trim(), "cms-system/brands"),
    description: input.description.trim(),
    status: input.status === "inactive" ? "inactive" : "active",
    features: input.features,
  };
}

export const getBrands = cache(async (): Promise<Brand[]> => {
  const rows = await db.select().from(brands).orderBy(desc(brands.updatedAt));
  return rows.map(rowToBrand);
});

export async function getBrandById(id: string): Promise<Brand | null> {
  const rows = await db
    .select()
    .from(brands)
    .where(eq(brands.id, id))
    .limit(1);

  return rows[0] ? rowToBrand(rows[0]) : null;
}

export async function createBrand(input: BrandInput): Promise<Brand> {
  const normalized = await normalizeInput(input);
  const id = normalized.slug;

  if (!id) {
    throw new Error("Brand slug is invalid");
  }

  const existing = await db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, normalized.slug))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("A brand with this slug already exists");
  }

  const now = new Date();
  const [row] = await db
    .insert(brands)
    .values({
      id,
      ...normalized,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToBrand(row);
}

export async function updateBrand(
  id: string,
  input: BrandInput,
): Promise<Brand> {
  const current = await getBrandById(id);
  if (!current) {
    throw new Error("Brand not found");
  }

  const normalized = await normalizeInput(input);

  const slugTaken = await db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, normalized.slug))
    .limit(1);

  if (slugTaken.length > 0 && slugTaken[0].id !== id) {
    throw new Error("A brand with this slug already exists");
  }

  const [row] = await db
    .update(brands)
    .set({
      ...normalized,
      updatedAt: new Date(),
    })
    .where(eq(brands.id, id))
    .returning();

  if (!row) {
    throw new Error("Brand not found");
  }

  return rowToBrand(row);
}

export async function deleteBrand(id: string): Promise<void> {
  const rows = await db
    .delete(brands)
    .where(eq(brands.id, id))
    .returning({ id: brands.id });

  if (rows.length === 0) {
    throw new Error("Brand not found");
  }
}
