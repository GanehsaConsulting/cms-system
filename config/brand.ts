export const BRAND_FORM_LIMITS = {
  name: 80,
  slug: 80,
  description: 240,
} as const;

export const BRAND_FEATURES = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview and quick stats for this brand.",
  },
  {
    id: "articles",
    label: "Articles",
    description: "Manage company profile articles.",
  },
  {
    id: "prices",
    label: "Prices Management",
    description: "Services and pricing tables.",
  },
  {
    id: "clients-works",
    label: "Clients & Works",
    description: "Client profiles and portfolio works.",
  },
  {
    id: "banners",
    label: "Banners",
    description: "Marketing banners and placements.",
  },
  {
    id: "activities",
    label: "Activities",
    description: "Activity and promo cards for the public site.",
  },
] as const;

export type BrandFeatureId = (typeof BRAND_FEATURES)[number]["id"];

export const BRAND_FEATURE_IDS = BRAND_FEATURES.map((feature) => feature.id);

export const BRAND_STATUSES = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
] as const;

export function getBrandFeatureLabel(id: BrandFeatureId): string {
  return BRAND_FEATURES.find((feature) => feature.id === id)?.label ?? id;
}

export function isBrandFeatureId(value: string): value is BrandFeatureId {
  return BRAND_FEATURE_IDS.includes(value as BrandFeatureId);
}
