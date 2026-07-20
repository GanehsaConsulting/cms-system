import { getNavFeatureForPath } from "@/config/brand-nav";
import type { Brand } from "@/types/brand";

/**
 * Nested CMS paths whose resource IDs are brand-scoped.
 * On brand switch, navigate here instead of refreshing (avoids 404).
 */
export function getBrandSwitchListPath(pathname: string): string | null {
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";

  if (/^\/articles\/.+/.test(path)) {
    return "/articles";
  }
  if (/^\/prices\/.+/.test(path)) {
    return "/prices";
  }
  if (/^\/banners\/.+/.test(path)) {
    return "/banners";
  }
  if (/^\/media\/.+/.test(path)) {
    return "/media";
  }
  if (/^\/clients\/portfolio\/.+/.test(path)) {
    return "/clients/portfolio";
  }
  if (/^\/clients\/(?:new|new-data)$/.test(path)) {
    return "/clients";
  }
  if (/^\/clients\/[^/]+\/edit$/.test(path)) {
    return "/clients";
  }

  return null;
}

/**
 * Path to open after switching brands so the current URL does not 404.
 * Returns null when a soft refresh on the current path is enough.
 */
export function getBrandSwitchNavigationPath(
  pathname: string,
  nextBrand: Brand,
): string | null {
  const path = (pathname.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  const feature = getNavFeatureForPath(path);

  if (feature && !nextBrand.features.includes(feature)) {
    return "/";
  }

  return getBrandSwitchListPath(path);
}
