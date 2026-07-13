import { z } from "zod";
import { PRICE_CATEGORY_LIMITS } from "@/config/price-category";

export const priceCategorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(
      PRICE_CATEGORY_LIMITS.label,
      `Category name must be at most ${PRICE_CATEGORY_LIMITS.label} characters`,
    ),
});

export type PriceCategoryFormValues = z.infer<typeof priceCategorySchema>;
