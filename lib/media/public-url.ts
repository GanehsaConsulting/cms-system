import { CMS_PUBLIC_ORIGIN } from "@/config/public-api";

/** Absolute URL for a media file as consumed by the public site. */
export function resolveMediaPublicUrl(url: string): string {
  const trimmed = url.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${CMS_PUBLIC_ORIGIN}${path}`;
}
