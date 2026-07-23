import type { BrandFeatureId } from "@/config/brand";

/** Production CMS origin used in FE wiring docs and public API examples. */
export const CMS_PUBLIC_ORIGIN = "https://cms.gonline.id";

export const CMS_PUBLIC_API_BASE = `${CMS_PUBLIC_ORIGIN}/api/public`;

export const PUBLIC_API_ENDPOINTS = {
  brands: `${CMS_PUBLIC_API_BASE}/brands`,
  brandById: (brandId: string) => `${CMS_PUBLIC_API_BASE}/brands/${brandId}`,
  articles: `${CMS_PUBLIC_API_BASE}/articles`,
  articleBySlug: (slug: string) =>
    `${CMS_PUBLIC_API_BASE}/articles/${encodeURIComponent(slug)}`,
  articleRelatedBySlug: (slug: string) =>
    `${CMS_PUBLIC_API_BASE}/articles/${encodeURIComponent(slug)}/related`,
  articleCategories: `${CMS_PUBLIC_API_BASE}/article-categories`,
  prices: `${CMS_PUBLIC_API_BASE}/prices`,
  priceBySlug: (slug: string) =>
    `${CMS_PUBLIC_API_BASE}/prices/${encodeURIComponent(slug)}`,
  priceCategories: `${CMS_PUBLIC_API_BASE}/price-categories`,
  clients: `${CMS_PUBLIC_API_BASE}/clients`,
  clientById: (id: string) =>
    `${CMS_PUBLIC_API_BASE}/clients/${encodeURIComponent(id)}`,
  clientPortfolioById: (id: string) =>
    `${CMS_PUBLIC_API_BASE}/clients/${encodeURIComponent(id)}/portfolio`,
  portfolio: `${CMS_PUBLIC_API_BASE}/portfolio`,
  portfolioById: (id: string) =>
    `${CMS_PUBLIC_API_BASE}/portfolio/${encodeURIComponent(id)}`,
  banners: `${CMS_PUBLIC_API_BASE}/banners`,
  bannerByKey: (key: string) =>
    `${CMS_PUBLIC_API_BASE}/banners/by-key/${encodeURIComponent(key)}`,
  bannerPlacements: `${CMS_PUBLIC_API_BASE}/banners/placements`,
} as const;

/** Feature required to call each content collection endpoint. */
export const PUBLIC_API_FEATURE_BY_COLLECTION = {
  articles: "articles",
  "article-categories": "articles",
  prices: "prices",
  "price-categories": "prices",
  clients: "clients-works",
  portfolio: "clients-works",
  banners: "banners",
} as const satisfies Record<string, BrandFeatureId>;
