"use server";

import { revalidatePath } from "next/cache";
import { createCustomCategory } from "@/lib/db/categories";
import { createCategorySchema } from "@/lib/validations/category";

export async function createCategoryAction(formData: FormData) {
  const parsed = createCategorySchema.safeParse({
    label: String(formData.get("label") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid category data",
    };
  }

  try {
    const category = await createCustomCategory(parsed.data);
    revalidatePath("/articles");
    revalidatePath("/articles/new");
    return {
      success: true as const,
      category,
    };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}
