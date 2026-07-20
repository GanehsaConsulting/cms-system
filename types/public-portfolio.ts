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
  const { description: _description, ...summary } = item;
  return summary;
}

export function toPublicPortfolioDetail(
  item: Portfolio,
  client: PublicClientRef,
): PublicPortfolio {
  return {
    ...item,
    client,
  };
}
