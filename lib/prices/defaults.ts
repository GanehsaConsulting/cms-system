import { emptyLocalizedText } from "@/lib/locale";
import type { PriceFeature, PriceInput } from "@/types/price";

function createFeature(): PriceFeature {
  return {
    id: crypto.randomUUID(),
    name: emptyLocalizedText(),
  };
}

export function createEmptyPriceInput(): PriceInput {
  return {
    slug: "",
    serviceSlug: "",
    category: "",
    highlighted: false,
    description: emptyLocalizedText(),
    service: emptyLocalizedText(),
    packageName: emptyLocalizedText(),
    price: 0,
    strikethroughPrice: 0,
    whatsappLink: emptyLocalizedText(),
    isActive: true,
    features: [createFeature()],
  };
}

export function priceToFormInput(price: {
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  description: PriceInput["description"];
  service: PriceInput["service"];
  packageName: PriceInput["packageName"];
  price: number;
  strikethroughPrice: number;
  whatsappLink: PriceInput["whatsappLink"];
  isActive: boolean;
  features: PriceFeature[];
}): PriceInput {
  return {
    slug: price.slug,
    serviceSlug: price.serviceSlug,
    category: price.category,
    highlighted: price.highlighted,
    description: price.description,
    service: price.service,
    packageName: price.packageName,
    price: price.price,
    strikethroughPrice: price.strikethroughPrice,
    whatsappLink: price.whatsappLink,
    isActive: price.isActive,
    features: price.features.length > 0 ? price.features : [createFeature()],
  };
}
