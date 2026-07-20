"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getPriceCategoryById } from "@/lib/db/price-categories";
import { createPrice, deletePrice, updatePrice } from "@/lib/db/prices";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  parsePriceForm,
  priceFormSchema,
  priceFormToInput,
} from "@/lib/validations/price";

async function assertValidPriceCategory(brandId: string, serviceSlug: string) {
  const category = await getPriceCategoryById(brandId, serviceSlug);
  if (!category) {
    return {
      success: false as const,
      error: "Selected price category is invalid",
    };
  }

  return null;
}

export async function createPriceAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = priceFormSchema.safeParse(parsePriceForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid price data",
    };
  }

  const categoryError = await assertValidPriceCategory(
    brand.brandId,
    parsed.data.serviceSlug,
  );
  if (categoryError) {
    return categoryError;
  }

  try {
    const price = await createPrice(brand.brandId, priceFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/prices");
    redirect(`/prices/${price.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save price plan",
    };
  }
}

export async function updatePriceAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = priceFormSchema.safeParse(parsePriceForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid price data",
    };
  }

  const categoryError = await assertValidPriceCategory(
    brand.brandId,
    parsed.data.serviceSlug,
  );
  if (categoryError) {
    return categoryError;
  }

  try {
    await updatePrice(brand.brandId, id, priceFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/prices");
    revalidatePath(`/prices/${id}/edit`);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update price plan",
    };
  }
}

export async function deletePriceAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    await deletePrice(brand.brandId, id);
    revalidatePath("/");
    revalidatePath("/prices");
    redirect("/prices");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete price plan",
    };
  }
}
