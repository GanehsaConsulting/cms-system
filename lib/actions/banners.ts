"use server";

import { revalidatePath } from "next/cache";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/lib/db/banners";
import { bannerSchema } from "@/lib/validations/banner";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";

function revalidateBannerPaths() {
  revalidatePath("/banners");
}

function parseImages(formData: FormData): string[] {
  const raw = String(formData.get("images") ?? "");
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function parseBannerFormData(formData: FormData) {
  return bannerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    key: String(formData.get("key") ?? ""),
    images: parseImages(formData),
    redirectUrl: String(formData.get("redirectUrl") ?? ""),
    isActive: String(formData.get("isActive") ?? "false") === "true",
  });
}

export async function createBannerAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = parseBannerFormData(formData);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid banner data",
    };
  }

  try {
    const banner = await createBanner(brand.brandId, parsed.data);
    revalidateBannerPaths();
    return { success: true as const, banner };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create banner",
    };
  }
}

export async function updateBannerAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = parseBannerFormData(formData);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid banner data",
    };
  }

  try {
    const banner = await updateBanner(brand.brandId, id, parsed.data);
    revalidateBannerPaths();
    return { success: true as const, banner };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update banner",
    };
  }
}

export async function deleteBannerAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    await deleteBanner(brand.brandId, id);
    revalidateBannerPaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete banner",
    };
  }
}
