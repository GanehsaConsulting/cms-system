import { requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ brandId: string }> },
) {
  const { brandId } = await context.params;
  const result = await requirePublicBrand(brandId);

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  const { brand } = result;

  return publicJson({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo,
    description: brand.description,
    features: brand.features,
  });
}
