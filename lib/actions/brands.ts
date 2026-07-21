"use server";

import { revalidatePath } from "next/cache";
import {
  createBrand,
  deleteBrand,
  updateBrand,
} from "@/lib/db/brands";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsSettingsAccess } from "@/lib/users/require-settings-access";
import {
  brandFormSchema,
  brandFormToInput,
  parseBrandForm,
} from "@/lib/validations/brand";

function revalidateBrandPaths() {
  revalidatePath("/settings");
  revalidatePath("/settings/users");
  revalidateMediaLibraryCache();
}

export async function createBrandAction(formData: FormData) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = brandFormSchema.safeParse(parseBrandForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid brand data",
    };
  }

  try {
    const brand = await createBrand(brandFormToInput(parsed.data));
    revalidateBrandPaths();
    return { success: true as const, brand };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create brand",
    };
  }
}

export async function updateBrandAction(id: string, formData: FormData) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const parsed = brandFormSchema.safeParse(parseBrandForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid brand data",
    };
  }

  try {
    const brand = await updateBrand(id, brandFormToInput(parsed.data));
    revalidateBrandPaths();
    return { success: true as const, brand };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update brand",
    };
  }
}

export async function deleteBrandAction(id: string) {
  const access = await requireCmsSettingsAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    await deleteBrand(id);
    revalidateBrandPaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete brand",
    };
  }
}
