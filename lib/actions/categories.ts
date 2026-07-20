"use server";

import { revalidatePath } from "next/cache";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createCustomCategory,
  deleteCustomCategory,
  updateCustomCategory,
} from "@/lib/db/categories";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import { createCategorySchema } from "@/lib/validations/category";

function revalidateArticlePaths() {
  revalidatePath("/articles");
  revalidatePath("/articles/new");
}

export async function createCategoryAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

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
    const category = await createCustomCategory(brand.brandId, parsed.data);
    revalidateArticlePaths();
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

export async function updateCategoryAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

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
    const category = await updateCustomCategory(brand.brandId, id, parsed.data);
    revalidateArticlePaths();
    return { success: true as const, category };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    await deleteCustomCategory(brand.brandId, id);
    revalidateArticlePaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
