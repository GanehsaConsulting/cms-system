import { PRICE_LIST_DISPLAY_LOCALE } from "@/config/price-form";
import type { Price, PriceFeature } from "@/types/price";
import type { LocalizedText } from "@/types/locale";
import { emptyLocalizedText } from "@/lib/locale";

function normalizeLocalizedText(value: unknown): LocalizedText {
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    "en" in value &&
    "zh" in value
  ) {
    const localized = value as LocalizedText;
    return {
      id: localized.id ?? "",
      en: localized.en ?? "",
      zh: localized.zh ?? "",
    };
  }

  const text = typeof value === "string" ? value : "";
  return emptyLocalizedText(text);
}

function normalizeFeature(feature: PriceFeature, index: number): PriceFeature {
  return {
    id: feature.id || `feature-${index + 1}`,
    name: normalizeLocalizedText(feature.name),
  };
}

export function normalizePrice(price: Price): Price {
  return {
    ...price,
    slug: price.slug ?? "",
    serviceSlug: price.serviceSlug ?? "",
    category: price.category ?? "",
    highlighted: price.highlighted ?? false,
    description: normalizeLocalizedText(price.description),
    service: normalizeLocalizedText(price.service),
    packageName: normalizeLocalizedText(price.packageName),
    price: Number(price.price) || 0,
    strikethroughPrice: Number(price.strikethroughPrice) || 0,
    whatsappLink: normalizeLocalizedText(price.whatsappLink),
    isActive: price.isActive ?? true,
    features: (price.features ?? []).map(normalizeFeature),
    createdAt: price.createdAt ?? new Date().toISOString(),
    updatedAt: price.updatedAt ?? new Date().toISOString(),
  };
}

export function getPriceDisplayText(
  text: LocalizedText,
  locale: typeof PRICE_LIST_DISPLAY_LOCALE = PRICE_LIST_DISPLAY_LOCALE,
) {
  return text[locale].trim() || text.id.trim() || text.en.trim();
}
