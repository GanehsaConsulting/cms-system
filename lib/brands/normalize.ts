import { BRAND_FEATURE_IDS, isBrandFeatureId } from "@/config/brand";
import type { Brand } from "@/types/brand";

export function normalizeBrand(brand: Brand): Brand {
  const features = brand.features.filter(isBrandFeatureId);

  return {
    ...brand,
    name: brand.name.trim(),
    slug: brand.slug.trim(),
    logo: brand.logo.trim(),
    description: brand.description.trim(),
    status: brand.status === "inactive" ? "inactive" : "active",
    features: features.length > 0 ? features : [...BRAND_FEATURE_IDS.slice(0, 1)],
  };
}
