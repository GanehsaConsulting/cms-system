import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/articles/slug";
import { normalizeBrand } from "@/lib/brands/normalize";
import type { Brand, BrandInput } from "@/types/brand";

const DATA_PATH = path.join(process.cwd(), "data/brands.json");

async function readBrands(): Promise<Brand[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const brands = JSON.parse(raw) as Brand[];
    return brands.map(normalizeBrand);
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

async function writeBrands(brands: Brand[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(brands, null, 2)}\n`, "utf-8");
}

function normalizeInput(input: BrandInput): BrandInput {
  return {
    name: input.name.trim(),
    slug: slugify(input.slug.trim() || input.name),
    logo: input.logo.trim(),
    description: input.description.trim(),
    status: input.status === "inactive" ? "inactive" : "active",
    features: input.features,
  };
}

export async function getBrands(): Promise<Brand[]> {
  const brands = await readBrands();
  return brands.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const brands = await readBrands();
  return brands.find((brand) => brand.id === id) ?? null;
}

export async function createBrand(input: BrandInput): Promise<Brand> {
  const brands = await readBrands();
  const normalized = normalizeInput(input);
  const id = normalized.slug;

  if (!id) {
    throw new Error("Brand slug is invalid");
  }

  if (brands.some((brand) => brand.id === id || brand.slug === normalized.slug)) {
    throw new Error("A brand with this slug already exists");
  }

  const now = new Date().toISOString();
  const brand: Brand = {
    id,
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  brands.push(brand);
  await writeBrands(brands);
  return brand;
}

export async function updateBrand(
  id: string,
  input: BrandInput,
): Promise<Brand> {
  const brands = await readBrands();
  const index = brands.findIndex((brand) => brand.id === id);

  if (index === -1) {
    throw new Error("Brand not found");
  }

  const normalized = normalizeInput(input);

  if (
    brands.some(
      (brand, brandIndex) =>
        brandIndex !== index && brand.slug === normalized.slug,
    )
  ) {
    throw new Error("A brand with this slug already exists");
  }

  const updated: Brand = {
    ...brands[index],
    ...normalized,
    id: brands[index].id,
    updatedAt: new Date().toISOString(),
  };

  brands[index] = updated;
  await writeBrands(brands);
  return updated;
}

export async function deleteBrand(id: string): Promise<void> {
  const brands = await readBrands();
  const next = brands.filter((brand) => brand.id !== id);

  if (next.length === brands.length) {
    throw new Error("Brand not found");
  }

  await writeBrands(next);
}
