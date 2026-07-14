import { BANNER_LIMITS } from "@/config/banner";
import { slugify } from "@/lib/articles/slug";

/** Build a unique key from an uploaded image file name. */
export function bannerKeyFromImageFileName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").trim();
  const slug = slugify(base).slice(0, BANNER_LIMITS.key);

  if (slug.length >= 2) {
    return slug;
  }

  return `banner-${Date.now().toString(36)}`.slice(0, BANNER_LIMITS.key);
}
