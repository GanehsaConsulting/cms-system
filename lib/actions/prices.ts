"use server";

import { toActionError } from "@/lib/actions/action-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import { getPriceCategoryById } from "@/lib/db/price-categories";
import { createPrice, deletePrice, getPriceById, updatePrice } from "@/lib/db/prices";
import { getPriceDisplayText } from "@/lib/prices/normalize";
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
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "price",
      entityId: price.id,
      action: "created",
      actor: access.user,
      entityTitle: getPriceDisplayText(price.packageName),
    });
    revalidatePath("/");
    revalidatePath("/prices");
    redirect(`/prices/${price.id}/edit`);
  } catch (error) {
    return toActionError(error, "Failed to save price plan");
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
    const current = await getPriceById(brand.brandId, id);
    await updatePrice(brand.brandId, id, priceFormToInput(parsed.data));
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "price",
      entityId: id,
      action: "updated",
      actor: access.user,
      entityTitle: getPriceDisplayText(
        parsed.data.packageName ?? current?.packageName ?? { id: "", en: "", zh: "" },
      ),
    });
    revalidatePath("/");
    revalidatePath("/prices");
    revalidatePath(`/prices/${id}/edit`);
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to update price plan");
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
    const current = await getPriceById(brand.brandId, id);
    await deletePrice(brand.brandId, id);
    if (current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "price",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: getPriceDisplayText(current.packageName),
      });
    }
    revalidatePath("/");
    revalidatePath("/prices");
    redirect("/prices");
  } catch (error) {
    return toActionError(error, "Failed to delete price plan");
  }
}
