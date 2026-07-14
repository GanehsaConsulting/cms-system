import type { Banner } from "@/types/banner";

/** Supports legacy single `image` until all records are migrated. */
export function getBannerImages(
  banner: Pick<Banner, "images"> | { image?: string; images?: string[] },
): string[] {
  if (Array.isArray(banner.images) && banner.images.length > 0) {
    return banner.images.map((item) => item.trim()).filter(Boolean);
  }

  if ("image" in banner && typeof banner.image === "string" && banner.image.trim()) {
    return [banner.image.trim()];
  }

  return [];
}

export function getBannerCoverImage(
  banner: Pick<Banner, "images"> | { image?: string; images?: string[] },
): string | null {
  return getBannerImages(banner)[0] ?? null;
}
