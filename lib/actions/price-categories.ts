"use server";

import { revalidatePath } from "next/cache";
import {
  createPriceCategory,
  deletePriceCategory,
  updatePriceCategory,
} from "@/lib/db/price-categories";
import { priceCategorySchema } from "@/lib/validations/price-category";

function revalidatePricePaths() {
  revalidatePath("/prices");
  revalidatePath("/prices/new");
}

export async function createPriceCategoryAction(formData: FormData) {
  const parsed = priceCategorySchema.safeParse({
    label: String(formData.get("label") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid category data",
    };
  }

  try {
    const category = await createPriceCategory(parsed.data);
    revalidatePricePaths();
    return { success: true as const, category };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updatePriceCategoryAction(
  id: string,
  formData: FormData,
) {
  const parsed = priceCategorySchema.safeParse({
    label: String(formData.get("label") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid category data",
    };
  }

  try {
    const category = await updatePriceCategory(id, parsed.data);
    revalidatePricePaths();
    return { success: true as const, category };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deletePriceCategoryAction(id: string) {
  try {
    await deletePriceCategory(id);
    revalidatePricePaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
