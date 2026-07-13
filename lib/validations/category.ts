import { z } from "zod";

export const createCategorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(40, "Category name must be at most 40 characters"),
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
