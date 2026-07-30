import { z } from "zod";
import { PRICE_FORM_LIMITS } from "@/config/price-form";
import { WHATSAPP_PHONE_LIMITS } from "@/config/whatsapp";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import {
  isValidWhatsAppPhone,
  normalizeWhatsAppPhone,
} from "@/lib/prices/whatsapp";
import type { PriceInput } from "@/types/price";

function localizedTextSchema(max: number, fieldLabel: string) {
  const tooLong = `${fieldLabel} must be ${max} characters or fewer`;
  return z.object({
    id: z.string().trim().max(max, tooLong),
    en: z.string().trim().max(max, tooLong),
    zh: z.string().trim().max(max, tooLong),
  });
}

const requiredLocalizedTextSchema = localizedTextSchema(
  PRICE_FORM_LIMITS.localizedField,
  "This field",
).refine(
  (value) =>
    value.id.length > 0 && value.en.length > 0 && value.zh.length > 0,
  "Fill this in for Indonesian, English, and Chinese",
);

const whatsappMessageSchema = z
  .object({
    id: z
      .string()
      .trim()
      .max(
        PRICE_FORM_LIMITS.whatsappMessage,
        `WhatsApp message must be ${PRICE_FORM_LIMITS.whatsappMessage} characters or fewer`,
      ),
    en: z
      .string()
      .trim()
      .max(
        PRICE_FORM_LIMITS.whatsappMessage,
        `WhatsApp message must be ${PRICE_FORM_LIMITS.whatsappMessage} characters or fewer`,
      ),
    zh: z
      .string()
      .trim()
      .max(
        PRICE_FORM_LIMITS.whatsappMessage,
        `WhatsApp message must be ${PRICE_FORM_LIMITS.whatsappMessage} characters or fewer`,
      ),
  })
  .refine(
    (value) =>
      value.id.length > 0 && value.en.length > 0 && value.zh.length > 0,
    "WhatsApp message is required in all languages",
  );

const priceFeatureSchema = z.object({
  id: z.string().optional(),
  name: localizedTextSchema(
    PRICE_FORM_LIMITS.localizedField,
    "Feature",
  ).refine(
    (value) =>
      value.id.length > 0 && value.en.length > 0 && value.zh.length > 0,
    "Feature text is required in all languages",
  ),
});

/** Form fields — slug is derived from package name; category mirrors serviceSlug. */
export const priceFormSchema = z.object({
  serviceSlug: z.string().trim().min(1, "Select a service name"),
  highlighted: z.boolean(),
  description: localizedTextSchema(
    PRICE_FORM_LIMITS.description,
    "Description",
  ),
  service: requiredLocalizedTextSchema,
  packageName: localizedTextSchema(
    PRICE_FORM_LIMITS.localizedField,
    "Package name",
  ).refine(
    (value) =>
      value.id.length > 0 && value.en.length > 0 && value.zh.length > 0,
    "Package name is required in all languages",
  ),
  price: z.number().int().min(1, "Price is required"),
  strikethroughPrice: z
    .number()
    .int()
    .min(0, "Original price must be zero or greater"),
  showStartingFrom: z.boolean(),
  whatsappPhone: z
    .string()
    .trim()
    .refine(
      (value) => isValidWhatsAppPhone(normalizeWhatsAppPhone(value)),
      `Enter a valid WhatsApp number (${WHATSAPP_PHONE_LIMITS.minDigits}–${WHATSAPP_PHONE_LIMITS.maxDigits} digits)`,
    ),
  whatsappMessage: whatsappMessageSchema,
  isActive: z.boolean(),
  features: z
    .array(priceFeatureSchema)
    .min(
      PRICE_FORM_LIMITS.minFeatures,
      "At least one feature is required",
    )
    .max(
      PRICE_FORM_LIMITS.maxFeatures,
      `You can add up to ${PRICE_FORM_LIMITS.maxFeatures} features`,
    ),
});

export type PriceFormValues = z.infer<typeof priceFormSchema>;

function packageNameForSlug(packageName: PriceFormValues["packageName"]) {
  return packageName.en.trim() || packageName.id.trim();
}

export function priceFormToInput(values: PriceFormValues): PriceInput {
  return {
    ...values,
    category: values.serviceSlug,
    strikethroughPrice: values.showStartingFrom ? 0 : values.strikethroughPrice,
    whatsappPhone: normalizeWhatsAppPhone(values.whatsappPhone),
    slug: slugifyArticleTitle(
      packageNameForSlug(values.packageName),
      PRICE_FORM_LIMITS.slug,
    ),
    features: values.features.map((feature, index) => ({
      id: feature.id || `feature-${index + 1}`,
      name: feature.name,
    })),
  };
}

function parseLocalizedText(value: FormDataEntryValue | null) {
  if (!value) {
    return { id: "", en: "", zh: "" };
  }

  try {
    const parsed = JSON.parse(String(value)) as {
      id?: string;
      en?: string;
      zh?: string;
    };

    return {
      id: parsed.id ?? "",
      en: parsed.en ?? "",
      zh: parsed.zh ?? "",
    };
  } catch {
    return { id: "", en: "", zh: "" };
  }
}

function parseFeatures(value: FormDataEntryValue | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parsePriceForm(formData: FormData) {
  return {
    serviceSlug: String(formData.get("serviceSlug") ?? ""),
    highlighted: formData.get("highlighted") === "true",
    description: parseLocalizedText(formData.get("description")),
    service: parseLocalizedText(formData.get("service")),
    packageName: parseLocalizedText(formData.get("packageName")),
    price: Number.parseInt(String(formData.get("price") ?? "0"), 10) || 0,
    strikethroughPrice:
      Number.parseInt(String(formData.get("strikethroughPrice") ?? "0"), 10) || 0,
    showStartingFrom: formData.get("showStartingFrom") === "true",
    whatsappPhone: normalizeWhatsAppPhone(
      String(formData.get("whatsappPhone") ?? ""),
    ),
    whatsappMessage: parseLocalizedText(formData.get("whatsappMessage")),
    isActive: formData.get("isActive") === "true",
    features: parseFeatures(formData.get("features")),
  };
}
