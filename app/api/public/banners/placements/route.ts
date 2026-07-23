import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { buildBannerPlacementCatalog } from "@/lib/banners/placements-catalog";
import { getBanners } from "@/lib/db/banners";

export function OPTIONS() {
  return publicOptionsResponse();
}

/**
 * Explicit banner placement contract for frontend wiring.
 * Always returns required website keys (even when CMS rows are missing)
 * plus discoverable custom keys for this brand.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "banners")) {
    return publicError("Banners module is not enabled for this brand", 404);
  }

  const banners = await getBanners(result.brand.id);
  return publicJson(buildBannerPlacementCatalog(banners));
}
