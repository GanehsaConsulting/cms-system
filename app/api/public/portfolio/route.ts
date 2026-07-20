import { brandHasFeature, requirePublicBrand } from "@/lib/api/public-brand";
import {
  compareIsoDesc,
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
import { getPortfolioItems } from "@/lib/db/portfolio";
import type { PortfolioWorkType } from "@/types/portfolio";

const WORK_TYPES = new Set<PortfolioWorkType>(["social-media", "website"]);

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
  const workTypeRaw = searchParams.get("workType")?.trim() || null;
  const workType =
    workTypeRaw && WORK_TYPES.has(workTypeRaw as PortfolioWorkType)
      ? (workTypeRaw as PortfolioWorkType)
      : null;
  const clientId = searchParams.get("clientId")?.trim() || null;
  const query = getSearchQuery(searchParams);
  const sort = searchParams.get("sort")?.trim() || "updatedAt-desc";

  const items = await getPortfolioItems();
  const data = items
    .filter((item) =>
      featured === null ? true : item.featured === featured,
    )
    .filter((item) => (workType ? item.workType === workType : true))
    .filter((item) => (clientId ? item.clientId === clientId : true))
    .filter((item) =>
      matchesSearch(query, [
        item.title,
        item.description,
        item.url,
        item.workType,
        item.clientId,
      ]),
    )
    .sort((left, right) => {
      switch (sort) {
        case "title-asc":
          return compareTextAsc(left.title, right.title);
        case "featured-first":
          if (left.featured !== right.featured) {
            return left.featured ? -1 : 1;
          }
          return compareIsoDesc(left.updatedAt, right.updatedAt);
        default:
          return compareIsoDesc(left.updatedAt, right.updatedAt);
      }
    });

  return publicJson(data);
}
