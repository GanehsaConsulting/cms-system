import {
  emptyPublicClientList,
  filterPublicClients,
  paginatePublicClientSummaries,
  parsePublicClientListQuery,
} from "@/lib/api/public-clients";
import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  publicError,
  publicListJson,
  publicOptionsResponse,
} from "@/lib/api/public-response";
import { getClients } from "@/lib/db/clients";

export function OPTIONS() {
  return publicOptionsResponse();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await requirePublicBrand(searchParams.get("brandId"));

  if ("error" in result) {
    return publicError(result.error, result.status);
  }

  const query = parsePublicClientListQuery(searchParams);

  if (!brandHasFeature(result.brand, "clients-works")) {
    const empty = emptyPublicClientList(query.limit);
    return publicListJson(empty.items, empty.pagination);
  }

  const clients = await getClients(result.brand.id);
  const filtered = filterPublicClients(clients, query);
  const page = paginatePublicClientSummaries(
    filtered,
    query.page ?? 1,
    query.limit ?? 20,
  );

  return publicListJson(page.items, page.pagination);
}
