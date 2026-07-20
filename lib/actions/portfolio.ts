"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "@/lib/db/portfolio";
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
    revalidatePortfolioPaths(item.id);
    redirect(`/clients/portfolio/${item.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create portfolio",
    };
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
    await updatePortfolio(
      brand.brandId,
      id,
      portfolioFormToInput(parsed.data),
    );
    revalidatePortfolioPaths(id);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update portfolio",
    };
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
    await deletePortfolio(brand.brandId, id);
    revalidatePortfolioPaths();
    redirect("/clients/portfolio");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete portfolio",
    };
  }
}
