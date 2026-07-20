import {
  publicError,
  publicJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getBrands } from "@/lib/db/brands";

export function OPTIONS() {
  return publicOptionsResponse();
}

/** List active brands (id, name, logo, features) for FE bootstrap. */
export async function GET() {
  const brands = await getBrands();
  const data = brands
    .filter((brand) => brand.status === "active")
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      description: brand.description,
      features: brand.features,
    }));

  return publicJson(data);
}
