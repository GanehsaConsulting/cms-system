import type { BrandFeatureId } from "@/config/brand";

/** Maps sidebar routes to brand feature modules. */
export const NAV_FEATURE_BY_HREF: Record<string, BrandFeatureId> = {
  "/": "dashboard",
  "/articles": "articles",
  "/prices": "prices",
  "/clients": "clients-works",
  "/banners": "banners",
  "/activities": "activities",
};

export function getNavFeatureForHref(href: string): BrandFeatureId | null {
  return NAV_FEATURE_BY_HREF[href] ?? null;
}

/** Resolves feature for list routes and nested paths (e.g. `/articles/new`). */
export function getNavFeatureForPath(path: string): BrandFeatureId | null {
  const exact = NAV_FEATURE_BY_HREF[path];
  if (exact) {
    return exact;
  }

  for (const [href, feature] of Object.entries(NAV_FEATURE_BY_HREF)) {
    if (href !== "/" && path.startsWith(`${href}/`)) {
      return feature;
    }
  }

  return null;
}
