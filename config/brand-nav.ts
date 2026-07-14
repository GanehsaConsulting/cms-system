import type { BrandFeatureId } from "@/config/brand";

/** Maps sidebar routes to brand feature modules. */
export const NAV_FEATURE_BY_HREF: Record<string, BrandFeatureId> = {
  "/": "dashboard",
  "/articles": "articles",
  "/prices": "prices",
  "/clients": "clients-works",
  "/banners": "banners",
};

export function getNavFeatureForHref(href: string): BrandFeatureId | null {
  return NAV_FEATURE_BY_HREF[href] ?? null;
}
