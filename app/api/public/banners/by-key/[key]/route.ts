import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getBannerByKey } from "@/lib/db/banners";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "banners")) {
    return publicError("Banners module is not enabled for this brand", 404);
  }

  const { key } = await context.params;
  const banner = await getBannerByKey(decodeURIComponent(key));

  if (!banner || !banner.isActive) {
    return publicError("Banner not found", 404);
  }

  return publicJson(banner);
}
