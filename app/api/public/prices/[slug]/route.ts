import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getPriceBySlug } from "@/lib/db/prices";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "prices")) {
    return publicError("Prices module is not enabled for this brand", 404);
  }

  const { slug } = await context.params;
  const price = await getPriceBySlug(result.brand.id, decodeURIComponent(slug));

  if (!price || !price.isActive) {
    return publicError("Price not found", 404);
  }

  return publicJson(price);
}
