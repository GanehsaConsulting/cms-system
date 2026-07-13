import { emptyLocalizedText } from "@/lib/locale";
import type { PriceFeature } from "@/types/price";
import type { PriceFormValues } from "@/lib/validations/price";

function createFeature(): PriceFeature {
  return {
    id: crypto.randomUUID(),
    name: emptyLocalizedText(),
  };
}

export function createEmptyPriceInput(): PriceFormValues {
  return {
    serviceSlug: "",
    highlighted: false,
    description: emptyLocalizedText(),
    service: emptyLocalizedText(),
    packageName: emptyLocalizedText(),
    price: 0,
    strikethroughPrice: 0,
    whatsappPhone: "",
    whatsappMessage: emptyLocalizedText(),
    isActive: true,
    features: [createFeature()],
  };
}

export function priceToFormInput(price: {
  serviceSlug: string;
  highlighted: boolean;
  description: PriceFormValues["description"];
  service: PriceFormValues["service"];
  packageName: PriceFormValues["packageName"];
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  whatsappMessage: PriceFormValues["whatsappMessage"];
  isActive: boolean;
  features: PriceFeature[];
}): PriceFormValues {
  return {
    serviceSlug: price.serviceSlug,
    highlighted: price.highlighted,
    description: price.description,
    service: price.service,
    packageName: price.packageName,
    price: price.price,
    strikethroughPrice: price.strikethroughPrice,
    whatsappPhone: price.whatsappPhone,
    whatsappMessage: price.whatsappMessage,
    isActive: price.isActive,
    features: price.features.length > 0 ? price.features : [createFeature()],
  };
}
