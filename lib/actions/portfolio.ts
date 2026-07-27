"use server";

import { toActionError } from "@/lib/actions/action-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createPortfolio,
  getPortfolioById,
  setPortfolioFeatured,
  setPortfolioWorkType,
  softDeletePortfolio,
  softDeletePortfolios,
  updatePortfolio,
} from "@/lib/db/portfolio";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import {
  parsePortfolioForm,
  portfolioFormSchema,
  portfolioFormToInput,
} from "@/lib/validations/portfolio";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import type { PortfolioWorkType } from "@/types/portfolio";

function normalizeIdList(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter((id) => id.length > 0))];
}

function revalidatePortfolioPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
  revalidatePath("/trash");
  if (id) {
    revalidatePath(`/clients/portfolio/${id}/edit`);
  }
  revalidateMediaLibraryCache();
}

export async function createPortfolioAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = portfolioFormSchema.safeParse(parsePortfolioForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid portfolio data",
    };
  }

  try {
    const item = await createPortfolio(
      brand.brandId,
      portfolioFormToInput(parsed.data),
    );
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "portfolio",
      entityId: item.id,
      action: "created",
      actor: access.user,
      entityTitle: item.title,
    });
    revalidatePortfolioPaths(item.id);
    redirect(`/clients/portfolio/${item.id}/edit`);
  } catch (error) {
    return toActionError(error, "Failed to create portfolio");
  }
}

export async function updatePortfolioAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = portfolioFormSchema.safeParse(parsePortfolioForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid portfolio data",
    };
  }

  try {
    const current = await getPortfolioById(brand.brandId, id);
    await updatePortfolio(
      brand.brandId,
      id,
      portfolioFormToInput(parsed.data),
    );
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "portfolio",
      entityId: id,
      action: "updated",
      actor: access.user,
      entityTitle: parsed.data.title.trim() || current?.title || "Portfolio item",
    });
    revalidatePortfolioPaths(id);
    return { success: true as const };
  } catch (error) {
    return toActionError(error, "Failed to update portfolio");
  }
}

export async function deletePortfolioAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const current = await getPortfolioById(brand.brandId, id);
    await softDeletePortfolio(brand.brandId, id);
    if (current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "portfolio",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.title,
      });
    }
    revalidatePortfolioPaths();
    redirect("/clients/portfolio");
  } catch (error) {
    return toActionError(error, "Failed to move work to Trash");
  }
}

export async function setPortfolioFeaturedAction(
  ids: string[],
  featured: boolean,
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
    return { success: false as const, error: "No works selected." };
  }

  try {
    const updatedCount = await setPortfolioFeatured(
      brand.brandId,
      uniqueIds,
      featured,
    );
    if (updatedCount === 0) {
      return { success: false as const, error: "No matching works found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "portfolio",
      entityId: uniqueIds[0] ?? "batch",
      action: "updated",
      actor: access.user,
      entityTitle:
        updatedCount === 1
          ? featured
            ? "1 work featured"
            : "1 work unfeatured"
          : featured
            ? `${updatedCount} works featured`
            : `${updatedCount} works unfeatured`,
      href: "/clients/portfolio",
    });
    revalidatePortfolioPaths();
    return { success: true as const, updatedCount };
  } catch (error) {
    return toActionError(error, "Failed to update works");
  }
}

export async function setPortfolioWorkTypeAction(
  ids: string[],
  workType: PortfolioWorkType,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  if (workType !== "social-media" && workType !== "website") {
    return { success: false as const, error: "Invalid work type." };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No works selected." };
  }

  try {
    const updatedCount = await setPortfolioWorkType(
      brand.brandId,
      uniqueIds,
      workType,
    );
    if (updatedCount === 0) {
      return { success: false as const, error: "No matching works found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "portfolio",
      entityId: uniqueIds[0] ?? "batch",
      action: "updated",
      actor: access.user,
      entityTitle:
        updatedCount === 1
          ? `1 work set to ${workType}`
          : `${updatedCount} works set to ${workType}`,
      href: "/clients/portfolio",
    });
    revalidatePortfolioPaths();
    return { success: true as const, updatedCount };
  } catch (error) {
    return toActionError(error, "Failed to update works");
  }
}

export async function deletePortfoliosAction(ids: string[]) {
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
    return { success: false as const, error: "No works selected." };
  }

  try {
    const deletedCount = await softDeletePortfolios(brand.brandId, uniqueIds);
    if (deletedCount === 0) {
      return { success: false as const, error: "No matching works found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "portfolio",
      entityId: uniqueIds[0] ?? "batch",
      action: "deleted",
      actor: access.user,
      entityTitle: deletedCount === 1 ? "1 work" : `${deletedCount} works`,
      href: "/trash",
    });
    revalidatePortfolioPaths();
    return { success: true as const, deletedCount };
  } catch (error) {
    return toActionError(error, "Failed to move works to Trash");
  }
}
