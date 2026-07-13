import { z } from "zod";
import { PRICE_FORM_LIMITS } from "@/config/price-form";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import type { PriceInput } from "@/types/price";

const localizedTextSchema = z.object({
  id: z.string().trim().max(PRICE_FORM_LIMITS.localizedField),
  en: z.string().trim().max(PRICE_FORM_LIMITS.localizedField),
  zh: z.string().trim().max(PRICE_FORM_LIMITS.localizedField),
});

const requiredLocalizedTextSchema = localizedTextSchema.refine(
  (value) =>
    value.id.length > 0 && value.en.length > 0 && value.zh.length > 0,
  "All languages are required",
);

const priceFeatureSchema = z.object({
  id: z.string().optional(),
  name: requiredLocalizedTextSchema,
});

export const priceFormSchema = z.object({
  slug: z.string().trim().max(PRICE_FORM_LIMITS.slug),
  serviceSlug: z.string().trim().max(PRICE_FORM_LIMITS.serviceSlug),
  category: z.string().trim().max(PRICE_FORM_LIMITS.category),
  highlighted: z.boolean(),
  description: localizedTextSchema,
  service: requiredLocalizedTextSchema,
  packageName: requiredLocalizedTextSchema,
  price: z.number().int().min(1, "Price is required"),
  strikethroughPrice: z
    .number()
    .int()
    .min(0, "Original price must be zero or greater"),
  whatsappLink: requiredLocalizedTextSchema,
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

export function priceFormToInput(values: PriceFormValues): PriceInput {
  return {
    ...values,
    slug:
      values.slug.trim() ||
      slugifyArticleTitle(values.packageName.id, PRICE_FORM_LIMITS.slug),
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
    slug: String(formData.get("slug") ?? ""),
    serviceSlug: String(formData.get("serviceSlug") ?? ""),
    category: String(formData.get("category") ?? ""),
    highlighted: formData.get("highlighted") === "true",
    description: parseLocalizedText(formData.get("description")),
    service: parseLocalizedText(formData.get("service")),
    packageName: parseLocalizedText(formData.get("packageName")),
    price: Number.parseInt(String(formData.get("price") ?? "0"), 10) || 0,
    strikethroughPrice:
      Number.parseInt(String(formData.get("strikethroughPrice") ?? "0"), 10) || 0,
    whatsappLink: parseLocalizedText(formData.get("whatsappLink")),
    isActive: formData.get("isActive") === "true",
    features: parseFeatures(formData.get("features")),
  };
}
