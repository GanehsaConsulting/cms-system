import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  emptyPublicPortfolioList,
  filterPublicPortfolioItems,
  paginatePublicPortfolioSummaries,
  parsePublicPortfolioListQuery,
} from "@/lib/api/public-portfolio";
import {
  publicError,
  publicListJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getClientById } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

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

  const query = parsePublicPortfolioListQuery(searchParams);

  if (!brandHasFeature(result.brand, "clients-works")) {
    const empty = emptyPublicPortfolioList(query.limit);
    return publicListJson(empty.items, empty.pagination);
  }

  const { id } = await context.params;
  const clientId = decodeURIComponent(id);
  const client = await getClientById(result.brand.id, clientId);

  if (!client) {
    return publicError("Client not found", 404);
  }

  const items = await getPortfolioItems(result.brand.id);
  const filtered = filterPublicPortfolioItems(items, {
    ...query,
    clientId,
  });
  const page = paginatePublicPortfolioSummaries(
    filtered,
    query.page ?? 1,
    query.limit ?? 20,
  );

  return publicListJson(page.items, page.pagination);
}
