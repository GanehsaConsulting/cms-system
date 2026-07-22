import { PRICE_LIST_DISPLAY_LOCALE } from "@/config/price-form";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import { buildWhatsAppUrl } from "@/lib/prices/whatsapp";
import type { Price } from "@/types/price";
import type { PricePreviewData } from "@/types/price-preview";

export function priceToPreviewData(
  price: Price,
  locale: typeof PRICE_LIST_DISPLAY_LOCALE = PRICE_LIST_DISPLAY_LOCALE,
): PricePreviewData {
  return {
    title: getPriceDisplayText(price.packageName, locale),
    price: price.price,
    strikethroughPrice: price.strikethroughPrice,
    features: price.features
      .map((feature) => getPriceDisplayText(feature.name, locale))
      .filter(Boolean),
    whatsappLink: buildWhatsAppUrl(
      price.whatsappPhone,
      getPriceDisplayText(price.whatsappMessage, locale),
    ),
    highlighted: price.highlighted,
  };
}
