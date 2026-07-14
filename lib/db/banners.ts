import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/articles/slug";
import { getBannerImages } from "@/lib/banners/images";
import type { Banner, BannerInput } from "@/types/banner";

const DATA_PATH = path.join(process.cwd(), "data/banners.json");

type LegacyBanner = Banner & { image?: string };

function normalizeBanner(raw: LegacyBanner): Banner {
  const { image: _legacyImage, ...rest } = raw;
  return {
    ...rest,
    images: getBannerImages(raw),
  };
}

async function readBanners(): Promise<Banner[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const banners = JSON.parse(raw) as LegacyBanner[];
    return banners.map(normalizeBanner);
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

async function writeBanners(banners: Banner[]): Promise<void> {
  await writeFile(DATA_PATH, `${JSON.stringify(banners, null, 2)}\n`, "utf-8");
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

export async function getBanners(): Promise<Banner[]> {
  const banners = await readBanners();
  return banners.sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const banners = await readBanners();
  return banners.find((banner) => banner.id === id) ?? null;
}

/** Public lookup — prefer active banners; returns null if missing or inactive. */
export async function getBannerByKey(key: string): Promise<Banner | null> {
  const normalizedKey = slugify(key.trim());
  if (!normalizedKey) {
    return null;
  }

  const banners = await readBanners();
  const banner = banners.find((item) => item.key === normalizedKey) ?? null;

  if (!banner || !banner.isActive) {
    return null;
  }

  return banner;
}

export async function createBanner(input: BannerInput): Promise<Banner> {
  const banners = await readBanners();
  const normalized = normalizeInput(input);

  if (!normalized.key) {
    throw new Error("Key is invalid");
  }

  if (normalized.images.length === 0) {
    throw new Error("At least one image is required");
  }

  const duplicate = banners.find((banner) => banner.key === normalized.key);
  if (duplicate) {
    throw new Error("A banner with this key already exists");
  }

  const now = new Date().toISOString();
  const banner: Banner = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  banners.push(banner);
  await writeBanners(banners);
  return banner;
}

export async function updateBanner(
  id: string,
  input: BannerInput,
): Promise<Banner> {
  const banners = await readBanners();
  const index = banners.findIndex((banner) => banner.id === id);

  if (index === -1) {
    throw new Error("Banner not found");
  }

  const normalized = normalizeInput(input);

  if (!normalized.key) {
    throw new Error("Key is invalid");
  }

  if (normalized.images.length === 0) {
    throw new Error("At least one image is required");
  }

  const duplicate = banners.find(
    (banner) => banner.id !== id && banner.key === normalized.key,
  );
  if (duplicate) {
    throw new Error("A banner with this key already exists");
  }

  const updated: Banner = {
    ...banners[index],
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  banners[index] = updated;
  await writeBanners(banners);
  return updated;
}

export async function deleteBanner(id: string): Promise<void> {
  const banners = await readBanners();
  const exists = banners.some((banner) => banner.id === id);

  if (!exists) {
    throw new Error("Banner not found");
  }

  await writeBanners(banners.filter((banner) => banner.id !== id));
}
