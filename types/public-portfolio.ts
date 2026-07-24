import type { Portfolio, PortfolioWorkType } from "@/types/portfolio";
import type { PublicClientRef } from "@/types/public-client";

/** List/card payload — no long description. */
export interface PublicPortfolioSummary {
  id: string;
  brandId: string;
  title: string;
  clientId: string;
  workType: PortfolioWorkType;
  coverImage: string;
  url: string;
  featured: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Detail payload — includes full description and embedded client. */
export interface PublicPortfolio extends Portfolio {
  client: PublicClientRef;
}

export function toPublicPortfolioSummary(
  item: Portfolio,
): PublicPortfolioSummary {
  return {
    id: item.id,
    brandId: item.brandId,
    title: item.title,
    clientId: item.clientId,
    workType: item.workType,
    coverImage: item.coverImage,
    url: item.url,
    featured: item.featured,
    clickCount: item.clickCount ?? 0,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function toPublicPortfolioDetail(
  item: Portfolio,
  client: PublicClientRef,
): PublicPortfolio {
  return {
    ...item,
    clickCount: item.clickCount ?? 0,
    client,
  };
}
