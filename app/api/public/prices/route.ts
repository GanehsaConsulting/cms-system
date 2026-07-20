import {
  emptyPublicPriceList,
  filterPublicPrices,
  paginatePublicPriceSummaries,
  parsePublicPriceListQuery,
} from "@/lib/api/public-prices";
import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicListJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getPrices } from "@/lib/db/prices";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  const query = parsePublicPriceListQuery(searchParams);

  if (!brandHasFeature(result.brand, "prices")) {
    const empty = emptyPublicPriceList(query.limit);
    return publicListJson(empty.items, empty.pagination);
  }

  const prices = await getPrices(result.brand.id);
  const filtered = filterPublicPrices(prices, query);
  const page = paginatePublicPriceSummaries(
    filtered,
    query.page ?? 1,
    query.limit ?? 20,
  );

  return publicListJson(page.items, page.pagination);
}
