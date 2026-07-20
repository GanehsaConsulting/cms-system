"use server";

import { revalidatePath } from "next/cache";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createPriceCategory,
  deletePriceCategory,
  updatePriceCategory,
} from "@/lib/db/price-categories";
import { priceCategorySchema } from "@/lib/validations/price-category";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";

function revalidatePricePaths() {
  revalidatePath("/prices");
  revalidatePath("/prices/new");
}

export async function createPriceCategoryAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

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
    const category = await createPriceCategory(brand.brandId, parsed.data);
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
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

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
    const category = await updatePriceCategory(brand.brandId, id, parsed.data);
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
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    await deletePriceCategory(brand.brandId, id);
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
