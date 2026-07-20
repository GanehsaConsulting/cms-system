import type { BrandFeatureId } from "@/config/brand";
import { getBrandById } from "@/lib/db/brands";
import type { Brand } from "@/types/brand";

export async function requirePublicBrand(
  brandId: string | null,
): Promise<{ brand: Brand } | { error: string; status: number }> {
  if (!brandId?.trim()) {
    return {
      error: "Missing required query parameter: brandId",
      status: 400,
    };
  }

  const brand = await getBrandById(brandId.trim());
  if (!brand || brand.status !== "active") {
    return { error: "Brand not found", status: 404 };
  }

  return { brand };
}

export function brandHasFeature(
  brand: Brand,
  feature: BrandFeatureId,
): boolean {
  return brand.features.includes(feature);
}
