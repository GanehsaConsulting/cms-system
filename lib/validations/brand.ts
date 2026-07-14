import { z } from "zod";
import {
  BRAND_FEATURE_IDS,
  BRAND_FORM_LIMITS,
  isBrandFeatureId,
} from "@/config/brand";
import type { BrandInput } from "@/types/brand";

const brandFeatureSchema = z
  .string()
  .refine(isBrandFeatureId, "Invalid module");

export const brandFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Brand name is required")
    .max(BRAND_FORM_LIMITS.name),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(BRAND_FORM_LIMITS.slug)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only",
    ),
  logo: z.string(),
  description: z.string().trim().max(BRAND_FORM_LIMITS.description),
  status: z.enum(["active", "inactive"]),
  features: z
    .array(brandFeatureSchema)
    .min(1, "Select at least one module")
    .refine(
      (features) => features.every((feature) => BRAND_FEATURE_IDS.includes(feature)),
      "Invalid module selection",
    ),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export function brandFormToInput(values: BrandFormValues): BrandInput {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    logo: values.logo.trim(),
    description: values.description.trim(),
    status: values.status,
    features: values.features,
  };
}

function parseFeatures(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseBrandForm(formData: FormData): unknown {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    logo: String(formData.get("logo") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "active"),
    features: parseFeatures(formData.get("features")),
  };
}
