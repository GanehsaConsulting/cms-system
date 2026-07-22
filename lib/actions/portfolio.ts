"use server";

import { toActionError } from "@/lib/actions/action-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  updatePortfolio,
} from "@/lib/db/portfolio";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import {
  parsePortfolioForm,
  portfolioFormSchema,
  portfolioFormToInput,
} from "@/lib/validations/portfolio";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";

function revalidatePortfolioPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
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
    await deletePortfolio(brand.brandId, id);
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
    return toActionError(error, "Failed to delete portfolio");
  }
}
