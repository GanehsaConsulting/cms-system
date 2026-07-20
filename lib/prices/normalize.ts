import { PRICE_LIST_DISPLAY_LOCALE } from "@/config/price-form";
import type { Price, PriceFeature } from "@/types/price";
import type { LocalizedText } from "@/types/locale";
import { emptyLocalizedText } from "@/lib/locale";
import {
  extractWhatsAppMessage,
  extractWhatsAppPhone,
  normalizeWhatsAppPhone,
} from "@/lib/prices/whatsapp";

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

function migrateWhatsAppFields(price: Price & {
  whatsappLink?: LocalizedText | string;
}) {
  if (typeof price.whatsappPhone === "string") {
    return {
      whatsappPhone: normalizeWhatsAppPhone(price.whatsappPhone),
      whatsappMessage: normalizeLocalizedText(price.whatsappMessage),
    };
  }

  const legacyLink = normalizeLocalizedText(price.whatsappLink);
  const source = legacyLink.en || legacyLink.id || legacyLink.zh;
  const phone = extractWhatsAppPhone(source);
  const message = extractWhatsAppMessage(source);

  return {
    whatsappPhone: phone,
    whatsappMessage: message
      ? emptyLocalizedText(message)
      : emptyLocalizedText(),
  };
}

export function normalizePrice(price: Price): Price {
  const whatsapp = migrateWhatsAppFields(
    price as Price & { whatsappLink?: LocalizedText | string },
  );

  return {
    ...price,
    brandId: String(price.brandId ?? "").trim(),
    slug: price.slug ?? "",
    serviceSlug: price.serviceSlug ?? "",
    category: price.category ?? "",
    highlighted: price.highlighted ?? false,
    description: normalizeLocalizedText(price.description),
    service: normalizeLocalizedText(price.service),
    packageName: normalizeLocalizedText(price.packageName),
    price: Number(price.price) || 0,
    strikethroughPrice: Number(price.strikethroughPrice) || 0,
    whatsappPhone: whatsapp.whatsappPhone,
    whatsappMessage: whatsapp.whatsappMessage,
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
