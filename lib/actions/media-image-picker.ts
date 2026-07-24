"use server";

import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getMediaLibraryFiles } from "@/lib/db/media-files";
import { getCachedMediaLibraryAssets } from "@/lib/media/cache";
import { buildMediaScopeContext } from "@/lib/media/scope";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import type { CmsImagePickerItem } from "@/types/cms-image-picker";

function toPickerItem(input: {
  id: string;
  url: string;
  filename: string;
}): CmsImagePickerItem {
  return {
    id: input.id,
    url: input.url,
    filename: input.filename,
  };
}

export async function getMediaImagePickerDataAction() {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const sharedContext = buildMediaScopeContext({ scope: "shared" });
    const [sharedFiles, inUseAssets] = await Promise.all([
      getMediaLibraryFiles(sharedContext),
      getCachedMediaLibraryAssets(brand.brandId),
    ]);

    const shared = sharedFiles
      .filter((file) => file.kind === "image")
      .map((file) =>
        toPickerItem({
          id: file.id,
          url: file.url,
          filename: file.filename,
        }),
      );

    const inUse = inUseAssets
      .filter((asset) => asset.kind === "image")
      .map((asset) =>
        toPickerItem({
          id: asset.id,
          url: asset.url,
          filename: asset.filename,
        }),
      );

    return { success: true as const, shared, inUse };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load media library images.",
    };
  }
}
