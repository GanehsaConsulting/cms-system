"use server";

import { revalidatePath } from "next/cache";
import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/lib/db/banners";
import { bannerSchema } from "@/lib/validations/banner";

function revalidateBannerPaths() {
  revalidatePath("/banners");
}

function parseBannerFormData(formData: FormData) {
  return bannerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    key: String(formData.get("key") ?? ""),
    image: String(formData.get("image") ?? ""),
    redirectUrl: String(formData.get("redirectUrl") ?? ""),
    isActive: String(formData.get("isActive") ?? "false") === "true",
  });
}

export async function createBannerAction(formData: FormData) {
  const parsed = parseBannerFormData(formData);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid banner data",
    };
  }

  try {
    const banner = await createBanner(parsed.data);
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
  const parsed = parseBannerFormData(formData);

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid banner data",
    };
  }

  try {
    const banner = await updateBanner(id, parsed.data);
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
  try {
    await deleteBanner(id);
    revalidateBannerPaths();
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete banner",
    };
  }
}
