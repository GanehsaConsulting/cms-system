import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getPortfolioById } from "@/lib/db/portfolio";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  if (!brandHasFeature(result.brand, "clients-works")) {
    return publicError(
      "Clients & Works module is not enabled for this brand",
      404,
    );
  }

  const { id } = await context.params;
  const item = await getPortfolioById(decodeURIComponent(id));

  if (!item) {
    return publicError("Portfolio item not found", 404);
  }

  return publicJson(item);
}
