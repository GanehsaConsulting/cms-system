import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareTextAsc,
  getBooleanFlag,
  getSearchQuery,
  matchesSearch,
} from "@/lib/api/public-query";
import {
  publicError,
  publicJson,
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

  if (!brandHasFeature(result.brand, "clients-works")) {
    return publicJson([]);
  }

  const featured = getBooleanFlag(searchParams, "featured");
  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "name-asc";

  const clients = await getClients();
  const data = clients
    .filter((client) =>
      featured === null ? true : client.featured === featured,
    )
    .filter((client) =>
      matchesSearch(query, [
        client.name,
        client.website,
        client.description,
        ...client.testimonials.flatMap((item) => [
          item.quote,
          item.authorName,
          item.authorTitle,
        ]),
      ]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "featured-first":
          if (left.featured !== right.featured) {
            return left.featured ? -1 : 1;
          }
          return compareTextAsc(left.name, right.name);
        case "name-desc":
          return compareTextAsc(right.name, left.name);
        default:
          return compareTextAsc(left.name, right.name);
      }
    });

  return publicJson(data);
}
