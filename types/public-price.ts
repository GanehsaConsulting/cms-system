import type { Price } from "@/types/price";

/** List/card payload for pricing cards — omits heavier long-form fields. */
export interface PublicPriceSummary {
  id: string;
  brandId: string;
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  service: Price["service"];
  packageName: Price["packageName"];
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function toPublicPriceSummary(price: Price): PublicPriceSummary {
  const {
    description: _description,
    whatsappMessage: _whatsappMessage,
    features: _features,
    ...summary
  } = price;
  return summary;
}
