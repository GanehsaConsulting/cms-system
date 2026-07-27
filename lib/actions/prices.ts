"use server";

import { toActionError } from "@/lib/actions/action-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import { getPriceCategoryById } from "@/lib/db/price-categories";
import {
  createPrice,
  getPriceById,
  setPricesActive,
  setPricesHighlighted,
  softDeletePrice,
  softDeletePrices,
  updatePrice,
} from "@/lib/db/prices";
import { getPriceDisplayText } from "@/lib/prices/normalize";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  parsePriceForm,
  priceFormSchema,
  priceFormToInput,
} from "@/lib/validations/price";

function normalizeIdList(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter((id) => id.length > 0))];
}

function revalidatePricePaths() {
  revalidatePath("/");
  revalidatePath("/prices");
  revalidatePath("/trash");
}

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
    await softDeletePrice(brand.brandId, id);
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
    revalidatePricePaths();
    redirect("/prices");
  } catch (error) {
    return toActionError(error, "Failed to move price plan to Trash");
  }
}

export async function setPricesHighlightedAction(
  ids: string[],
  highlighted: boolean,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No price plans selected." };
  }

  try {
    const updatedCount = await setPricesHighlighted(
      brand.brandId,
      uniqueIds,
      highlighted,
    );
    if (updatedCount === 0) {
      return { success: false as const, error: "No matching price plans found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "price",
      entityId: uniqueIds[0] ?? "batch",
      action: "updated",
      actor: access.user,
      entityTitle:
        updatedCount === 1
          ? highlighted
            ? "1 price plan highlighted"
            : "1 price plan unhighlighted"
          : highlighted
            ? `${updatedCount} price plans highlighted`
            : `${updatedCount} price plans unhighlighted`,
      href: "/prices",
    });
    revalidatePath("/");
    revalidatePath("/prices");
    return { success: true as const, updatedCount };
  } catch (error) {
    return toActionError(error, "Failed to update price plans");
  }
}

export async function setPricesActiveAction(ids: string[], isActive: boolean) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No price plans selected." };
  }

  try {
    const updatedCount = await setPricesActive(
      brand.brandId,
      uniqueIds,
      isActive,
    );
    if (updatedCount === 0) {
      return { success: false as const, error: "No matching price plans found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "price",
      entityId: uniqueIds[0] ?? "batch",
      action: "updated",
      actor: access.user,
      entityTitle:
        updatedCount === 1
          ? isActive
            ? "1 price plan set active"
            : "1 price plan set inactive"
          : isActive
            ? `${updatedCount} price plans set active`
            : `${updatedCount} price plans set inactive`,
      href: "/prices",
    });
    revalidatePath("/");
    revalidatePath("/prices");
    return { success: true as const, updatedCount };
  } catch (error) {
    return toActionError(error, "Failed to update price plans");
  }
}

export async function deletePricesAction(ids: string[]) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No price plans selected." };
  }

  try {
    const deletedCount = await softDeletePrices(brand.brandId, uniqueIds);
    if (deletedCount === 0) {
      return { success: false as const, error: "No matching price plans found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "price",
      entityId: uniqueIds[0] ?? "batch",
      action: "deleted",
      actor: access.user,
      entityTitle:
        deletedCount === 1 ? "1 price plan" : `${deletedCount} price plans`,
      href: "/trash",
    });
    revalidatePricePaths();
    return { success: true as const, deletedCount };
  } catch (error) {
    return toActionError(error, "Failed to move price plans to Trash");
  }
}
